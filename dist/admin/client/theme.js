import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0d1117', // Dark sleek background
      paper: 'rgba(22, 27, 34, 0.7)', // Glassmorphism base
    },
    primary: {
      main: '#58a6ff', // Vibrant blue for primary actions
    },
    secondary: {
      main: '#8b949e', // Subdued secondary color
    },
    error: {
      main: '#f85149',
    },
    success: {
      main: '#2ea043',
    },
    text: {
      primary: '#c9d1d9',
      secondary: '#8b949e',
    }
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.5px',
      color: '#ffffff',
    },
    h6: {
      fontWeight: 500,
      color: '#ffffff',
    }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
          borderRadius: '12px',
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0d1117',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(13, 17, 23, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: 'none',
        }
      }
    }
  }
});

export default theme;
