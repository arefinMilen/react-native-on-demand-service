import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';

export const ProviderAuthScreen = ({ navigation }: any) => {
  const [phone, setPhone] = useState('+8801900000000');
  const [loading, setLoading] = useState(false);

  const handleProviderLogin = async () => {
    if (!phone) {
      Alert.alert('Error', 'Please enter your registered phone number');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.replace('DutyDashboard', { providerId: 'demo-provider-1', phone });
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBox}>
        <Text style={styles.brandTitle}>PROVIDER PORTAL</Text>
        <Text style={styles.brandSubtitle}>Earn on your schedule</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Provider Login</Text>
        <Text style={styles.cardSubtitle}>Enter your verified provider phone number</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>REGISTERED PHONE NUMBER</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="+88019XXXXXXXX"
            placeholderTextColor="#64748B"
          />
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleProviderLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#0F172A" />
          ) : (
            <Text style={styles.buttonText}>Go to Duty Dashboard →</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 32,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#10B981',
    letterSpacing: 2,
  },
  brandSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 8,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#334155',
  },
  primaryButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
});
