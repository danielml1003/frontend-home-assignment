import { useState, type FormEvent, useContext } from 'react';
import { Box, Paper, Typography, TextField, Button, Alert } from '@mui/material';
import api from '../api';
import { AuthContext } from '../AuthContext';

// Props for the component, including a callback for when login is successful
interface LoginPageProps {
  onLoginSuccess: (token: string, role: string) => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  // State for form inputs, loading status, and error messages
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);

  // Handles the form submission
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const resp = await api.post('/login', { username, password });
      const data = resp.data;
      if (!resp.status || !data.token) throw new Error(data.message || 'Failed to log in');
      login(data.token);
      onLoginSuccess(data.token, data.role);
    } catch (err) {
      setError((err as any)?.response?.data?.message || (err as Error).message || 'Network error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper sx={{ p: 4, width: 420 }} elevation={4}>
        <Typography variant="h5" align="center" gutterBottom>
          Admin Login
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth sx={{ mb: 2 }} required />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth sx={{ mb: 2 }} required />
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
