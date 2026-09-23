import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';

interface IncomingJobModalProps {
  visible: boolean;
  jobOffer: any;
  onAccept: (bookingId: string) => void;
  onDecline: (bookingId: string) => void;
}

export const IncomingJobModal: React.FC<IncomingJobModalProps> = ({
  visible,
  jobOffer,
  onAccept,
  onDecline,
}) => {
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (!visible) {
      setTimeLeft(30);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onDecline(jobOffer?.bookingId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [visible, jobOffer]);

  if (!jobOffer) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.headerRow}>
            <Text style={styles.alertBadge}>⚡ NEW JOB OFFER</Text>
            <View style={styles.timerChip}>
              <Text style={styles.timerText}>⏳ {timeLeft}s</Text>
            </View>
          </View>

          <Text style={styles.serviceTitle}>{jobOffer.serviceTitle || 'Handyman & Plumbing'}</Text>
          <Text style={styles.customerName}>👤 Customer: {jobOffer.customerName || 'Tanvir Customer'}</Text>

          <View style={styles.detailsBox}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>📍 Distance:</Text>
              <Text style={styles.detailValue}>{jobOffer.distanceKm || 1.8} km away</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>🏠 Address:</Text>
              <Text style={styles.detailValue} numberOfLines={1}>
                {jobOffer.addressText || 'Gulshan-2, Dhaka'}
              </Text>
            </View>
            <View style={[styles.detailRow, styles.earningsRow]}>
              <Text style={styles.earningsLabel}>💵 Your Earnings:</Text>
              <Text style={styles.earningsValue}>৳{jobOffer.providerEarnings || 450}</Text>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.declineButton}
              onPress={() => onDecline(jobOffer.bookingId)}
            >
              <Text style={styles.declineText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => onAccept(jobOffer.bookingId)}
            >
              <Text style={styles.acceptText}>ACCEPT JOB</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 24,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  alertBadge: {
    backgroundColor: '#065F46',
    color: '#34D399',
    fontWeight: '800',
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timerChip: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timerText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  serviceTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  customerName: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
    marginBottom: 16,
  },
  detailsBox: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    color: '#64748B',
    fontSize: 13,
  },
  detailValue: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '600',
  },
  earningsRow: {
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 10,
    marginTop: 6,
    marginBottom: 0,
  },
  earningsLabel: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },
  earningsValue: {
    color: '#10B981',
    fontSize: 20,
    fontWeight: '900',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  declineButton: {
    flex: 1,
    backgroundColor: '#334155',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  declineText: {
    color: '#94A3B8',
    fontWeight: '700',
    fontSize: 15,
  },
  acceptButton: {
    flex: 2,
    backgroundColor: '#10B981',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  acceptText: {
    color: '#0F172A',
    fontWeight: '900',
    fontSize: 16,
  },
});
