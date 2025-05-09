import React from 'react';
import Sidebar from './components/Sidebar';
import { Box } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <AppRoutes />
        </Box>
      </Box>
    </Router>
  );
}

export default App;