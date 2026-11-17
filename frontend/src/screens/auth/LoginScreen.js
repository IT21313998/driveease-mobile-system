import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';

const LoginScreen = ({ navigation }) => {
  const { login, baseUrl, setCustomBaseUrl } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [showServerConfig, setShowServerConfig] = useState(false);
  const [customUrl, setCustomUrl] = useState(baseUrl);

  const validate = () => {
    let errs = {};
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

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async () => {
    setGeneralError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setGeneralError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.brandTitle}>DriveEase</Text>
        <Text style={styles.subtitle}>Sign in to rent your dream ride</Text>
      </View>

      {generalError ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{generalError}</Text>
        </View>
      ) : null}

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
        placeholder="Enter your password"
        secureTextEntry
        error={errors.password}
      />

      <Button title="Sign In" onPress={handleLogin} loading={loading} style={styles.loginBtn} />

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Server URL Switcher */}
      <View style={styles.serverConfigBox}>
        <TouchableOpacity onPress={() => setShowServerConfig(!showServerConfig)}>
          <Text style={styles.serverConfigToggle}>
            ⚙️ Server URL: <Text style={styles.serverConfigUrl}>{baseUrl}</Text> (Tap to change)
          </Text>
        </TouchableOpacity>

        {showServerConfig && (
          <View style={styles.serverInputContainer}>
            <Input
              value={customUrl}
              onChangeText={setCustomUrl}
              placeholder="e.g. http://10.0.2.2:5000 or http://192.168.8.185:5000"
              autoCapitalize="none"
            />
            <View style={styles.presetButtons}>
              <TouchableOpacity
                style={styles.presetBtn}
                onPress={() => setCustomUrl('http://10.0.2.2:5000')}
              >
                <Text style={styles.presetBtnText}>Android Emulator</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.presetBtn}
                onPress={() => setCustomUrl('http://192.168.190.163:5000')}
              >
                <Text style={styles.presetBtnText}>Wi-Fi (Phone)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.presetBtn}
                onPress={() => setCustomUrl('http://localhost:5000')}
              >
                <Text style={styles.presetBtnText}>Web / Local</Text>
              </TouchableOpacity>
            </View>
            <Button
              title="Apply Server URL"
              onPress={async () => {
                await setCustomBaseUrl(customUrl);
                setShowServerConfig(false);
                Alert.alert('Saved', `API endpoint set to: ${customUrl}`);
              }}
            />
          </View>
        )}
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
    marginBottom: 32,
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2563EB',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 6,
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
  loginBtn: {
    marginTop: 16,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
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
  serverConfigBox: {
    marginTop: 28,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    alignItems: 'center',
  },
  serverConfigToggle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  serverConfigUrl: {
    color: '#2563EB',
    fontWeight: '700',
  },
  serverInputContainer: {
    width: '100%',
    marginTop: 12,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  presetButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    gap: 6,
  },
  presetBtn: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
    alignItems: 'center',
  },
  presetBtnText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#334155',
  },
});

export default LoginScreen;
