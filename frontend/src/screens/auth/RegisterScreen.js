import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';

const RegisterScreen = ({ navigation }) => {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  const validate = () => {
    let errs = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async () => {
    setGeneralError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await register(name, email, password, role);
    } catch (err) {
      setGeneralError(err.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.brandTitle}>Create Account</Text>
        <Text style={styles.subtitle}>Join DriveEase to explore and book vehicles</Text>
      </View>

      {generalError ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{generalError}</Text>
        </View>
      ) : null}

      <Input
        label="Full Name"
        value={name}
        onChangeText={(text) => {
          setName(text);
          if (errors.name) setErrors({ ...errors, name: null });
        }}
        placeholder="e.g. John Doe"
        error={errors.name}
      />

      <Input
        label="Email Address"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (errors.email) setErrors({ ...errors, email: null });
        }}
        placeholder="e.g. user@example.com"
        keyboardType="email-address"
        error={errors.email}
      />

      <Input
        label="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (errors.password) setErrors({ ...errors, password: null });
        }}
        placeholder="Min 6 characters"
        secureTextEntry
        error={errors.password}
      />

      <Input
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
        }}
        placeholder="Re-type password"
        secureTextEntry
        error={errors.confirmPassword}
      />

      {/* Account Type Selection */}
      <View style={styles.roleContainer}>
        <Text style={styles.roleLabel}>Account Role</Text>
        <View style={styles.roleButtonGroup}>
          <TouchableOpacity
            style={[styles.roleOption, role === 'customer' && styles.roleOptionActive]}
            onPress={() => setRole('customer')}
          >
            <Text style={[styles.roleText, role === 'customer' && styles.roleTextActive]}>
              Customer
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleOption, role === 'admin' && styles.roleOptionActive]}
            onPress={() => setRole('admin')}
          >
            <Text style={[styles.roleText, role === 'admin' && styles.roleTextActive]}>
              Admin / Manager
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Button title="Sign Up" onPress={handleRegister} loading={loading} style={styles.submitBtn} />

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2563EB',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
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
  roleContainer: {
    marginVertical: 10,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 8,
  },
  roleButtonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  roleOption: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  roleOptionActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  roleText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  roleTextActive: {
    color: '#2563EB',
  },
  submitBtn: {
    marginTop: 16,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  footerText: {
    color: '#64748B',
    fontSize: 14,
  },
  linkText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RegisterScreen;
