import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { Launch, Launchpad } from '../types/spacex';
import { getLaunchById, getLaunchpad } from '../services/spacexApi';
import {
  getCurrentLocation,
  calculateDistance,
  openMapsDirections,
  requestLocationPermission,
} from '../services/locationService';
import { formatDate, getLaunchStatus } from '../utils';
import MapView from '../components/MapView';

interface RouteParams {
  launchId: string;
  launchName: string;
}

const LaunchDetailScreen: React.FC = () => {
  const route = useRoute();
  const { launchId } = route.params as RouteParams;

  const [launch, setLaunch] = useState<Launch | null>(null);
  const [launchpad, setLaunchpad] = useState<Launchpad | null>(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy?: number;
  } | null>(null);
  const [distance, setDistance] = useState<{
    distance: number;
    unit: string;
  } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const fetchLaunchData = useCallback(async () => {
    try {
      setLoading(true);

      const launchResponse = await getLaunchById(launchId);
      if (!launchResponse.success) {
        Alert.alert('Error', launchResponse.error);
        return;
      }

      setLaunch(launchResponse.data);

      const launchpadResponse = await getLaunchpad(
        launchResponse.data.launchpad
      );
      if (!launchpadResponse.success) {
        Alert.alert('Error', launchpadResponse.error);
        return;
      }

      setLaunchpad(launchpadResponse.data);
    } catch {
      Alert.alert('Error', 'Failed to fetch launch data');
    } finally {
      setLoading(false);
    }
  }, [launchId]);

  const getCurrentLocationHandler = useCallback(async () => {
    setLocationLoading(true);
    try {
      const location = await getCurrentLocation();
      if (location && launchpad) {
        setUserLocation(location);
        const distanceData = calculateDistance(
          location.latitude,
          location.longitude,
          launchpad.latitude,
          launchpad.longitude
        );
        setDistance(distanceData);
        Alert.alert('Success', 'Location updated successfully!');
      } else if (!location) {
        Alert.alert(
          'Error',
          'Unable to get your current location. Please try again.'
        );
      }
    } catch (error) {
      console.log('Location error:', error);
      Alert.alert(
        'Location Permission Required',
        'This app needs location access to show your distance to the launchpad. Please enable location permissions in your device settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Try Again',
            onPress: () => getCurrentLocationHandler(),
          },
        ]
      );
    } finally {
      setLocationLoading(false);
    }
  }, [launchpad]);

  const openDirections = useCallback(async () => {
    if (!launchpad) return;

    try {
      await openMapsDirections(
        launchpad.latitude,
        launchpad.longitude,
        launchpad.full_name
      );
    } catch {
      Alert.alert('Error', 'Failed to open maps application');
    }
  }, [launchpad]);

  useEffect(() => {
    fetchLaunchData();
  }, [fetchLaunchData]);

  useEffect(() => {
    if (launchpad) {
      getCurrentLocationHandler();
    }
  }, [launchpad, getCurrentLocationHandler]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading launch details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!launch || !launchpad) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorText}>Launch data not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const status = getLaunchStatus(launch);
  const missionImage = launch.links.patch.large || launch.links.patch.small;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          {missionImage && (
            <Image source={{ uri: missionImage }} style={styles.missionImage} />
          )}
          <View style={styles.headerInfo}>
            <Text style={styles.missionName}>{launch.name}</Text>
            <Text style={styles.flightNumber}>
              Flight #{launch.flight_number}
            </Text>
            <View
              style={[styles.statusBadge, { backgroundColor: status.color }]}
            >
              <Text style={styles.statusText}>{status.status}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Launch Details</Text>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={20} color="#8E8E93" />
            <Text style={styles.detailText}>{formatDate(launch.date_utc)}</Text>
          </View>
          {launch.details && (
            <Text style={styles.description}>{launch.details}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Launchpad</Text>
          <View style={styles.launchpadInfo}>
            <Text style={styles.launchpadName}>{launchpad.full_name}</Text>
            <Text style={styles.launchpadLocation}>
              {launchpad.locality}, {launchpad.region}
            </Text>
            <View style={styles.launchpadStats}>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Attempts</Text>
                <Text style={styles.statValue}>
                  {launchpad.launch_attempts}
                </Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Successes</Text>
                <Text style={styles.statValue}>
                  {launchpad.launch_successes}
                </Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Status</Text>
                <Text style={styles.statValue}>{launchpad.status}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.mapHeader}>
            <Text style={styles.sectionTitle}>Location</Text>
          </View>

          <MapView
            latitude={launchpad.latitude}
            longitude={launchpad.longitude}
            title={launchpad.full_name}
            description={launchpad.locality}
            userLocation={userLocation || undefined}
            distance={distance || undefined}
            onDirectionsPress={openDirections}
            onLocationPress={getCurrentLocationHandler}
            locationLoading={locationLoading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  missionImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  missionName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  flightNumber: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 16,
    color: '#3C3C43',
    marginLeft: 8,
  },
  description: {
    fontSize: 16,
    color: '#3C3C43',
    lineHeight: 24,
    marginTop: 8,
  },
  launchpadInfo: {
    marginTop: 8,
  },
  launchpadName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  launchpadLocation: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
  },
  launchpadStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
});

export default LaunchDetailScreen;
