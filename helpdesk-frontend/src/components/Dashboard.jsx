import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { fetchTickets, fetchAgentByUserId } from '../api';

const Dashboard = () => {
  const { user, token, agentId } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTickets = async () => {
      
      try {
        const res = await fetchTickets(token);
        console.log('Logged in user ID:', user.id);
        console.log('User ID type:', typeof user.id);
        console.log('All tickets:', res.data.map(t => ({ 
          id: t._id, 
          agentId: t.agentId,
          agentIdType: typeof t.agentId,
          agentIdString: t.agentId ? t.agentId.toString() : 'null'
        })));
        
        const assigned = res.data.filter(ticket => {
          console.log('Checking ticket:', {
            ticketId: ticket._id,
            ticketAgentId: ticket.agentId,
            userAgentId: user.id,
            isMatch: ticket.agentId && ticket.agentId.toString() === user.id
          });
          return ticket.agentId && ticket.agentId.toString() === agentId;
        });
        
        console.log('Filtered assigned tickets:', assigned);
        setTickets(assigned);
      } catch (err) {
        console.error('Error loading tickets', err);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, [token, user.id, agentId]);

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