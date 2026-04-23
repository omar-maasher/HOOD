import { Tabs } from 'expo-router';
import React from 'react';
import { CalendarDays, Bell, Settings } from 'lucide-react-native';
import { useNotifications } from '../../hooks/useNotifications';

export default function TabLayout() {
  useNotifications();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ff5e21',
        headerShown: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'الحجوزات',
          tabBarIcon: ({ color }) => <CalendarDays size={24} color={color} />,
          headerTitle: 'جدول الحجوزات',
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'التنبيهات',
          tabBarIcon: ({ color }) => <Bell size={24} color={color} />,
          headerTitle: 'التنبيهات الأخيرة',
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: 'الإعدادات',
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
          headerTitle: 'إعدادات الحساب',
        }}
      />
    </Tabs>
  );
}
