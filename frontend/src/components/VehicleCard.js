import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import StatusBadge from './StatusBadge';
import { AuthContext } from '../context/AuthContext';

const VehicleCard = ({ vehicle, onPress }) => {
  const { baseUrl } = useContext(AuthContext);

  // Fallback placeholder image or constructed remote image URL
  const imageUrl = vehicle.image?.startsWith('http')
    ? vehicle.image
    : `${baseUrl}${vehicle.image}`;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={onPress}
    >
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.modelText} numberOfLines={1}>
            {vehicle.model}
          </Text>
          <StatusBadge status={vehicle.isAvailable ? 'Available' : 'Rented'} />
        </View>

        <Text style={styles.categoryText}>{vehicle.category} • {vehicle.fuelType}</Text>

        <View style={styles.footerRow}>
          <View>
            <Text style={styles.rateLabel}>Daily Rate</Text>
            <Text style={styles.rateValue}>${vehicle.dailyRate} <Text style={styles.perDay}>/day</Text></Text>
          </View>
          <Text style={styles.capacityText}>👥 {vehicle.seatingCapacity} Seats</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 170,
    backgroundColor: '#E2E8F0',
  },
  content: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  modelText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 12,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  rateLabel: {
    fontSize: 11,
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  rateValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2563EB',
  },
  perDay: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  capacityText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
});

export default VehicleCard;
