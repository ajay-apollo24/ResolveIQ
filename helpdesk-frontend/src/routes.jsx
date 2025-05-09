import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import TicketList from './components/TicketList';
import TicketDetail from './components/TicketDetail';
import Analytics from './components/Analytics';
import Settings from './components/Settings';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/tickets" element={<TicketList />} />
      <Route path="/tickets/:ticketId" element={<TicketDetail />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
};

export default AppRoutes;