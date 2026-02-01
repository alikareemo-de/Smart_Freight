import { zodResolver } from '@hookform/resolvers/zod';
import {
    Box,
    Button,
    FormControlLabel,
    Grid,
    Paper,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { z } from 'zod';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import PageHeader from '../components/PageHeader';
import { useCreateDriver, useDriver, useUpdateDriver } from '../hooks/drivers';
import type { DriverCreateRequest } from '../types/driver';

const driverSchema = z.object({
    firstName: z.string().min(1, 'First name is required.'),
    lastName: z.string().min(1, 'Last name is required.'),
    email: z.string().email().optional().or(z.literal('')),
    phoneNumber: z.string().optional().or(z.literal('')),
    licenseNumber: z.string().optional().or(z.literal('')),
    isActive: z.boolean(),
});

type DriverFormValues = z.infer<typeof driverSchema>;

type DriverFormPageProps = {
    mode: 'create' | 'edit';
};

const DriverFormPage = ({ mode }: DriverFormPageProps) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = mode === 'edit';
    const { data, isLoading, isError, refetch } = useDriver(isEdit ? id ?? '' : '');
    const createMutation = useCreateDriver();
    const updateMutation = useUpdateDriver(id ?? '');

    const {
        register,
        control,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<DriverFormValues>({
        resolver: zodResolver(driverSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            licenseNumber: '',
            isActive: true,
        },
    });

    useEffect(() => {
        if (data && isEdit) {
            setValue('firstName', data.firstName);
            setValue('lastName', data.lastName);
            setValue('email', data.email ?? '');
            setValue('phoneNumber', data.phoneNumber ?? '');
            setValue('licenseNumber', data.licenseNumber ?? '');
            setValue('isActive', data.isActive);
        }
    }, [data, isEdit, setValue]);

    const onSubmit = async (values: DriverFormValues) => {
        const payload: DriverCreateRequest = {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email || null,
            phoneNumber: values.phoneNumber || null,
            licenseNumber: values.licenseNumber || null,
            isActive: values.isActive,
        };

        try {
            if (isEdit && id) {
                await updateMutation.mutateAsync(payload);
                enqueueSnackbar('Driver updated.', { variant: 'success' });
                navigate(`/drivers/${id}`);
            } else {
                await createMutation.mutateAsync(payload);
                enqueueSnackbar('Driver created.', { variant: 'success' });
                navigate('/drivers');
            }
        } catch (error: any) {
            const message = error?.response?.data?.message ?? 'Unable to save driver.';
            enqueueSnackbar(message, { variant: 'error' });
        }
    };

    if (isEdit && isLoading) {
        return <LoadingState message="Loading driver..." />;
    }

    if (isEdit && (isError || !data)) {
        return <ErrorState message="Unable to load driver." onRetry={refetch} />;
    }

    return (
        <Box>
            <PageHeader
                title={isEdit ? 'Edit Driver' : 'Create Driver'}
                subtitle="Keep driver profiles up to date for dispatch operations."
            />
            <Paper variant="outlined" sx={{ p: 3 }}>
                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="First Name"
                                fullWidth
                                {...register('firstName')}
                                error={Boolean(errors.firstName)}
                                helperText={errors.firstName?.message}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Last Name"
                                fullWidth
                                {...register('lastName')}
                                error={Boolean(errors.lastName)}
                                helperText={errors.lastName?.message}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Email"
                                fullWidth
                                {...register('email')}
                                error={Boolean(errors.email)}
                                helperText={errors.email?.message}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Phone"
                                fullWidth
                                {...register('phoneNumber')}
                                error={Boolean(errors.phoneNumber)}
                                helperText={errors.phoneNumber?.message}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="License Number"
                                fullWidth
                                {...register('licenseNumber')}
                                error={Boolean(errors.licenseNumber)}
                                helperText={errors.licenseNumber?.message}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box display="flex" alignItems="center" height="100%">
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
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box display="flex" gap={2} flexWrap="wrap">
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
            <Box mt={2}>
                <Typography variant="caption" color="text.secondary">
                    Ensure contact information is accurate for delivery coordination.
                </Typography>
            </Box>
        </Box>
    );
};

export default DriverFormPage;
