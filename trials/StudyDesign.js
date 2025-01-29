import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';

const DesignItem = ({ icon, label, value }) => {
  return (
    <View style={styles.infoRow}>
      <View style={styles.labelContainer}>
        <View style={styles.iconWrapper}>
          <Icon name={icon} size={16} color="#2563EB" />
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value || 'Not specified'}</Text>
    </View>
  );
};

const StudyDesign = ({ design }) => {
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

  const designItems = [
    { icon: 'shuffle', label: 'Allocation', value: design?.allocation },
    { icon: 'eye', label: 'Masking', value: design?.masking },
    { icon: 'layout', label: 'Model', value: design?.model },
    { icon: 'target', label: 'Endpoint', value: design?.endpoint },
  ];

  if (!design) {
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
          colors={['#2563EB', '#1E40AF']}
          style={styles.headerGradient}
        >
          <Icon name="columns" size={28} color="#FFF" style={styles.headerIcon} />
          <Text style={styles.headerText}>Study Design</Text>
        </LinearGradient>
        <View style={styles.emptyState}>
          <Icon name="alert-circle" size={24} color="#94A3B8" />
          <Text style={styles.emptyText}>No study design data available</Text>
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
        colors={['#2563EB', '#1E40AF']}
        style={styles.headerGradient}
      >
        <Icon name="columns" size={28} color="#FFF" style={styles.headerIcon} />
        <Text style={styles.headerText}>Study Design</Text>
      </LinearGradient>

      <View style={styles.contentContainer}>
        {designItems.map((item, index) => (
          <DesignItem
            key={index}
            icon={item.icon}
            label={item.label}
            value={item.value}
          />
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
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
    letterSpacing: 0.5,
  },
  contentContainer: {
    padding: 20,
    backgroundColor: '#FFF',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  value: {
    fontSize: 15,
    color: '#334155',
    flex: 1,
    textAlign: 'right',
  },
  emptyState: {
    backgroundColor: '#FFF',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 8,
  },
});

export default StudyDesign;