import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';

const ResultSection = ({ label, content, icon, isLast }) => {
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
    <View style={[styles.section, !isLast && styles.sectionMargin]}>
      <Pressable onPress={toggleExpand}>
        <LinearGradient
          colors={['#F8FAFC', '#EFF6FF']}
          style={styles.sectionGradient}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.iconContainer}>
              <Icon name={icon} size={20} color="#2563EB" />
            </View>
            <Text style={styles.sectionLabel}>{label}</Text>
            <Animated.View style={{ transform: [{ rotate }] }}>
              <Icon name="chevron-down" size={20} color="#2563EB" />
            </Animated.View>
          </View>
          
          {expanded && (
            <View style={styles.expandedContent}>
              <Text style={styles.sectionContent}>{content}</Text>
            </View>
          )}
        </LinearGradient>
      </Pressable>
    </View>
  );
};

const Results = ({ results }) => {
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

  if (!results || Object.keys(results).length === 0) {
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
          <Icon name="clipboard" size={28} color="#FFF" style={styles.headerIcon} />
          <Text style={styles.headerText}>Study Results</Text>
        </LinearGradient>
        <View style={styles.emptyState}>
          <Icon name="alert-circle" size={24} color="#94A3B8" />
          <Text style={styles.emptyText}>No results available at this time.</Text>
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
        <Icon name="clipboard" size={28} color="#FFF" style={styles.headerIcon} />
        <Text style={styles.headerText}>Study Results</Text>
      </LinearGradient>

      <View style={styles.contentContainer}>
        {results.adverseEvents && (
          <ResultSection
            label="Adverse Events"
            content={results.adverseEvents}
            icon="alert-octagon"
            isLast={!results.studyResults && !results.publications}
          />
        )}
        
        {results.studyResults && (
          <ResultSection
            label="Study Results"
            content={results.studyResults}
            icon="file-text"
            isLast={!results.publications}
          />
        )}
        
        {results.publications && (
          <ResultSection
            label="Publications"
            content={results.publications}
            icon="book-open"
            isLast={true}
          />
        )}
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
    padding: 16,
    backgroundColor: '#FFF',
  },
  section: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionMargin: {
    marginBottom: 16,
  },
  sectionGradient: {
    borderRadius: 12,
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
  sectionLabel: {
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
  sectionContent: {
    fontSize: 15,
    lineHeight: 24,
    color: '#334155',
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

export default Results;