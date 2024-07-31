import React from 'react';
import { Avatar, Box, Drawer, List, ListItem, ListItemText, Toolbar, Typography, Button } from '@mui/material';
import Link from 'next/link';

const drawerWidth = 240;

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
  ];

  const handleSignOut = () => {
    // Handle sign out logic here
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
          <Avatar sx={{ width: 56, height: 56, mb: 2 }} />
          <Typography variant="h6">User Name</Typography>
        </Box>
      </Toolbar>
      <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem button key={item.text}>
              <Link href={item.path} passHref>
                <ListItemText primary={item.text} />
              </Link>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ p: 2 }}>
        <Link href="/sign-up" passHref>
          <Button variant="contained" color="primary" fullWidth>
            Sign Up
          </Button>
        </Link>
        <Button variant="contained" color="secondary" fullWidth onClick={handleSignOut} sx={{ mt: 1 }}>
          Sign Out
        </Button>
      </Box>
    </Drawer>
  );
};

export default Navbar;
