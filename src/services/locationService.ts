import * as Location from 'expo-location';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';
import {
  APPLE_MAPS_BASE_URL,
  GOOGLE_MAPS_BASE_URL,
} from '../config/GlobalUrls';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface DistanceData {
  distance: number;
  unit: 'km' | 'miles';
}

let locationPermission: Location.PermissionStatus | null = null;

export async function requestLocationPermission(): Promise<boolean> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    locationPermission = status;
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
}

export async function getCurrentLocation(): Promise<LocationData | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    locationPermission = status;

    if (status !== 'granted') {
      throw new Error('Location permission not granted');
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy ?? undefined,
    };
  } catch (error) {
    console.error('Error getting current location:', error);
    throw error;
  }
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): DistanceData {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;

  return {
    distance: Math.round(distanceKm * 100) / 100,
    unit: 'km',
  };
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export async function openMapsDirections(
  destinationLat: number,
  destinationLon: number,
  destinationName: string
): Promise<void> {
  try {
    const label = encodeURIComponent(destinationName);

    if (Platform.OS === 'ios') {
      const appleMapsUrl = `${APPLE_MAPS_BASE_URL}/?daddr=${destinationLat},${destinationLon}&dirflg=d&t=m&q=${label}`;
      const appleSupported = await Linking.canOpenURL(appleMapsUrl);

      if (appleSupported) {
        await Linking.openURL(appleMapsUrl);
        return;
      }
    }

    let googleMapsUrl;

    if (Platform.OS === 'android') {
      googleMapsUrl = `google.navigation:q=${destinationLat},${destinationLon}`;
      const androidSupported = await Linking.canOpenURL(googleMapsUrl);

      if (androidSupported) {
        await Linking.openURL(googleMapsUrl);
        return;
      }
    }

    googleMapsUrl = `${GOOGLE_MAPS_BASE_URL}/dir/?api=1&destination=${destinationLat},${destinationLon}&travelmode=driving`;
    const webSupported = await Linking.canOpenURL(googleMapsUrl);

    if (webSupported) {
      await Linking.openURL(googleMapsUrl);
    } else {
      throw new Error('No maps app available');
    }
  } catch (error) {
    console.error('Error opening maps:', error);
    throw new Error('Failed to open maps application');
  }
}

export function getPermissionStatus(): Location.PermissionStatus | null {
  return locationPermission;
}
