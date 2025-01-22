import axios from 'axios';

export const reverseGeocode = async (lat, lng) => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
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
                throw new Error('No results for this location.');
            }
        } else {
            throw new Error(`Geocoding API error: ${data.status}`);
        }
    } catch (error) {
        console.error('Error in reverse geocoding:', error);
        return { city: null, country: null };
    }
};
