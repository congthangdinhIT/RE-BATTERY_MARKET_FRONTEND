import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from '../config/routes';
import { AppLayout } from '../components/layout/AppLayout';
import { MarketplacePage } from '../pages/MarketplacePage';
import { BatteryPacksPage } from '../pages/BatteryPacksPage';
import { SmartMatchingPage } from '../pages/SmartMatchingPage';
import { PassportDetailsPage } from '../pages/PassportDetailsPage';
import { EscrowPage } from '../pages/EscrowPage';
import { BessProjectsPage } from '../pages/BessProjectsPage';
import { DashboardPage } from '../pages/DashboardPage';
import { EprCompliancePage } from '../pages/EprCompliancePage';
import { PublicTracePage } from '../pages/PublicTracePage';
import { LoginPage } from '../pages/LoginPage';

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />
  },
  {
    path: ROUTES.PUBLIC_TRACE,
    element: <PublicTracePage />
  },
  {
    path: ROUTES.HOME,
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to={ROUTES.MARKETPLACE} replace /> },
      { path: ROUTES.MARKETPLACE,    element: <MarketplacePage /> },
      { path: ROUTES.BATTERY_PACKS,  element: <BatteryPacksPage /> },
      { path: ROUTES.SMART_MATCHING, element: <SmartMatchingPage /> },
      { path: ROUTES.PASSPORTS,      element: <PassportDetailsPage /> },
      { path: ROUTES.ESCROW,         element: <EscrowPage /> },
      { path: ROUTES.BESS_PROJECTS,  element: <BessProjectsPage /> },
      { path: ROUTES.DASHBOARD,      element: <DashboardPage /> },
      { path: ROUTES.EPR_COMPLIANCE, element: <EprCompliancePage /> },
    ]
  }
]);
