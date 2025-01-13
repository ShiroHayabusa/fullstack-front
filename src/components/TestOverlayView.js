import React, { useState } from 'react';
import {
  GoogleMap,
  Marker,
  OverlayView,
  useLoadScript
} from '@react-google-maps/api';

const center = { lat: 37.7749, lng: -122.4194 }; // Сан-Франциско
const mapContainerStyle = { width: '100%', height: '400px' };

function TestOverlayView() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAcxOK0QJ7PZ5WTK--7_kAHKtBRnhef9s0"
  });

  const [showOverlay, setShowOverlay] = useState(false);

  if (!isLoaded) return <div>Загрузка карты...</div>;

  return (
    <GoogleMap
      center={center}
      zoom={10}
      mapContainerStyle={mapContainerStyle}
    >
      <Marker
        position={center}
        onClick={() => setShowOverlay(!showOverlay)}
      />
      {showOverlay && (
        <OverlayView
          position={center}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div
            style={{
              position: 'absolute',
              transform: 'translate(-50%, -120%)',
              backgroundColor: 'white',
              borderRadius: 8,
              boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
              padding: 0,
              width: '200px',
              textAlign: 'center'
            }}
          >
            <button
              onClick={() => setShowOverlay(false)}
              style={{
                position: 'absolute',
                top: 5,
                right: 5,
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: 18,
              }}
            >
              ✕
            </button>
            <img
              src="https://placecats.com/neo/300/200"
              alt="placeholder"
              style={{
                maxWidth: '100%',
                maxHeight: '150px',
                objectFit: 'cover',
                marginBottom: '10px',
              }}
            />
            <p style={{ margin: 0 }}>
              Пример OverlayView
            </p>
          </div>
        </OverlayView>
      )}
    </GoogleMap>
  );
}

export default TestOverlayView;
