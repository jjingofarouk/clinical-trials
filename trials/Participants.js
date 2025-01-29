import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';

const AnimatedCounter = ({ endValue, duration = 2000, textColor = '#FFF' }) => {
  const [count, setCount] = useState(0);
  const startTimeRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    startTimeRef.current = Date.now();
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTimeRef.current) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(easeOutQuart * endValue);
      
      setCount(currentValue);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [endValue, duration]);

  return (
    <Text style={[styles.statValue, { color: textColor }]}>
      {count}
    </Text>
  );
};

const ParticipantCard = ({ icon, value, label, gradient, delay = 0 }) => {
  const [translateY] = useState(new Animated.Value(20));
  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const numericValue = parseInt(value);
  const isNumeric = !isNaN(numericValue);

  return (
    <Animated.View
      style={[
        styles.statItem,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <LinearGradient
        colors={gradient}
        style={styles.statContent}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.iconContainer}>
          <Icon name={icon} size={24} color="#FFF" />
        </View>
        {isNumeric ? (
          <AnimatedCounter endValue={numericValue} textColor="#FFF" />
        ) : (
          <Text style={[styles.statValue, { color: '#FFF' }]}>{value || 'N/A'}</Text>
        )}
        <Text style={styles.statLabel}>{label}</Text>
      </LinearGradient>
    </Animated.View>
  );
};

const Participants = ({ participants }) => {
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

  if (!participants) {
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
          style={styles.header}
        >
          <Icon name="users" size={28} color="#FFF" style={styles.icon} />
          <Text style={styles.headerText}>Participant Information</Text>
        </LinearGradient>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No participant data available</Text>
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
        style={styles.header}
      >
        <Icon name="users" size={28} color="#FFF" style={styles.icon} />
        <Text style={styles.headerText}>Participant Information</Text>
      </LinearGradient>
      
      <View style={styles.statsGrid}>
        <ParticipantCard
          icon="calendar"
          value={participants.ageRange}
          label="Age Range"
          gradient={['#FF6B6B', '#EE5253']}
          delay={0}
        />
        <ParticipantCard
          icon="user"
          value={participants.sex}
          label="Sex"
          gradient={['#4ECDC4', '#45B7AF']}
          delay={100}
        />
        <ParticipantCard
          icon="users"
          value={participants.enrollment}
          label="Enrollment"
          gradient={['#6C5CE7', '#5B4BC7']}
          delay={200}
        />
      </View>

      {participants.eligibility && (
        <View style={styles.eligibilityContainer}>
          <Text style={styles.eligibilityTitle}>Eligibility Criteria</Text>
          <Text style={styles.eligibilityText}>{participants.eligibility}</Text>
        </View>
      )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  icon: {
    marginRight: 12,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFF',
  },
  statItem: {
    width: '31%',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statContent: {
    padding: 16,
    alignItems: 'center',
    height: 140,
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    marginVertical: 4,
    includeFontPadding: false,
  },
  statLabel: {
    fontSize: 13,
    color: '#FFF',
    fontWeight: '600',
    textAlign: 'center',
    opacity: 0.9,
  },
  eligibilityContainer: {
    padding: 20,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  eligibilityTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 12,
  },
  eligibilityText: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 22,
  },
  emptyContainer: {
    padding: 40,
    backgroundColor: '#FFF',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#A0AEC0',
    fontStyle: 'italic',
  },
});

export default Participants;