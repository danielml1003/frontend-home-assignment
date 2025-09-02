import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    background: { default: '#f6f8fb', paper: '#ffffff' },
    primary: { main: '#4051b5' },
    error: { main: '#dc3545' },
  },
  typography: {
    fontFamily: 'Alef, Arial, sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;
