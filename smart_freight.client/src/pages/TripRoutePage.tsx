import { Box, Button, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { GoogleMap, Marker, Polyline } from '@react-google-maps/api';
import DataTable from '../components/DataTable';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import PageHeader from '../components/PageHeader';
import { GoogleMapsProvider, useGoogleMaps } from '../components/maps/GoogleMapsProvider';
import { useGraphNodes } from '../hooks/graph';
import { useLocations } from '../hooks/locations';
import { useTrip, useTripRoute } from '../hooks/trips';
import type { TripRouteStep } from '../types/trip';

const defaultCenter = { lat: 40.7128, lng: -74.006 };

const TripRouteInner = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, isLoading, isError, refetch } = useTripRoute(id ?? '');
    const { data: nodes, isLoading: nodesLoading, isError: nodesError, refetch: refetchNodes } = useGraphNodes();
    const { data: trip, isLoading: tripLoading } = useTrip(id ?? '');
    const { data: locations, isLoading: locationsLoading } = useLocations();
    const { isLoaded, isApiKeyMissing } = useGoogleMaps();

    if (isLoading || nodesLoading || tripLoading || locationsLoading) {
        return <LoadingState message="Loading route steps..." />;
    }

    if (isError || nodesError || !data || !nodes) {
        return <ErrorState message="Unable to load route steps." onRetry={() => {
            refetch();
            refetchNodes();
        }} />;
    }

    const nodeLookup = new Map(nodes.map((node) => [node.id, node]));
    const routeCoordinates = data
        .map((step) => nodeLookup.get(step.fromNodeId))
        .concat(nodeLookup.get(data[data.length - 1]?.toNodeId))
        .filter((node): node is NonNullable<typeof node> => Boolean(node))
        .filter((node) => node.latitude != null && node.longitude != null)
        .map((node) => ({ lat: node.latitude!, lng: node.longitude! }));

    const stopMarkers = trip?.stops
        .map((stop) => {
            const location = locations?.find((loc) => loc.id === stop.stopLocationId);
            if (location?.latitude != null && location.longitude != null) {
                return { ...stop, lat: location.latitude, lng: location.longitude };
            }
            const node = nodeLookup.get(location?.graphNodeId ?? '');
            if (node?.latitude != null && node.longitude != null) {
                return { ...stop, lat: node.latitude, lng: node.longitude };
            }
            return null;
        })
        .filter((stop): stop is NonNullable<typeof stop> => Boolean(stop));

    const canRenderMap = routeCoordinates.length > 1 && !isApiKeyMissing && isLoaded;

    return (
        <Box>
            <PageHeader
                title="Trip Route"
                subtitle="Ordered path computed by Dijkstra."
                actionLabel="Back to Trip"
                onAction={() => navigate(`/trips/${id}`)}
            />
            {canRenderMap ? (
                <Box mb={3}>
                    <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '360px' }}
                        center={routeCoordinates[0] ?? defaultCenter}
                        zoom={12}
                        options={{ streetViewControl: false, mapTypeControl: false }}
                    >
                        <Polyline path={routeCoordinates} options={{ strokeColor: '#1e3a8a', strokeWeight: 4 }} />
                        {routeCoordinates.map((coord, index) => (
                            <Marker key={`${coord.lat}-${coord.lng}-${index}`} position={coord} />
                        ))}
                        {stopMarkers?.map((stop) => (
                            <Marker
                                key={stop.id}
                                position={{ lat: stop.lat, lng: stop.lng }}
                                label={`${stop.stopOrder}`}
                            />
                        ))}
                    </GoogleMap>
                </Box>
            ) : (
                <Typography variant="body2" color="text.secondary" mb={2}>
                    Route map is unavailable. Ensure graph nodes have coordinates and set VITE_GOOGLE_MAPS_API_KEY.
                </Typography>
            )}
            <DataTable
                rows={data}
                columns={[
                    { header: 'Step', render: (step: TripRouteStep) => step.stepOrder },
                    { header: 'From Node', render: (step: TripRouteStep) => step.fromNodeId },
                    { header: 'To Node', render: (step: TripRouteStep) => step.toNodeId },
                    { header: 'Edge Weight', render: (step: TripRouteStep) => step.edgeWeight },
                    { header: 'Cumulative', render: (step: TripRouteStep) => step.cumulativeWeight },
                ]}
            />
            <Box mt={3}>
                <Button variant="outlined" onClick={() => navigate('/trips')}>
                    Back to trips
                </Button>
            </Box>
        </Box>
    );
};

const TripRoutePage = () => (
    <GoogleMapsProvider>
        <TripRouteInner />
    </GoogleMapsProvider>
);

export default TripRoutePage;
