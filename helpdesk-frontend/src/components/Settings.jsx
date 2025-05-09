import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';

const Settings = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Settings</Typography>

      <List>
        <ListItem button>
          <ListItemText primary="Teams / Groups" />
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemText primary="Roles & Permissions" />
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemText primary="SLA Policies" />
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemText primary="Ticket Categories" />
        </ListItem>
      </List>
    </Box>
  );
};

export default Settings;