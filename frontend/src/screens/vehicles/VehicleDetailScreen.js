import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { getVehicleByIdApi, deleteVehicleApi } from '../../api/vehicleApi';
import StatusBadge from '../../components/StatusBadge';
import Button from '../../components/Button';
import { LoadingView } from '../../components/LoadingView';
import { AuthContext } from '../../context/AuthContext';

const VehicleDetailScreen = ({ route, navigation }) => {
  const { vehicleId } = route.params;
  const { user, baseUrl } = useContext(AuthContext);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await getVehicleByIdApi(vehicleId);
        setVehicle(data);
      } catch (err) {
        Alert.alert('Error', err.message || 'Could not load vehicle details');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [vehicleId]);

  const handleDelete = () => {
    const doDelete = async () => {
      setDeleting(true);
      try {
        await deleteVehicleApi(vehicleId);
        if (Platform.OS === 'web') {
          window.alert('Success: Vehicle removed from fleet');
        } else {
          Alert.alert('Success', 'Vehicle removed from fleet');
        }
        navigation.goBack();
      } catch (err) {
        if (Platform.OS === 'web') {
          window.alert('Cannot Delete: ' + err.message);
        } else {
          Alert.alert('Cannot Delete', err.message);
        }
      } finally {
        setDeleting(false);
      }
    };

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm(`Are you sure you want to permanently delete ${vehicle?.model}?`)) {
        doDelete();
      }
    } else {
      Alert.alert(
        'Confirm Deletion',
        `Are you sure you want to permanently delete ${vehicle?.model}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: doDelete,
          },
        ]
      );
    }
  };

  if (loading || !vehicle) {
    return <LoadingView message="Loading vehicle specifications..." />;
  }

  const imageUrl = vehicle.image?.startsWith('http')
    ? vehicle.image
    : `${baseUrl}${vehicle.image}`;

  const isAdmin = user?.role === 'admin';

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.bannerImage} resizeMode="cover" />

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.modelTitle}>{vehicle.model}</Text>
          <StatusBadge status={vehicle.isAvailable ? 'Available' : 'Rented'} />
        </View>

        <Text style={styles.plateText}>Plate: {vehicle.plateNumber}</Text>

        <View style={styles.priceContainer}>
          <Text style={styles.priceValue}>Rs. {Number(vehicle.dailyRate).toLocaleString()}</Text>
          <Text style={styles.priceSub}> / 24-hour rental</Text>
        </View>

        {/* Specs Grid */}
        <View style={styles.specsGrid}>
          <View style={styles.specBox}>
            <Text style={styles.specLabel}>Category</Text>
            <Text style={styles.specValue}>{vehicle.category}</Text>
          </View>
          <View style={styles.specBox}>
            <Text style={styles.specLabel}>Fuel Type</Text>
            <Text style={styles.specValue}>{vehicle.fuelType}</Text>
          </View>
          <View style={styles.specBox}>
            <Text style={styles.specLabel}>Capacity</Text>
            <Text style={styles.specValue}>{vehicle.seatingCapacity} Passengers</Text>
          </View>
          <View style={styles.specBox}>
            <Text style={styles.specLabel}>Availability</Text>
            <Text style={[styles.specValue, { color: vehicle.isAvailable ? '#16A34A' : '#DC2626' }]}>
              {vehicle.isAvailable ? 'Ready for Booking' : 'Currently Rented'}
            </Text>
          </View>
        </View>

        {vehicle.description ? (
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionHeader}>About This Vehicle</Text>
            <Text style={styles.descriptionBody}>{vehicle.description}</Text>
          </View>
        ) : null}

        {/* Action Button */}
        <View style={styles.actionsContainer}>
          <Button
            title={vehicle.isAvailable ? 'Reserve This Vehicle' : 'Currently Unavailable'}
            disabled={!vehicle.isAvailable}
            onPress={() => navigation.navigate('BookVehicle', { vehicle })}
            style={styles.bookBtn}
          />

          {isAdmin ? (
            <Button
              title="Delete from Fleet (Admin)"
              variant="danger"
              loading={deleting}
              onPress={handleDelete}
              style={styles.deleteBtn}
            />
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  bannerImage: {
    width: '100%',
    height: 240,
    backgroundColor: '#E2E8F0',
  },
  content: {
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  modelTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
    marginRight: 10,
  },
  plateText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: '#EFF6FF',
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
  },
  priceValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2563EB',
  },
  priceSub: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  specBox: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 12,
  },
  specLabel: {
    fontSize: 12,
    color: '#94A3B8',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 4,
  },
  specValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  descriptionBody: {
    fontSize: 14,
    lineHeight: 22,
    color: '#475569',
  },
  actionsContainer: {
    marginTop: 10,
    marginBottom: 30,
  },
  bookBtn: {
    marginBottom: 10,
  },
  deleteBtn: {
    marginTop: 6,
  },
});

export default VehicleDetailScreen;
