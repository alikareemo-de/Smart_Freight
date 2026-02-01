import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate();
    return (
        <Box textAlign="center" py={10}>
            <Typography variant="h4" fontWeight={700}>
                Page not found
            </Typography>
            <Typography variant="body1" color="text.secondary" mt={2}>
                The page you are looking for does not exist.
            </Typography>
            <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate('/dashboard')}>
                Back to dashboard
            </Button>
        </Box>
    );
};

export default NotFoundPage;
