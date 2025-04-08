import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import {
  GoogleMap,
  Marker,
  useLoadScript,
  OverlayView
} from '@react-google-maps/api';
import { reverseGeocode } from '../components/geocode';

const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

const defaultMapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
};

export default function GoogleMapWithMarker({
  spots = [],
  latitude,
  longitude,
  title = 'Your Spot',
  fitBounds = false, // <-- Control flag. Defaults to false.
  defaultZoom = 15,
}) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  });

  // Link to the Map and local states
  const [mapRef, setMapRef] = useState(null);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [locationInfo, setLocationInfo] = useState({});

  // Keep the center and zoom in the state so that it doesn't jump during rerendering
  const [mapCenter, setMapCenter] = useState({ lat: latitude, lng: longitude });
  const [mapZoom, setMapZoom] = useState(defaultZoom);




  // When mounting (or when changing latitude/longitude) we will determine the city/country
  useEffect(() => {
    if (latitude && longitude) {
      const fetchLocationInfo = async () => {
        const { city, country } = await reverseGeocode(latitude, longitude);
        setLocationInfo({ city, country });
      };
      fetchLocationInfo();
    }
  }, [latitude, longitude]);

  // When the map (mapRef) is ready, we decide whether to do fitBounds or not
  // By the fitBounds flag (if true) and the number of spots

  useEffect(() => {
    if (!mapRef || spots.length === 0) return;
    if (spots.length > 1) {
      // "List mode" - fly around all spots
      const bounds = new window.google.maps.LatLngBounds();

      spots.forEach((spot) => {
        bounds.extend({ lat: spot.latitude, lng: spot.longitude });
      });
      mapRef.fitBounds(bounds);
    } else if (spots.length === 1) {
      // "Single Spot Page" (or fitBounds=false), if we have 1 spot
      // We trust this one spot completely
      const single = spots[0];
      setMapCenter({ lat: single.latitude, lng: single.longitude });
      // We can manually set the zoom (instead of fitBounds)
      setMapZoom(defaultZoom);
    } else {
      // If spots > 1, but fitBounds = false — leave the center that is set
      // Or if spots.length === 1, but fitBounds is also false —
      // you can leave mapCenter, which is already in the state.
    }
    // Dependencies: mapRef, spots, fitBounds
  }, [mapRef, spots, fitBounds, defaultZoom]);

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={mapCenter}
      zoom={mapZoom}
      options={defaultMapOptions}
      onLoad={(map) => setMapRef(map)}
    >
      {/* Render markers */}
      {spots.length > 0 ? (
        spots
          .filter(
            (spot) =>
              typeof spot.latitude === 'number' &&
              typeof spot.longitude === 'number'
          )
          .map((spot) => (
            <Marker
              key={spot.id}
              position={{ lat: spot.latitude, lng: spot.longitude }}
              title={spot.title || `Spot ${spot.id}`}
              onClick={() => {
                // If the same spot is already selected, then when you click again we reset it
                if (selectedSpot?.id === spot.id) {
                  setSelectedSpot(null);
                } else {
                  setSelectedSpot(spot);
                }
              }}
            />
          ))
      ) : (
        <Marker
          position={{ lat: latitude, lng: longitude }}
          title={title}
          onClick={() => setSelectedSpot({ latitude, longitude, title })}
        />
      )}

      {/* Overlay when choosing a spot */}
      {selectedSpot && (
        <OverlayView
          position={{ lat: selectedSpot.latitude, lng: selectedSpot.longitude }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div
            style={{
              display: 'inline-block',
              position: 'absolute',
              transform: 'translate(-50%, -120%)',
              backgroundColor: 'white',
              borderRadius: 8,
              boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
              padding: 0,
              textAlign: 'center',
            }}
          >
            <Link
              to={`/spots/${selectedSpot.id}`}
              style={{
                display: 'block',
                marginTop: '8px',
                color: '#007BFF',
                textDecoration: 'none',
                fontWeight: 'bold',
              }}
            >
              <img
                src={`https://newloripinbucket.s3.amazonaws.com/image/spots/${selectedSpot.user?.username}/${selectedSpot.id}/${selectedSpot.photos?.find((p) => p.isMain)?.name}`}
                alt={
                  selectedSpot.photos?.find((photo) => photo.isMain)?.name || ''
                }
                style={{
                  maxHeight: '150px',
                  objectFit: 'cover',
                }}
              />
            </Link>
            <p style={{ margin: 0 }}>
              {selectedSpot.city && <span>{selectedSpot.city}, </span>}
              {selectedSpot.country && <span>{selectedSpot.country}</span>}
            </p>
          </div>
        </OverlayView>
      )}
    </GoogleMap>
  );
}
