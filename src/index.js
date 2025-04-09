require('dotenv').config();
const express = require('express');
const cors = require('cors');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes');
const promptRoutes = require('./routes/promptRoutes');
const growthRoutes = require('./routes/growthRoutes');
const buddyRoutes = require('./routes/buddyRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);
app.use('/api/prompts', promptRoutes);
app.use('/api/growth', growthRoutes);
app.use('/api/buddy', buddyRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'ZENTRAFUGE backend is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'An error occurred on the server',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`ZENTRAFUGE backend server running on port ${PORT}`);
});

module.exports = app; // For testing purposes
