import { createContext, useState, useEffect } from 'react';
import { fetchAgentByUserId } from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [agentId, setAgentId] = useState(() => localStorage.getItem('agentId'));

  const getAndSetAgentId = async (userId, token) => {
    try {
      const res = await fetchAgentByUserId(userId, token);
      setAgentId(res.data._id);
      localStorage.setItem('agentId', res.data._id);
    } catch {
      setAgentId(null);
      localStorage.removeItem('agentId');
    }
  };

  useEffect(() => {
    if (user && user.id && token) {
      getAndSetAgentId(user.id, token);
    }
  }, [user, token]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
    getAndSetAgentId(userData.id, authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAgentId(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, token, agentId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};