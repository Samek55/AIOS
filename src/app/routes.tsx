import { createBrowserRouter } from 'react-router';
import { RequireAdmin, RequireAuth, RequireVendor } from './components/RouteGuards';
import Layout from './components/Layout';
import AdminConsole from './pages/AdminConsole';
import Dashboard from './pages/AIOSDashboard';
import Login from './pages/Login';
import Marketplace from './pages/AIOSMarketplace';
import AIAssistant from './pages/AIOSAssistant';
import Health from './pages/AIOSHealth';
import Routine from './pages/AIOSRoutine';
import Finance from './pages/AIOSFinance';
import Social from './pages/Social';
import AccountPage from './pages/AccountPage';
import VendorPortal from './pages/VendorPortal';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    Component: RequireAuth,
    children: [
      {
        path: '/',
        Component: Layout,
        children: [
          { index: true, Component: Dashboard },
          { path: 'marketplace', Component: Marketplace },
          { path: 'ai-assistant', Component: AIAssistant },
          { path: 'health', Component: Health },
          { path: 'routine', Component: Routine },
          { path: 'finance', Component: Finance },
          { path: 'social', Component: Social },
          { path: 'profile', Component: AccountPage },
          {
            Component: RequireAdmin,
            children: [{ path: 'admin', Component: AdminConsole }],
          },
          {
            Component: RequireVendor,
            children: [{ path: 'vendor', Component: VendorPortal }],
          },
        ],
      },
    ],
  },
]);
