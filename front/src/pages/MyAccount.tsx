import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { AuthContext } from '../AuthContext';

export default function MyAccount() {
  const { user } = React.useContext(AuthContext);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', minHeight: '60vh' }}>
      <Paper sx={{ p: 3, width: '100%', maxWidth: 1000, textAlign: 'left' }} elevation={3}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>Username: {user?.username ?? '—'}</Typography>
        <Typography variant="h5">Role: {user?.role ?? '—'}</Typography>
      </Paper>
    </Box>
  );
}
