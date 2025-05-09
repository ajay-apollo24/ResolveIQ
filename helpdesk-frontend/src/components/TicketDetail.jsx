import React from 'react';
import { Box, Typography, Button, Chip, TextField, Divider, Stack } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const TicketDetail = () => {
  const { ticketId } = useParams();
  const ticket = useSelector(state => state.tickets.list.find(t => t.id.toString() === ticketId));

  if (!ticket) {
    return <Typography>Ticket not found.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5">{ticket.subject} (#{ticket.id})</Typography>
      <Chip label={ticket.status} color="primary" sx={{ mt: 1 }} />
      <Divider sx={{ my: 2 }} />

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Button variant="contained">Reply</Button>
        <Button variant="outlined">Add Note</Button>
        <Button variant="outlined">Forward</Button>
        <Button variant="outlined" color="error">Close</Button>
        <Button variant="outlined">Merge</Button>
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6">Conversation / Notes</Typography>
          {ticket.notes?.map((note, index) => (
            <Box key={index} sx={{ my: 2, p: 2, bgcolor: note.type === 'private' ? '#f5f5f5' : '#e8f5e9' }}>
              <Typography>{note.text}</Typography>
              <Typography variant="caption" color="textSecondary">{note.time}</Typography>
            </Box>
          ))}
          <TextField fullWidth multiline rows={3} label="Add a new note..." variant="outlined" sx={{ mt: 2 }} />
        </Box>

        <Box sx={{ minWidth: 280 }}>
          <Typography variant="h6">Properties</Typography>
          <Typography><strong>Priority:</strong> {ticket.priority}</Typography>
          <Typography><strong>Status:</strong> {ticket.status}</Typography>
          <Typography><strong>Group:</strong> {ticket.group}</Typography>
          <Typography><strong>Due By:</strong> {ticket.due || 'N/A'}</Typography>
          <Typography><strong>Tags:</strong> {ticket.tags?.join(', ') || 'None'}</Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6">Contact</Typography>
          <Typography><strong>Name:</strong> {ticket.customer}</Typography>
          <Typography><strong>Email:</strong> {ticket.email || 'N/A'}</Typography>
          <Typography><strong>Phone:</strong> {ticket.phone || 'N/A'}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TicketDetail;