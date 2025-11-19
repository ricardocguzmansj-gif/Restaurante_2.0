
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { KdsPage } from './pages/KdsPage';
import { LoginPage } from './pages/LoginPage';
import { MenuPage } from './pages/MenuPage';
import { OrdersPage } from './pages/OrdersPage';
import { CustomersPage } from './pages/CustomersPage';
import { CouponsPage } from './pages/CouponsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { useAppContext } from './contexts/AppContext';
import { UserRole } from './types';
import { NAVIGATION_ITEMS } from './constants';
import { FloorPlanPage } from './pages/FloorPlanPage';
import { InventoryPage } from './pages/InventoryPage';
import { CustomerPortalPage } from './pages/CustomerPortalPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles: UserRole[] }> = ({ children, allowedRoles }) => {
  const { user } = useAppContext();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.rol)) {
    const fallbackUrl = NAVIGATION_ITEMS.find(item => item.roles.includes(user.rol))?.href || '/';
    return <Navigate to={fallbackUrl} replace />;
  }

  return <>{children}</>;
};

const AdminApp: React.FC = () => {
  const { user } = useAppContext();

  if (!user) {
    return <LoginPage />;
  }
  
  const userHomePage = NAVIGATION_ITEMS.find(item => item.roles.includes(user.rol))?.href || '/';

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to={userHomePage} replace />} />
        <Route path="dashboard" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.GERENTE]}><DashboardPage /></ProtectedRoute>} />
        <Route path="pedidos" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.GERENTE, UserRole.MOZO, UserRole.REPARTO]}><OrdersPage /></ProtectedRoute>} />
        <Route path="salon" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.GERENTE, UserRole.MOZO]}><FloorPlanPage /></ProtectedRoute>} />
        <Route path="gic" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.GERENTE, UserRole.COCINA]}><KdsPage /></ProtectedRoute>} />
        <Route path="menu" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.GERENTE]}><MenuPage /></ProtectedRoute>} />
        <Route path="inventario" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.GERENTE]}><InventoryPage /></ProtectedRoute>} />
        <Route path="clientes" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.GERENTE, UserRole.MOZO]}><CustomersPage /></ProtectedRoute>} />
        <Route path="cupones" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.GERENTE]}><CouponsPage /></ProtectedRoute>} />
        <Route path="reportes" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.GERENTE]}><ReportsPage /></ProtectedRoute>} />
        <Route path="configuracion" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]}><SettingsPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to={userHomePage} replace />} />
      </Route>
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/portal/:restaurantId" element={<CustomerPortalPage />} />
        <Route path="/*" element={<AdminApp />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
