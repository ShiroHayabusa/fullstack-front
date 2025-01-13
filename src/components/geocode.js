// src/components/geocode.js
import axios from 'axios';

// Обратное геокодирование: координаты -> город и страна
export const reverseGeocode = async (lat, lng) => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY; // Используйте переменные окружения
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        if (data.status === 'OK') {
            if (data.results[0]) {
                let city = '';
                let country = '';

                data.results.forEach(result => {
                    result.address_components.forEach(component => {
                        if (component.types.includes('locality')) {
                            city = component.long_name;
                        }
                        if (component.types.includes('country')) {
                            country = component.long_name;
                        }
                    });
                });

                return { city, country };
            } else {
                throw new Error('Нет результатов для данного местоположения.');
            }
        } else {
            throw new Error(`Geocoding API ошибка: ${data.status}`);
        }
    } catch (error) {
        console.error('Ошибка при обратном геокодировании:', error);
        return { city: null, country: null };
    }
};
