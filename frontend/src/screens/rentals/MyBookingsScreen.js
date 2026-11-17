import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Image,
  Platform,
} from 'react-native';
import { getMyRentalsApi, getAllRentalsApi, updateRentalStatusApi } from '../../api/rentalApi';
import StatusBadge from '../../components/StatusBadge';
import { LoadingView, EmptyState } from '../../components/LoadingView';
import { AuthContext } from '../../context/AuthContext';

const MyBookingsScreen = ({ navigation }) => {
  const { baseUrl, user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';

  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = useCallback(async () => {
    try {
      const data = isAdmin ? await getAllRentalsApi() : await getMyRentalsApi();
      setRentals(data);
    } catch (err) {
      console.warn('Could not fetch bookings', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchBookings();
    });
    return unsubscribe;
  }, [navigation, fetchBookings]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const handleUpdateStatus = (bookingId, vehicleModel, newStatus) => {
    const doUpdate = async () => {
      try {
        await updateRentalStatusApi(bookingId, newStatus);
        const msg = newStatus === 'Completed'
          ? 'Rental marked as Completed. Vehicle has been returned to the available fleet!'
          : 'Reservation has been cancelled. Vehicle released back to the fleet.';
        
        if (Platform.OS === 'web') {
          window.alert(msg);
        } else {
          Alert.alert('Status Updated', msg);
        }
        fetchBookings();
      } catch (err) {
        if (Platform.OS === 'web') {
          window.alert('Error: ' + (err.message || 'Failed to update status'));
        } else {
          Alert.alert('Error', err.message || 'Failed to update status');
        }
      }
    };

    const actionText = newStatus === 'Completed'
      ? `mark the rental for ${vehicleModel} as Returned / Completed`
      : `cancel the reservation for ${vehicleModel}`;

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm(`Are you sure you want to ${actionText}?`)) {
        doUpdate();
      }
    } else {
      Alert.alert(
        'Update Reservation',
        `Are you sure you want to ${actionText}?`,
        [
          { text: 'No', style: 'cancel' },
          { text: 'Yes, Confirm', onPress: doUpdate },
        ]
      );
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderBookingCard = ({ item }) => {
    const vehicle = item.vehicleId || {};
    const canCancel = ['Pending', 'Confirmed'].includes(item.status);

    const imageUrl = vehicle.image?.startsWith('http')
      ? vehicle.image
      : `${baseUrl}${vehicle.image}`;

    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          {vehicle.image ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.vehicleThumb}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.vehicleThumb, styles.noThumb]}>
              <Text style={{ fontSize: 22 }}>🚗</Text>
            </View>
          )}

          <View style={styles.headerInfo}>
            <Text style={styles.vehicleTitle} numberOfLines={1}>
              {vehicle.model || 'Unknown Vehicle'}
            </Text>
            <Text style={styles.vehicleSub}>
              {vehicle.plateNumber ? `Plate: ${vehicle.plateNumber}` : 'DriveEase Rental'}
            </Text>
          </View>

          <StatusBadge status={item.status} />
        </View>

        {/* Admin only: Customer details banner */}
        {isAdmin && item.userId ? (
          <View style={styles.customerBox}>
            <Text style={styles.customerBoxText}>
              👤 Customer: <Text style={{ fontWeight: '700' }}>{item.userId?.name || 'Customer'}</Text> ({item.userId?.email || 'N/A'})
            </Text>
          </View>
        ) : null}

        <View style={styles.detailsDivider} />

        <View style={styles.detailsRow}>
          <View>
            <Text style={styles.metaLabel}>Rental Period</Text>
            <Text style={styles.metaValue}>
              {formatDate(item.startDate)} → {formatDate(item.endDate)}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.metaLabel}>Total ({item.totalDays} days)</Text>
            <Text style={styles.totalPrice}>Rs. {Number(item.totalCost).toLocaleString()}</Text>
          </View>
        </View>

        {item.notes ? (
          <Text style={styles.notesText}>Note: {item.notes}</Text>
        ) : null}

        {/* Action Buttons */}
        {canCancel ? (
          <View style={styles.actionsRow}>
            {isAdmin && item.status === 'Confirmed' && (
              <TouchableOpacity
                style={styles.completeBtn}
                onPress={() => handleUpdateStatus(item._id, vehicle.model || 'vehicle', 'Completed')}
              >
                <Text style={styles.completeBtnText}>✓ Mark as Returned</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => handleUpdateStatus(item._id, vehicle.model || 'vehicle', 'Cancelled')}
            >
              <Text style={styles.cancelBtnText}>✕ Cancel Reservation</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  };

  if (loading) {
    return <LoadingView message="Loading bookings..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={rentals}
        keyExtractor={(item) => item._id}
        renderItem={renderBookingCard}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />
        }
        ListEmptyComponent={
          <EmptyState
            title="No Bookings Found"
            description={isAdmin ? "No customer reservations recorded in the system yet." : "You haven't reserved any vehicles yet. Explore the fleet to book a ride!"}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  list: {
    padding: 16,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  vehicleThumb: {
    width: 52,
    height: 52,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#E2E8F0',
  },
  noThumb: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  vehicleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  vehicleSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  customerBox: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 8,
  },
  customerBoxText: {
    fontSize: 12,
    color: '#334155',
  },
  detailsDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginTop: 2,
  },
  totalPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563EB',
    marginTop: 2,
  },
  notesText: {
    fontSize: 12,
    color: '#64748B',
    fontStyle: 'italic',
    marginTop: 4,
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  completeBtn: {
    flex: 1,
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  completeBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '700',
  },
});

export default MyBookingsScreen;
