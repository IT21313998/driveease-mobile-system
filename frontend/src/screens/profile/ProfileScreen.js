import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';

const ProfileScreen = () => {
  const { user, logout, baseUrl, setCustomBaseUrl } = useContext(AuthContext);
  const [urlInput, setUrlInput] = useState(baseUrl);
  const [savingUrl, setSavingUrl] = useState(false);

  const handleSaveUrl = async () => {
    if (!urlInput.trim()) {
      Alert.alert('Error', 'Please enter a valid backend URL');
      return;
    }
    setSavingUrl(true);
    try {
      await setCustomBaseUrl(urlInput);
      Alert.alert('URL Updated', `API base endpoint set to:\n${urlInput}`);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setSavingUrl(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
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

      {/* Backend API Configuration Section */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>🌐 Backend API Host URL</Text>
        <Text style={styles.sectionSubtitle}>
          Use your computer's LAN IP (e.g. http://192.168.1.15:5000) for mobile Expo testing or your live Render URL.
        </Text>

        <Input
          value={urlInput}
          onChangeText={setUrlInput}
          placeholder="http://192.168.1.x:5000 or https://..."
          autoCapitalize="none"
        />

        <Button
          title="Save API Endpoint"
          onPress={handleSaveUrl}
          loading={savingUrl}
          style={styles.saveUrlBtn}
        />
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
    padding: 20,
    backgroundColor: '#F8FAFC',
    flexGrow: 1,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
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
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 12,
  },
  saveUrlBtn: {
    marginTop: 4,
  },
  logoutBtn: {
    marginTop: 10,
    marginBottom: 30,
  },
});

export default ProfileScreen;
