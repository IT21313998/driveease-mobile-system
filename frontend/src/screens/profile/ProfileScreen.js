import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import Button from '../../components/Button';

const ProfileScreen = () => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm) {
        if (window.confirm('Are you sure you want to sign out?')) {
          logout();
        }
      } else {
        logout();
      }
    } else {
      Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: logout },
      ]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* User Info Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</Text>
        </View>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        <View style={[styles.roleBadge, user?.role === 'admin' ? styles.adminBadge : styles.customerBadge]}>
          <Text style={[styles.roleText, user?.role === 'admin' ? styles.adminText : styles.customerText]}>
            {user?.role?.toUpperCase() || 'CUSTOMER'}
          </Text>
        </View>
      </View>

      {/* Account Overview Card */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>👤 Account Overview</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Account Status</Text>
          <Text style={styles.infoValueSuccess}>Verified Active</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Membership</Text>
          <Text style={styles.infoValue}>DriveEase Premium</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Support Hotline</Text>
          <Text style={styles.infoValue}>+94 11 234 5678</Text>
        </View>

        <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.infoLabel}>Email Support</Text>
          <Text style={styles.infoValue}>support@driveease.lk</Text>
        </View>
      </View>

      <Button
        title="Sign Out"
        variant="danger"
        onPress={handleLogout}
        style={styles.logoutBtn}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F8FAFC',
    flexGrow: 1,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  userEmail: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 12,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  adminBadge: {
    backgroundColor: '#FEF3C7',
  },
  customerBadge: {
    backgroundColor: '#EFF6FF',
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
  },
  adminText: {
    color: '#B45309',
  },
  customerText: {
    color: '#2563EB',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  infoValueSuccess: {
    fontSize: 14,
    color: '#16A34A',
    fontWeight: '700',
  },
  logoutBtn: {
    marginTop: 6,
    marginBottom: 30,
  },
});

export default ProfileScreen;
