import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#2AD368', // Vert vif de la charte
      light: '#CBED62', // Vert clair de la charte
      dark: '#052E1C',
    },
    secondary: {
      main: '#CBED62', // Vert clair de la charte
      light: '#CBED62',
      dark: '#052E1C',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#121A21',
      secondary: '#121A21',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
          background: '#FFFFFF',
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
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: '#052E1C',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#041E13',
          },
        },
      },
    },
  },
});