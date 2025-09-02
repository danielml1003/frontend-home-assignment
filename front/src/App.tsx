import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { LoginPage } from './pages/Login';
import { UsersPage } from './pages/Users';
import MyAccount from './pages/MyAccount';
import Layout from './Layout';
import theme from './theme';
import { AuthProvider, AuthContext } from './AuthContext';

function AppRoutes() {
  const { token, logout } = useContext(AuthContext);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLoginSuccess = (token: string, role: string) => {
    if (role !== 'admin') return;
    login(token);
    navigate('/users');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ width: '100%', py: 4, px: 2 }}>
      <Routes>
        <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />

        {/* Protected routes */}
        <Route
          path="/*"
          element={token ? (
            <Layout>
              <Routes>
                <Route path="account" element={<MyAccount />} />
                <Route path="users" element={<AdminRoute onLogout={handleLogout} />} />
                <Route path="" element={<Navigate to="/account" />} />
              </Routes>
            </Layout>
          ) : (
            <Navigate to="/login" />
          )}
        />

      </Routes>
  </Box>
  );
}

function AdminRoute({ onLogout }: { onLogout: () => void }) {
  const { user } = useContext(AuthContext);
  if (user?.role !== 'admin') return <Navigate to="/account" />;
  return <UsersPage onLogout={onLogout} />;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
