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
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import DataTable from '../components/DataTable';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import PageHeader from '../components/PageHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import { useDeleteTruck, useTrucks } from '../hooks/trucks';
import type { Truck } from '../types/truck';

const TrucksListPage = () => {
    const navigate = useNavigate();
    const { data, isLoading, isError, refetch } = useTrucks();
    const deleteMutation = useDeleteTruck();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);

    const filtered = useMemo(() => {
        if (!data) return [];
        const query = search.trim().toLowerCase();
        if (!query) return data;
        return data.filter((truck) =>
            [truck.name, truck.plateNumber].join(' ').toLowerCase().includes(query)
        );
    }, [data, search]);

    const paginated = useMemo(() => {
        const start = page * rowsPerPage;
        return filtered.slice(start, start + rowsPerPage);
    }, [filtered, page, rowsPerPage]);

    const handleDelete = async () => {
        if (!selectedTruck) return;
        try {
            await deleteMutation.mutateAsync(selectedTruck.id);
            enqueueSnackbar('Truck deleted.', { variant: 'success' });
            setSelectedTruck(null);
        } catch (error: any) {
            const message = error?.response?.data?.message ?? 'Unable to delete truck.';
            enqueueSnackbar(message, { variant: 'error' });
        }
    };

    if (isLoading) {
        return <LoadingState message="Loading trucks..." />;
    }

    if (isError) {
        return <ErrorState message="Unable to load trucks." onRetry={refetch} />;
    }

    return (
        <Box>
            <PageHeader
                title="Trucks"
                subtitle="Manage fleet vehicles and payload capacity."
                actionLabel="Add Truck"
                onAction={() => navigate('/trucks/new')}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
                <TextField
                    placeholder="Search trucks"
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
                        header: 'Truck',
                        render: (truck: Truck) => (
                            <Box>
                                <Typography fontWeight={600}>{truck.name}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {truck.plateNumber}
                                </Typography>
                            </Box>
                        ),
                    },
                    {
                        header: 'Max Payload (kg)',
                        render: (truck: Truck) => truck.maxPayloadKg.toLocaleString(),
                    },
                    {
                        header: 'Status',
                        render: (truck: Truck) => (truck.isActive ? 'Active' : 'Inactive'),
                    },
                    {
                        header: 'Actions',
                        render: (truck: Truck) => (
                            <Box display="flex" gap={1}>
                                <Tooltip title="View">
                                    <IconButton onClick={() => navigate(`/trucks/${truck.id}`)}>
                                        <VisibilityIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit">
                                    <IconButton onClick={() => navigate(`/trucks/${truck.id}/edit`)}>
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                    <IconButton color="error" onClick={() => setSelectedTruck(truck)}>
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
                open={Boolean(selectedTruck)}
                title="Delete truck?"
                description="This action cannot be undone."
                confirmLabel="Delete"
                onConfirm={handleDelete}
                onCancel={() => setSelectedTruck(null)}
                isLoading={deleteMutation.isPending}
            />
        </Box>
    );
};

export default TrucksListPage;
