import React from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';

const LocationCard = ({ location, index, totalLocations }) => {
  const [pressed] = React.useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(pressed, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressed, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View
        style={[
          styles.locationCard,
          { transform: [{ scale: pressed }] }
        ]}
      >
        <LinearGradient
          colors={['#ffffff', '#f8f9ff']}
          style={styles.cardGradient}
        >
          <View style={styles.cardHeader}>
            <Icon name="map-pin" size={16} color="#4f46e5" />
            <Text style={styles.facilityName}>
              {location.name || 'Facility Name Not Specified'}
            </Text>
          </View>
          
          <View style={styles.addressContainer}>
            <Text style={styles.addressText}>
              {[location.city, location.state, location.country]
                .filter(Boolean)
                .join(', ')}
            </Text>
          </View>
          
          {index < totalLocations - 1 && <View style={styles.separator} />}
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
};

const Locations = ({ locations }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  if (!locations || locations.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="map-off" size={32} color="#9ca3af" />
        <Text style={styles.noDataText}>No location data available</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <LinearGradient
          colors={['#4f46e5', '#6366f1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <Icon name="map" size={24} color="#ffffff" />
          <Text style={styles.headerText}>Study Locations</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{locations.length}</Text>
          </View>
        </LinearGradient>
      </View>
      
      <View style={styles.locationsGrid}>
        {locations.map((location, index) => (
          <LocationCard
            key={index}
            location={location}
            index={index}
            totalLocations={locations.length}
          />
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  header: {
    overflow: 'hidden',
  },
  headerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingVertical: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 12,
    color: '#ffffff',
    flex: 1,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#ffffff',
    borderRadius: 16,
  },
  noDataText: {
    color: '#9ca3af',
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  locationsGrid: {
    padding: 16,
  },
  locationCard: {
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardGradient: {
    borderRadius: 12,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  facilityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
  },
  addressContainer: {
    paddingLeft: 24,
  },
  addressText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginTop: 16,
    marginVertical: 12,
  },
});

export default Locations;