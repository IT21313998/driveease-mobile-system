import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatusBadge = ({ status }) => {
  let badgeStyle = styles.pending;
  let textStyle = styles.pendingText;

  switch (status?.toLowerCase()) {
    case 'available':
    case 'confirmed':
    case 'completed':
      badgeStyle = styles.success;
      textStyle = styles.successText;
      break;
    case 'rented':
    case 'cancelled':
    case 'rejected':
      badgeStyle = styles.danger;
      textStyle = styles.dangerText;
      break;
    case 'pending':
    default:
      badgeStyle = styles.warning;
      textStyle = styles.warningText;
      break;
  }

  return (
    <View style={[styles.badge, badgeStyle]}>
      <Text style={[styles.text, textStyle]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  success: {
    backgroundColor: '#DCFCE7',
  },
  successText: {
    color: '#15803D',
  },
  warning: {
    backgroundColor: '#FEF3C7',
  },
  warningText: {
    color: '#B45309',
  },
  danger: {
    backgroundColor: '#FEE2E2',
  },
  dangerText: {
    color: '#B91C1C',
  },
});

export default StatusBadge;
