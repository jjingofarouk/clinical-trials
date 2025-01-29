import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';

const RegulatoryItem = ({ label, value, icon, isStatus = false }) => {
  return (
    <View style={styles.infoRow}>
      <View style={styles.labelContainer}>
        <Icon name={icon} size={16} color="#2563EB" style={styles.itemIcon} />
        <Text style={styles.label}>{label}</Text>
      </View>
      {isStatus ? (
        <View style={[
          styles.statusBadge,
          value === 'Yes' ? styles.statusApproved : styles.statusNotApproved
        ]}>
          <Icon 
            name={value === 'Yes' ? 'check-circle' : 'x-circle'} 
            size={14} 
            color="#FFF" 
            style={styles.statusIcon} 
          />
          <Text style={styles.statusText}>{value}</Text>
        </View>
      ) : (
        <Text style={styles.value}>{value || 'Not specified'}</Text>
      )}
    </View>
  );
};

const RegulatoryInfo = ({ regulatory }) => {
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

  if (!regulatory) {
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
          colors={['#1E40AF', '#1E3A8A']}
          style={styles.headerGradient}
        >
          <Icon name="shield" size={28} color="#FFF" style={styles.headerIcon} />
          <Text style={styles.headerText}>Regulatory Information</Text>
        </LinearGradient>
        <View style={styles.emptyState}>
          <Icon name="alert-circle" size={24} color="#94A3B8" />
          <Text style={styles.emptyText}>No regulatory data available</Text>
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
        colors={['#1E40AF', '#1E3A8A']}
        style={styles.headerGradient}
      >
        <Icon name="shield" size={28} color="#FFF" style={styles.headerIcon} />
        <Text style={styles.headerText}>Regulatory Information</Text>
      </LinearGradient>

      <View style={styles.contentContainer}>
        <RegulatoryItem
          label="NCT ID"
          value={regulatory.nctId}
          icon="hash"
        />
        <RegulatoryItem
          label="FDA Regulated"
          value={regulatory.fdaRegulated ? 'Yes' : 'No'}
          icon="check-square"
          isStatus={true}
        />
        <RegulatoryItem
          label="Sponsor"
          value={regulatory.sponsor}
          icon="briefcase"
        />
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
  },
  itemIcon: {
    marginRight: 8,
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
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusApproved: {
    backgroundColor: '#059669',
  },
  statusNotApproved: {
    backgroundColor: '#DC2626',
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
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

export default RegulatoryInfo;