import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import RequireAuth from './components/RequireAuth';
import RequireRole from './components/RequireRole';
import DashboardPage from './pages/DashboardPage';
import DriverDetailsPage from './pages/DriverDetailsPage';
import DriverFormPage from './pages/DriverFormPage';
import DriversListPage from './pages/DriversListPage';
import LoginPage from './pages/LoginPage';
import NotAuthorizedPage from './pages/NotAuthorizedPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
                path="/"
                element={
                    <RequireAuth>
                        <AppLayout />
                    </RequireAuth>
                }
            >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route element={<RequireRole allowedRoles={['Admin', 'Dispatcher']} />}>
                    <Route path="drivers" element={<DriversListPage />} />
                    <Route path="drivers/new" element={<DriverFormPage mode="create" />} />
                    <Route path="drivers/:id" element={<DriverDetailsPage />} />
                    <Route path="drivers/:id/edit" element={<DriverFormPage mode="edit" />} />
                </Route>
                <Route path="not-authorized" element={<NotAuthorizedPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    );
}

export default App;
