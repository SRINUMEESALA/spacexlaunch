import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

interface MapViewProps {
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  userLocation?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  distance?: {
    distance: number;
    unit: string;
  };
  onDirectionsPress: () => void;
  onLocationPress: () => void;
  locationLoading?: boolean;
}

const LaunchMapView: React.FC<MapViewProps> = ({
  latitude,
  longitude,
  title,
  description,
  userLocation,
  distance,
  onDirectionsPress,
  onLocationPress,
  locationLoading = false,
}) => {
  const region = {
    latitude,
    longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        showsUserLocation={!!userLocation}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
      >
        <Marker
          coordinate={{ latitude, longitude }}
          title={title}
          description={description}
          pinColor="#FF3B30"
        />

        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="Your Location"
            description="Current location"
            pinColor="#007AFF"
          />
        )}
      </MapView>

      <View style={styles.infoPanel}>
        <View style={styles.locationInfo}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <Text style={styles.coordinates}>
            {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </Text>
          {distance && (
            <Text style={styles.distance}>
              {distance.distance} {distance.unit} away
            </Text>
          )}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onDirectionsPress}
          >
            <Ionicons name="navigate" size={20} color="#007AFF" />
            <Text style={styles.actionText}>Directions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={onLocationPress}
            disabled={locationLoading}
          >
            {locationLoading ? (
              <ActivityIndicator size="small" color="#007AFF" />
            ) : (
              <Ionicons name="location" size={20} color="#007AFF" />
            )}
            <Text style={styles.actionText}>
              {locationLoading ? 'Loading...' : 'My Location'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  map: {
    flex: 1,
  },
  infoPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  locationInfo: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  coordinates: {
    fontSize: 12,
    color: '#8E8E93',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  distance: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    minWidth: 100,
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
    marginLeft: 6,
  },
});

export default LaunchMapView;
