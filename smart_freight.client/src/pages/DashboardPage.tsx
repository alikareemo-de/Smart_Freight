import { Grid, Paper, Typography } from '@mui/material';
import PageHeader from '../components/PageHeader';

const dashboardCards = [
    { label: 'Trips Today', value: '—' },
    { label: 'On-Time Delivery %', value: '—' },
    { label: 'Active Drivers', value: '—' },
    { label: 'Total Distance', value: '—' },
];

const DashboardPage = () => (
    <div>
        <PageHeader title="Dashboard" subtitle="Operational snapshot for dispatchers and admins." />
        <Grid container spacing={3}>
            {dashboardCards.map((card) => (
                <Grid item xs={12} sm={6} md={3} key={card.label}>
                    <Paper variant="outlined" sx={{ p: 3 }}>
                        <Typography variant="overline" color="text.secondary">
                            {card.label}
                        </Typography>
                        <Typography variant="h4" fontWeight={700}>
                            {card.value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Connect reports to show live metrics.
                        </Typography>
                    </Paper>
                </Grid>
            ))}
        </Grid>
    </div>
);

export default DashboardPage;
