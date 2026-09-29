import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

export const LoadingView = ({ message = 'Loading...' }) => (
  <View style={styles.centerContainer}>
    <ActivityIndicator size="large" color="#2563EB" />
    <Text style={styles.loadingText}>{message}</Text>
  </View>
);

export const EmptyState = ({ title = 'No items found', description = 'There is no data to display right now.' }) => (
  <View style={styles.centerContainer}>
    <Text style={styles.emptyTitle}>{title}</Text>
    <Text style={styles.emptyDescription}>{description}</Text>
  </View>
);

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    minHeight: 250,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#64748B',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
});
