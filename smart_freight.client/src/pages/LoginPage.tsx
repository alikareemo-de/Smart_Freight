import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
    const { login } = useAuth();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    });

    const onSubmit = async (values: LoginFormValues) => {
        setErrorMessage(null);
        try {
            await login(values.email, values.password);
        } catch (error: any) {
            const message =
                error?.response?.data?.message ?? 'Unable to sign in. Check your credentials and try again.';
            setErrorMessage(message);
        }
    };

    return (
        <Box minHeight="100vh" display="flex" alignItems="center" bgcolor="grey.100">
            <Container maxWidth="sm">
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Box mb={3}>
                        <Typography variant="h4" fontWeight={700}>
                            Welcome back
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Sign in to manage routes, drivers, and deliveries.
                        </Typography>
                    </Box>
                    {errorMessage && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {errorMessage}
                        </Alert>
                    )}
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} display="grid" gap={2}>
                        <TextField
                            label="Email"
                            fullWidth
                            {...register('email')}
                            error={Boolean(errors.email)}
                            helperText={errors.email?.message}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            {...register('password')}
                            error={Boolean(errors.password)}
                            helperText={errors.password?.message}
                        />
                        <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
                            {isSubmitting ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </Box>
                    <Box mt={3}>
                        <Typography variant="caption" color="text.secondary">
                            Use the seeded admin credentials to get started.
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default LoginPage;
