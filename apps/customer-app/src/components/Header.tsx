import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface HeaderProps {
  locationText?: string;
  onProfilePress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  locationText = 'Gulshan-2, Dhaka',
  onProfilePress,
}) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.subTitle}>CURRENT LOCATION</Text>
        <Text style={styles.title} numberOfLines={1}>
          📍 {locationText}
        </Text>
      </View>
      <TouchableOpacity style={styles.avatarButton} onPress={onProfilePress}>
        <Text style={styles.avatarText}>👤</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0F172A',
  },
  subTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#38BDF8',
    letterSpacing: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8FAFC',
    marginTop: 2,
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  avatarText: {
    fontSize: 18,
  },
});
