import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
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
import { getLaunchesPaginated } from '../services/spacexApi';
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  const fetchLaunches = useCallback(
    async (page: number = 1, isRefresh: boolean = false) => {
      try {
        if (page === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        const response = await getLaunchesPaginated(page, 10);

        if (response.success) {
          const {
            docs,
            hasNextPage: hasNext,
            totalPages: total,
          } = response.data;

          if (isRefresh || page === 1) {
            setLaunches(docs);
          } else {
            setLaunches((prev) => [...prev, ...docs]);
          }

          setHasNextPage(hasNext);
          setTotalPages(total);
          setCurrentPage(page);
        } else {
          Alert.alert('Error', response.error);
        }
      } catch {
        Alert.alert('Error', 'Failed to fetch launches');
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    []
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setCurrentPage(1);
    setHasNextPage(true);
    fetchLaunches(1, true);
  }, [fetchLaunches]);

  const loadMoreLaunches = useCallback(() => {
    if (
      !loadingMore &&
      hasNextPage &&
      currentPage < totalPages &&
      !searchQuery.trim()
    ) {
      const nextPage = currentPage + 1;
      fetchLaunches(nextPage, false);
    }
  }, [
    loadingMore,
    hasNextPage,
    currentPage,
    totalPages,
    fetchLaunches,
    searchQuery,
  ]);

  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const filteredLaunches = useMemo(() => {
    if (!searchQuery.trim()) {
      setSearching(false);
      return launches;
    }

    setSearching(true);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    const filtered = launches.filter((launch) =>
      launch.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );

    searchTimeoutRef.current = setTimeout(() => {
      setSearching(false);
    }, 400);

    return filtered;
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
    if (loading || searching) return null;

    if (filteredLaunches.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>
            {searchQuery.trim() ? 'No matches found' : 'No missions found'}
          </Text>
          <Text style={styles.emptyStateText}>
            {searchQuery.trim()
              ? `No launches matching "${searchQuery}" in loaded ${launches.length} records`
              : 'Try adjusting your search terms'}
          </Text>
        </View>
      );
    }

    return null;
  }, [
    loading,
    searching,
    filteredLaunches.length,
    searchQuery,
    launches.length,
  ]);

  const renderFooter = useCallback(() => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={styles.footerText}>Loading more launches...</Text>
      </View>
    );
  }, [loadingMore]);

  const renderSearchLoader = useCallback(() => {
    if (!searching) return null;

    return (
      <View style={styles.searchLoader}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={styles.searchLoaderText}>
          Searching in {launches.length} loaded records...
        </Text>
      </View>
    );
  }, [searching, launches.length]);

  useEffect(() => {
    fetchLaunches();
  }, [fetchLaunches]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

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

      {renderSearchLoader()}

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
        ListFooterComponent={renderFooter}
        onEndReached={loadMoreLaunches}
        onEndReachedThreshold={0.3}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
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
  footerLoader: {
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    marginTop: 8,
    fontSize: 14,
    color: '#8E8E93',
  },
  searchLoader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F7',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  searchLoaderText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#8E8E93',
  },
});

export default LaunchListScreen;
