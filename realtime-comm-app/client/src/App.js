import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RoomProvider } from './context/RoomContext';
import { ToastProvider } from './context/ToastContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Room from './pages/Room';
import NotFound from './pages/NotFound';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();

  if (!token) {
    // Room link save karo login ke baad redirect ke liye
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/room/')) {
      sessionStorage.setItem('redirectAfterLogin', currentPath);
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};
function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/room/:roomId"
        element={
          <PrivateRoute>
            <Room />
          </PrivateRoute>
        }
      />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RoomProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ToastProvider>
      </RoomProvider>
    </AuthProvider>
  );
}
