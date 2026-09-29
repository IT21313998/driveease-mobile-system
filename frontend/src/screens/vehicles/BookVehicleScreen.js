import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { createRentalApi } from '../../api/rentalApi';
import Input from '../../components/Input';
import Button from '../../components/Button';

const BookVehicleScreen = ({ route, navigation }) => {
  const { vehicle } = route.params;

  // Defaults to starting tomorrow for 3 days
  const today = new Date();
  const defaultStart = new Date(today);
  defaultStart.setDate(today.getDate() + 1);

  const defaultEnd = new Date(defaultStart);
  defaultEnd.setDate(defaultStart.getDate() + 3);

  const formatDate = (d) => d.toISOString().split('T')[0];

  const [startDateStr, setStartDateStr] = useState(formatDate(defaultStart));
  const [endDateStr, setEndDateStr] = useState(formatDate(defaultEnd));
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  // Calculate days & estimate
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const isValidDateRange = !isNaN(start.getTime()) && !isNaN(end.getTime()) && end > start;
  const calculatedDays = isValidDateRange
    ? Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    : 0;
  const estimatedCost = calculatedDays * vehicle.dailyRate;

  const validate = () => {
    let errs = {};
    if (!startDateStr.trim()) errs.startDate = 'Start date is required';
    if (!endDateStr.trim()) errs.endDate = 'End date is required';

    if (isNaN(start.getTime())) errs.startDate = 'Use format YYYY-MM-DD';
    if (isNaN(end.getTime())) errs.endDate = 'Use format YYYY-MM-DD';

    if (!errs.startDate && !errs.endDate && end <= start) {
      errs.endDate = 'End date must be after start date';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleBooking = async () => {
    setGeneralError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await createRentalApi({
        vehicleId: vehicle._id,
        startDate: startDateStr,
        endDate: endDateStr,
        notes,
      });

      Alert.alert(
        'Booking Confirmed! 🎉',
        `Your reservation for ${vehicle.model} has been confirmed. Total: $${estimatedCost}`,
        [
          {
            text: 'View My Bookings',
            onPress: () => {
              navigation.navigate('MyBookingsTab');
            },
          },
        ]
      );
    } catch (err) {
      setGeneralError(err.message || 'Failed to place booking.');
    } finally {
      setLoading(false);
    }
  };

  const adjustDays = (days) => {
    const newEnd = new Date(start);
    newEnd.setDate(start.getDate() + days);
    setEndDateStr(formatDate(newEnd));
    if (errors.endDate) setErrors({ ...errors, endDate: null });
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Selected Vehicle</Text>
        <Text style={styles.vehicleName}>{vehicle.model}</Text>
        <Text style={styles.vehicleSub}>{vehicle.category} • ${vehicle.dailyRate}/day</Text>
      </View>

      {generalError ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{generalError}</Text>
        </View>
      ) : null}

      <Text style={styles.sectionHeader}>Reservation Period</Text>

      <Input
        label="Start Date (YYYY-MM-DD)"
        value={startDateStr}
        onChangeText={(text) => {
          setStartDateStr(text);
          if (errors.startDate) setErrors({ ...errors, startDate: null });
        }}
        placeholder="YYYY-MM-DD"
        error={errors.startDate}
      />

      <Input
        label="End Date (YYYY-MM-DD)"
        value={endDateStr}
        onChangeText={(text) => {
          setEndDateStr(text);
          if (errors.endDate) setErrors({ ...errors, endDate: null });
        }}
        placeholder="YYYY-MM-DD"
        error={errors.endDate}
      />

      {/* Quick duration presets */}
      <View style={styles.presetsRow}>
        <Text style={styles.presetLabel}>Quick Select:</Text>
        <TouchableOpacity style={styles.presetChip} onPress={() => adjustDays(1)}>
          <Text style={styles.presetChipText}>1 Day</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.presetChip} onPress={() => adjustDays(3)}>
          <Text style={styles.presetChipText}>3 Days</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.presetChip} onPress={() => adjustDays(7)}>
          <Text style={styles.presetChipText}>1 Week</Text>
        </TouchableOpacity>
      </View>

      <Input
        label="Special Instructions / Pickup Notes (Optional)"
        value={notes}
        onChangeText={setNotes}
        placeholder="e.g. Flight arrival time, child seat requested"
        multiline
        numberOfLines={3}
      />

      {/* Live Cost Breakdown Card */}
      <View style={styles.costCard}>
        <View style={styles.costRow}>
          <Text style={styles.costLabel}>Duration:</Text>
          <Text style={styles.costValue}>{calculatedDays} {calculatedDays === 1 ? 'day' : 'days'}</Text>
        </View>
        <View style={styles.costRow}>
          <Text style={styles.costLabel}>Rate:</Text>
          <Text style={styles.costValue}>${vehicle.dailyRate} / day</Text>
        </View>
        <View style={[styles.costRow, styles.costTotalRow]}>
          <Text style={styles.totalLabel}>Total Estimated Cost:</Text>
          <Text style={styles.totalAmount}>${estimatedCost}</Text>
        </View>
      </View>

      <Button
        title={`Confirm & Book ($${estimatedCost})`}
        onPress={handleBooking}
        loading={loading}
        disabled={!isValidDateRange}
        style={styles.confirmBtn}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    flexGrow: 1,
  },
  summaryCard: {
    backgroundColor: '#F1F5F9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 12,
    textTransform: 'uppercase',
    color: '#64748B',
    fontWeight: '700',
  },
  vehicleName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  vehicleSub: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F87171',
  },
  errorBannerText: {
    color: '#B91C1C',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  presetsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  presetLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  presetChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  costCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  costLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  costValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  costTotalRow: {
    borderTopWidth: 1,
    borderTopColor: '#CBD5E1',
    paddingTop: 10,
    marginTop: 4,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2563EB',
  },
  confirmBtn: {
    marginTop: 8,
    marginBottom: 24,
  },
});

export default BookVehicleScreen;
