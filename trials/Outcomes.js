import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';

const OutcomeSection = ({ title, content, icon, isLast }) => {
  const [expanded, setExpanded] = useState(false);
  const rotateAnim = new Animated.Value(expanded ? 1 : 0);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  const toggleExpand = () => {
    Animated.spring(rotateAnim, {
      toValue: expanded ? 0 : 1,
      useNativeDriver: true
    }).start();
    setExpanded(!expanded);
  };

  return (
    <View style={[styles.outcomeSection, !isLast && styles.withSeparator]}>
      <Pressable onPress={toggleExpand}>
        <LinearGradient
          colors={['#F8FAFC', '#EFF6FF']}
          style={styles.sectionContent}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.iconContainer}>
              <Icon name={icon} size={20} color="#2563EB" />
            </View>
            <Text style={styles.sectionTitle}>{title}</Text>
            <Animated.View style={{ transform: [{ rotate }] }}>
              <Icon name="chevron-down" size={20} color="#2563EB" />
            </Animated.View>
          </View>
          
          {expanded && (
            <View style={styles.expandedContent}>
              <Text style={styles.outcomeText}>{content}</Text>
            </View>
          )}
        </LinearGradient>
      </Pressable>
    </View>
  );
};

const Outcomes = ({ outcomes }) => {
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

  if (!outcomes || (!outcomes.primary && !outcomes.secondary)) {
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
          <Icon name="target" size={28} color="#FFF" style={styles.headerIcon} />
          <Text style={styles.headerText}>Study Outcomes</Text>
        </LinearGradient>
        <View style={styles.noDataContainer}>
          <Icon name="clipboard" size={24} color="#94A3B8" />
          <Text style={styles.noDataText}>No outcome data available</Text>
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
        <Icon name="target" size={28} color="#FFF" style={styles.headerIcon} />
        <Text style={styles.headerText}>Study Outcomes</Text>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer}>
        {outcomes.primary && (
          <OutcomeSection
            title="Primary Outcomes"
            content={outcomes.primary}
            icon="award"
            isLast={!outcomes.secondary && !outcomes.timeFrames}
          />
        )}
        
        {outcomes.secondary && (
          <OutcomeSection
            title="Secondary Outcomes"
            content={outcomes.secondary}
            icon="layers"
            isLast={!outcomes.timeFrames}
          />
        )}
        
        {outcomes.timeFrames && (
          <OutcomeSection
            title="Time Frames"
            content={outcomes.timeFrames}
            icon="clock"
            isLast={true}
          />
        )}
      </ScrollView>
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
  scrollContainer: {
    padding: 16,
    maxHeight: 400,
    backgroundColor: '#FFF',
  },
  outcomeSection: {
    marginBottom: 16,
  },
  withSeparator: {
    marginBottom: 16,
  },
  sectionContent: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  expandedContent: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: '#FFF',
  },
  outcomeText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#334155',
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

export default Outcomes;