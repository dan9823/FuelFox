require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const mealsRoutes = require('./routes/meals');
const waterRoutes = require('./routes/water');
const fastingRoutes = require('./routes/fasting');
const challengesRoutes = require('./routes/challenges');
const mealPlanRoutes = require('./routes/mealPlan');
const analyzeRoutes = require('./routes/analyze');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/meals', mealsRoutes);
app.use('/api/water', waterRoutes);
app.use('/api/fasting', fastingRoutes);
app.use('/api/challenges', challengesRoutes);
app.use('/api/meal-plan', mealPlanRoutes);
app.use('/api/analyze', analyzeRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`FuelFox server running on port ${PORT}`);
});

module.exports = app;
