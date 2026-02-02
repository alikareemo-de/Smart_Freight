import { zodResolver } from '@hookform/resolvers/zod';
import {
    Box,
    Button,
    Divider,
    Grid,
    MenuItem,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { z } from 'zod';
import DataTable from '../components/DataTable';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import PageHeader from '../components/PageHeader';
import { useCreateGraphEdge, useCreateGraphNode, useGraphEdges, useGraphNodes } from '../hooks/graph';

const nodeSchema = z.object({
    name: z.string().min(1, 'Name is required.'),
    latitude: z.coerce.number().optional(),
    longitude: z.coerce.number().optional(),
});

const edgeSchema = z.object({
    fromNodeId: z.string().min(1, 'From node is required.'),
    toNodeId: z.string().min(1, 'To node is required.'),
    weight: z.coerce.number().positive('Weight must be greater than 0.'),
    isBidirectional: z.boolean(),
});

type NodeFormValues = z.infer<typeof nodeSchema>;
type EdgeFormValues = z.infer<typeof edgeSchema>;

const GraphPage = () => {
    const { data: nodes, isLoading: nodesLoading, isError: nodesError, refetch: refetchNodes } = useGraphNodes();
    const { data: edges, isLoading: edgesLoading, isError: edgesError, refetch: refetchEdges } = useGraphEdges();
    const createNodeMutation = useCreateGraphNode();
    const createEdgeMutation = useCreateGraphEdge();

    const nodeForm = useForm<NodeFormValues>({
        resolver: zodResolver(nodeSchema),
        defaultValues: {
            name: '',
            latitude: undefined,
            longitude: undefined,
        },
    });

    const edgeForm = useForm<EdgeFormValues>({
        resolver: zodResolver(edgeSchema),
        defaultValues: {
            fromNodeId: '',
            toNodeId: '',
            weight: 1,
            isBidirectional: true,
        },
    });

    if (nodesLoading || edgesLoading) {
        return <LoadingState message="Loading graph data..." />;
    }

    if (nodesError || edgesError || !nodes || !edges) {
        return <ErrorState message="Unable to load graph data." onRetry={() => {
            refetchNodes();
            refetchEdges();
        }} />;
    }

    const handleNodeSubmit = async (values: NodeFormValues) => {
        try {
            await createNodeMutation.mutateAsync({
                name: values.name,
                latitude: values.latitude ?? null,
                longitude: values.longitude ?? null,
            });
            enqueueSnackbar('Graph node created.', { variant: 'success' });
            nodeForm.reset({ name: '', latitude: undefined, longitude: undefined });
        } catch (error: any) {
            const message = error?.response?.data?.message ?? 'Unable to create node.';
            enqueueSnackbar(message, { variant: 'error' });
        }
    };

    const handleEdgeSubmit = async (values: EdgeFormValues) => {
        if (values.fromNodeId === values.toNodeId) {
            enqueueSnackbar('From and To nodes must be different.', { variant: 'error' });
            return;
        }
        try {
            await createEdgeMutation.mutateAsync({
                fromNodeId: values.fromNodeId,
                toNodeId: values.toNodeId,
                weight: values.weight,
                isBidirectional: values.isBidirectional,
            });
            enqueueSnackbar('Graph edge created.', { variant: 'success' });
            edgeForm.reset({ fromNodeId: '', toNodeId: '', weight: 1, isBidirectional: true });
        } catch (error: any) {
            const message = error?.response?.data?.message ?? 'Unable to create edge.';
            enqueueSnackbar(message, { variant: 'error' });
        }
    };

    return (
        <Box>
            <PageHeader
                title="Routing Graph"
                subtitle="Define graph nodes and weighted edges for Dijkstra routing."
            />
            <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                    <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" fontWeight={600} mb={2}>
                            Create Node
                        </Typography>
                        <Box component="form" onSubmit={nodeForm.handleSubmit(handleNodeSubmit)}>
                            <Stack spacing={2}>
                                <TextField
                                    label="Node Name"
                                    fullWidth
                                    {...nodeForm.register('name')}
                                    error={Boolean(nodeForm.formState.errors.name)}
                                    helperText={nodeForm.formState.errors.name?.message}
                                />
                                <TextField
                                    label="Latitude"
                                    fullWidth
                                    type="number"
                                    {...nodeForm.register('latitude')}
                                />
                                <TextField
                                    label="Longitude"
                                    fullWidth
                                    type="number"
                                    {...nodeForm.register('longitude')}
                                />
                                <Button type="submit" variant="contained" disabled={nodeForm.formState.isSubmitting}>
                                    {nodeForm.formState.isSubmitting ? 'Saving...' : 'Add Node'}
                                </Button>
                            </Stack>
                        </Box>
                    </Paper>
                    <Paper variant="outlined" sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight={600} mb={2}>
                            Create Edge
                        </Typography>
                        <Box component="form" onSubmit={edgeForm.handleSubmit(handleEdgeSubmit)}>
                            <Stack spacing={2}>
                                <TextField
                                    select
                                    label="From Node"
                                    fullWidth
                                    {...edgeForm.register('fromNodeId')}
                                    error={Boolean(edgeForm.formState.errors.fromNodeId)}
                                    helperText={edgeForm.formState.errors.fromNodeId?.message}
                                >
                                    {nodes.map((node) => (
                                        <MenuItem key={node.id} value={node.id}>
                                            {node.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    select
                                    label="To Node"
                                    fullWidth
                                    {...edgeForm.register('toNodeId')}
                                    error={Boolean(edgeForm.formState.errors.toNodeId)}
                                    helperText={edgeForm.formState.errors.toNodeId?.message}
                                >
                                    {nodes.map((node) => (
                                        <MenuItem key={node.id} value={node.id}>
                                            {node.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    label="Weight"
                                    fullWidth
                                    type="number"
                                    {...edgeForm.register('weight')}
                                    error={Boolean(edgeForm.formState.errors.weight)}
                                    helperText={edgeForm.formState.errors.weight?.message}
                                />
                                <Controller
                                    name="isBidirectional"
                                    control={edgeForm.control}
                                    render={({ field }) => (
                                        <TextField select label="Bidirectional" fullWidth value={field.value} onChange={field.onChange}>
                                            <MenuItem value={true}>Yes</MenuItem>
                                            <MenuItem value={false}>No</MenuItem>
                                        </TextField>
                                    )}
                                />
                                <Button type="submit" variant="contained" disabled={edgeForm.formState.isSubmitting}>
                                    {edgeForm.formState.isSubmitting ? 'Saving...' : 'Add Edge'}
                                </Button>
                            </Stack>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={7}>
                    <Paper variant="outlined" sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight={600} mb={2}>
                            Nodes
                        </Typography>
                        <DataTable
                            rows={nodes}
                            columns={[
                                { header: 'Name', render: (node) => node.name },
                                { header: 'Latitude', render: (node) => node.latitude ?? '—' },
                                { header: 'Longitude', render: (node) => node.longitude ?? '—' },
                            ]}
                        />
                        <Divider sx={{ my: 3 }} />
                        <Typography variant="h6" fontWeight={600} mb={2}>
                            Edges
                        </Typography>
                        <DataTable
                            rows={edges}
                            columns={[
                                { header: 'From', render: (edge) => edge.fromNodeId },
                                { header: 'To', render: (edge) => edge.toNodeId },
                                { header: 'Weight', render: (edge) => edge.weight },
                                { header: 'Bidirectional', render: (edge) => (edge.isBidirectional ? 'Yes' : 'No') },
                            ]}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default GraphPage;
