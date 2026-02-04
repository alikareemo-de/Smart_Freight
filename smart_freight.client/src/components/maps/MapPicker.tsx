import { memo } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { Box, Typography } from '@mui/material';
import { useGoogleMaps } from './GoogleMapsProvider';

type MapPickerProps = {
    center: google.maps.LatLngLiteral;
    zoom?: number;
    markerPosition?: google.maps.LatLngLiteral | null;
    onSelect: (position: google.maps.LatLngLiteral) => void;
    height?: string;
    disabled?: boolean;
};

const defaultHeight = '360px';

const MapPicker = ({ center, zoom = 12, markerPosition, onSelect, height = defaultHeight, disabled }: MapPickerProps) => {
    const { isLoaded } = useGoogleMaps();

    if (!isLoaded || disabled) {
        return (
            <Box
                height={height}
                display="flex"
                alignItems="center"
                justifyContent="center"
                bgcolor="grey.100"
                borderRadius={1}
            >
                <Typography variant="body2" color="text.secondary">
                    Map is unavailable.
                </Typography>
            </Box>
        );
    }

    return (
        <GoogleMap
            mapContainerStyle={{ width: '100%', height }}
            center={markerPosition ?? center}
            zoom={zoom}
            onClick={(event) => {
                if (!event.latLng) return;
                onSelect({ lat: event.latLng.lat(), lng: event.latLng.lng() });
            }}
            options={{
                streetViewControl: false,
                mapTypeControl: false,
            }}
        >
            {markerPosition && (
                <Marker
                    position={markerPosition}
                    draggable
                    onDragEnd={(event) => {
                        if (!event.latLng) return;
                        onSelect({ lat: event.latLng.lat(), lng: event.latLng.lng() });
                    }}
                />
            )}
        </GoogleMap>
    );
};

export default memo(MapPicker);
