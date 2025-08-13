// src/theme.js
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2', // blue
    },
    secondary: {
      main: '#ff4081', // pink
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#bbbbbb',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 500,
      letterSpacing: '0.5px',
    },
    h5: {
      fontWeight: 400,
    },
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: '#1976d2',
        },
        thumb: {
          width: 16,
          height: 16,
        },
        track: {
          height: 6,
        },
      },
    },
  },
})

export default theme
