import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotAuthorizedPage = () => {
    const navigate = useNavigate();
    return (
        <Box textAlign="center" py={10}>
            <Typography variant="h4" fontWeight={700}>
                Not authorized
            </Typography>
            <Typography variant="body1" color="text.secondary" mt={2}>
                You do not have access to this page. Please contact your administrator.
            </Typography>
            <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate('/dashboard')}>
                Go back
            </Button>
        </Box>
    );
};

export default NotAuthorizedPage;
