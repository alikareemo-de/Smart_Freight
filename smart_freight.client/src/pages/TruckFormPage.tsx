import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, FormControlLabel, Grid, Paper, Switch, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { z } from 'zod';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import PageHeader from '../components/PageHeader';
import { useCreateTruck, useTruck, useUpdateTruck } from '../hooks/trucks';
import type { TruckCreateRequest } from '../types/truck';

const truckSchema = z.object({
    name: z.string().min(1, 'Name is required.'),
    plateNumber: z.string().min(1, 'Plate number is required.'),
    maxPayloadKg: z.coerce.number().positive('Payload must be greater than 0.'),
    isActive: z.boolean(),
});

type TruckFormValues = z.infer<typeof truckSchema>;

type TruckFormPageProps = {
    mode: 'create' | 'edit';
};

const TruckFormPage = ({ mode }: TruckFormPageProps) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = mode === 'edit';
    const { data, isLoading, isError, refetch } = useTruck(isEdit ? id ?? '' : '');
    const createMutation = useCreateTruck();
    const updateMutation = useUpdateTruck(id ?? '');

    const {
        control,
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<TruckFormValues>({
        resolver: zodResolver(truckSchema),
        defaultValues: {
            name: '',
            plateNumber: '',
            maxPayloadKg: 0,
            isActive: true,
        },
    });

    if (isEdit && isLoading) {
        return <LoadingState message="Loading truck..." />;
    }

    if (isEdit && (isError || !data)) {
        return <ErrorState message="Unable to load truck." onRetry={refetch} />;
    }

    useEffect(() => {
        if (data && isEdit) {
            setValue('name', data.name, { shouldDirty: false });
            setValue('plateNumber', data.plateNumber, { shouldDirty: false });
            setValue('maxPayloadKg', data.maxPayloadKg, { shouldDirty: false });
            setValue('isActive', data.isActive, { shouldDirty: false });
        }
    }, [data, isEdit, setValue]);

    const onSubmit = async (values: TruckFormValues) => {
        const payload: TruckCreateRequest = {
            name: values.name,
            plateNumber: values.plateNumber,
            maxPayloadKg: values.maxPayloadKg,
            isActive: values.isActive,
        };
        try {
            if (isEdit && id) {
                await updateMutation.mutateAsync(payload);
                enqueueSnackbar('Truck updated.', { variant: 'success' });
                navigate(`/trucks/${id}`);
            } else {
                await createMutation.mutateAsync(payload);
                enqueueSnackbar('Truck created.', { variant: 'success' });
                navigate('/trucks');
            }
        } catch (error: any) {
            const message = error?.response?.data?.message ?? 'Unable to save truck.';
            enqueueSnackbar(message, { variant: 'error' });
        }
    };

    return (
        <Box>
            <PageHeader
                title={isEdit ? 'Edit Truck' : 'Create Truck'}
                subtitle="Maintain fleet configuration for trip planning."
            />
            <Paper variant="outlined" sx={{ p: 3 }}>
                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Truck Name"
                                fullWidth
                                {...register('name')}
                                error={Boolean(errors.name)}
                                helperText={errors.name?.message}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Plate Number"
                                fullWidth
                                {...register('plateNumber')}
                                error={Boolean(errors.plateNumber)}
                                helperText={errors.plateNumber?.message}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Max Payload (kg)"
                                fullWidth
                                type="number"
                                {...register('maxPayloadKg')}
                                error={Boolean(errors.maxPayloadKg)}
                                helperText={errors.maxPayloadKg?.message}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Controller
                                name="isActive"
                                control={control}
                                render={({ field }) => (
                                    <FormControlLabel
                                        control={<Switch checked={field.value} onChange={field.onChange} />}
                                        label="Active"
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box display="flex" gap={2}>
                                <Button type="submit" variant="contained" disabled={isSubmitting}>
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

export default TruckFormPage;
