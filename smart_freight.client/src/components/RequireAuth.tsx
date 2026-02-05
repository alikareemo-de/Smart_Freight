import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
    const { auth } = useAuth();
    const location = useLocation();

    if (!auth?.token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default RequireAuth;
