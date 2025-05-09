import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [
    { id: 4005080, subject: 'Delivery delay', customer: 'Sangeeta Prasad', priority: 'Medium', status: 'Open' },
    { id: 4002389, subject: 'Cancel the order', customer: 'Bhanu', priority: 'Medium', status: 'Open' }
  ],
  selectedTicket: null
};

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    selectTicket: (state, action) => {
      state.selectedTicket = state.list.find(t => t.id === action.payload);
    }
  }
});

export const { selectTicket } = ticketsSlice.actions;
export default ticketsSlice.reducer;