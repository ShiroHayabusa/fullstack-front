// src/GoogleMapWithMarker.js
import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, useLoadScript, InfoWindow } from '@react-google-maps/api';
import { reverseGeocode } from '../components/geocode'; // Импортируем функцию обратного геокодирования

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const options = {
  disableDefaultUI: true,
  zoomControl: false,
};

const GoogleMapWithMarker = ({ latitude, longitude, title = "Ваш Спот" }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyAcxOK0QJ7PZ5WTK--7_kAHKtBRnhef9s0', // Замените на ваш API ключ
  });

  const center = {
    lat: latitude,
    lng: longitude,
  };

  const [selected, setSelected] = useState(false);
  const [locationInfo, setLocationInfo] = useState({ city: '', country: '' });

  useEffect(() => {
    const fetchLocationInfo = async () => {
      const { city, country } = await reverseGeocode(latitude, longitude);
      setLocationInfo({ city, country });
    };

    fetchLocationInfo();
  }, [latitude, longitude]);

  if (loadError) return <div>Ошибка загрузки карты</div>;
  if (!isLoaded) return <div>Загрузка карты...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={15}
      center={center}
      options={options}
    >
      <Marker
        position={center}
        title={title}
        onClick={() => {
          setSelected(true);
        }}
      >
        {selected && (
          <InfoWindow
            onCloseClick={() => {
              setSelected(false);
            }}
          >
            <div>
              <h2>{title}</h2>
              <p>Город: {locationInfo.city || 'Не найден'}</p>
              <p>Страна: {locationInfo.country || 'Не найдена'}</p>
              <p>Lat: {latitude}, Lng: {longitude}</p>
            </div>
          </InfoWindow>
        )}
      </Marker>
    </GoogleMap>
  );
};

export default GoogleMapWithMarker;
