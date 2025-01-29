import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Dimensions, 
  ActivityIndicator, 
  Linking, 
  Pressable 
} from 'react-native';
import { SharedElement } from 'react-navigation-shared-element';
import Icon from 'react-native-vector-icons/Feather';
import MapView, { Marker } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const LocationDetail = ({ route, navigation }) => {
  const { location } = route.params;
  const [state, setState] = useState({
    wikiData: null,
    loading: true,
    error: null
  });

  const facilityName = location?.facility_name || location?.name || 'Location Details';
  const fullAddress = [
    location?.address,
    location?.city,
    location?.state,
    location?.country
  ].filter(Boolean).join(', ');

  const coordinates = {
    latitude: location?.latitude || location?.coordinates?.lat || 37.7749,
    longitude: location?.longitude || location?.coordinates?.lon || -122.4194,
  };

  const fetchWikiData = useCallback(async () => {
    if (!facilityName || facilityName === 'Location Details') {
      setState(prev => ({ ...prev, loading: false, error: 'No facility name available' }));
      return;
    }

    try {
      // Search for Wikipedia page
      const searchResponse = await fetch(
        `https://en.wikipedia.org/w/api.php?` + 
        `action=query&list=search&srsearch=${encodeURIComponent(facilityName)}` +
        `&format=json&origin=*&srlimit=1`
      );
      
      const searchData = await searchResponse.json();
      const firstResult = searchData.query?.search?.[0];

      if (!firstResult) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'No Wikipedia information found for this location'
        }));
        return;
      }

      // Fetch detailed page information
      const detailsResponse = await fetch(
        `https://en.wikipedia.org/w/api.php?` +
        `action=query&pageids=${firstResult.pageid}&prop=extracts|info|coordinates|extlinks` +
        `&inprop=url&exintro=1&explaintext=1&format=json&origin=*`
      );
      
      const detailsData = await detailsResponse.json();
      const page = detailsData.query?.pages?.[firstResult.pageid];

      if (!page) {
        throw new Error('Failed to fetch Wikipedia page details');
      }

      setState(prev => ({
        ...prev,
        loading: false,
        wikiData: {
          extract: page.extract,
          fullUrl: page.fullurl,
          coordinates: page.coordinates?.[0],
          extlinks: page.extlinks || []
        }
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load location information'
      }));
      console.error('Wikipedia fetch error:', error);
    }
  }, [facilityName]);

  useEffect(() => {
    fetchWikiData();
  }, [fetchWikiData]);

  const handleOpenWiki = useCallback(() => {
    if (state.wikiData?.fullUrl) {
      Linking.openURL(state.wikiData.fullUrl);
    }
  }, [state.wikiData]);

  const handleOpenLink = useCallback((url) => {
    Linking.openURL(url);
  }, []);

  const renderContent = () => {
    if (state.loading) {
      return <ActivityIndicator size="large" color="#4F46E5" />;
    }

    if (state.error) {
      return (
        <View style={styles.section}>
          <Text style={styles.errorText}>{state.error}</Text>
        </View>
      );
    }

    if (!state.wikiData?.extract) {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionText}>
            No additional information is available for this location.
          </Text>
        </View>
      );
    }

    return (
      <>
        {fullAddress && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address</Text>
            <Text style={styles.sectionText}>{fullAddress}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.sectionText}>{state.wikiData.extract}</Text>
        </View>

        {state.wikiData.extlinks?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Related Links</Text>
            {state.wikiData.extlinks.slice(0, 3).map((link, index) => (
              <Pressable 
                key={index}
                onPress={() => handleOpenLink(link['*'])}
                style={styles.linkItem}
              >
                <Text style={styles.linkText} numberOfLines={1}>
                  {link['*']}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        <Pressable onPress={handleOpenWiki} style={styles.wikiButton}>
          <Text style={styles.wikiButtonText}>Read More on Wikipedia</Text>
        </Pressable>
      </>
    );
  };

  return (
    <ScrollView style={styles.container} bounces={false}>
      <SharedElement id={`location.${location?.id}.card`}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
            <Icon name="arrow-left" size={24} color="#4F46E5" />
          </Pressable>
          <Text style={styles.title} numberOfLines={1}>
            {facilityName}
          </Text>
          <View style={{ width: 24 }} /> {/* Spacer for layout balance */}
        </View>
      </SharedElement>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            ...coordinates,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker
            coordinate={coordinates}
            title={facilityName}
          />
        </MapView>
      </View>

      <View style={styles.details}>
        {renderContent()}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginHorizontal: 16,
    textAlign: 'center',
  },
  mapContainer: {
    width,
    height: height * 0.3,
    backgroundColor: '#E5E7EB',
  },
  map: {
    flex: 1,
  },
  details: {
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    lineHeight: 20,
  },
  linkItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  linkText: {
    fontSize: 14,
    color: '#4F46E5',
  },
  wikiButton: {
    backgroundColor: '#4F46E5',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 16,
  },
  wikiButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default LocationDetail;