import { Box, Button, Grid, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import { useTrip, useUpdateTripStatus, useUpdateTripStopStatus } from '../hooks/trips';
import type { TripStop } from '../types/trip';

const tripStatuses = ['Planned', 'InProgress', 'Completed', 'Cancelled'];
const stopStatuses = ['Pending', 'Delivered', 'Failed', 'Delayed'];

const TripDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { auth } = useAuth();
    const { data, isLoading, isError, refetch } = useTrip(id ?? '');
    const updateTripStatusMutation = useUpdateTripStatus(id ?? '');
    const updateTripStopMutation = useUpdateTripStopStatus(id ?? '');
    const [stopNotes, setStopNotes] = useState<Record<string, string>>({});

    if (isLoading) {
        return <LoadingState message="Loading trip details..." />;
    }

    if (isError || !data) {
        return <ErrorState message="Unable to load trip." onRetry={refetch} />;
    }

    const handleTripStatusChange = async (status: string) => {
        try {
            await updateTripStatusMutation.mutateAsync({ status });
            enqueueSnackbar('Trip status updated.', { variant: 'success' });
        } catch (error: any) {
            const message = error?.response?.data?.message ?? 'Unable to update trip status.';
            enqueueSnackbar(message, { variant: 'error' });
        }
    };

    const handleStopStatusChange = async (stop: TripStop, status: string) => {
        try {
            await updateTripStopMutation.mutateAsync({
                stopId: stop.id,
                payload: { status, notes: stopNotes[stop.id] ?? '' },
            });
            enqueueSnackbar('Stop status updated.', { variant: 'success' });
        } catch (error: any) {
            const message = error?.response?.data?.message ?? 'Unable to update stop status.';
            enqueueSnackbar(message, { variant: 'error' });
        }
    };

    const canManageTrip = auth?.role === 'Admin' || auth?.role === 'Dispatcher';

    return (
        <Box>
            <PageHeader
                title="Trip Details"
                subtitle={`Truck: ${data.truckName}`}
                actionLabel="View Route"
                onAction={() => navigate(`/trips/${data.id}/route`)}
            />
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Trip
                        </Typography>
                        <Typography fontWeight={600} mt={2}>
                            Status
                        </Typography>
                        <Typography>{data.status}</Typography>
                        <Typography fontWeight={600} mt={2}>
                            Total Distance
                        </Typography>
                        <Typography>{data.totalPlannedDistance.toFixed(2)} km</Typography>
                        <Typography fontWeight={600} mt={2}>
                            Created At
                        </Typography>
                        <Typography>{new Date(data.createdAt).toLocaleString()}</Typography>
                        {canManageTrip && (
                            <Box mt={3}>
                                <TextField
                                    select
                                    label="Update Status"
                                    fullWidth
                                    defaultValue=""
                                    onChange={(event) => handleTripStatusChange(event.target.value)}
                                >
                                    {tripStatuses.map((status) => (
                                        <MenuItem key={status} value={status}>
                                            {status}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Box>
                        )}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Cargo Items
                        </Typography>
                        <Stack spacing={2} mt={2}>
                            {data.cargoItems.length === 0 ? (
                                <Typography color="text.secondary">No cargo items.</Typography>
                            ) : (
                                data.cargoItems.map((item) => (
                                    <Box key={item.productId}>
                                        <Typography fontWeight={600}>{item.productName}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Qty {item.quantity} · {item.totalWeightKg.toFixed(2)} kg
                                        </Typography>
                                    </Box>
                                ))
                            )}
                        </Stack>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper variant="outlined" sx={{ p: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Stops
                        </Typography>
                        <Stack spacing={2} mt={2}>
                            {data.stops.map((stop) => (
                                <Paper key={stop.id} variant="outlined" sx={{ p: 2 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} md={4}>
                                            <Typography fontWeight={600}>
                                                Stop {stop.stopOrder}: {stop.stopName}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Status: {stop.status}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                select
                                                label="Update Stop Status"
                                                fullWidth
                                                defaultValue=""
                                                onChange={(event) => handleStopStatusChange(stop, event.target.value)}
                                            >
                                                {stopStatuses.map((status) => (
                                                    <MenuItem key={status} value={status}>
                                                        {status}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                label="Notes"
                                                fullWidth
                                                value={stopNotes[stop.id] ?? ''}
                                                onChange={(event) =>
                                                    setStopNotes((prev) => ({
                                                        ...prev,
                                                        [stop.id]: event.target.value,
                                                    }))
                                                }
                                            />
                                        </Grid>
                                    </Grid>
                                </Paper>
                            ))}
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
            <Box mt={3}>
                <Button variant="outlined" onClick={() => navigate('/trips')}>
                    Back to trips
                </Button>
            </Box>
        </Box>
    );
};

export default TripDetailsPage;
