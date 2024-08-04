import React from 'react';
import { Box, Drawer, List, ListItem, ListItemText, Button, createTheme, ThemeProvider, Paper } from '@mui/material';
import Link from 'next/link';
import { green, brown, red, grey } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: green[700], // Earthy green
    },
    secondary: {
      main: brown[500], // Earthy brown
    },
    error: {
      main: red[500], // Red for sign out button
    },
    background: {
      default: 'transparent', // Transparent background
    },
    text: {
      primary: grey[900], // Dark text
      secondary: grey[600], // Grey text
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: 18, // Increased the font size
  },
});

const Navbar: React.FC = () => {
  const menuItems = [
    { text: 'Home', path: '/' },
    { text: 'Pantry Item List', path: '/pantry-item-list' },
    { text: 'Add Pantry Item', path: '/add-pantry-item' },
    { text: 'Image Scanner', path: '/image-scanner' },
    { text: 'Shopping List', path: '/shopping-list' },
    { text: 'Add Shopping List Item', path: '/add-shopping-list-item' },
    { text: 'Category List', path: '/category-list' },
    { text: 'Add Category', path: '/add-category' },
    { text: 'Generate Recipes', path: '/recipe' }
  ];

  const handleSignOut = () => {
    // Handle sign out logic here
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          padding: '16px 0', // Adjust top and bottom padding
          boxSizing: 'border-box',
        }}
      >
        <Drawer
          variant="permanent"
          sx={{
            width: { xs: '90vw', sm: '60vw', md: '300px' },
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: { xs: '90vw', sm: '60vw', md: '300px' },
              boxSizing: 'border-box',
              color: theme.palette.text.primary,
              borderRight: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingTop: '16px',
              paddingBottom: '16px',
              borderRadius: '16px',
              height: 'calc(100% - 32px)',
              marginTop: '16px',
              marginBottom: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(5px)',
            },
          }}
        >
          <Box sx={{ overflow: 'auto', flexGrow: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 2 }}>
            <List sx={{ width: '100%', padding: 0 }}>
              {menuItems.map((item) => (
                <Paper elevation={2} sx={{ mb: 2, borderRadius: '10px', width: '90%', mx: 'auto' }} key={item.text}>
                  <ListItem button component={Link} href={item.path} sx={{ color: theme.palette.text.primary, justifyContent: 'center', textAlign: 'center' }}>
                    <ListItemText primary={item.text} sx={{ textAlign: 'center' }} className="merienda-font" disableTypography={true}/>
                  </ListItem>
                </Paper>
              ))}
            </List>
          </Box>
          <Box sx={{ p: 2, width: '80%', mt: 'auto' }}>
            <Button variant="contained" color="error" fullWidth onClick={handleSignOut} className="merienda-font" >
              SIGN OUT
            </Button>
          </Box>
        </Drawer>
      </Box>
    </ThemeProvider>
  );
};

export default Navbar;
