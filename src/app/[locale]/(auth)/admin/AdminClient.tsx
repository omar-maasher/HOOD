'use client';

import { AlertTriangle, Building2, ChevronDown, ChevronUp, Copy, Crown, MessageSquare, Puzzle, RefreshCcw, Settings2, ShieldCheck, Sparkles, Store, Trash2, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

import { deleteOrganization, getOrganizationDeepSettings, updateOrganizationDeepSettings, updateOrganizationSubscription } from './actions';

type AdminStats = {
  totalOrgs: number;
  totalLeads: number;
  totalIntegrations: number;
  activeSubscriptions: number;
};

export function AdminClient({ stats, organizations }: { stats: AdminStats; organizations: any[] }) {
  const t = useTranslations('Admin');
  const [mounted, setMounted] = React.useState(false);
  const [editingOrg, setEditingOrg] = React.useState<any>(null);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [deepSettings, setDeepSettings] = React.useState<any>(null);
  const [isLoadingDeep, setIsLoadingDeep] = React.useState(false);
  const [showDeepContent, setShowDeepContent] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch deep settings when an org is selected
  React.useEffect(() => {
    if (editingOrg && showDeepContent) {
      const fetchDeep = async () => {
        setIsLoadingDeep(true);
        try {
          const data = await getOrganizationDeepSettings(editingOrg.id);
          setDeepSettings(data);
        } catch (err) {
          console.error('Failed to fetch deep settings', err);
        } finally {
          setIsLoadingDeep(false);
        }
      };
      fetchDeep();
    } else if (!editingOrg) {
      setDeepSettings(null);
      setShowDeepContent(false);
    }
  }, [editingOrg, showDeepContent]);

  const handleUpdateSubscription = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingOrg) {
      return;
    }

    setIsUpdating(true);
    const formData = new FormData(e.currentTarget);
    const planId = formData.get('planId') as string;
    const status = formData.get('status') as string;

    try {
      await updateOrganizationSubscription(editingOrg.id, planId, status);
      setEditingOrg(null);
      router.refresh();
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateDeepSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingOrg) {
      return;
    }

    setIsUpdating(true);
    const formData = new FormData(e.currentTarget);

    try {
      await updateOrganizationDeepSettings(editingOrg.id, {
        botName: formData.get('botName') as string,
        systemPrompt: formData.get('systemPrompt') as string,
        businessName: formData.get('businessName') as string,
        businessDescription: formData.get('businessDescription') as string,
      });
      // Optionally refresh to show new business name in table
      router.refresh();
    } catch (error) {
      console.error('Deep update failed:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteOrg = async () => {
    if (!editingOrg) {
      return;
    }
    setIsDeleting(true);
    try {
      await deleteOrganization(editingOrg.id);
      setEditingOrg(null);
      setShowDeleteConfirm(false);
      router.refresh();
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const statCards = [
    {
      title: t('total_orgs'),
      value: stats.totalOrgs,
      icon: <Building2 className="size-5 text-blue-600" />,
      description: t('total_orgs_desc'),
      gradient: 'from-blue-500/10 to-transparent',
      borderColor: 'border-blue-200/50',
    },
    {
      title: t('active_subs'),
      value: stats.activeSubscriptions,
      icon: <Crown className="size-5 text-amber-600" />,
      description: t('active_subs_desc'),
      gradient: 'from-amber-500/10 to-transparent',
      borderColor: 'border-amber-200/50',
    },
    {
      title: t('global_leads'),
      value: stats.totalLeads,
      icon: <MessageSquare className="size-5 text-purple-600" />,
      description: t('global_leads_desc'),
      gradient: 'from-purple-500/10 to-transparent',
      borderColor: 'border-purple-200/50',
    },
    {
      title: t('meta_integrations'),
      value: stats.totalIntegrations,
      icon: <Puzzle className="size-5 text-pink-600" />,
      description: t('meta_integrations_desc'),
      gradient: 'from-pink-500/10 to-transparent',
      borderColor: 'border-pink-200/50',
    },
  ];

  return (
    <div className="space-y-8 duration-500 animate-in fade-in">
      <div className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/40 p-6 shadow-sm backdrop-blur-md">
        <div>
          <h1 className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
            {t('title')}
          </h1>
          <p className="mt-1 flex items-center gap-2 text-muted-foreground">
            <ShieldCheck className="size-4 text-emerald-500" />
            {t('subtitle')}
          </p>
        </div>
        <div className="hidden gap-2 sm:flex">
          <div className="rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-[10px] font-bold uppercase text-emerald-700">{t('system_online')}</div>
          <div className="rounded-full border border-blue-200 bg-blue-100 px-3 py-1 text-[10px] font-bold text-blue-700">v1.16.0</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map(stat => (
          <Card key={stat.title} className={`relative overflow-hidden border-2 ${stat.borderColor} group bg-white/50 backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-lg`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-50`} />
            <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">{stat.title}</CardTitle>
              <div className="rounded-xl border border-gray-100 bg-white p-2 shadow-sm transition-transform group-hover:scale-110">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-black text-gray-900">{stat.value}</div>
              <p className="mt-1 text-xs font-medium text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Organizations Table */}
      <Card className="overflow-hidden rounded-3xl border-none bg-white/60 shadow-2xl ring-1 ring-white/80 backdrop-blur-xl">
        <CardHeader className="border-b border-gray-100/50 bg-white/30 p-6">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <Users className="size-5" />
              </div>
              {t('platform_orgs')}
            </CardTitle>
            <Button variant="outline" size="sm" className="gap-2 rounded-full bg-white/50" onClick={() => router.refresh()}>
              <RefreshCcw className="size-3" />
              {t('reload')}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow className="border-b border-gray-100 hover:bg-transparent">
                  <TableHead className="py-4 pl-6 text-[11px] font-black uppercase tracking-wider text-gray-400">{t('org_details')}</TableHead>
                  <TableHead className="text-[11px] font-black uppercase tracking-wider text-gray-400">{t('plan')}</TableHead>
                  <TableHead className="text-[11px] font-black uppercase tracking-wider text-gray-400">{t('usage_metrics')}</TableHead>
                  <TableHead className="text-[11px] font-black uppercase tracking-wider text-gray-400">{t('status')}</TableHead>
                  <TableHead className="text-[11px] font-black uppercase tracking-wider text-gray-400">{t('reg_date')}</TableHead>
                  <TableHead className="pr-6 text-right text-[11px] font-black uppercase tracking-wider text-gray-400">{t('management')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizations?.map(org => (
                  <TableRow key={org.id} className="group border-b border-gray-50 transition-colors hover:bg-white/40">
                    <TableCell className="py-5 pl-6">
                      <div className="group/id flex flex-col">
                        <span className="max-w-[150px] truncate text-sm font-bold text-gray-900">{org.businessName}</span>
                        <div className="mt-0.5 flex items-center gap-2">
                          <span className="font-mono text-[10px] uppercase tracking-tighter text-muted-foreground">{org.id}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-3 opacity-0 transition-opacity group-hover/id:opacity-100"
                            onClick={() => navigator.clipboard.writeText(org.id)}
                          >
                            <Copy className="size-2" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase ring-1 ring-inset ${
                          org.planId === 'premium'
                            ? 'bg-purple-50 text-purple-700 ring-purple-200'
                            : 'bg-gray-100 text-gray-600 ring-gray-200'
                        }`}
                        >
                          {org.planId === 'premium' ? t('premium_plan') : t('free_plan')}
                        </span>
                        {org.planId === 'premium' && <Crown className="size-3 text-amber-500" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-bold text-gray-700">{org.leadsCount}</span>
                          <span className="text-[9px] font-black uppercase text-muted-foreground">{t('leads_count')}</span>
                        </div>
                        <div className="h-4 w-px bg-gray-200" />
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-bold text-gray-700">{org.productsCount}</span>
                          <span className="text-[9px] font-black uppercase text-muted-foreground">{t('products_count')}</span>
                        </div>
                        <div className="h-4 w-px bg-gray-200" />
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-bold text-gray-700">{org.integrationsCount}</span>
                          <span className="text-[9px] font-black uppercase text-muted-foreground">{t('integrations_count')}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`size-2 rounded-full ${org.stripeSubscriptionStatus === 'active' ? 'animate-pulse bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-gray-300'}`} />
                        <span className={`text-[11px] font-semibold capitalize ${org.stripeSubscriptionStatus === 'active' ? 'text-emerald-700' : 'text-gray-500'}`}>
                          {org.stripeSubscriptionStatus === 'active' ? t('active') : (org.stripeSubscriptionStatus || t('not_subscribed'))}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[11px] font-medium text-muted-foreground">
                      {mounted ? new Date(org.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : '...'}
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2 rounded-xl border border-transparent opacity-0 transition-all hover:border-gray-100 hover:bg-white hover:shadow-md group-hover:opacity-100"
                        onClick={() => {
                          setEditingOrg(org);
                          setShowDeleteConfirm(false);
                        }}
                      >
                        <Settings2 className="size-4 text-primary" />
                        {t('manage_button')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {(!organizations || organizations.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Users className="size-8 text-gray-200" />
                        <p className="text-sm font-medium text-muted-foreground">{t('no_orgs')}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Management Drawer */}
      <Sheet
        open={!!editingOrg}
        onOpenChange={() => {
          setEditingOrg(null);
          setShowDeleteConfirm(false);
          setDeepSettings(null);
          setShowDeepContent(false);
        }}
      >
        <SheetContent side="right" className="overflow-y-auto border-l border-white/20 bg-white/95 backdrop-blur-xl sm:max-w-xl">
          <SheetHeader className="mb-8">
            <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Settings2 className="size-6" />
            </div>
            <SheetTitle className="text-2xl font-black tracking-tight">{t('manage_org')}</SheetTitle>
            <SheetDescription>
              {t('manage_org_desc', { id: editingOrg?.businessName || editingOrg?.id })}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-8">
            <form onSubmit={handleUpdateSubscription} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="plan-select" className="ml-1 text-xs font-bold uppercase tracking-wider text-gray-500">{t('sub_plan')}</label>
                  <select
                    id="plan-select"
                    name="planId"
                    defaultValue={editingOrg?.planId || 'free'}
                    className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="free">{t('free_plan')}</option>
                    <option value="premium">{t('premium_plan')}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="status-select" className="ml-1 text-xs font-bold uppercase tracking-wider text-gray-500">{t('status')}</label>
                  <select
                    id="status-select"
                    name="status"
                    defaultValue={editingOrg?.stripeSubscriptionStatus || 'inactive'}
                    className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="active">{t('active')}</option>
                    <option value="inactive">{t('inactive')}</option>
                    <option value="canceled">{t('canceled')}</option>
                    <option value="past_due">{t('past_due')}</option>
                  </select>
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 p-3">
                <RefreshCcw className="mt-0.5 size-3.5 text-amber-600" />
                <p className="text-[10px] font-medium text-amber-800">
                  {t('system_warning')}
                </p>
              </div>

              <Button type="submit" className="flex h-11 w-full gap-2 rounded-xl text-sm font-bold" disabled={isUpdating}>
                {isUpdating ? <RefreshCcw className="size-4 animate-spin" /> : <RefreshCcw className="size-4" />}
                {t('save_changes')}
              </Button>
            </form>

            {/* Deep Management Section */}
            <div className="space-y-4">
              <Button
                variant="outline"
                className="group h-12 w-full justify-between rounded-xl border-2 border-gray-100 px-4 transition-all hover:border-primary/20 hover:bg-primary/5"
                onClick={() => setShowDeepContent(!showDeepContent)}
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-100 p-1.5 text-emerald-600 transition-transform group-hover:scale-110">
                    <Settings2 className="size-4" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-bold text-gray-900">{t('deep_manage')}</span>
                    <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">Override AI & Profile</span>
                  </div>
                </div>
                {showDeepContent ? <ChevronUp className="size-4 text-gray-400" /> : <ChevronDown className="size-4 text-gray-400" />}
              </Button>

              {showDeepContent && (
                <div className="space-y-6 rounded-2xl border border-gray-100 bg-gray-50/50 p-5 animate-in slide-in-from-top-2">
                  {isLoadingDeep
                    ? (
                        <div className="flex items-center justify-center gap-2 py-8">
                          <RefreshCcw className="size-4 animate-spin text-primary" />
                          <span className="text-xs font-bold text-muted-foreground">{t('loading')}</span>
                        </div>
                      )
                    : (
                        <form onSubmit={handleUpdateDeepSettings} className="space-y-6">
                          {/* AI Section */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                              <Sparkles className="size-3.5 text-emerald-500" />
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t('ai_config')}</h4>
                            </div>
                            <div className="space-y-2">
                              <label className="ml-1 text-[10px] font-black uppercase text-gray-400">{t('bot_name')}</label>
                              <Input
                                name="botName"
                                defaultValue={deepSettings?.ai?.botName}
                                className="h-10 rounded-xl border-gray-200 bg-white"
                                placeholder="Assistant Name"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="ml-1 text-[10px] font-black uppercase text-gray-400">{t('system_prompt')}</label>
                              <Textarea
                                name="systemPrompt"
                                defaultValue={deepSettings?.ai?.systemPrompt}
                                className="min-h-[100px] rounded-xl border-gray-200 bg-white text-xs leading-relaxed"
                                placeholder="System instructions..."
                              />
                            </div>
                          </div>

                          {/* Profile Section */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 border-b border-gray-100 py-2">
                              <Store className="size-3.5 text-blue-500" />
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t('business_profile')}</h4>
                            </div>
                            <div className="space-y-2">
                              <label className="ml-1 text-[10px] font-black uppercase text-gray-400">{t('business_name')}</label>
                              <Input
                                name="businessName"
                                defaultValue={deepSettings?.profile?.businessName}
                                className="h-10 rounded-xl border-gray-200 bg-white"
                                placeholder="Business Name"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="ml-1 text-[10px] font-black uppercase text-gray-400">{t('business_desc')}</label>
                              <Textarea
                                name="businessDescription"
                                defaultValue={deepSettings?.profile?.businessDescription}
                                className="min-h-[80px] rounded-xl border-gray-200 bg-white text-xs leading-relaxed"
                                placeholder="Business description for AI..."
                              />
                            </div>
                          </div>

                          <Button
                            type="submit"
                            variant="secondary"
                            className="h-11 w-full gap-2 rounded-xl text-xs font-bold"
                            disabled={isUpdating}
                          >
                            {isUpdating
                              ? <RefreshCcw className="size-3 animate-spin" />
                              : <ShieldCheck className="size-3" />}
                            {t('save_deep')}
                          </Button>
                        </form>
                      )}
                </div>
              )}
            </div>

            {/* Destructive Zone */}
            <div className="flex flex-col gap-4 border-t border-red-50 pt-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-300">{t('delete_org')}</h3>
              {!showDeleteConfirm
                ? (
                    <Button
                      variant="ghost"
                      className="h-11 w-full gap-2 rounded-xl text-[11px] font-bold text-red-400 transition-all hover:bg-red-50 hover:text-red-500"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      <Trash2 className="size-3.5" />
                      {t('delete_org')}
                    </Button>
                  )
                : (
                    <div className="rounded-2xl border border-red-100 bg-red-50 p-4 animate-in slide-in-from-bottom-2">
                      <div className="mb-4 flex gap-3">
                        <AlertTriangle className="size-5 shrink-0 text-red-600" />
                        <p className="text-xs font-medium leading-relaxed text-red-900">
                          {t('delete_confirm')}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="destructive"
                          className="h-10 w-full rounded-xl text-xs font-bold shadow-lg shadow-red-200"
                          onClick={handleDeleteOrg}
                          disabled={isDeleting}
                        >
                          {isDeleting
                            ? <RefreshCcw className="mr-2 size-3 animate-spin" />
                            : <Trash2 className="mr-2 size-3" />}
                          {t('delete_button')}
                        </Button>
                        <Button
                          variant="ghost"
                          className="h-10 w-full rounded-xl text-xs font-bold text-gray-600 hover:bg-white"
                          onClick={() => setShowDeleteConfirm(false)}
                          disabled={isDeleting}
                        >
                          {t('discard')}
                        </Button>
                      </div>
                    </div>
                  )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
