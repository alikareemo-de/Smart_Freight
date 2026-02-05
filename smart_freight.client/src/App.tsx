import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import RequireAuth from './components/RequireAuth';
import RequireRole from './components/RequireRole';
import DashboardPage from './pages/DashboardPage';
import DriverDetailsPage from './pages/DriverDetailsPage';
import DriverFormPage from './pages/DriverFormPage';
import DriversListPage from './pages/DriversListPage';
import GraphPage from './pages/GraphPage';
import LoginPage from './pages/LoginPage';
import LocationFormPage from './pages/LocationFormPage';
import LocationsListPage from './pages/LocationsListPage';
import NotAuthorizedPage from './pages/NotAuthorizedPage';
import NotFoundPage from './pages/NotFoundPage';
import ProductFormPage from './pages/ProductFormPage';
import ProductsListPage from './pages/ProductsListPage';
import ProductStockPage from './pages/ProductStockPage';
import TripDetailsPage from './pages/TripDetailsPage';
import TripFormPage from './pages/TripFormPage';
import TripRoutePage from './pages/TripRoutePage';
import TripsListPage from './pages/TripsListPage';
import TruckDetailsPage from './pages/TruckDetailsPage';
import TruckFormPage from './pages/TruckFormPage';
import TrucksListPage from './pages/TrucksListPage';

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
                    <Route path="trucks" element={<TrucksListPage />} />
                    <Route path="trucks/new" element={<TruckFormPage mode="create" />} />
                    <Route path="trucks/:id" element={<TruckDetailsPage />} />
                    <Route path="trucks/:id/edit" element={<TruckFormPage mode="edit" />} />
                    <Route path="products" element={<ProductsListPage />} />
                    <Route path="products/new" element={<ProductFormPage mode="create" />} />
                    <Route path="products/:id/edit" element={<ProductFormPage mode="edit" />} />
                    <Route path="products/:id/stock" element={<ProductStockPage />} />
                    <Route path="locations" element={<LocationsListPage />} />
                    <Route path="locations/new" element={<LocationFormPage mode="create" />} />
                    <Route path="locations/:id/edit" element={<LocationFormPage mode="edit" />} />
                    <Route path="graph" element={<GraphPage />} />
                    <Route path="trips/new" element={<TripFormPage />} />
                </Route>
                <Route path="trips" element={<TripsListPage />} />
                <Route path="trips/:id" element={<TripDetailsPage />} />
                <Route path="trips/:id/route" element={<TripRoutePage />} />
                <Route path="not-authorized" element={<NotAuthorizedPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    );
}

export default App;
