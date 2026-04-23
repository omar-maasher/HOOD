import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import axios from 'axios';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { FontAwesome, FontAwesome5, MaterialIcons } from '@expo/vector-icons';

export default function BookingsScreen() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Edit State
  const [editingBooking, setEditingBooking] = useState<any>(null);
  const [editStatus, setEditStatus] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  const fetchBookings = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) {
      console.warn("Error fetching data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const handleUpdateStatus = async () => {
    if (!editingBooking) return;
    setUpdateLoading(true);
    try {
        const token = await getToken();
        await axios.put(`${process.env.EXPO_PUBLIC_API_URL}/api/bookings`, {
            id: editingBooking.id,
            status: editStatus
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setEditingBooking(null);
        fetchBookings();
        Alert.alert('نجاح', 'تم تحديث حالة الحجز بنجاح.');
    } catch (err) {
        console.error('Update Error:', err);
        Alert.alert('خطأ', 'فشل تحديث الحجز، حاول جرب مرة أخرى.');
    } finally {
        setUpdateLoading(false);
    }
  };

  const openEdit = (item: any) => {
    setEditingBooking(item);
    setEditStatus(item.status);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'confirmed': return { bg: '#D1FAE5', color: '#059669', icon: 'check-circle', label: 'مؤكد' };
      case 'cancelled': return { bg: '#FEE2E2', color: '#DC2626', icon: 'times-circle', label: 'ملغي' };
      default: return { bg: '#FEF3C7', color: '#D97706', icon: 'clock', label: 'قيد الانتظار' };
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const statusInfo = getStatusStyle(item.status);
    const formattedDate = new Date(item.bookingDate).toLocaleString('ar-SA', {
        weekday: 'long', year: 'numeric', month: 'short', day: 'numeric',
        hour: 'numeric', minute: 'numeric', hour12: true
    });

    return (
      <TouchableOpacity activeOpacity={0.7} style={styles.card} onPress={() => openEdit(item)}>
        <View style={styles.cardHeader}>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
            <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
            <FontAwesome5 name={statusInfo.icon} size={14} color={statusInfo.color} style={{ marginLeft: 6 }} />
          </View>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{item.customerName || 'عميل مجهول'}</Text>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{(item.customerName || 'ع').charAt(0)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>{formattedDate}</Text>
            <FontAwesome5 name="calendar-alt" size={14} color="#94a3b8" style={styles.infoIcon} />
          </View>
          
          {(item.serviceType || item.serviceDetails) && (
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>{item.serviceType || item.serviceDetails}</Text>
              <MaterialIcons name="medical-services" size={16} color="#94a3b8" style={styles.infoIcon} />
            </View>
          )}

          {item.contactInfo && (
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>{item.contactInfo}</Text>
              <FontAwesome name="phone" size={16} color="#94a3b8" style={styles.infoIcon} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>مرحباً بك مجدداً 👋</Text>
        <Text style={styles.headerText}>{user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'إدارة الحجوزات'}</Text>
      </View>
      
      {loading ? (
        <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#ff5e21" />
            <Text style={styles.loaderText}>جاري جلب البيانات...</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ff5e21" />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <FontAwesome5 name="box-open" size={48} color="#D1D5DB" />
                <Text style={styles.emptyText}>لا توجد حجوزات مسجلة حالياً.</Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* --- EDIT MODAL --- */}
      <Modal
        visible={!!editingBooking}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditingBooking(null)}
      >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>تعديل حالة الحجز</Text>
                    <TouchableOpacity onPress={() => setEditingBooking(null)}>
                        <FontAwesome name="close" size={24} color="#94a3b8" />
                    </TouchableOpacity>
                </View>

                <View style={styles.customerSummary}>
                    <Text style={styles.summaryName}>{editingBooking?.customerName}</Text>
                    <Text style={styles.summaryDate}>{editingBooking && new Date(editingBooking.bookingDate).toLocaleDateString('ar-SA')}</Text>
                </View>

                <Text style={styles.sectionLabel}>اختر الحالة الجديدة:</Text>
                <View style={styles.statusOptions}>
                    {[
                        { id: 'upcoming', label: 'قيد الانتظار', color: '#D97706', bg: '#FEF3C7' },
                        { id: 'confirmed', label: 'مؤكد', color: '#059669', bg: '#D1FAE5' },
                        { id: 'cancelled', label: 'ملغي', color: '#DC2626', bg: '#FEE2E2' },
                    ].map((s) => (
                        <TouchableOpacity 
                            key={s.id} 
                            style={[
                                styles.statusOption, 
                                { backgroundColor: s.bg },
                                editStatus === s.id && { borderWidth: 2, borderColor: s.color }
                            ]}
                            onPress={() => setEditStatus(s.id)}
                        >
                            <Text style={[styles.statusOptionText, { color: s.color }]}>{s.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity 
                    style={styles.saveButton} 
                    onPress={handleUpdateStatus}
                    disabled={updateLoading}
                >
                    {updateLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.saveButtonText}>حفظ التغييرات</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { 
    padding: 24, 
    paddingTop: 60,
    backgroundColor: '#ff5e21', 
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30, 
    marginBottom: 20,
    shadowColor: '#ff5e21',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  headerText: { fontSize: 26, fontWeight: '800', color: '#ffffff', textAlign: 'right', marginTop: 4 },
  headerSubtitle: { fontSize: 16, color: '#f8fafc', opacity: 0.9, textAlign: 'right', fontWeight: '500' },
  
  listContent: { paddingHorizontal: 16, paddingBottom: 30 },
  
  card: { 
    backgroundColor: '#1e293b', 
    marginBottom: 16, 
    padding: 18, 
    borderRadius: 20, 
    shadowColor: '#000000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.04, 
    shadowRadius: 10, 
    elevation: 3,
    borderWidth: 1,
    borderColor: '#334155'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f8fafc',
    marginRight: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff7ed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff5e21',
  },
  statusBadge: { 
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 10, 
  },
  statusText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 12,
  },
  cardBody: {
    flexDirection: 'column',
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 6,
  },
  infoText: {
    fontSize: 15,
    color: '#94a3b8',
    marginRight: 8,
    fontWeight: '500',
  },
  infoIcon: {
    width: 20,
    textAlign: 'center',
  },
  
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderText: { marginTop: 12, fontSize: 16, color: '#94a3b8', fontWeight: '500' },
  
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 80 },
  emptyText: { textAlign: 'center', color: '#475569', marginTop: 16, fontSize: 18, fontWeight: '500' },

  // --- MODAL STYLES ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#f8fafc',
  },
  customerSummary: {
    backgroundColor: '#0f172a',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  summaryName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f8fafc',
    textAlign: 'right',
  },
  summaryDate: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'right',
    marginTop: 4,
  },
  sectionLabel: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'right',
  },
  statusOptions: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statusOption: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  statusOptionText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#ff5e21',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#ff5e21',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  }
});
