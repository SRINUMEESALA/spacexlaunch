import React, { memo } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { Launch } from '../types/spacex';
import { formatDate, getLaunchStatus, truncateText } from '../utils/formatters';

interface LaunchCardProps {
  launch: Launch;
  onPress: (launch: Launch) => void;
}

const LaunchCard: React.FC<LaunchCardProps> = ({ launch, onPress }) => {
  const status = getLaunchStatus(launch);
  const missionImage = launch.links.patch.large || launch.links.patch.small;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(launch)}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={['#ffffff', '#f8f9fa']}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <View style={styles.missionInfo}>
            <Text style={styles.missionName} numberOfLines={2}>
              {launch.name}
            </Text>
            <Text style={styles.flightNumber}>
              Flight #{launch.flight_number}
            </Text>
          </View>
          <View style={styles.statusContainer}>
            <View
              style={[styles.statusBadge, { backgroundColor: status.color }]}
            >
              <Text style={styles.statusText}>{status.status}</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {missionImage ? (
            <Image source={{ uri: missionImage }} style={styles.missionImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="rocket-outline" size={40} color="#8E8E93" />
            </View>
          )}

          <View style={styles.details}>
            <View style={styles.dateContainer}>
              <Ionicons name="calendar-outline" size={16} color="#8E8E93" />
              <Text style={styles.dateText}>{formatDate(launch.date_utc)}</Text>
            </View>

            {launch.details && (
              <Text style={styles.description} numberOfLines={3}>
                {truncateText(launch.details, 120)}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Ionicons name="location-outline" size={14} color="#8E8E93" />
              <Text style={styles.statText}>Launchpad {launch.launchpad}</Text>
            </View>
            {launch.cores.length > 0 && (
              <View style={styles.stat}>
                <Ionicons
                  name="hardware-chip-outline"
                  size={14}
                  color="#8E8E93"
                />
                <Text style={styles.statText}>
                  {launch.cores.length} core(s)
                </Text>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  missionInfo: {
    flex: 1,
    marginRight: 12,
  },
  missionName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  flightNumber: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  missionImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    color: '#3C3C43',
    lineHeight: 20,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingTop: 12,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 4,
  },
});

export default memo(LaunchCard);
