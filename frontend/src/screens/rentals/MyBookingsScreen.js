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
import { getMyRentalsApi, updateRentalStatusApi } from '../../api/rentalApi';
import StatusBadge from '../../components/StatusBadge';
import { LoadingView, EmptyState } from '../../components/LoadingView';
import { AuthContext } from '../../context/AuthContext';

const MyBookingsScreen = ({ navigation }) => {
  const { baseUrl } = useContext(AuthContext);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = useCallback(async () => {
    try {
      const data = await getMyRentalsApi();
      setRentals(data);
    } catch (err) {
      console.warn('Could not fetch bookings', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

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

  const handleCancelBooking = (bookingId, vehicleModel) => {
    const doCancel = async () => {
      try {
        await updateRentalStatusApi(bookingId, 'Cancelled');
        if (Platform.OS === 'web') {
          window.alert('Booking Cancelled: The vehicle is now released back to the fleet.');
        } else {
          Alert.alert('Booking Cancelled', 'The vehicle is now released back to the fleet.');
        }
        fetchBookings();
      } catch (err) {
        if (Platform.OS === 'web') {
          window.alert('Error: ' + (err.message || 'Failed to cancel booking'));
        } else {
          Alert.alert('Error', err.message || 'Failed to cancel booking');
        }
      }
    };

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm(`Are you sure you want to cancel your rental booking for ${vehicleModel}?`)) {
        doCancel();
      }
    } else {
      Alert.alert(
        'Cancel Reservation',
        `Are you sure you want to cancel your rental booking for ${vehicleModel}?`,
        [
          { text: 'No', style: 'cancel' },
          {
            text: 'Yes, Cancel',
            style: 'destructive',
            onPress: doCancel,
          },
        ]
      );
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderBookingCard = ({ item }) => {
    const vehicle = item.vehicleId || {};
    const imageUrl = vehicle.image?.startsWith('http')
      ? vehicle.image
      : `${baseUrl}${vehicle.image}`;
    const canCancel = ['Pending', 'Confirmed'].includes(item.status);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          {vehicle.image ? (
            <Image source={{ uri: imageUrl }} style={styles.thumbImage} resizeMode="cover" />
          ) : (
            <View style={[styles.thumbImage, styles.placeholderThumb]}>
              <Text style={{ fontSize: 20 }}>🚗</Text>
            </View>
          )}

          <View style={styles.headerInfo}>
            <Text style={styles.vehicleTitle} numberOfLines={1}>
              {vehicle.model || 'Vehicle Rental'}
            </Text>
            <Text style={styles.plateText}>{vehicle.plateNumber || 'No plate'}</Text>
            <View style={{ marginTop: 4 }}>
              <StatusBadge status={item.status} />
            </View>
          </View>
        </View>

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
            <Text style={styles.totalPrice}>${item.totalCost}</Text>
          </View>
        </View>

        {item.notes ? (
          <Text style={styles.notesText}>Note: {item.notes}</Text>
        ) : null}

        {canCancel ? (
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => handleCancelBooking(item._id, vehicle.model || 'vehicle')}
          >
            <Text style={styles.cancelBtnText}>Cancel Reservation</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  if (loading) {
    return <LoadingView message="Loading your bookings..." />;
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
            title="No Bookings Yet"
            description="You haven't reserved any vehicles. Check out our fleet to book a ride!"
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
  cardHeader: {
    flexDirection: 'row',
  },
  thumbImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
    marginRight: 12,
  },
  placeholderThumb: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  vehicleTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  plateText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  detailsDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 11,
    color: '#94A3B8',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  metaValue: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
    marginTop: 2,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2563EB',
    marginTop: 1,
  },
  notesText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#64748B',
    marginTop: 8,
    backgroundColor: '#F8FAFC',
    padding: 6,
    borderRadius: 6,
  },
  cancelBtn: {
    marginTop: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#F87171',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
  },
  cancelBtnText: {
    color: '#DC2626',
    fontWeight: '600',
    fontSize: 13,
  },
});

export default MyBookingsScreen;
