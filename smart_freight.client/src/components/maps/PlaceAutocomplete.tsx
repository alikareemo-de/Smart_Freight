import { useEffect, useRef } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { TextField } from '@mui/material';
import { useGoogleMaps } from './GoogleMapsProvider';

type PlaceAutocompleteProps = {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    onPlaceSelected: (place: google.maps.places.PlaceResult) => void;
    disabled?: boolean;
};

const PlaceAutocomplete = ({ label = 'Search places', value, onChange, onPlaceSelected, disabled }: PlaceAutocompleteProps) => {
    const { isLoaded, isApiKeyMissing } = useGoogleMaps();
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    useEffect(() => {
        if (disabled) {
            autocompleteRef.current = null;
        }
    }, [disabled]);

    if (!isLoaded || isApiKeyMissing) {
        return (
            <TextField
                label={label}
                fullWidth
                value={value}
                onChange={(event) => onChange(event.target.value)}
                disabled
            />
        );
    }

    return (
        <Autocomplete
            onLoad={(autocomplete) => {
                autocompleteRef.current = autocomplete;
            }}
            onPlaceChanged={() => {
                const place = autocompleteRef.current?.getPlace();
                if (place) {
                    onPlaceSelected(place);
                }
            }}
        >
            <TextField
                label={label}
                fullWidth
                value={value}
                onChange={(event) => onChange(event.target.value)}
                disabled={disabled}
            />
        </Autocomplete>
    );
};

export default PlaceAutocomplete;
