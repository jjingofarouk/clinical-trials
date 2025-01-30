import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LocationDetail = ({ location }) => {
  const [state, setState] = useState({
    wikiData: null,
    loading: true,
    error: null
  });

  const navigate = useNavigate();

  const facilityName = location?.facility_name || location?.name || 'Location Details';
  const fullAddress = [
    location?.address,
    location?.city,
    location?.state,
    location?.country
  ].filter(Boolean).join(', ');

  const coordinates = {
    lat: location?.latitude || location?.coordinates?.lat || 37.7749,
    lng: location?.longitude || location?.coordinates?.lon || -122.4194,
  };

  const fetchWikiData = useCallback(async () => {
    if (!facilityName || facilityName === 'Location Details') {
      setState(prev => ({ ...prev, loading: false, error: 'No facility name available' }));
      return;
    }

    try {
      const searchResponse = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(facilityName)}&format=json&origin=*&srlimit=1`
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

      const detailsResponse = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&pageids=${firstResult.pageid}&prop=extracts|info|coordinates|extlinks&inprop=url&exintro=1&explaintext=1&format=json&origin=*`
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
      window.open(state.wikiData.fullUrl, '_blank');
    }
  }, [state.wikiData]);

  const handleOpenLink = useCallback((url) => {
    window.open(url, '_blank');
  }, []);

  const renderContent = () => {
    if (state.loading) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (state.error) {
      return (
        <div className="p-4 bg-red-50 rounded-lg">
          <p className="text-red-600">{state.error}</p>
        </div>
      );
    }

    if (!state.wikiData?.extract) {
      return (
        <p className="text-gray-600">
          No additional information is available for this location.
        </p>
      );
    }

    return (
      <div className="space-y-6">
        {fullAddress && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Address</h3>
            <p className="text-gray-600">{fullAddress}</p>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
          <p className="text-gray-600 leading-relaxed">{state.wikiData.extract}</p>
        </div>

        {state.wikiData.extlinks?.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Related Links</h3>
            <div className="space-y-2">
              {state.wikiData.extlinks.slice(0, 3).map((link, index) => (
                <button
                  key={index}
                  onClick={() => handleOpenLink(link['*'])}
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  <span className="truncate">{link['*']}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleOpenWiki}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <span>Read More on Wikipedia</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 truncate max-w-2xl">
              {facilityName}
            </h1>
            <div className="w-8" /> {/* Spacer */}
          </div>
        </div>
      </header>

      <div className="h-72 bg-gray-200">
        <MapContainer
          center={[coordinates.lat, coordinates.lng]}
          zoom={13}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[coordinates.lat, coordinates.lng]}>
            <Popup>{facilityName}</Popup>
          </Marker>
        </MapContainer>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Location Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderContent()}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default LocationDetail;