import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { initProviderSocket, emitLocationUpdate } from '../services/socket';
import { IncomingJobModal } from '../components/IncomingJobModal';

export const DutyDashboardScreen = ({ route, navigation }: any) => {
  const providerId = route.params?.providerId || 'demo-provider-1';
  const [isOnline, setIsOnline] = useState(true);
  const [jobOffer, setJobOffer] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const socket = initProviderSocket(providerId);

    socket.on('new_job_offer', (offerData: any) => {
      console.log('⚡ [Provider App] New Job Offer Received:', offerData);
      setJobOffer(offerData);
      setModalVisible(true);
    });

    // Location streaming loop
    const locationInterval = setInterval(() => {
      if (isOnline) {
        // Stream mock coordinates around Gulshan, Dhaka
        const mockLat = 23.7940 + (Math.random() - 0.5) * 0.005;
        const mockLng = 90.4050 + (Math.random() - 0.5) * 0.005;
        emitLocationUpdate(providerId, 'handyman-plumbing', mockLat, mockLng);
      }
    }, 5000);

    return () => clearInterval(locationInterval);
  }, [isOnline, providerId]);

  const handleSimulateOffer = () => {
    setJobOffer({
      bookingId: 'demo-booking-99',
      serviceTitle: 'Handyman & Plumbing',
      customerName: 'Tanvir Customer',
      addressText: 'House 12, Road 5, Gulshan-2',
      distanceKm: 1.4,
      providerEarnings: 450,
    });
    setModalVisible(true);
  };

  const handleAcceptJob = (bookingId: string) => {
    setModalVisible(false);
    Alert.alert('Job Accepted!', 'Navigating to Customer Location...');
  };

  const handleDeclineJob = (bookingId: string) => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Rahim Plumbing Expert</Text>
          <Text style={styles.headerSubtitle}>⭐ 4.9 Rating (Verified KYC)</Text>
        </View>
        <View style={styles.statusChip}>
          <Text style={styles.statusChipText}>{isOnline ? '🟢 ONLINE' : '🔴 OFFLINE'}</Text>
        </View>
      </View>

      {/* Online Duty Switch Card */}
      <View style={styles.dutyCard}>
        <View style={styles.dutyTextGroup}>
          <Text style={styles.dutyTitle}>Duty Status</Text>
          <Text style={styles.dutySubtitle}>
            {isOnline
              ? 'Broadcasting live location to nearby customers'
              : 'Turn on duty to start receiving job offers'}
          </Text>
        </View>
        <Switch
          value={isOnline}
          onValueChange={setIsOnline}
          trackColor={{ false: '#334155', true: '#059669' }}
          thumbColor={isOnline ? '#10B981' : '#94A3B8'}
        />
      </View>

      {/* Wallet Summary */}
      <View style={styles.walletCard}>
        <Text style={styles.walletHeader}>💰 Today's Wallet Earnings</Text>
        <Text style={styles.walletAmount}>৳1,850.00</Text>
        <View style={styles.walletRow}>
          <Text style={styles.walletSub}>4 Completed Jobs</Text>
          <Text style={styles.walletSub}>Platform Commission: ৳200</Text>
        </View>
      </View>

      {/* Demo Action Trigger */}
      <View style={styles.actionBox}>
        <Text style={styles.actionBoxTitle}>⚡ Dispatch Simulation</Text>
        <TouchableOpacity style={styles.simulateButton} onPress={handleSimulateOffer}>
          <Text style={styles.simulateButtonText}>Simulate Incoming Job Offer Alert</Text>
        </TouchableOpacity>
      </View>

      <IncomingJobModal
        visible={modalVisible}
        jobOffer={jobOffer}
        onAccept={handleAcceptJob}
        onDecline={handleDeclineJob}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 16,
    paddingTop: 48,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#F59E0B',
    marginTop: 2,
  },
  statusChip: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statusChipText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  dutyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  dutyTextGroup: {
    flex: 1,
    marginRight: 12,
  },
  dutyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  dutySubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  walletCard: {
    backgroundColor: '#047857',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  walletHeader: {
    color: '#A7F3D0',
    fontSize: 13,
    fontWeight: '700',
  },
  walletAmount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    marginVertical: 6,
  },
  walletRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#059669',
    paddingTop: 10,
    marginTop: 4,
  },
  walletSub: {
    color: '#E6F4EA',
    fontSize: 12,
  },
  actionBox: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  actionBoxTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 12,
  },
  simulateButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  simulateButtonText: {
    color: '#0F172A',
    fontWeight: '800',
    fontSize: 14,
  },
});
