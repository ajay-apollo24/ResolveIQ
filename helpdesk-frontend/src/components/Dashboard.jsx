import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { fetchTickets } from '../api';

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const res = await fetchTickets(token);
        const assigned = res.data.filter(ticket => ticket.agentId === user.id);
        setTickets(assigned);
      } catch (err) {
        console.error('Error loading tickets', err);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, [token, user.id]);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>My Assigned Tickets</h2>
      {loading ? (
        <p>Loading...</p>
      ) : tickets.length === 0 ? (
        <p>No tickets assigned.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Status</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket._id}>
                <td>{ticket.subject}</td>
                <td>{ticket.status}</td>
                <td>{ticket.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;