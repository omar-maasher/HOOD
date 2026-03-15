'use client';

import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Link as LinkIcon,
  Loader2,
  MessageSquare,
  Phone,
  Plus,
  Trash2,
  XCircle,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useCallback, useEffect, useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────
type ButtonType = 'URL' | 'PHONE_NUMBER' | 'QUICK_REPLY';
type BtnDraft = { type: ButtonType; text: string; url?: string; phone_number?: string };

type MetaTemplate = {
  id: string;
  name: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'PAUSED';
  category: string;
  language: string;
  components: Array<{ type: string; text?: string; format?: string; buttons?: any[] }>;
  rejected_reason?: string;
};

// ─── WhatsApp Phone Preview ───────────────────────────────────────────────────
const WAPreview = ({
  headerText,
  bodyText,
  footerText,
  buttons,
  t,
}: {
  headerText?: string;
  bodyText: string;
  footerText?: string;
  buttons: BtnDraft[];
  t: any;
}) => (
  <div className="flex flex-col items-end">
    <div className="w-full max-w-[280px] overflow-hidden rounded-2xl rounded-tr-sm bg-white shadow-lg">
      {headerText && (
        <div className="border-b border-slate-100 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800">
          {headerText}
        </div>
      )}
      <div className="px-4 py-3">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
          {bodyText || <span className="italic text-slate-400">{t('preview_placeholder')}</span>}
        </p>
        {footerText && (
          <p className="mt-1.5 text-xs text-slate-400">{footerText}</p>
        )}
        <p className="mt-1.5 text-right text-[10px] text-slate-400">
          {t('footer_preview')}
          {' '}
          ✓✓
        </p>
      </div>
      {buttons.length > 0 && (
        <div className="border-t border-slate-100">
          {buttons.map((btn, i) => (
            <button
              key={`${btn.type}-${i}`}
              type="button"
              className="flex w-full items-center justify-center gap-1.5 border-b border-slate-100 py-2.5 text-xs font-medium text-sky-600 last:border-b-0 hover:bg-sky-50"
            >
              {btn.type === 'URL' && <LinkIcon className="size-3" />}
              {btn.type === 'PHONE_NUMBER' && <Phone className="size-3" />}
              {btn.text || `${t('url')} ${i + 1}`}
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export const WhatsAppTemplateBuilder: React.FC = () => {
  const t = useTranslations('WhatsAppTemplates');

  const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
    APPROVED: { label: t('status_approved'), icon: <CheckCircle2 className="size-4" />, className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    PENDING: { label: t('status_pending'), icon: <Clock className="size-4" />, className: 'bg-amber-100 text-amber-700 border-amber-200' },
    REJECTED: { label: t('status_rejected'), icon: <XCircle className="size-4" />, className: 'bg-red-100 text-red-700 border-red-200' },
    PAUSED: { label: t('status_paused'), icon: <AlertCircle className="size-4" />, className: 'bg-slate-100 text-slate-600 border-slate-200' },
  };

  // ── Form state ──
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'MARKETING' | 'UTILITY'>('MARKETING');
  const [language, setLanguage] = useState('ar');
  const [headerText, setHeaderText] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [footerText, setFooterText] = useState('');
  const [buttons, setButtons] = useState<BtnDraft[]>([]);

  // ── List state ──
  const [templates, setTemplates] = useState<MetaTemplate[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deletingName, setDeletingName] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await fetch('/api/integrations/whatsapp/templates');
      const data = await res.json();
      setTemplates(data.templates || []);
    } catch {
      setTemplates([]);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const addButton = () => {
    if (buttons.length >= 3) {
      return;
    }
    setButtons(prev => [...prev, { type: 'QUICK_REPLY', text: '' }]);
  };

  const updateButton = (i: number, patch: Partial<BtnDraft>) =>
    setButtons(prev => prev.map((b, idx) => (idx === i ? { ...b, ...patch } : b)));

  const removeButton = (i: number) =>
    setButtons(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!name || !bodyText) {
      setError(t('error_required'));
      return;
    }
    if (!/^[a-z0-9_]+$/.test(name)) {
      setError(t('error_regex'));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/integrations/whatsapp/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category, language, headerText: headerText || undefined, bodyText, footerText: footerText || undefined, buttons: buttons.length > 0 ? buttons : undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create template');
        return;
      }
      setSuccess(t('success_sent', { name }));
      setName('');
      setHeaderText('');
      setBodyText('');
      setFooterText('');
      setButtons([]);
      await fetchTemplates();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (templateName: string) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm(t('confirm_delete', { name: templateName }))) {
      return;
    }
    setDeletingName(templateName);
    try {
      const res = await fetch(`/api/integrations/whatsapp/templates/${encodeURIComponent(templateName)}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchTemplates();
      }
    } finally {
      setDeletingName(null);
    }
  };

  return (
    <div className="space-y-10">
      {/* ── Header ── */}
      <div className="flex items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
          <MessageSquare className="size-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
          <p className="text-sm text-slate-500">{t('description')}</p>
        </div>
      </div>

      {/* ── Builder + Preview ── */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">{t('create_new')}</h2>

          {/* Name */}
          <div>
            <label htmlFor="template-name" className="mb-1 block text-sm font-medium text-slate-700">{t('template_name')}</label>
            <input
              id="template-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              placeholder={t('placeholder_name')}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
            />
            <p className="mt-1 text-xs text-slate-400">{t('name_help')}</p>
          </div>

          {/* Category + Language */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="template-category" className="mb-1 block text-sm font-medium text-slate-700">{t('category')}</label>
              <select
                id="template-category"
                value={category}
                onChange={e => setCategory(e.target.value as 'MARKETING' | 'UTILITY')}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-400 focus:outline-none"
              >
                <option value="MARKETING">{t('marketing')}</option>
                <option value="UTILITY">{t('utility')}</option>
              </select>
            </div>
            <div>
              <label htmlFor="template-language" className="mb-1 block text-sm font-medium text-slate-700">{t('language')}</label>
              <select
                id="template-language"
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-400 focus:outline-none"
              >
                <option value="ar">{t('arabic')}</option>
                <option value="en_US">{t('english')}</option>
              </select>
            </div>
          </div>

          {/* Header */}
          <div>
            <label htmlFor="header-text" className="mb-1 block text-sm font-medium text-slate-700">{t('header')}</label>
            <input
              id="header-text"
              type="text"
              value={headerText}
              onChange={e => setHeaderText(e.target.value)}
              placeholder="..."
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
            />
          </div>

          {/* Body */}
          <div>
            <label htmlFor="body-text" className="mb-1 block text-sm font-medium text-slate-700">
              {t('body')}
              {' '}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              id="body-text"
              value={bodyText}
              onChange={e => setBodyText(e.target.value)}
              rows={4}
              placeholder={t('placeholder_body')}
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
            />
            <p className="mt-1 text-xs text-slate-400">
              {t('body_help')}
            </p>
          </div>

          {/* Footer */}
          <div>
            <label htmlFor="footer-text" className="mb-1 block text-sm font-medium text-slate-700">{t('footer')}</label>
            <input
              id="footer-text"
              type="text"
              value={footerText}
              onChange={e => setFooterText(e.target.value)}
              placeholder="..."
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
            />
          </div>

          {/* Buttons */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">{t('buttons')}</span>
              {buttons.length < 3 && (
                <button type="button" onClick={addButton} className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700">
                  <Plus className="size-3.5" />
                  {' '}
                  {t('add_button')}
                </button>
              )}
            </div>
            <div className="space-y-2">
              {buttons.map((btn, i) => (
                <div key={`${btn.type}-${i}`} className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center gap-2">
                    <select
                      value={btn.type}
                      onChange={e => updateButton(i, { type: e.target.value as ButtonType, url: undefined, phone_number: undefined })}
                      className="flex-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs focus:outline-none"
                    >
                      <option value="QUICK_REPLY">{t('quick_reply')}</option>
                      <option value="URL">{t('url')}</option>
                      <option value="PHONE_NUMBER">{t('phone')}</option>
                    </select>
                    <button type="button" onClick={() => removeButton(i)} className="text-red-400 hover:text-red-600">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder={t('button_text')}
                    value={btn.text}
                    onChange={e => updateButton(i, { text: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs focus:outline-none"
                  />
                  {btn.type === 'URL' && (
                    <input
                      type="url"
                      placeholder="https://example.com"
                      value={btn.url || ''}
                      onChange={e => updateButton(i, { url: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs focus:outline-none"
                    />
                  )}
                  {btn.type === 'PHONE_NUMBER' && (
                    <input
                      type="tel"
                      placeholder="+966501234567"
                      value={btn.phone_number || ''}
                      onChange={e => updateButton(i, { phone_number: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs focus:outline-none"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              {' '}
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
              {' '}
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {submitting ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            {submitting ? t('submitting') : t('submit')}
          </button>
        </form>

        {/* Preview */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-800">{t('preview_title')}</h2>
          <div className="flex h-full min-h-[400px] items-center justify-center rounded-2xl border border-slate-200 bg-[#e5ddd5] p-6" style={{ backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAB3RJTUUH5ggFBCwiqvMAAAAASUVORK5CYII=")' }}>
            <WAPreview
              headerText={headerText}
              bodyText={bodyText}
              footerText={footerText}
              buttons={buttons}
              t={t}
            />
          </div>
        </div>
      </div>

      {/* ── Templates List ── */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">{t('existing_templates')}</h2>
          <button
            type="button"
            onClick={fetchTemplates}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            <Loader2 className={`size-3.5 ${loadingList ? 'animate-spin' : ''}`} />
            {t('refresh')}
          </button>
        </div>

        {loadingList
          ? (
              <div className="flex items-center justify-center py-16 text-slate-400">
                <Loader2 className="mr-2 size-5 animate-spin" />
                {' '}
                {t('loading')}
              </div>
            )
          : templates.length === 0
            ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 py-16 text-slate-400">
                  <MessageSquare className="size-10" />
                  <p className="text-sm">{t('no_templates')}</p>
                </div>
              )
            : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {templates.map((t_item) => {
                    const statusCfg = STATUS_CONFIG[t_item.status] ?? STATUS_CONFIG.PENDING!;
                    const bodyComp = t_item.components?.find(c => c.type === 'BODY');
                    const headerComp = t_item.components?.find(c => c.type === 'HEADER');
                    // Only show rejected reason if it exists, is not 'NONE', and status is REJECTED
                    const showRejected = t_item.status === 'REJECTED' && t_item.rejected_reason && t_item.rejected_reason !== 'NONE';

                    return (
                      <div key={t_item.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-slate-900">{t_item.name}</p>
                            <p className="text-xs text-slate-400">
                              {t_item.category}
                              {' '}
                              ·
                              {' '}
                              {t_item.language}
                            </p>
                          </div>
                          <span className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${statusCfg.className}`}>
                            {statusCfg.icon}
                            {statusCfg.label}
                          </span>
                        </div>
                        {headerComp?.text && (
                          <p className="text-xs font-semibold text-slate-700">{headerComp.text}</p>
                        )}
                        <p className="line-clamp-3 text-sm text-slate-600">{bodyComp?.text || '—'}</p>
                        {showRejected && (
                          <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                            {t('rejection_reason')}
                            :
                            {' '}
                            {t_item.rejected_reason}
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(t_item.name)}
                          disabled={deletingName === t_item.name}
                          className="flex items-center justify-center gap-1.5 rounded-xl border border-red-200 py-2 text-sm text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingName === t_item.name ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                          {t('delete')}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
      </div>
    </div>
  );
};
