import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AiosAppProvider } from './state/AiosAppContext';
import { AuthProvider } from './state/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <AiosAppProvider>
        <RouterProvider router={router} />
      </AiosAppProvider>
    </AuthProvider>
  );
}
