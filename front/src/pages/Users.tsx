import { useState, useEffect, type FormEvent, useContext } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import api from '../api';
import { AuthContext } from '../AuthContext';

interface User {
  uuid: string;
  username: string;
  role: 'user' | 'admin';
}

export function UsersPage({ onLogout }: { onLogout: () => void }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { token } = useContext(AuthContext);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await api.get('/users');
      setUsers(resp.data || []);
    } catch (err) {
      setError((err as any)?.response?.data?.message || (err as Error).message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const loadCurrent = async () => {
    try {
      const resp = await api.get('/users/me');
      setCurrentUser(resp.data);
    } catch (err) {
      setNotification((err as any)?.response?.data?.message || (err as Error).message || 'Failed to fetch current user');
    }
  };

  useEffect(() => {
    load();
    loadCurrent();
  }, [token]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/users/${deleteTarget.uuid}`);
      setNotification('User deleted');
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setNotification((err as any)?.response?.data?.message || (err as Error).message || 'Failed to delete');
      setDeleteTarget(null);
    }
  };

  return (
    <Box>
  <Paper sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">User Management</Typography>
        <Box>
          <Button variant="outlined" sx={{ mr: 2 }} onClick={() => setCreateOpen(true)} startIcon={<AddIcon />}>Create New User</Button>
          <Button variant="contained" color="secondary" onClick={onLogout}>Logout</Button>
        </Box>
      </Paper>

      {notification && <Alert severity="info" onClose={() => setNotification(null)} sx={{ mb: 2 }}>{notification}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <TableContainer component={Paper} sx={{ overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>UUID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => {
                const isSelf = currentUser?.uuid === u.uuid;
                return (
                  <TableRow key={u.uuid} hover>
                    <TableCell sx={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.uuid}</TableCell>
                    <TableCell>{u.username}</TableCell>
                    <TableCell>{u.role}</TableCell>
                    <TableCell align="center">
                      {!isSelf && (
                        <IconButton color="error" onClick={() => setDeleteTarget(u)}>
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <CreateUserDialog open={createOpen} onClose={() => setCreateOpen(false)} onCreated={async () => { setCreateOpen(false); await load(); setNotification('User created'); }} />

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete "{deleteTarget?.username}"? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function CreateUserDialog({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void; }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e?: FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const resp = await api.post('/users', { username, password, role });
      // backend returns created user
      if (resp.status === 201) {
        onCreated();
      } else {
        setError('Failed to create user');
      }
    } catch (err) {
      setError((err as any)?.response?.data?.message || (err as Error).message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Create New User</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
        <Box component="form" onSubmit={submit} sx={{ mt: 1 }}>
          <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth sx={{ mb: 2 }} required />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth sx={{ mb: 2 }} required />
          <Select value={role} onChange={(e) => setRole(e.target.value as any)} fullWidth>
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button disabled={loading} onClick={submit} variant="contained">{loading ? 'Creating...' : 'Create User'}</Button>
      </DialogActions>
    </Dialog>
  );
}

