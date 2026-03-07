const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const destinationRoutes = require('./routes/destinationRoutes');
const tripRoutes = require('./routes/tripRoutes');
const itineraryRoutes = require('./routes/itineraryRoutes');
const historyRoutes = require('./routes/historyRoutes');
const adminRoutes = require('./routes/adminRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ ok: true });
});

app.use((err, req, res, next) => {
  console.error('SERVER ERROR STACK:', err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

module.exports = app;
