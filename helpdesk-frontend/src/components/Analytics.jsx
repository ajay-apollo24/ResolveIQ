import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';

const Analytics = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Analytics Dashboard</Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Tickets</Typography>
              <Typography variant="h4">126</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Open Tickets</Typography>
              <Typography variant="h4">48</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">SLA Breaches</Typography>
              <Typography variant="h4" color="error">5</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Avg. Response Time</Typography>
              <Typography variant="h4">2h 15m</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Tickets by Status (Bar Chart Placeholder)</Typography>
        <Box sx={{ bgcolor: '#f5f5f5', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography>Bar Chart Here</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Analytics;