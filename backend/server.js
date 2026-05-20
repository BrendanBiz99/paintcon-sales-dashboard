require('dotenv').config();
const express = require('express');
const cors = require('cors');

const teamRoutes = require('./src/routes/team');
const repsRoutes = require('./src/routes/reps');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GoHighLevel webhook mock
app.get('/api/webhooks/ghl', (req, res) => {
  console.log('[GHL Webhook]', new Date().toISOString(), req.query);
  res.json({ received: true });
});

app.post('/api/webhooks/ghl', (req, res) => {
  console.log('[GHL Webhook POST]', new Date().toISOString(), req.body);
  res.json({ received: true });
});

// Routes
app.use('/api/team', teamRoutes);
app.use('/api/reps', repsRoutes);

app.listen(PORT, () => {
  console.log(`PaintCon Sales Backend running on http://localhost:${PORT}`);
});
