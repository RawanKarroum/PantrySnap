// src/app/login/page.tsx
'use client';

import React from 'react';
import { Box, Button, Typography, createTheme, ThemeProvider } from '@mui/material';
import { Google } from '@mui/icons-material';
import { signInWithGoogle } from '../config/Firebase';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#00c853',
    },
    background: {
      default: 'transparent',
      paper: 'rgba(255, 255, 255, 0.9)',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '50px',
          textTransform: 'none',
          padding: '10px 20px',
        },
      },
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
    h5: {
      fontWeight: 'bolder',
    },
    body1: {
      fontSize: '1.2rem',
    },
  },
});

const Login: React.FC = () => {
  const router = useRouter();
  const { setUser } = useUser();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      setUser(result.user);
      router.push('/home'); // Redirect to home page after successful login
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundImage: 'url(/path/to/kitchen-image.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Box
          sx={{
            width: '400px',
            height: '200px',
            padding: 4,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: 'background.paper',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h5" className="pacifico-font" sx={{ mb: 2, color: 'text.primary' }}>
            Pantry Tracker
          </Typography>
          <Button
            variant="contained"
            startIcon={<Google sx={{ color: '#DB4437' }} />}
            onClick={handleGoogleLogin}
            sx={{
              backgroundColor: 'primary.main',
              color: '#fff',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            Login with Google
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
