import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2AD368', // Vert vif de la charte
      light: '#CBED62', // Vert clair de la charte
      dark: '#052E1C', // Vert foncé de la charte
    },
    secondary: {
      main: '#CBED62', // Vert clair comme couleur secondaire
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#121A21', // Gris foncé de la charte
      secondary: '#121A21',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#FFFFFF',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
          borderRadius: 16,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: '#FFFFFF',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#FFFFFF',
          color: '#121A21',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: '#052E1C',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#041E13',
          },
        },
        outlinedPrimary: {
          borderColor: '#2AD368',
          color: '#2AD368',
        },
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "Chillax", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#121A21',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#121A21',
    },
    h6: {
      color: '#2AD368',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 16,
  },
});

export default theme;
