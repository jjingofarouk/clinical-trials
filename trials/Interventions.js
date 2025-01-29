import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';

const InterventionCard = ({ intervention, isLast }) => {
  const [expanded, setExpanded] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [translateY] = useState(new Animated.Value(20));
  const rotateAnim = new Animated.Value(expanded ? 1 : 0);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const toggleExpand = () => {
    Animated.spring(rotateAnim, {
      toValue: expanded ? 0 : 1,
      useNativeDriver: true
    }).start();
    setExpanded(!expanded);
  };

  const getInterventionIcon = (type) => {
    const iconMap = {
      'DRUG': 'pill',
      'DEVICE': 'box',
      'PROCEDURE': 'activity',
      'BEHAVIORAL': 'users',
      'OTHER': 'package'
    };
    return iconMap[type?.toUpperCase()] || 'package';
  };

  const getGradientColors = (status) => {
    const gradientMap = {
      'ACTIVE': ['#059669', '#047857'],
      'PENDING': ['#D97706', '#B45309'],
      'COMPLETED': ['#2563EB', '#1D4ED8'],
      'SUSPENDED': ['#DC2626', '#B91C1C']
    };
    return gradientMap[status?.toUpperCase()] || ['#6B7280', '#4B5563'];
  };

  return (
    <Animated.View
      style={[
        styles.card,
        !isLast && styles.cardMargin,
        {
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
      ]}
    >
      <Pressable onPress={toggleExpand}>
        <LinearGradient
          colors={getGradientColors(intervention.status)}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardContent}
        >
          {/* Header Section */}
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Icon name={getInterventionIcon(intervention.type)} size={24} color="#FFF" />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.interventionName}>{intervention.name || 'Unnamed Intervention'}</Text>
              <View style={styles.typeContainer}>
                <Text style={styles.typeText}>{intervention.type || 'Type not specified'}</Text>
                {intervention.status && (
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>
                      {intervention.status}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <Animated.View style={{ transform: [{ rotate }] }}>
              <Icon name="chevron-down" size={20} color="#FFF" />
            </Animated.View>
          </View>

          {/* Expanded Content */}
          {expanded && (
            <View style={styles.expandedContent}>
              {/* Dosage Information */}
              {intervention.dosage && (
                <View style={styles.infoRow}>
                  <Icon name="droplet" size={16} color="#FFF" />
                  <Text style={styles.infoLabel}>Dosage:</Text>
                  <Text style={styles.infoValue}>{intervention.dosage}</Text>
                </View>
              )}

              {/* Administration Route */}
              {intervention.route && (
                <View style={styles.infoRow}>
                  <Icon name="arrow-right" size={16} color="#FFF" />
                  <Text style={styles.infoLabel}>Route:</Text>
                  <Text style={styles.infoValue}>{intervention.route}</Text>
                </View>
              )}

              {/* Frequency */}
              {intervention.frequency && (
                <View style={styles.infoRow}>
                  <Icon name="clock" size={16} color="#FFF" />
                  <Text style={styles.infoLabel}>Frequency:</Text>
                  <Text style={styles.infoValue}>{intervention.frequency}</Text>
                </View>
              )}

              {/* Duration */}
              {intervention.duration && (
                <View style={styles.infoRow}>
                  <Icon name="calendar" size={16} color="#FFF" />
                  <Text style={styles.infoLabel}>Duration:</Text>
                  <Text style={styles.infoValue}>{intervention.duration}</Text>
                </View>
              )}

              {/* Description */}
              {intervention.description && (
                <View style={styles.descriptionContainer}>
                  <Text style={styles.descriptionText}>{intervention.description}</Text>
                </View>
              )}
            </View>
          )}
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

const Interventions = ({ interventions }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.95));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (!interventions || interventions.length === 0) {
    return (
      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={['#4A90E2', '#357ABD']}
          style={styles.headerGradient}
        >
          <Icon name="layers" size={28} color="#FFF" style={styles.headerIcon} />
          <Text style={styles.headerText}>Trial Interventions</Text>
        </LinearGradient>
        <View style={styles.noDataContainer}>
          <Icon name="alert-circle" size={24} color="#94A3B8" />
          <Text style={styles.noDataText}>No intervention data available</Text>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={['#4A90E2', '#357ABD']}
        style={styles.headerGradient}
      >
        <Icon name="layers" size={28} color="#FFF" style={styles.headerIcon} />
        <Text style={styles.headerText}>Trial Interventions</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{interventions.length}</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer}>
        {interventions.map((intervention, index) => (
          <InterventionCard
            key={index}
            intervention={intervention}
            isLast={index === interventions.length - 1}
          />
        ))}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7FAFC',
    borderRadius: 16,
    marginVertical: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  headerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerIcon: {
    marginRight: 12,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
    flex: 1,
    letterSpacing: 0.5,
  },
  countBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  countText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContainer: {
    padding: 16,
    maxHeight: 400,
    backgroundColor: '#FFF',
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardMargin: {
    marginBottom: 16,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  interventionName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginRight: 8,
  },
  statusBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFF',
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginLeft: 8,
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    color: '#FFF',
    flex: 1,
  },
  descriptionContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#FFF',
    lineHeight: 20,
  },
  noDataContainer: {
    backgroundColor: '#FFF',
    alignItems: 'center',
    padding: 32,
  },
  noDataText: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 8,
  },
});

export default Interventions;