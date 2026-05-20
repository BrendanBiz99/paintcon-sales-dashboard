import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import OwnerDashboard from './pages/OwnerDashboard';
import RepDashboard from './pages/RepDashboard';
import ProtectedRoute from './components/shared/ProtectedRoute';

function RootRedirect() {
  const { user, userRole, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (userRole === 'owner') return <Navigate to="/owner" replace />;
  if (userRole === 'rep') return <Navigate to="/rep" replace />;
  return <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/owner"
        element={
          <ProtectedRoute requiredRole="owner">
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rep"
        element={
          <ProtectedRoute requiredRole="rep">
            <RepDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
