import * as fs from 'node:fs';
import * as path from 'node:path';

import { NextResponse } from 'next/server';

export const GET = async () => {
  const logPath = path.join(process.cwd(), 'tmp', 'last_webhook_payload.json');

  if (!fs.existsSync(logPath)) {
    return NextResponse.json({
      status: 'waiting',
      message: 'No webhook received yet. Send a message to the test account now!',
    });
  }

  const data = JSON.parse(fs.readFileSync(logPath, 'utf8'));
  return NextResponse.json(data);
};
