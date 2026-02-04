import { zodResolver } from '@hookform/resolvers/zod';
import {
    Box,
    Button,
    Grid,
    IconButton,
    MenuItem,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import PageHeader from '../components/PageHeader';
import { useGraphNodes } from '../hooks/graph';
import { useLocations } from '../hooks/locations';
import { useProducts } from '../hooks/products';
import { useDrivers } from '../hooks/drivers';
import { useTrucks } from '../hooks/trucks';
import { usePlanTrip } from '../hooks/trips';
import type { TripPlanRequest } from '../types/trip';

const cargoSchema = z.object({
    productId: z.string().min(1, 'Product is required.'),
    quantity: z.coerce.number().int().positive('Quantity must be at least 1.'),
});

const tripSchema = z.object({
    truckId: z.string().min(1, 'Truck is required.'),
    driverId: z.string().min(1, 'Driver is required.'),
    startNodeId: z.string().min(1, 'Start node is required.'),
    cargoItems: z.array(cargoSchema).min(1, 'At least one cargo item is required.'),
    stopLocationIds: z.array(z.string().min(1)).min(1, 'At least one stop is required.'),
});

type TripFormValues = z.infer<typeof tripSchema>;

const TripFormPage = () => {
    const navigate = useNavigate();
    const planMutation = usePlanTrip();
    const { data: trucks, isLoading: trucksLoading, isError: trucksError, refetch: refetchTrucks } = useTrucks();
    const { data: drivers, isLoading: driversLoading, isError: driversError, refetch: refetchDrivers } = useDrivers();
    const { data: products, isLoading: productsLoading, isError: productsError, refetch: refetchProducts } = useProducts();
    const { data: locations, isLoading: locationsLoading, isError: locationsError, refetch: refetchLocations } = useLocations();
    const { data: nodes, isLoading: nodesLoading, isError: nodesError, refetch: refetchNodes } = useGraphNodes();

    const {
        control,
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
        watch,
        setValue,
    } = useForm<TripFormValues>({
        resolver: zodResolver(tripSchema),
        defaultValues: {
            truckId: '',
            driverId: '',
            startNodeId: '',
            cargoItems: [{ productId: '', quantity: 1 }],
            stopLocationIds: [],
        },
    });

    const { fields: cargoFields, append: appendCargo, remove: removeCargo } = useFieldArray({
        control,
        name: 'cargoItems',
    });

    const cargoItems = watch('cargoItems');
    const selectedStops = watch('stopLocationIds');

    const totalWeight = useMemo(() => {
        if (!products) return 0;
        return cargoItems.reduce((total, item) => {
            const product = products.find((p) => p.id === item.productId);
            if (!product) return total;
            return total + product.unitWeightKg * item.quantity;
        }, 0);
    }, [cargoItems, products]);

    if (trucksLoading || driversLoading || productsLoading || locationsLoading || nodesLoading) {
        return <LoadingState message="Loading trip dependencies..." />;
    }

    if (
        trucksError ||
        driversError ||
        productsError ||
        locationsError ||
        nodesError ||
        !trucks ||
        !drivers ||
        !products ||
        !locations ||
        !nodes
    ) {
        return (
            <ErrorState
                message="Unable to load trip dependencies."
                onRetry={() => {
                    refetchTrucks();
                    refetchDrivers();
                    refetchProducts();
                    refetchLocations();
                    refetchNodes();
                }}
            />
        );
    }

    const onSubmit = async (values: TripFormValues) => {
        const payload: TripPlanRequest = {
            truckId: values.truckId,
            driverId: values.driverId,
            startNodeId: values.startNodeId,
            cargoItems: values.cargoItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
            })),
            stopLocationIds: values.stopLocationIds,
        };
        try {
            const response = await planMutation.mutateAsync(payload);
            enqueueSnackbar(`Trip planned. Distance ${response.totalPlannedDistance.toFixed(2)} km.`, {
                variant: 'success',
            });
            navigate(`/trips/${response.tripId}`);
        } catch (error: any) {
            const message = error?.response?.data?.message ?? 'Unable to plan trip.';
            enqueueSnackbar(message, { variant: 'error' });
        }
    };

    const handleAddStop = (locationId: string) => {
        if (!locationId || selectedStops.includes(locationId)) {
            return;
        }
        setValue('stopLocationIds', [...selectedStops, locationId], { shouldDirty: true });
    };

    const handleRemoveStop = (locationId: string) => {
        setValue(
            'stopLocationIds',
            selectedStops.filter((id) => id !== locationId),
            { shouldDirty: true }
        );
    };

    return (
        <Box>
            <PageHeader
                title="Plan Trip"
                subtitle="Select truck, cargo, and delivery stops to compute the route."
            />
            <Paper variant="outlined" sx={{ p: 3 }}>
                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                label="Truck"
                                fullWidth
                                {...register('truckId')}
                                error={Boolean(errors.truckId)}
                                helperText={errors.truckId?.message}
                            >
                                {trucks.map((truck) => (
                                    <MenuItem key={truck.id} value={truck.id}>
                                        {truck.name} ({truck.plateNumber})
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                label="Driver"
                                fullWidth
                                {...register('driverId')}
                                error={Boolean(errors.driverId)}
                                helperText={errors.driverId?.message}
                            >
                                {drivers.map((driver) => (
                                    <MenuItem key={driver.id} value={driver.id}>
                                        {driver.firstName} {driver.lastName}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                label="Start Node"
                                fullWidth
                                {...register('startNodeId')}
                                error={Boolean(errors.startNodeId)}
                                helperText={errors.startNodeId?.message}
                            >
                                {nodes.map((node) => (
                                    <MenuItem key={node.id} value={node.id}>
                                        {node.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" fontWeight={600} mb={2}>
                                Cargo Items
                            </Typography>
                            <Stack spacing={2}>
                                {cargoFields.map((field, index) => (
                                    <Grid container spacing={2} key={field.id}>
                                        <Grid item xs={12} md={6}>
                                            <Controller
                                                name={`cargoItems.${index}.productId`}
                                                control={control}
                                                render={({ field: productField }) => (
                                                    <TextField
                                                        select
                                                        label="Product"
                                                        fullWidth
                                                        value={productField.value}
                                                        onChange={productField.onChange}
                                                        error={Boolean(errors.cargoItems?.[index]?.productId)}
                                                        helperText={errors.cargoItems?.[index]?.productId?.message}
                                                    >
                                                        {products.map((product) => (
                                                            <MenuItem key={product.id} value={product.id}>
                                                                {product.name} ({product.availableQuantity} available)
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={10} md={4}>
                                            <Controller
                                                name={`cargoItems.${index}.quantity`}
                                                control={control}
                                                render={({ field: qtyField }) => (
                                                    <TextField
                                                        label="Quantity"
                                                        type="number"
                                                        fullWidth
                                                        value={qtyField.value}
                                                        onChange={qtyField.onChange}
                                                        error={Boolean(errors.cargoItems?.[index]?.quantity)}
                                                        helperText={errors.cargoItems?.[index]?.quantity?.message}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={2} md={2} display="flex" alignItems="center">
                                            <IconButton color="error" onClick={() => removeCargo(index)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                ))}
                                <Button
                                    variant="outlined"
                                    startIcon={<AddCircleOutlineIcon />}
                                    onClick={() => appendCargo({ productId: '', quantity: 1 })}
                                >
                                    Add Cargo Item
                                </Button>
                                {errors.cargoItems?.message && (
                                    <Typography color="error">{errors.cargoItems.message}</Typography>
                                )}
                                <Typography variant="body2" color="text.secondary">
                                    Total payload weight: {totalWeight.toFixed(2)} kg
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" fontWeight={600} mb={2}>
                                Delivery Stops
                            </Typography>
                            <Stack spacing={2}>
                                <TextField
                                    select
                                    label="Add Stop"
                                    fullWidth
                                    value=""
                                    onChange={(event) => handleAddStop(event.target.value)}
                                >
                                    {locations.map((location) => (
                                        <MenuItem key={location.id} value={location.id}>
                                            {location.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                {selectedStops.length === 0 && (
                                    <Typography variant="body2" color="text.secondary">
                                        No stops added yet.
                                    </Typography>
                                )}
                                {selectedStops.map((locationId, index) => {
                                    const location = locations.find((item) => item.id === locationId);
                                    return (
                                        <Paper key={locationId} variant="outlined" sx={{ p: 2 }}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Box>
                                                    <Typography fontWeight={600}>
                                                        Stop {index + 1}: {location?.name ?? 'Unknown'}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {location?.addressText ?? 'No address'}
                                                    </Typography>
                                                </Box>
                                                <IconButton color="error" onClick={() => handleRemoveStop(locationId)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Stack>
                                        </Paper>
                                    );
                                })}
                                {errors.stopLocationIds?.message && (
                                    <Typography color="error">{errors.stopLocationIds.message}</Typography>
                                )}
                            </Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <Stack direction="row" spacing={2}>
                                <Button type="submit" variant="contained" disabled={isSubmitting}>
                                    {isSubmitting ? 'Planning...' : 'Plan Trip'}
                                </Button>
                                <Button variant="outlined" onClick={() => navigate('/trips')}>
                                    Cancel
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
};

export default TripFormPage;
