import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';

export default function SettingsScreen() {
  const { signOut } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>إدارة الحساب</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => signOut()}>
          <Text style={styles.logoutText}>تسجيل الخروج</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#0f172a' },
  card: { backgroundColor: '#1e293b', padding: 24, borderRadius: 24, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, elevation: 5, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 25, textAlign: 'right', color: '#f8fafc' },
  logoutBtn: { backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: 18, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.2)' },
  logoutText: { color: '#ef4444', fontWeight: 'bold', fontSize: 16 }
});
