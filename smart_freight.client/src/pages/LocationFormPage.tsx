import { zodResolver } from '@hookform/resolvers/zod';
import {
    Box,
    Button,
    Grid,
    MenuItem,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { z } from 'zod';
import { useEffect } from 'react';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import PageHeader from '../components/PageHeader';
import { useGraphNodes } from '../hooks/graph';
import { useCreateLocation, useLocation, useUpdateLocation } from '../hooks/locations';
import type { LocationCreateRequest } from '../types/location';

const locationSchema = z.object({
    name: z.string().min(1, 'Name is required.'),
    addressText: z.string().optional().or(z.literal('')),
    graphNodeId: z.string().min(1, 'Graph node is required.'),
    latitude: z.coerce.number().optional(),
    longitude: z.coerce.number().optional(),
});

type LocationFormValues = z.infer<typeof locationSchema>;

type LocationFormPageProps = {
    mode: 'create' | 'edit';
};

const LocationFormPage = ({ mode }: LocationFormPageProps) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = mode === 'edit';
    const { data, isLoading, isError, refetch } = useLocation(isEdit ? id ?? '' : '');
    const { data: nodes, isLoading: nodesLoading, isError: nodesError, refetch: refetchNodes } = useGraphNodes();
    const createMutation = useCreateLocation();
    const updateMutation = useUpdateLocation(id ?? '');

    const {
        register,
        handleSubmit,
        setValue,
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

    useEffect(() => {
        if (data && isEdit) {
            setValue('name', data.name, { shouldDirty: false });
            setValue('addressText', data.addressText ?? '', { shouldDirty: false });
            setValue('graphNodeId', data.graphNodeId, { shouldDirty: false });
            setValue('latitude', data.latitude ?? undefined, { shouldDirty: false });
            setValue('longitude', data.longitude ?? undefined, { shouldDirty: false });
        }
    }, [data, isEdit, setValue]);

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

    const onSubmit = async (values: LocationFormValues) => {
        const payload: LocationCreateRequest = {
            name: values.name,
            addressText: values.addressText || null,
            graphNodeId: values.graphNodeId,
            latitude: values.latitude ?? null,
            longitude: values.longitude ?? null,
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
                                {...register('addressText')}
                                error={Boolean(errors.addressText)}
                                helperText={errors.addressText?.message}
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
                            />
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

export default LocationFormPage;
