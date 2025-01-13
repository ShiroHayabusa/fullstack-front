import React, { useState, useEffect } from 'react';
import {
  GoogleMap,
  Marker,
  useLoadScript,
  OverlayView
} from '@react-google-maps/api';
import { reverseGeocode } from '../components/geocode';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
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
  fitBounds = false, // <-- Управляющий флаг. По умолчанию false.
  defaultZoom = 15,
}) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyAcxOK0QJ7PZ5WTK--7_kAHKtBRnhef9s0'
  });

  // Ссылка на карту (Map) и локальные состояния
  const [mapRef, setMapRef] = useState(null);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [locationInfo, setLocationInfo] = useState({});

  // Сохраняем центр и зум в состоянии, чтобы не прыгало при ререндере
  const [mapCenter, setMapCenter] = useState({ lat: latitude, lng: longitude });
  const [mapZoom, setMapZoom] = useState(defaultZoom);




  // При монтировании (или при изменении latitude/longitude) определим город/страну
  useEffect(() => {
    if (latitude && longitude) {
      const fetchLocationInfo = async () => {
        const { city, country } = await reverseGeocode(latitude, longitude);
        setLocationInfo({ city, country });
      };
      fetchLocationInfo();
    }
  }, [latitude, longitude]);

  // Когда карта (mapRef) готова, решаем — делать fitBounds или нет
  // По флагу fitBounds (если true) и количеству spots

  useEffect(() => {
    if (!mapRef || spots.length === 0) return;
    if (spots.length > 1) {
      // "Режим списка" — облет всех спотов
      const bounds = new window.google.maps.LatLngBounds();

      spots.forEach((spot) => {
        bounds.extend({ lat: spot.latitude, lng: spot.longitude });
      });
      mapRef.fitBounds(bounds);
    } else if (spots.length === 1) {
      // "Страница одного спота" (или fitBounds=false), если у нас 1 спот
      // Целиком доверяем этому одному споту
      const single = spots[0];
      setMapCenter({ lat: single.latitude, lng: single.longitude });
      // Можем вручную задать зум (вместо fitBounds)
      setMapZoom(defaultZoom);
    } else {
      // Если spots > 1, но fitBounds = false — оставляем центр, который задан
      // Или если spots.length === 1, но fitBounds тоже false —
      // можно оставить mapCenter, который уже в стейте.
    }
    // Зависимости: mapRef, spots, fitBounds
  }, [mapRef, spots, fitBounds, defaultZoom]);

  if (loadError) return <div>Ошибка загрузки карты</div>;
  if (!isLoaded) return <div>Загрузка карты...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={mapCenter}
      zoom={mapZoom}
      options={defaultMapOptions}
      onLoad={(map) => setMapRef(map)}
    >
      {/* Рендерим маркеры */}
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
              title={spot.title || `Спот ${spot.id}`}
              onClick={() => {
                // Если уже выбран этот же спот, то при повторном клике сбрасываем
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

      {/* Оверлей при выборе спота */}
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
            <img
              src={`https://newloripinbucket.s3.amazonaws.com/image/spots/${selectedSpot.user?.username}/${selectedSpot.photos?.find((p) => p.isMain)?.name}`}
              alt={
                selectedSpot.photos?.find((photo) => photo.isMain)?.name || ''
              }
              style={{
                maxHeight: '150px',
                objectFit: 'cover',
              }}
            />
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
