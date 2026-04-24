'use client';

import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { Bell } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const locale = useLocale();
  const dateLocale = locale === 'ar' ? ar : enUS;

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.notifications) {
        setNotifications(data.notifications);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => n.isRead !== 'true').length;

  const markAsRead = async (id?: number) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(id ? { id } : { markAllRead: true }),
      });
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const requestWebPush = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        window.location.reload();
      }
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full p-0 text-[10px]"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-[400px] w-80 overflow-y-auto p-0">
        <div className="flex flex-col gap-2 border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold">{locale === 'ar' ? 'الإشعارات' : 'Notifications'}</h4>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={() => markAsRead()} className="h-auto px-2 py-1 text-xs text-primary">
                {locale === 'ar' ? 'تحديد الكل كمقروء' : 'Mark all read'}
              </Button>
            )}
          </div>
          {permission !== 'granted' && (
            <Button
              variant="outline"
              size="sm"
              onClick={requestWebPush}
              className="h-8 w-full border-primary/20 bg-primary/10 text-xs text-primary hover:bg-primary/20"
            >
              {locale === 'ar' ? 'تفعيل تنبيهات سطح المكتب 🖥️' : 'Enable Desktop Notifications 🖥️'}
            </Button>
          )}
        </div>
        {notifications.length === 0
          ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                {locale === 'ar' ? 'لا توجد إشعارات' : 'No notifications'}
              </div>
            )
          : (
              <div className="flex flex-col">
                {notifications.map(n => (
                  <DropdownMenuItem
                    key={n.id}
                    className={`flex flex-col items-start gap-1 p-4 ${n.isRead !== 'true' ? 'bg-primary/5' : ''}`}
                    onClick={() => {
                      if (n.isRead !== 'true') {
                        markAsRead(n.id);
                      }
                      if (n.link) {
                        window.location.href = n.link;
                      }
                    }}
                  >
                    <div className="flex w-full items-start justify-between gap-2">
                      <span className="text-sm font-semibold">{n.title}</span>
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: dateLocale })}
                      </span>
                    </div>
                    <p className="line-clamp-2 text-start text-xs text-muted-foreground">
                      {n.message}
                    </p>
                  </DropdownMenuItem>
                ))}
              </div>
            )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
