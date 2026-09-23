import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface CategoryCardProps {
  id: string;
  name: string;
  description?: string;
  basePrice: number;
  iconUrl?: string;
  onPress: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  description,
  basePrice,
  iconUrl,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.iconContainer}>
        {iconUrl ? (
          <Image source={{ uri: iconUrl }} style={styles.icon} resizeMode="contain" />
        ) : (
          <Text style={styles.placeholderIcon}>🛠️</Text>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        {description ? <Text style={styles.description} numberOfLines={2}>{description}</Text> : null}
        <View style={styles.priceTag}>
          <Text style={styles.priceLabel}>Starts from</Text>
          <Text style={styles.priceValue}>৳{basePrice.toFixed(0)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  icon: {
    width: 36,
    height: 36,
  },
  placeholderIcon: {
    fontSize: 28,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 6,
  },
  priceTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 11,
    color: '#64748B',
    marginRight: 6,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#38BDF8',
  },
});
