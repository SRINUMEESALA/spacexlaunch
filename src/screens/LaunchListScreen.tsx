import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Text,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { Launch } from '../types/spacex';
import { getLaunches } from '../services/spacexApi';
import LaunchCard from '../components/LaunchCard';
import SearchBar from '../components/SearchBar';
import { RootStackParamList } from '../navigation/types';
import { NAVIGATION_ROUTES } from '../constants/navigation';
import type { StackNavigationProp } from '@react-navigation/stack';

type Nav = StackNavigationProp<
  RootStackParamList,
  typeof NAVIGATION_ROUTES.LAUNCH_LIST
>;

const LaunchListScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLaunches = useCallback(async () => {
    try {
      const response = await getLaunches();

      if (response.success) {
        setLaunches(response.data);
      } else {
        Alert.alert('Error', response.error);
      }
    } catch {
      Alert.alert('Error', 'Failed to fetch launches');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLaunches();
  }, [fetchLaunches]);

  const filteredLaunches = useMemo(() => {
    if (!searchQuery.trim()) {
      return launches;
    }
    return launches.filter((launch) =>
      launch.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
  }, [launches, searchQuery]);

  const handleLaunchPress = useCallback(
    (launch: Launch) => {
      navigation.navigate(NAVIGATION_ROUTES.LAUNCH_DETAIL, {
        launchId: launch.id,
        launchName: launch.name,
      });
    },
    [navigation]
  );

  const renderLaunchCard = useCallback(
    ({ item }: { item: Launch }) => (
      <LaunchCard launch={item} onPress={handleLaunchPress} />
    ),
    [handleLaunchPress]
  );

  const renderEmptyState = useCallback(() => {
    if (loading) return null;

    if (filteredLaunches.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No missions found</Text>
          <Text style={styles.emptyStateText}>
            Try adjusting your search terms
          </Text>
        </View>
      );
    }

    return null;
  }, [loading, filteredLaunches.length]);

  useEffect(() => {
    fetchLaunches();
  }, [fetchLaunches]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading launches...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search missions..."
      />

      <FlatList
        data={filteredLaunches}
        renderItem={renderLaunchCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#007AFF"
          />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
        getItemLayout={(data, index) => ({
          length: 120,
          offset: 120 * index,
          index,
        })}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  listContainer: {
    paddingVertical: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8E8E93',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default LaunchListScreen;
