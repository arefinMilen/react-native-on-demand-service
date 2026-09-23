import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Header } from '../components/Header';
import { CategoryCard } from '../components/CategoryCard';
import { apiClient } from '../services/api';

export const HomeScreen = ({ navigation }: any) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('/categories');
      setCategories(response.data.data);
    } catch (err: any) {
      console.error('Error fetching categories:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Header locationText="Gulshan-2, Dhaka" />

      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Search 'Plumber', 'AC Servicing', 'Doctor'..."
          placeholderTextColor="#64748B"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.bannerContainer}>
        <View style={styles.banner}>
          <Text style={styles.bannerBadge}>PROMO 20% OFF</Text>
          <Text style={styles.bannerTitle}>Fastest Handyman at your door</Text>
          <Text style={styles.bannerSubtitle}>Verified pros within 5 km radius</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Available Services</Text>
        <TouchableOpacity onPress={fetchCategories}>
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loaderCenter}>
          <ActivityIndicator size="large" color="#38BDF8" />
        </View>
      ) : (
        <FlatList
          data={filteredCategories}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listPadding}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchCategories();
              }}
              tintColor="#38BDF8"
            />
          }
          renderItem={({ item }) => (
            <CategoryCard
              id={item.id}
              name={item.name}
              description={item.description}
              basePrice={item.basePrice}
              iconUrl={item.iconUrl}
              onPress={() => navigation.navigate('Booking', { category: item })}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#334155',
  },
  bannerContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  banner: {
    backgroundColor: 'linear-gradient(135deg, #0284C7 0%, #0F172A 100%)',
    backgroundColor: '#0284C7',
    borderRadius: 16,
    padding: 16,
  },
  bannerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#38BDF8',
    color: '#0F172A',
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#E0F2FE',
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  refreshText: {
    fontSize: 13,
    color: '#38BDF8',
  },
  listPadding: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  loaderCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
