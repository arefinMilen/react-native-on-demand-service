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
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { apiClient, setAuthToken } from '../services/api';

export const AuthScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [phone, setPhone] = useState('+8801800000000');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!phone) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/auth/send-otp', { phone });
      setStep('OTP');
      Alert.alert('OTP Sent', 'Use test OTP: 123456');
    } catch (err: any) {
      Alert.alert('Failed', err.response?.data?.message || 'Could not send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter 6-digit OTP code');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/auth/verify-otp', { phone, otp });
      const data = response.data.data;

      if (data.isRegistered && data.accessToken) {
        setAuthToken(data.accessToken);
        dispatch(setCredentials({ user: data.user, token: data.accessToken }));
        navigation.replace('Home');
      } else {
        // If not registered, register as Customer automatically for demo
        const regResponse = await apiClient.post('/auth/register', {
          phone,
          fullName: 'Tanvir Customer',
          role: 'CUSTOMER',
        });
        const regData = regResponse.data.data;
        setAuthToken(regData.accessToken);
        dispatch(setCredentials({ user: regData.user, token: regData.accessToken }));
        navigation.replace('Home');
      }
    } catch (err: any) {
      Alert.alert('Verification Failed', err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBox}>
        <Text style={styles.brandTitle}>ON-DEMAND</Text>
        <Text style={styles.brandSubtitle}>Service at your doorstep</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {step === 'PHONE' ? 'Enter Mobile Number' : 'Enter Verification Code'}
        </Text>
        <Text style={styles.cardSubtitle}>
          {step === 'PHONE'
            ? 'We will send a 6-digit OTP code to verify your phone.'
            : `Code sent to ${phone}`}
        </Text>

        {step === 'PHONE' ? (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>PHONE NUMBER</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="+8801XXXXXXXXX"
              placeholderTextColor="#64748B"
            />
          </View>
        ) : (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>6-DIGIT OTP CODE</Text>
            <TextInput
              style={styles.input}
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
              placeholder="123456"
              placeholderTextColor="#64748B"
            />
          </View>
        )}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={step === 'PHONE' ? handleSendOtp : handleVerifyOtp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#0F172A" />
          ) : (
            <Text style={styles.buttonText}>
              {step === 'PHONE' ? 'Send OTP Code' : 'Verify & Continue'}
            </Text>
          )}
        </TouchableOpacity>

        {step === 'OTP' && (
          <TouchableOpacity style={styles.backButton} onPress={() => setStep('PHONE')}>
            <Text style={styles.backButtonText}>← Change Phone Number</Text>
          </TouchableOpacity>
        )}
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
    fontSize: 28,
    fontWeight: '900',
    color: '#38BDF8',
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
    color: '#38BDF8',
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
    backgroundColor: '#38BDF8',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  backButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#94A3B8',
    fontSize: 14,
  },
});
