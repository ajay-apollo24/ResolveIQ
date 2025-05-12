import React from 'react';
import Sidebar from './components/Sidebar';
import { Box } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import { AuthProvider } from './contexts/AuthContext';
const drawerWidth = 240;

function App() {
  return (
    <Router>
      <AuthProvider>
        <Box sx={{ display: 'flex' }}>
          <Sidebar />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              ml: `${drawerWidth}px`,
              px: 4, // left-right padding
              pt: 3,
              minHeight: '100vh',
              backgroundColor: '#fafafa',
            }}
          >
            <AppRoutes />
          </Box>
        </Box>
      </AuthProvider>
    </Router>
  );
}

export default App;