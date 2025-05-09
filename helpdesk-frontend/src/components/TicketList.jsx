import React from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { selectTicket } from '../slices/ticketsSlice';
import { useNavigate } from 'react-router-dom';

const TicketList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const rows = useSelector(state => state.tickets.list);

  const handleView = (id) => {
    dispatch(selectTicket(id));
    navigate(`/tickets/${id}`);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'subject', headerName: 'Subject', width: 300 },
    { field: 'customer', headerName: 'Customer', width: 180 },
    { field: 'priority', headerName: 'Priority', width: 120,
      renderCell: (params) => (
        <Chip label={params.value} color={params.value === 'High' ? 'error' : 'primary'} size="small" />
      )
    },
    { field: 'status', headerName: 'Status', width: 120 },
    {
      field: 'action',
      headerName: 'Action',
      width: 130,
      renderCell: (params) => (
        <Button variant="outlined" size="small" onClick={() => handleView(params.row.id)}>View</Button>
      )
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Tickets</Typography>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default TicketList;