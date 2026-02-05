import { zodResolver } from '@hookform/resolvers/zod';
import {
    Alert,
    Box,
    Button,
    FormControlLabel,
    Grid,
    IconButton,
    MenuItem,
    Paper,
    Stack,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { z } from 'zod';
import { useEffect, useMemo, useRef, useState } from 'react';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import PageHeader from '../components/PageHeader';
import { GoogleMapsProvider, useGoogleMaps } from '../components/maps/GoogleMapsProvider';
import MapPicker from '../components/maps/MapPicker';
import PlaceAutocomplete from '../components/maps/PlaceAutocomplete';
import { geocodeAddress, reverseGeocode } from '../components/maps/geocoding';
import { useGraphNodes } from '../hooks/graph';
import { useCreateLocation, useLocation, useUpdateLocation } from '../hooks/locations';
import type { LocationCreateRequest } from '../types/location';
import type { GraphNode } from '../types/graph';

const coordinateSchema = z
    .coerce
    .number()
    .refine((value) => !Number.isNaN(value), 'Coordinate is required.');

const locationSchema = z.object({
    name: z.string().min(1, 'Name is required.'),
    addressText: z.string().optional().or(z.literal('')),
    graphNodeId: z.string().min(1, 'Graph node is required.'),
    latitude: coordinateSchema.refine((value) => value >= -90 && value <= 90, 'Latitude must be between -90 and 90.'),
    longitude: coordinateSchema.refine((value) => value >= -180 && value <= 180, 'Longitude must be between -180 and 180.'),
});

type LocationFormValues = z.infer<typeof locationSchema>;

type LocationFormPageProps = {
    mode: 'create' | 'edit';
};

const defaultCenter = { lat: 40.7128, lng: -74.006 };

const LocationFormInner = ({ mode }: LocationFormPageProps) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = mode === 'edit';
    const { data, isLoading, isError, refetch } = useLocation(isEdit ? id ?? '' : '');
    const { data: nodes, isLoading: nodesLoading, isError: nodesError, refetch: refetchNodes } = useGraphNodes();
    const createMutation = useCreateLocation();
    const updateMutation = useUpdateLocation(id ?? '');
    const { isLoaded, isApiKeyMissing } = useGoogleMaps();
    const [allowManualCoords, setAllowManualCoords] = useState(false);
    const [manualAddress, setManualAddress] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);
    const geocodeTimeoutRef = useRef<number | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<LocationFormValues>({
        resolver: zodResolver(locationSchema),
        defaultValues: {
            name: '',
            addressText: '',
            graphNodeId: '',
            latitude: undefined,
            longitude: undefined,
        },
    });

    const addressField = register('addressText');
    const latitudeValue = watch('latitude');
    const longitudeValue = watch('longitude');

    useEffect(() => {
        if (data && isEdit) {
            setValue('name', data.name, { shouldDirty: false });
            setValue('addressText', data.addressText ?? '', { shouldDirty: false });
            setValue('graphNodeId', data.graphNodeId, { shouldDirty: false });
            setValue('latitude', data.latitude ?? undefined, { shouldDirty: false });
            setValue('longitude', data.longitude ?? undefined, { shouldDirty: false });
            setSearchValue(data.addressText ?? '');
            if (data.latitude && data.longitude) {
                const position = { lat: data.latitude, lng: data.longitude };
                setMapCenter(position);
                setMarkerPosition(position);
            }
        }
    }, [data, isEdit, setValue]);

    useEffect(() => {
        if (isApiKeyMissing) {
            setAllowManualCoords(true);
        }
    }, [isApiKeyMissing]);

    useEffect(() => {
        if (!allowManualCoords) return;
        if (typeof latitudeValue !== 'number' || typeof longitudeValue !== 'number') return;
        if (Number.isNaN(latitudeValue) || Number.isNaN(longitudeValue)) return;
        const position = { lat: latitudeValue, lng: longitudeValue };
        setMarkerPosition(position);
        setMapCenter(position);
    }, [allowManualCoords, latitudeValue, longitudeValue]);

    if (isEdit && isLoading) {
        return <LoadingState message="Loading location..." />;
    }

    if (isEdit && (isError || !data)) {
        return <ErrorState message="Unable to load location." onRetry={refetch} />;
    }

    if (nodesLoading) {
        return <LoadingState message="Loading graph nodes..." />;
    }

    if (nodesError || !nodes) {
        return <ErrorState message="Unable to load graph nodes." onRetry={refetchNodes} />;
    }

    const handleMapSelect = async (position: google.maps.LatLngLiteral) => {
        setMarkerPosition(position);
        setMapCenter(position);
        setValue('latitude', Number(position.lat.toFixed(6)), { shouldDirty: true });
        setValue('longitude', Number(position.lng.toFixed(6)), { shouldDirty: true });

        if (manualAddress) {
            return;
        }

        if (geocodeTimeoutRef.current) {
            window.clearTimeout(geocodeTimeoutRef.current);
        }

        geocodeTimeoutRef.current = window.setTimeout(async () => {
            try {
                const results = await reverseGeocode(position.lat, position.lng);
                if (results[0]?.formatted_address) {
                    setValue('addressText', results[0].formatted_address, { shouldDirty: true });
                }
            } catch {
                // ignore reverse geocode errors
            }
        }, 600);
    };

    const handleLocateAddress = async () => {
        const address = getValues('addressText');
        if (!address) {
            enqueueSnackbar('Enter an address to locate.', { variant: 'warning' });
            return;
        }
        if (!isLoaded) {
            enqueueSnackbar('Google Maps is not ready.', { variant: 'warning' });
            return;
        }
        try {
            const results = await geocodeAddress(address);
            const location = results[0]?.geometry?.location;
            if (location) {
                const position = { lat: location.lat(), lng: location.lng() };
                setManualAddress(false);
                await handleMapSelect(position);
                setMapCenter(position);
            }
        } catch {
            enqueueSnackbar('Unable to geocode that address.', { variant: 'error' });
        }
    };

    const handleUseMyLocation = () => {
        if (!navigator.geolocation) {
            enqueueSnackbar('Geolocation is not supported by this browser.', { variant: 'error' });
            return;
        }
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
                setManualAddress(false);
                await handleMapSelect(coords);
            },
            () => {
                enqueueSnackbar('Unable to access your location.', { variant: 'error' });
            }
        );
    };

    const availableNodes = useMemo(
        () => nodes.filter((node) => node.latitude !== null && node.latitude !== undefined && node.longitude !== null && node.longitude !== undefined),
        [nodes]
    );
    const nearestNodes = useMemo(() => {
        if (!markerPosition || availableNodes.length === 0) return [];
        const toRadians = (value: number) => (value * Math.PI) / 180;
        const distance = (node: GraphNode) => {
            if (node.latitude == null || node.longitude == null) return Number.POSITIVE_INFINITY;
            const dLat = toRadians(node.latitude - markerPosition.lat);
            const dLng = toRadians(node.longitude - markerPosition.lng);
            const a =
                Math.sin(dLat / 2) ** 2 +
                Math.cos(toRadians(markerPosition.lat)) *
                    Math.cos(toRadians(node.latitude)) *
                    Math.sin(dLng / 2) ** 2;
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return 6371 * c;
        };

        return [...availableNodes]
            .map((node) => ({ node, distance: distance(node) }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 5);
    }, [availableNodes, markerPosition]);

    const onSubmit = async (values: LocationFormValues) => {
        const payload: LocationCreateRequest = {
            name: values.name,
            addressText: values.addressText || null,
            graphNodeId: values.graphNodeId,
            latitude: values.latitude,
            longitude: values.longitude,
        };

        try {
            if (isEdit && id) {
                await updateMutation.mutateAsync(payload);
                enqueueSnackbar('Location updated.', { variant: 'success' });
                navigate('/locations');
            } else {
                await createMutation.mutateAsync(payload);
                enqueueSnackbar('Location created.', { variant: 'success' });
                navigate('/locations');
            }
        } catch (error: any) {
            const message = error?.response?.data?.message ?? 'Unable to save location.';
            enqueueSnackbar(message, { variant: 'error' });
        }
    };

    return (
        <Box>
            <PageHeader
                title={isEdit ? 'Edit Location' : 'Create Location'}
                subtitle="Map delivery stops to routing graph nodes."
            />
            <Paper variant="outlined" sx={{ p: 3 }}>
                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Location Name"
                                fullWidth
                                {...register('name')}
                                error={Boolean(errors.name)}
                                helperText={errors.name?.message}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Address"
                                fullWidth
                                {...addressField}
                                error={Boolean(errors.addressText)}
                                helperText={errors.addressText?.message}
                                onChange={(event) => {
                                    addressField.onChange(event);
                                    setManualAddress(true);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            {isApiKeyMissing && (
                                <Alert severity="warning">
                                    Map features are disabled. Enter coordinates manually or configure VITE_GOOGLE_MAPS_API_KEY.
                                </Alert>
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            <PlaceAutocomplete
                                label="Search address / place"
                                value={searchValue}
                                onChange={setSearchValue}
                                onPlaceSelected={(place) => {
                                    if (!place.geometry?.location) return;
                                    const position = {
                                        lat: place.geometry.location.lat(),
                                        lng: place.geometry.location.lng(),
                                    };
                                    setManualAddress(false);
                                    setSearchValue(place.formatted_address ?? '');
                                    setValue('addressText', place.formatted_address ?? '', { shouldDirty: true });
                                    handleMapSelect(position);
                                }}
                                disabled={isApiKeyMissing}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                label="Graph Node"
                                fullWidth
                                {...register('graphNodeId')}
                                error={Boolean(errors.graphNodeId)}
                                helperText={errors.graphNodeId?.message}
                            >
                                {nodes.length === 0 ? (
                                    <MenuItem value="">
                                        <em>No nodes available</em>
                                    </MenuItem>
                                ) : (
                                    nodes.map((node) => (
                                        <MenuItem key={node.id} value={node.id}>
                                            {node.name}
                                        </MenuItem>
                                    ))
                                )}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                label="Latitude"
                                fullWidth
                                type="number"
                                {...register('latitude')}
                                error={Boolean(errors.latitude)}
                                helperText={errors.latitude?.message}
                                InputProps={{ readOnly: !allowManualCoords }}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                label="Longitude"
                                fullWidth
                                type="number"
                                {...register('longitude')}
                                error={Boolean(errors.longitude)}
                                helperText={errors.longitude?.message}
                                InputProps={{ readOnly: !allowManualCoords }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={allowManualCoords}
                                            onChange={(event) => setAllowManualCoords(event.target.checked)}
                                        />
                                    }
                                    label="Edit coordinates manually"
                                />
                                <Button variant="outlined" onClick={handleLocateAddress}>
                                    Locate on map
                                </Button>
                                <Button variant="outlined" startIcon={<MyLocationIcon />} onClick={handleUseMyLocation}>
                                    Use my location
                                </Button>
                                <IconButton
                                    aria-label="Copy coordinates"
                                    onClick={() => {
                                        const lat = getValues('latitude');
                                        const lng = getValues('longitude');
                                        navigator.clipboard.writeText(`${lat}, ${lng}`);
                                        enqueueSnackbar('Coordinates copied.', { variant: 'success' });
                                    }}
                                >
                                    <ContentCopyIcon />
                                </IconButton>
                            </Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <MapPicker
                                center={mapCenter}
                                markerPosition={markerPosition}
                                onSelect={handleMapSelect}
                                disabled={isApiKeyMissing}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            {markerPosition && nearestNodes.length > 0 ? (
                                <Paper variant="outlined" sx={{ p: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Nearest Graph Nodes
                                    </Typography>
                                    <Stack spacing={1} mt={1}>
                                        {nearestNodes.map(({ node, distance }) => (
                                            <Box key={node.id} display="flex" justifyContent="space-between" alignItems="center">
                                                <Typography variant="body2">
                                                    {node.name} · {distance.toFixed(2)} km
                                                </Typography>
                                                <Button size="small" onClick={() => setValue('graphNodeId', node.id, { shouldDirty: true })}>
                                                    Select
                                                </Button>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Paper>
                            ) : (
                                <Alert severity="info">
                                    Add coordinates to graph nodes to enable nearest node suggestions.
                                </Alert>
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            {nodes.length === 0 && (
                                <Typography variant="body2" color="text.secondary" mb={2}>
                                    Create graph nodes before adding locations.
                                </Typography>
                            )}
                            <Box display="flex" gap={2}>
                                <Button type="submit" variant="contained" disabled={isSubmitting || nodes.length === 0}>
                                    {isSubmitting ? 'Saving...' : 'Save'}
                                </Button>
                                <Button variant="outlined" onClick={() => navigate(-1)}>
                                    Cancel
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
};

const LocationFormPage = ({ mode }: LocationFormPageProps) => (
    <GoogleMapsProvider>
        <LocationFormInner mode={mode} />
    </GoogleMapsProvider>
);

export default LocationFormPage;
