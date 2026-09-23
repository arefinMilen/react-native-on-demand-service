import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/index';
import { setAssignedProvider, updateProviderLiveLocation } from '../store/bookingSlice';
import { initCustomerSocket, getCustomerSocket } from '../services/socket';
import { apiClient } from '../services/api';

export const LiveTrackingScreen = ({ route, navigation }: any) => {
  const dispatch = useDispatch();
  const { bookingId } = route.params;

  const authUser = useSelector((state: RootState) => state.auth.user);
  const bookingState = useSelector((state: RootState) => state.booking);
  
  const [booking, setBooking] = useState<any>(bookingState.currentBooking);
  const [provider, setProvider] = useState<any>(bookingState.assignedProvider);
  const [status, setStatus] = useState<string>('SEARCHING');

  useEffect(() => {
    if (authUser?.id) {
      const socket = initCustomerSocket(authUser.id);

      socket.on('provider_assigned', (data: any) => {
        console.log('✅ [Socket Event] Provider Assigned:', data);
        setBooking(data.booking);
        setProvider(data.provider);
        setStatus('ACCEPTED');
        dispatch(setAssignedProvider({ booking: data.booking, provider: data.provider }));

        // Subscribe to live location stream of assigned provider
        if (data.provider?.id) {
          socket.on(`provider_live_location:${data.provider.id}`, (loc: any) => {
            dispatch(updateProviderLiveLocation(loc));
          });
        }
      });
    }
  }, [authUser]);

  useEffect(() => {
    // Initial fetch of booking details from API
    const fetchDetails = async () => {
      try {
        const response = await apiClient.get(`/bookings/${bookingId}`);
        const data = response.data.data;
        setBooking(data);
        if (data.provider) {
          setProvider(data.provider.providerProfile);
          setStatus(data.status);
        }
      } catch (err: any) {
        console.error('Fetch booking error:', err.message);
      }
    };

    fetchDetails();
  }, [bookingId]);

  const handleCallProvider = () => {
    if (provider?.user?.phone) {
      Linking.openURL(`tel:${provider.user.phone}`);
    } else {
      Alert.alert('Calling', 'Dialing Provider +8801900000000');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapMock}>
        <Text style={styles.mapMockText}>🗺️ Live Map Tracking View</Text>
        <Text style={styles.mapMockSubtext}>Pickup Lat: {booking?.pickupLat || 23.7925} | Lng: {booking?.pickupLng || 90.4078}</Text>

        {status === 'SEARCHING' ? (
          <View style={styles.radarBox}>
            <ActivityIndicator size="large" color="#38BDF8" style={{ marginBottom: 12 }} />
            <Text style={styles.radarText}>Searching for nearest verified provider within 5 km...</Text>
            <Text style={styles.radarHint}>Please hold on. High priority dispatch active.</Text>
          </View>
        ) : (
          <View style={styles.markerBox}>
            <Text style={styles.markerIcon}>🛵</Text>
            <Text style={styles.markerText}>Provider is on the way (ETA: ~12 mins)</Text>
          </View>
        )}
      </View>

      {/* Provider Details Card */}
      <View style={styles.detailsCard}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>
            STATUS: {status === 'SEARCHING' ? 'SEARCHING FOR PROVIDER' : status}
          </Text>
        </View>

        {provider ? (
          <View style={styles.providerRow}>
            <View style={styles.providerAvatar}>
              <Text style={styles.avatarText}>🛠️</Text>
            </View>
            <View style={styles.providerInfo}>
              <Text style={styles.providerName}>{provider.fullName || 'Rahim Plumbing Expert'}</Text>
              <Text style={styles.providerRating}>⭐ {provider.ratingAvg || 4.9} (42 reviews)</Text>
              <Text style={styles.providerService}>{booking?.service?.name || 'Handyman'}</Text>
            </View>
            <TouchableOpacity style={styles.callButton} onPress={handleCallProvider}>
              <Text style={styles.callButtonText}>📞 Call</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.bookingSummary}>
          <Text style={styles.summaryLabel}>Order No: {booking?.bookingNumber || 'BK-102938'}</Text>
          <Text style={styles.summaryValue}>Total: ৳{booking?.totalAmount || 520}</Text>
        </View>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  mapMock: {
    flex: 1,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  mapMockText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#38BDF8',
    marginBottom: 6,
  },
  mapMockSubtext: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 24,
  },
  radarBox: {
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  radarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
    textAlign: 'center',
  },
  radarHint: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 6,
    textAlign: 'center',
  },
  markerBox: {
    alignItems: 'center',
    backgroundColor: '#0369A1',
    borderRadius: 16,
    padding: 20,
  },
  markerIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  markerText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  detailsCard: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#334155',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#0284C7',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 16,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  providerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  avatarText: {
    fontSize: 24,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  providerRating: {
    fontSize: 12,
    color: '#F59E0B',
    marginVertical: 2,
  },
  providerService: {
    fontSize: 12,
    color: '#94A3B8',
  },
  callButton: {
    backgroundColor: '#10B981',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  callButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  bookingSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  summaryLabel: {
    color: '#94A3B8',
    fontSize: 13,
  },
  summaryValue: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '700',
  },
  homeButton: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  homeButtonText: {
    color: '#F8FAFC',
    fontWeight: '700',
    fontSize: 14,
  },
});
