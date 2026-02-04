import { useMemo, useState } from 'react';
import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    Stack,
    TablePagination,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import DataTable from '../components/DataTable';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import PageHeader from '../components/PageHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import { useDeleteLocation, useLocations } from '../hooks/locations';
import type { Location } from '../types/location';

const LocationsListPage = () => {
    const navigate = useNavigate();
    const { data, isLoading, isError, refetch } = useLocations();
    const deleteMutation = useDeleteLocation();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

    const filtered = useMemo(() => {
        if (!data) return [];
        const query = search.trim().toLowerCase();
        if (!query) return data;
        return data.filter((location) =>
            [location.name, location.addressText ?? ''].join(' ').toLowerCase().includes(query)
        );
    }, [data, search]);

    const paginated = useMemo(() => {
        const start = page * rowsPerPage;
        return filtered.slice(start, start + rowsPerPage);
    }, [filtered, page, rowsPerPage]);

    const handleDelete = async () => {
        if (!selectedLocation) return;
        try {
            await deleteMutation.mutateAsync(selectedLocation.id);
            enqueueSnackbar('Location deleted.', { variant: 'success' });
            setSelectedLocation(null);
        } catch (error: any) {
            const message = error?.response?.data?.message ?? 'Unable to delete location.';
            enqueueSnackbar(message, { variant: 'error' });
        }
    };

    if (isLoading) {
        return <LoadingState message="Loading locations..." />;
    }

    if (isError) {
        return <ErrorState message="Unable to load locations." onRetry={refetch} />;
    }

    return (
        <Box>
            <PageHeader
                title="Stop Locations"
                subtitle="Manage delivery destinations and graph mapping."
                actionLabel="Add Location"
                onAction={() => navigate('/locations/new')}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
                <TextField
                    placeholder="Search locations"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    fullWidth
                />
                <Button variant="outlined" onClick={() => refetch()}>
                    Refresh
                </Button>
            </Stack>
            <DataTable
                rows={paginated}
                columns={[
                    {
                        header: 'Location',
                        render: (location: Location) => (
                            <Box>
                                <Typography fontWeight={600}>{location.name}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {location.addressText ?? 'No address'}
                                </Typography>
                            </Box>
                        ),
                    },
                    {
                        header: 'Graph Node',
                        render: (location: Location) => location.graphNodeId,
                    },
                    {
                        header: 'Actions',
                        render: (location: Location) => (
                            <Box display="flex" gap={1}>
                                <Tooltip title="Edit">
                                    <IconButton onClick={() => navigate(`/locations/${location.id}/edit`)}>
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                    <IconButton color="error" onClick={() => setSelectedLocation(location)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        ),
                    },
                ]}
            />
            <TablePagination
                component="div"
                count={filtered.length}
                page={page}
                onPageChange={(_, nextPage) => setPage(nextPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(event) => {
                    setRowsPerPage(Number(event.target.value));
                    setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 20]}
            />
            <ConfirmDialog
                open={Boolean(selectedLocation)}
                title="Delete location?"
                description="This action cannot be undone."
                confirmLabel="Delete"
                onConfirm={handleDelete}
                onCancel={() => setSelectedLocation(null)}
                isLoading={deleteMutation.isPending}
            />
        </Box>
    );
};

export default LocationsListPage;
