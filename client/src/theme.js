import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0d9488', // Modern teal
      dark: '#0b8276',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2dd4bf', // Accent teal
      dark: '#26a69a',
    },
    background: {
      default: '#f5f3e7', // Soft beige
      paper: '#ffffff',
    },
    text: {
      primary: '#2d3748', // Dark gray
      secondary: '#4b5563',
    },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h2: {
      fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      fontWeight: 800,
    },
    h4: {
      fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      fontWeight: 700,
    },
    h5: {
      fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      fontWeight: 700,
    },
    body1: {
      fontSize: '1.125rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            width: 0,
            height: '2px',
            bottom: '-2px',
            left: 0,
            backgroundColor: '#0b8276',
            transition: 'width 0.3s ease',
          },
          '&:hover::after': {
            width: '100%',
          },
          '&:focus': {
            outline: 'none',
            boxShadow: '0 0 0 3px rgba(13, 148, 136, 0.3)',
            borderRadius: '2px',
          },
        },
      },
    },
  },
});

export default theme;