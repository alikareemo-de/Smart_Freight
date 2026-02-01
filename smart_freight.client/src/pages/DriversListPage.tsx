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
import { useDeleteDriver, useDrivers } from '../hooks/drivers';
import type { Driver } from '../types/driver';

const DriversListPage = () => {
    const navigate = useNavigate();
    const { data, isLoading, isError, refetch } = useDrivers();
    const deleteMutation = useDeleteDriver();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

    const filteredDrivers = useMemo(() => {
        if (!data) return [];
        const query = search.trim().toLowerCase();
        if (!query) return data;
        return data.filter((driver) => {
            const haystack = [
                driver.firstName,
                driver.lastName,
                driver.email ?? '',
                driver.phoneNumber ?? '',
                driver.licenseNumber ?? '',
            ]
                .join(' ')
                .toLowerCase();
            return haystack.includes(query);
        });
    }, [data, search]);

    const paginatedDrivers = useMemo(() => {
        const start = page * rowsPerPage;
        return filteredDrivers.slice(start, start + rowsPerPage);
    }, [filteredDrivers, page, rowsPerPage]);

    const handleDelete = async () => {
        if (!selectedDriver) return;
        try {
            await deleteMutation.mutateAsync(selectedDriver.id);
            enqueueSnackbar('Driver deleted.', { variant: 'success' });
            setSelectedDriver(null);
        } catch (error: any) {
            const message = error?.response?.data?.message ?? 'Unable to delete driver.';
            enqueueSnackbar(message, { variant: 'error' });
        }
    };

    if (isLoading) {
        return <LoadingState message="Loading drivers..." />;
    }

    if (isError) {
        return <ErrorState message="Unable to load drivers." onRetry={refetch} />;
    }

    return (
        <Box>
            <PageHeader
                title="Drivers"
                subtitle="Manage driver profiles and availability."
                actionLabel="Add Driver"
                onAction={() => navigate('/drivers/new')}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3} alignItems="flex-start">
                <TextField
                    placeholder="Search drivers"
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
                rows={paginatedDrivers}
                columns={[
                    {
                        header: 'Driver',
                        render: (driver: Driver) => (
                            <Box>
                                <Typography fontWeight={600}>
                                    {driver.firstName} {driver.lastName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {driver.email ?? 'No email'}
                                </Typography>
                            </Box>
                        ),
                    },
                    {
                        header: 'Phone',
                        render: (driver: Driver) => driver.phoneNumber ?? '—',
                    },
                    {
                        header: 'License',
                        render: (driver: Driver) => driver.licenseNumber ?? '—',
                    },
                    {
                        header: 'Status',
                        render: (driver: Driver) => (driver.isActive ? 'Active' : 'Inactive'),
                    },
                    {
                        header: 'Actions',
                        render: (driver: Driver) => (
                            <Box display="flex" gap={1}>
                                <Tooltip title="View">
                                    <IconButton onClick={() => navigate(`/drivers/${driver.id}`)}>
                                        <VisibilityIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit">
                                    <IconButton onClick={() => navigate(`/drivers/${driver.id}/edit`)}>
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                    <IconButton color="error" onClick={() => setSelectedDriver(driver)}>
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
                count={filteredDrivers.length}
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
                open={Boolean(selectedDriver)}
                title="Delete driver?"
                description="This action cannot be undone."
                confirmLabel="Delete"
                onConfirm={handleDelete}
                onCancel={() => setSelectedDriver(null)}
                isLoading={deleteMutation.isPending}
            />
        </Box>
    );
};

export default DriversListPage;
