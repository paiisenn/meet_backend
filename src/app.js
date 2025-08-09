const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối DB
connectDB();

// Routes
app.get('/', (req, res) => {
    res.send('Meet backend is running...');
});
app.use('/api/auth', authRoutes);

module.exports = app;
