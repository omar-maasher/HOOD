import { desc, eq } from 'drizzle-orm';
import { google } from 'googleapis';

import { bookingSchema } from '@/models/Schema';

import { db } from './DB';
import { logger } from './Logger';

/**
 * Extracts the spreadsheet ID from a full Google Sheets URL.
 * Example URL: https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
export function extractSpreadsheetId(url: string): string | null {
  const match = url.match(/\/d\/([\w-]+)/);
  return match && match[1] ? match[1] : null;
}

/**
 * Authenticates with Google APIs using a Service Account.
 */
function getGoogleAuth() {
  const email = process.env.GOOGLE_CLIENT_EMAIL;
  // Replace escaped newlines with actual newlines
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!email || !privateKey) {
    throw new Error('Google Cloud credentials missing from environment variables (GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY)');
  }

  return new google.auth.JWT({
    email,
    key: privateKey,
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive', // Full drive scope to avoid permission errors
    ],
  });
}

/**
 * Creates a new Google Sheet and shares it with the customer's email.
 * @param customerEmail The email address of the customer (e.g. gmail.com)
 * @param title The title of the new spreadsheet
 * @returns The created spreadsheet ID and URL
 */
export async function createAndShareSheet(customerEmail: string, title: string) {
  try {
    const auth = getGoogleAuth();
    const sheets = google.sheets({ version: 'v4', auth });
    const drive = google.drive({ version: 'v3', auth });

    // 1. Create a new Spreadsheet
    const spreadsheet = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title,
        },
      },
    });

    const spreadsheetId = spreadsheet.data.spreadsheetId;
    const spreadsheetUrl = spreadsheet.data.spreadsheetUrl;

    if (!spreadsheetId) {
      throw new Error('Failed to create spreadsheet');
    }

    // 2. Share it with the customer's email as an Editor (writer)
    await drive.permissions.create({
      fileId: spreadsheetId,
      sendNotificationEmail: false, // Disabling this often solves 'caller does not have permission'
      requestBody: {
        type: 'user',
        role: 'writer',
        emailAddress: customerEmail,
      },
    });

    return { spreadsheetId, spreadsheetUrl };
  } catch (error: any) {
    logger.error({ error: error.message, customerEmail }, 'Failed to create and share Google Sheet');
    throw error;
  }
}

/**
 * Appends a row to a Google Sheet.
 * @param spreadsheetId The extracted ID of the spreadsheet.
 * @param values Array of strings/numbers representing the row data.
 * @param sheetName The name of the sheet tab (e.g., "Sheet1" or "الورقة 1"). Defaults to "Sheet1".
 */
export async function appendBookingToSheet(
  spreadsheetId: string,
  values: any[],
  sheetName: string = 'Sheet1',
) {
  try {
    const auth = getGoogleAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    // Assuming the sheet exists. 'USER_ENTERED' ensures dates/numbers are formatted correctly.
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:A`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [values],
      },
    });

    return response.data;
  } catch (error: any) {
    logger.error({ error: error.message, spreadsheetId }, 'Failed to append row to Google Sheet');
    throw error;
  }
}

/**
 * Automatically syncs a new booking to the connected Google Sheet for the organization.
 */
export async function syncBookingToGoogleSheet(orgId: string, booking: any) {
  try {
    const integration = await db.query.integrationSchema.findFirst({
      where: (i, { and, eq }) => and(eq(i.organizationId, orgId), eq(i.type, 'google_sheets'), eq(i.status, 'active')),
    });

    if (!integration || !integration.providerId) {
      return;
    }

    // Format the row data
    const row = [
      booking.id?.toString() || '',
      booking.customerName || '',
      booking.contactInfo || '',
      booking.serviceType || '',
      booking.bookingDate ? new Date(booking.bookingDate).toLocaleString('ar-SA') : '',
      booking.status || '',
      booking.source || '',
      booking.notes || '',
    ];

    try {
      await appendBookingToSheet(integration.providerId, row, 'Sheet1');
    } catch (err: any) {
      // If default "Sheet1" fails, try Arabic default "ورقة 1"
      if (err.message && err.message.includes('Unable to parse range')) {
        await appendBookingToSheet(integration.providerId, row, 'ورقة 1');
      } else {
        throw err;
      }
    }
  } catch (error) {
    logger.error('Failed to sync booking to Google Sheets', error);
  }
}

/**
 * Syncs ALL bookings for the organization to the connected Google Sheet.
 */
export async function syncAllBookingsToGoogleSheet(orgId: string) {
  try {
    const integration = await db.query.integrationSchema.findFirst({
      where: (i, { and, eq }) => and(eq(i.organizationId, orgId), eq(i.type, 'google_sheets'), eq(i.status, 'active')),
    });

    if (!integration || !integration.providerId) {
      return { success: false, error: 'لم يتم العثور على ربط نشط بجدول جوجل.' };
    }

    const bookings = await db.query.bookingSchema.findMany({
      where: eq(bookingSchema.organizationId, orgId),
      orderBy: [desc(bookingSchema.createdAt)],
    });

    if (bookings.length === 0) {
      return { success: true, count: 0, message: 'لا توجد حجوزات لمزامنتها.' };
    }

    const rows = bookings.map(booking => [
      booking.id?.toString() || '',
      booking.customerName || '',
      booking.contactInfo || '',
      booking.serviceType || '',
      booking.bookingDate ? new Date(booking.bookingDate).toLocaleString('ar-SA') : '',
      booking.status || '',
      booking.source || '',
      booking.notes || '',
    ]);

    // Reverse to chronological order for inserting from top to bottom
    rows.reverse();

    try {
      const auth = getGoogleAuth();
      const sheets = google.sheets({ version: 'v4', auth });

      await sheets.spreadsheets.values.append({
        spreadsheetId: integration.providerId,
        range: 'Sheet1!A:A',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: rows },
      });
    } catch (err: any) {
      if (err.message && err.message.includes('Unable to parse range')) {
        const auth = getGoogleAuth();
        const sheets = google.sheets({ version: 'v4', auth });
        await sheets.spreadsheets.values.append({
          spreadsheetId: integration.providerId,
          range: 'ورقة 1!A:A',
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: rows },
        });
      } else {
        throw err;
      }
    }

    return { success: true, count: bookings.length };
  } catch (error: any) {
    logger.error('Failed to sync all bookings to Google Sheets', error);
    return { success: false, error: error.message || 'فشل المزامنة. تأكد من صلاحية المحرر للروبوت.' };
  }
}
