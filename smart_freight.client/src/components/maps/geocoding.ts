const geocodeCache = new Map<string, google.maps.GeocoderResult[]>();

const getGeocoder = () => {
    if (!window.google?.maps) {
        throw new Error('Google Maps API is not loaded.');
    }
    return new google.maps.Geocoder();
};

export const geocodeAddress = async (address: string) => {
    const key = `addr:${address}`;
    if (geocodeCache.has(key)) {
        return geocodeCache.get(key)!;
    }
    const geocoder = getGeocoder();
    const results = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
        geocoder.geocode({ address }, (response, status) => {
            if (status === 'OK' && response) {
                resolve(response);
            } else {
                reject(new Error(status));
            }
        });
    });
    geocodeCache.set(key, results);
    return results;
};

export const reverseGeocode = async (lat: number, lng: number) => {
    const key = `latlng:${lat.toFixed(5)},${lng.toFixed(5)}`;
    if (geocodeCache.has(key)) {
        return geocodeCache.get(key)!;
    }
    const geocoder = getGeocoder();
    const results = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
        geocoder.geocode({ location: { lat, lng } }, (response, status) => {
            if (status === 'OK' && response) {
                resolve(response);
            } else {
                reject(new Error(status));
            }
        });
    });
    geocodeCache.set(key, results);
    return results;
};
