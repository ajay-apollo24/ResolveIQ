// src/api.js
import axios from 'axios';

const API_BASE = 'http://localhost:5780/api';

// --- Auth ---
export const login = async (email, password) =>
  axios.post(`${API_BASE}/auth/login`, { email, password });

// --- Tickets ---
export const fetchTickets = (token) =>
  axios.get(`${API_BASE}/tickets`, authHeader(token));

export const fetchTicketById = (id, token) =>
  axios.get(`${API_BASE}/tickets/${id}`, authHeader(token));

export const createTicket = (data, token) =>
  axios.post(`${API_BASE}/tickets`, data, authHeader(token));

export const updateTicket = (id, data, token) =>
  axios.put(`${API_BASE}/tickets/${id}`, data, authHeader(token));

export const deleteTicket = (id, token) =>
  axios.delete(`${API_BASE}/tickets/${id}`, authHeader(token));

// --- Agents ---
export const fetchAgents = (token) =>
  axios.get(`${API_BASE}/agents`, authHeader(token));

export const fetchAgentByUserId = (userId, token) =>
  axios.get(`${API_BASE}/agents/by-user/${userId}`, authHeader(token));

// --- Groups ---
export const fetchGroups = (token) =>
  axios.get(`${API_BASE}/groups`, authHeader(token));

// --- Ticket Types ---
export const fetchTicketTypes = (token) =>
  axios.get(`${API_BASE}/ticketTypes`, authHeader(token));

// --- Classifications ---
export const fetchClassifications = (token) =>
  axios.get(`${API_BASE}/classifications`, authHeader(token));

// --- Users ---
export const fetchUsers = (token) =>
  axios.get(`${API_BASE}/users`, authHeader(token));

// --- SLAs ---
export const fetchSLAs = (token) =>
  axios.get(`${API_BASE}/slas`, authHeader(token));

// --- Stages ---
export const fetchStages = (token) =>
  axios.get(`${API_BASE}/stages`, authHeader(token));

// --- Utility ---
const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});