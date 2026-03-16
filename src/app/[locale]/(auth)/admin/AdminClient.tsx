'use client';

import { Building2, Crown, ExternalLink, MessageSquare, Puzzle, RefreshCcw, Settings2, ShieldCheck, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
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

import { updateOrganizationSubscription } from './actions';

type AdminStats = {
  totalOrgs: number;
  totalLeads: number;
  totalIntegrations: number;
  activeSubscriptions: number;
};

export function AdminClient({ stats, organizations }: { stats: AdminStats; organizations: any[] }) {
  const [mounted, setMounted] = React.useState(false);
  const [editingOrg, setEditingOrg] = React.useState<any>(null);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    setMounted(true);
  }, []);

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
      // Removed restricted alert(), errors are logged to console.
      // In a real app, use a Toast component here.
    } finally {
      setIsUpdating(false);
    }
  };

  const statCards = [
    {
      title: 'Total Organizations',
      value: stats.totalOrgs,
      icon: <Building2 className="size-5 text-blue-600" />,
      description: 'Total businesses registered',
      gradient: 'from-blue-500/10 to-transparent',
      borderColor: 'border-blue-200/50',
    },
    {
      title: 'Active Subscriptions',
      value: stats.activeSubscriptions,
      icon: <Crown className="size-5 text-amber-600" />,
      description: 'Paying customers (Active Status)',
      gradient: 'from-amber-500/10 to-transparent',
      borderColor: 'border-amber-200/50',
    },
    {
      title: 'Global Leads',
      value: stats.totalLeads,
      icon: <MessageSquare className="size-5 text-purple-600" />,
      description: 'Leads across all organizations',
      gradient: 'from-purple-500/10 to-transparent',
      borderColor: 'border-purple-200/50',
    },
    {
      title: 'Meta Integrations',
      value: stats.totalIntegrations,
      icon: <Puzzle className="size-5 text-pink-600" />,
      description: 'Connected Meta accounts',
      gradient: 'from-pink-500/10 to-transparent',
      borderColor: 'border-pink-200/50',
    },
  ];

  return (
    <div className="space-y-8 duration-500 animate-in fade-in">
      <div className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/40 p-6 shadow-sm backdrop-blur-md">
        <div>
          <h1 className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
            Super Admin Portal
          </h1>
          <p className="mt-1 flex items-center gap-2 text-muted-foreground">
            <ShieldCheck className="size-4 text-emerald-500" />
            Control center for platform-wide operations
          </p>
        </div>
        <div className="hidden gap-2 sm:flex">
          <div className="rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-700">SYSTEM ONLINE</div>
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
              Platform Organizations
            </CardTitle>
            <Button variant="outline" size="sm" className="gap-2 rounded-full bg-white/50" onClick={() => router.refresh()}>
              <RefreshCcw className="size-3" />
              Reload
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow className="border-b border-gray-100 hover:bg-transparent">
                  <TableHead className="py-4 pl-6 text-[11px] font-black uppercase tracking-wider text-gray-400">Organization Details</TableHead>
                  <TableHead className="text-[11px] font-black uppercase tracking-wider text-gray-400">Subscription Plan</TableHead>
                  <TableHead className="text-[11px] font-black uppercase tracking-wider text-gray-400">Usage Metrics</TableHead>
                  <TableHead className="text-[11px] font-black uppercase tracking-wider text-gray-400">Status</TableHead>
                  <TableHead className="text-[11px] font-black uppercase tracking-wider text-gray-400">Reg. Date</TableHead>
                  <TableHead className="pr-6 text-right text-[11px] font-black uppercase tracking-wider text-gray-400">Management</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizations?.map(org => (
                  <TableRow key={org.id} className="group border-b border-gray-50 transition-colors hover:bg-white/40">
                    <TableCell className="py-5 pl-6">
                      <div className="group/id flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold tracking-tighter text-gray-900">{org.id}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-4 opacity-0 transition-opacity group-hover/id:opacity-100"
                            onClick={() => {
                              navigator.clipboard.writeText(org.id);
                            }}
                          >
                            <ExternalLink className="size-2.5" />
                          </Button>
                        </div>
                        <span className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">INTERNAL ID</span>
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
                          {org.planId || 'Free'}
                        </span>
                        {org.planId === 'premium' && <Crown className="size-3 text-amber-500" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-bold text-gray-700">{org.leadsCount}</span>
                          <span className="text-[9px] font-black uppercase text-muted-foreground">Leads</span>
                        </div>
                        <div className="h-4 w-px bg-gray-200" />
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-bold text-gray-700">{org.productsCount}</span>
                          <span className="text-[9px] font-black uppercase text-muted-foreground">Items</span>
                        </div>
                        <div className="h-4 w-px bg-gray-200" />
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-bold text-gray-700">{org.integrationsCount}</span>
                          <span className="text-[9px] font-black uppercase text-muted-foreground">Apps</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`size-2 rounded-full ${org.stripeSubscriptionStatus === 'active' ? 'animate-pulse bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-gray-300'}`} />
                        <span className={`text-[11px] font-semibold capitalize ${org.stripeSubscriptionStatus === 'active' ? 'text-emerald-700' : 'text-gray-500'}`}>
                          {org.stripeSubscriptionStatus || 'Not Subscribed'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[11px] font-medium text-muted-foreground">
                      {mounted ? new Date(org.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : '...'}
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2 rounded-xl border border-transparent opacity-0 transition-all hover:border-gray-100 hover:bg-white hover:shadow-md group-hover:opacity-100"
                        onClick={() => setEditingOrg(org)}
                      >
                        <Settings2 className="size-4 text-primary" />
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {(!organizations || organizations.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Users className="size-8 text-gray-200" />
                        <p className="text-sm font-medium text-muted-foreground">No organizations found on the platform.</p>
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
      <Sheet open={!!editingOrg} onOpenChange={() => setEditingOrg(null)}>
        <SheetContent side="right" className="border-l border-white/20 bg-white/95 backdrop-blur-xl sm:max-w-md">
          <SheetHeader className="mb-8">
            <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Settings2 className="size-6" />
            </div>
            <SheetTitle className="text-2xl font-black tracking-tight">Manage Organization</SheetTitle>
            <SheetDescription>
              Adjust subscription parameters and account status for
              {' '}
              <span className="rounded bg-primary/5 px-2 py-0.5 font-mono text-primary">{editingOrg?.id}</span>
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleUpdateSubscription} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="plan-select" className="ml-1 text-xs font-bold uppercase tracking-wider text-gray-500">Subscription Plan</label>
                <select
                  id="plan-select"
                  name="planId"
                  defaultValue={editingOrg?.planId || 'free'}
                  className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
                >
                  <option value="free">Free Starter Plan</option>
                  <option value="premium">Premium Business Plan</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="status-select" className="ml-1 text-xs font-bold uppercase tracking-wider text-gray-500">Account Status</label>
                <select
                  id="status-select"
                  name="status"
                  defaultValue={editingOrg?.stripeSubscriptionStatus || 'inactive'}
                  className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
                >
                  <option value="active">Active (Premium Enabled)</option>
                  <option value="inactive">Inactive</option>
                  <option value="canceled">Canceled</option>
                  <option value="past_due">Past Due</option>
                </select>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <RefreshCcw className="mt-0.5 size-4 text-amber-600" />
              <p className="text-[11px] font-medium leading-relaxed text-amber-800">
                Changing these values will manually override the Stripe billing state. Use this only for direct renewals or testing purposes.
              </p>
            </div>

            <SheetFooter className="mt-8 flex flex-col gap-2">
              <Button type="submit" className="flex h-12 w-full gap-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40" disabled={isUpdating}>
                {isUpdating ? <RefreshCcw className="size-4 animate-spin" /> : <RefreshCcw className="size-4" />}
                Save Subscription Changes
              </Button>
              <Button type="button" variant="ghost" className="h-11 w-full rounded-xl text-xs font-bold text-gray-500 hover:text-red-500" onClick={() => setEditingOrg(null)}>
                Discard Changes
              </Button>
            </SheetFooter>
          </form>

          {/* Deep Access Tools */}
          <div className="mt-12 flex flex-col gap-4 border-t border-gray-100 pt-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Administrative Access</h3>
            <Button variant="outline" className="group h-11 w-full justify-between rounded-xl border-2 border-dashed text-xs font-bold transition-all hover:border-primary hover:bg-primary/5" disabled>
              <div className="flex items-center gap-2">
                <ExternalLink className="size-3 text-gray-400 group-hover:text-primary" />
                System Log Monitoring
              </div>
              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[9px] font-black text-gray-400">SOON</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
