import { createContext, useContext, useMemo } from 'react';
import { Box, Alert } from '@mui/material';
import { useJsApiLoader } from '@react-google-maps/api';

type GoogleMapsContextValue = {
    isLoaded: boolean;
    loadError: Error | undefined;
    isApiKeyMissing: boolean;
};

const GoogleMapsContext = createContext<GoogleMapsContextValue | undefined>(undefined);

const libraries: ("places")[] = ['places'];

export const GoogleMapsProvider = ({ children }: { children: React.ReactNode }) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const isApiKeyMissing = !apiKey;

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: apiKey || 'missing',
        libraries,
    });

    const value = useMemo(
        () => ({
            isLoaded: Boolean(apiKey) && isLoaded,
            loadError,
            isApiKeyMissing,
        }),
        [apiKey, isLoaded, loadError, isApiKeyMissing]
    );

    return (
        <GoogleMapsContext.Provider value={value}>
            {isApiKeyMissing ? (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Google Maps API key is missing. Map features are disabled. Set VITE_GOOGLE_MAPS_API_KEY.
                </Alert>
            ) : loadError ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                    Unable to load Google Maps. Check the API key and enabled APIs.
                </Alert>
            ) : null}
            <Box>{children}</Box>
        </GoogleMapsContext.Provider>
    );
};

export const useGoogleMaps = () => {
    const ctx = useContext(GoogleMapsContext);
    if (!ctx) {
        throw new Error('useGoogleMaps must be used within GoogleMapsProvider');
    }
    return ctx;
};
