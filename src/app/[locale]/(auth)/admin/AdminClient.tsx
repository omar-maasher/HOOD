'use client';

import { Building2, Crown, MessageSquare, Puzzle, Users } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type AdminStats = {
  totalOrgs: number;
  totalLeads: number;
  totalIntegrations: number;
  activeSubscriptions: number;
};

export function AdminClient({ stats, organizations }: { stats: AdminStats; organizations: any[] }) {
  const statCards = [
    {
      title: 'Total Organizations',
      value: stats.totalOrgs,
      icon: <Building2 className="size-5 text-blue-600" />,
      description: 'Total businesses registered',
      color: 'bg-blue-50 border-blue-100',
    },
    {
      title: 'Active Subscriptions',
      value: stats.activeSubscriptions,
      icon: <Crown className="size-5 text-emerald-600" />,
      description: 'Paying customers (Active Status)',
      color: 'bg-emerald-50 border-emerald-100',
    },
    {
      title: 'Global Leads',
      value: stats.totalLeads,
      icon: <MessageSquare className="size-5 text-purple-600" />,
      description: 'Leads across all organizations',
      color: 'bg-purple-50 border-purple-100',
    },
    {
      title: 'Meta Integrations',
      value: stats.totalIntegrations,
      icon: <Puzzle className="size-5 text-pink-600" />,
      description: 'Connected Meta accounts',
      color: 'bg-pink-50 border-pink-100',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your platform, organizations, and subscriptions.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map(stat => (
          <Card key={stat.title} className={`${stat.color} border-2 transition-all hover:shadow-md`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Organizations Table */}
      <Card className="border-none bg-white/50 shadow-xl backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="size-5 text-primary" />
              Latest Registered Organizations
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-xl border border-border/50">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Organization ID</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Subscription Status</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizations.map(org => (
                  <TableRow key={org.id} className="transition-colors hover:bg-muted/30">
                    <TableCell className="font-mono text-xs font-medium">{org.id}</TableCell>
                    <TableCell>
                      <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                        org.planId === 'premium' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                      }`}
                      >
                        {org.planId || 'Free'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`size-2 rounded-full ${org.stripeSubscriptionStatus === 'active' ? 'animate-pulse bg-emerald-500' : 'bg-gray-300'}`} />
                        <span className="text-sm capitalize">{org.stripeSubscriptionStatus || 'No Subscription'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(org.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
                {organizations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      No organizations found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
