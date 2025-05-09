const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/tickets', require('./routes/tickets.routes'));
app.use('/api/users', require('./routes/users.routes'));

module.exports = app;