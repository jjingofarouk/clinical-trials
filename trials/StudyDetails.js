import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    const configs = {
      'Recruiting': {
        colors: ['#059669', '#047857'],
        icon: 'user-plus'
      },
      'Not Yet Recruiting': {
        colors: ['#F59E0B', '#D97706'],
        icon: 'clock'
      },
      'Active, not recruiting': {
        colors: ['#3B82F6', '#2563EB'],
        icon: 'check-circle'
      },
      'Completed': {
        colors: ['#6B7280', '#4B5563'],
        icon: 'check-square'
      },
      'Terminated': {
        colors: ['#EF4444', '#DC2626'],
        icon: 'x-circle'
      },
      'Withdrawn': {
        colors: ['#7C3AED', '#6D28D9'],
        icon: 'minus-circle'
      },
      'Unknown': {
        colors: ['#6B7280', '#4B5563'],
        icon: 'help-circle'
      }
    };
    return configs[status] || configs['Unknown'];
  };

  const config = getStatusConfig(status);

  return (
    <LinearGradient
      colors={config.colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.statusBadge}
    >
      <Icon name={config.icon} size={16} color="#FFF" style={styles.statusIcon} />
      <Text style={styles.statusText}>{status}</Text>
    </LinearGradient>
  );
};

const InfoCard = ({ icon, label, value }) => (
  <View style={styles.infoCard}>
    <View style={styles.iconContainer}>
      <Icon name={icon} size={20} color="#2563EB" />
    </View>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value || 'Not specified'}</Text>
  </View>
);

const DateInfo = ({ icon, label, date }) => (
  <View style={styles.dateContainer}>
    <View style={styles.dateIconContainer}>
      <Icon name={icon} size={16} color="#2563EB" />
    </View>
    <Text style={styles.dateLabel}>{label}</Text>
    <Text style={styles.dateValue}>{date || 'Not specified'}</Text>
  </View>
);

const AccordionSection = ({ title, icon, children, initiallyExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);
  const [animation] = useState(new Animated.Value(initiallyExpanded ? 1 : 0));

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    Animated.timing(animation, {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const bodyHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1000],
  });

  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity 
        style={styles.accordionHeader} 
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <View style={styles.accordionTitleContainer}>
          <View style={styles.iconWrapper}>
            <Icon name={icon} size={20} color="#2563EB" />
          </View>
          <Text style={styles.accordionTitle}>{title}</Text>
        </View>
        <Icon 
          name={isExpanded ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color="#64748B" 
        />
      </TouchableOpacity>
      <Animated.View style={[styles.accordionBody, { maxHeight: bodyHeight }]}>
        {children}
      </Animated.View>
    </View>
  );
};

const StudyDetails = ({ study }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (!study) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Icon name="alert-circle" size={40} color="#94A3B8" />
          <Text style={styles.emptyText}>No study details available</Text>
        </View>
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={['#1E40AF', '#1E3A8A']}
        style={styles.header}
      >
        <Text style={styles.title}>{study.title}</Text>
        <StatusBadge status={study.status} />
      </LinearGradient>

      <View style={styles.content}>
        <AccordionSection title="Overview" icon="info" initiallyExpanded={true}>
          <View style={styles.infoGrid}>
            <InfoCard icon="activity" label="Study Type" value={study.type} />
            <InfoCard icon="layers" label="Phase" value={study.phase} />
          </View>
        </AccordionSection>

        <AccordionSection title="Description" icon="file-text">
          {study.description ? (
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionText}>{study.description}</Text>
            </View>
          ) : (
            <View style={styles.emptyStateSmall}>
              <Text style={styles.emptyText}>No description available</Text>
            </View>
          )}
        </AccordionSection>

        <AccordionSection title="Timeline" icon="calendar">
          <View style={styles.timelineContainer}>
            <DateInfo
              icon="calendar"
              label="Start Date"
              date={study.startDate}
            />
            <DateInfo
              icon="calendar"
              label="Primary Completion"
              date={study.primaryCompletionDate}
            />
            <DateInfo
              icon="calendar"
              label="Study Completion"
              date={study.completionDate}
            />
            <DateInfo
              icon="calendar"
              label="First Posted"
              date={study.firstPostedDate}
            />
            <DateInfo
              icon="calendar"
              label="Last Updated"
              date={study.lastUpdateDate}
            />
          </View>
        </AccordionSection>


      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center', // Center the container horizontally
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginVertical: 16,
    marginHorizontal: 'auto',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  header: {
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
    lineHeight: 32,
  },
  content: {
    padding: 16,
  },
  accordionContainer: {
    maxWidth: 1200,
    width: '100%', // Make it responsive
    alignSelf: 'center',
    marginBottom: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  accordionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 12,
  },
  accordionBody: {
    overflow: 'hidden',
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoGrid: {
    padding: 16,
    flexDirection: 'row',
    gap: 16,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#002432',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#002432',
    textAlign: 'center',
  },

  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#002432',
  },
  timelineContainer: {
    padding: 16,
    gap: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DFE4E5',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dateIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dateLabel: {
    fontSize: 14,
    color: '#002432',
    marginRight: 8,
    flex: 1,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    flex: 1,
    textAlign: 'right',
  },
  eligibilityContainer: {
    padding: 16,
    gap: 16,
  },

  criteriaSection: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  criteriaHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  criteriaText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#475569',
  },
  ageContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  locationsContainer: {
    padding: 16,
    gap: 16,
  },
  descriptionContainer: {
    backgroundColor: '#DFE4E5',
    borderRadius: 12,
    padding: 8,
    maxWidth: 800,
    width: '100%',
  },
  locationItem: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  locationAddress: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 4,
  },
  locationContact: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 2,
  },
  locationPhone: {
    fontSize: 14,
    color: '#2563EB',
  },
  sponsorsContainer: {
    padding: 16,
    gap: 16,
  },
  sponsorSection: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sponsorLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  sponsorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  collaboratorName: {
    fontSize: 15,
    color: '#475569',
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  statusIcon: {
    marginRight: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 12,
  },
  emptyStateSmall: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: '#94A3B8',
  },
});

export default StudyDetails;