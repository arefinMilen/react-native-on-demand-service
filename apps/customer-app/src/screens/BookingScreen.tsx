import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { setCurrentBooking } from '../store/bookingSlice';
import { apiClient } from '../services/api';

export const BookingScreen = ({ route, navigation }: any) => {
  const dispatch = useDispatch();
  const { category } = route.params;

  const [address, setAddress] = useState('House 12, Road 5, Gulshan-2, Dhaka');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'BKASH'>('CASH');
  const [loading, setLoading] = useState(false);

  const handleConfirmBooking = async () => {
    if (!address) {
      Alert.alert('Error', 'Please enter your service address');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/bookings', {
        serviceId: category.id,
        pickupLat: 23.7925,
        pickupLng: 90.4078,
        addressText: address,
        notes,
        paymentMethod,
      });

      const bookingData = response.data.data;
      dispatch(setCurrentBooking(bookingData));

      navigation.replace('LiveTracking', { bookingId: bookingData.id });
    } catch (err: any) {
      Alert.alert('Booking Error', err.response?.data?.message || 'Could not place booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentPadding}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back to Categories</Text>
      </TouchableOpacity>

      <Text style={styles.screenTitle}>Confirm Booking</Text>

      {/* Category Card */}
      <View style={styles.card}>
        <Text style={styles.categoryName}>{category.name}</Text>
        <Text style={styles.categoryDesc}>{category.description}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Base Service Rate:</Text>
          <Text style={styles.priceValue}>৳{category.basePrice}</Text>
        </View>
      </View>

      {/* Address Card */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>📍 Service Location</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Enter detailed house/flat address..."
          placeholderTextColor="#64748B"
          multiline
        />
        <TextInput
          style={[styles.input, { marginTop: 10 }]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Special notes or instructions for provider (optional)..."
          placeholderTextColor="#64748B"
        />
      </View>

      {/* Payment Method */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>💳 Payment Method</Text>
        <View style={styles.paymentOptions}>
          <TouchableOpacity
            style={[styles.paymentChip, paymentMethod === 'CASH' && styles.paymentChipSelected]}
            onPress={() => setPaymentMethod('CASH')}
          >
            <Text style={[styles.chipText, paymentMethod === 'CASH' && styles.chipTextSelected]}>
              💵 Cash on Delivery
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.paymentChip, paymentMethod === 'BKASH' && styles.paymentChipSelected]}
            onPress={() => setPaymentMethod('BKASH')}
          >
            <Text style={[styles.chipText, paymentMethod === 'BKASH' && styles.chipTextSelected]}>
              💖 bKash Online
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bill Summary */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>🧾 Fare Breakdown</Text>
        <View style={styles.fareRow}>
          <Text style={styles.fareLabel}>Base Service Charge</Text>
          <Text style={styles.fareValue}>৳{category.basePrice}</Text>
        </View>
        <View style={styles.fareRow}>
          <Text style={styles.fareLabel}>Platform Convenience Fee</Text>
          <Text style={styles.fareValue}>৳20</Text>
        </View>
        <View style={[styles.fareRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total Payable Amount</Text>
          <Text style={styles.totalValue}>৳{category.basePrice + 20}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirmBooking}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#0F172A" />
        ) : (
          <Text style={styles.confirmButtonText}>Confirm & Search Nearby Provider</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  contentPadding: {
    padding: 16,
    paddingBottom: 36,
  },
  backButton: {
    marginBottom: 12,
  },
  backButtonText: {
    color: '#38BDF8',
    fontSize: 14,
    fontWeight: '600',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#38BDF8',
  },
  categoryDesc: {
    fontSize: 13,
    color: '#94A3B8',
    marginVertical: 6,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 8,
  },
  priceLabel: {
    color: '#94A3B8',
    fontSize: 14,
  },
  priceValue: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  cardHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 12,
    color: '#F8FAFC',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  paymentOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  paymentChip: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  paymentChipSelected: {
    borderColor: '#38BDF8',
    backgroundColor: '#0369A1',
  },
  chipText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  fareLabel: {
    color: '#94A3B8',
    fontSize: 13,
  },
  fareValue: {
    color: '#F8FAFC',
    fontSize: 13,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 10,
    marginTop: 6,
  },
  totalLabel: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },
  totalValue: {
    color: '#38BDF8',
    fontSize: 18,
    fontWeight: '800',
  },
  confirmButton: {
    backgroundColor: '#38BDF8',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
});
