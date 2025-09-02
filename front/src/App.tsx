import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Container } from '@mui/material';
import { LoginPage } from './pages/Login';
import { UsersPage } from './pages/Users';
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Routes>
        <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
        <Route
          path="/users"
          element={token ? <UsersPage onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to={token ? '/users' : '/login'} />} />
      </Routes>
    </Container>
  );
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
