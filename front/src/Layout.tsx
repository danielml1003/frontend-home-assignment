import React from 'react';
import { Box, Drawer, List, ListItemButton, ListItemText, Toolbar, AppBar, Typography, Button } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const drawerWidth = 200;

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = React.useContext(AuthContext);
  const { logout } = React.useContext(AuthContext);
  const navigate = useNavigate();

  // If user is not admin, show only My Account navigation or hide drawer entirely
  const showDrawer = !!user && user.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Users</Typography>
          <Button variant="contained" color="secondary" onClick={handleLogout} sx={{ borderRadius: 2 }}>Log out</Button>
        </Toolbar>
      </AppBar>

      {showDrawer && (
          <Drawer
            variant="permanent"
            sx={{ width: drawerWidth, [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' } }}
            open
          >
            {/* keep links close to AppBar by reserving the AppBar height with Toolbar */}
            <Toolbar />
          <List>
            <ListItemButton component={RouterLink} to="/users">
              <ListItemText primary="Manage Users" />
            </ListItemButton>
            <ListItemButton component={RouterLink} to="/account">
              <ListItemText primary="My Account" />
            </ListItemButton>
          </List>
        </Drawer>
      )}

  {/* main area */}
  <Box component="main" sx={{ flexGrow: 1, p: 0, pl: 1, mr: '150px' }}>
      {/* reserve AppBar space so main content starts right under the bar */}
      <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
