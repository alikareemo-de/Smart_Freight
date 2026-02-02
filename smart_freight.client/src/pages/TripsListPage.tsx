import { Box, Button, Stack, TablePagination, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/DataTable';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import PageHeader from '../components/PageHeader';
import { useTrips } from '../hooks/trips';
import type { TripSummary } from '../types/trip';

const TripsListPage = () => {
    const navigate = useNavigate();
    const { data, isLoading, isError, refetch } = useTrips();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const paginated = useMemo(() => {
        if (!data) return [];
        const start = page * rowsPerPage;
        return data.slice(start, start + rowsPerPage);
    }, [data, page, rowsPerPage]);

    if (isLoading) {
        return <LoadingState message="Loading trips..." />;
    }

    if (isError) {
        return <ErrorState message="Unable to load trips." onRetry={refetch} />;
    }

    return (
        <Box>
            <PageHeader
                title="Trips"
                subtitle="Monitor planned and active delivery trips."
                actionLabel="Plan Trip"
                onAction={() => navigate('/trips/new')}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
                <Button variant="outlined" onClick={() => refetch()}>
                    Refresh
                </Button>
            </Stack>
            <DataTable
                rows={paginated}
                columns={[
                    {
                        header: 'Trip',
                        render: (trip: TripSummary) => (
                            <Box>
                                <Typography fontWeight={600}>{trip.truckName}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {new Date(trip.createdAt).toLocaleString()}
                                </Typography>
                            </Box>
                        ),
                    },
                    {
                        header: 'Status',
                        render: (trip: TripSummary) => trip.status,
                    },
                    {
                        header: 'Distance',
                        render: (trip: TripSummary) => `${trip.totalPlannedDistance.toFixed(2)} km`,
                    },
                    {
                        header: 'Actions',
                        render: (trip: TripSummary) => (
                            <Button variant="outlined" onClick={() => navigate(`/trips/${trip.id}`)}>
                                View
                            </Button>
                        ),
                    },
                ]}
            />
            <TablePagination
                component="div"
                count={data?.length ?? 0}
                page={page}
                onPageChange={(_, nextPage) => setPage(nextPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(event) => {
                    setRowsPerPage(Number(event.target.value));
                    setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 20]}
            />
        </Box>
    );
};

export default TripsListPage;
