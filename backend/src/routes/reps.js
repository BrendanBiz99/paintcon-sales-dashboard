const express = require('express');
const router = express.Router();
const {
  REPS,
  TODAY_KPIS,
  WEEK_KPIS,
  ACTIVITIES,
  DAILY_TARGET,
  CAMPAIGN,
  buildRepDailyTrend,
} = require('../data/mockData');

// GET /api/reps — list all reps
router.get('/', (req, res) => {
  const list = REPS.map((rep) => ({
    id: rep.id,
    name: rep.name,
    initials: rep.initials,
    email: rep.email,
  }));
  res.json(list);
});

// GET /api/reps/:id/kpis
router.get('/:id/kpis', (req, res) => {
  const rep = REPS.find((r) => r.id === req.params.id);
  if (!rep) return res.status(404).json({ error: 'Rep not found' });

  const today = TODAY_KPIS[rep.id] || { dials: 0, contacts: 0, conversations: 0, closes: 0 };
  const thisWeek = WEEK_KPIS[rep.id] || { dials: 0, contacts: 0, conversations: 0, closes: 0 };

  res.json({
    today,
    thisWeek,
    allTime: rep.allTime,
    speedToLead: rep.speedToLead,
    dailyTarget: DAILY_TARGET,
    dailyProgress: today.closes,
    revenue: rep.allTime.closes * CAMPAIGN.pricePerTicket,
  });
});

// GET /api/reps/:id/sales-trend
router.get('/:id/sales-trend', (req, res) => {
  const rep = REPS.find((r) => r.id === req.params.id);
  if (!rep) return res.status(404).json({ error: 'Rep not found' });

  const trend = buildRepDailyTrend(rep.id);
  // Return last 30 days
  res.json(trend.slice(-30));
});

// GET /api/reps/:id/activities
router.get('/:id/activities', (req, res) => {
  const rep = REPS.find((r) => r.id === req.params.id);
  if (!rep) return res.status(404).json({ error: 'Rep not found' });

  res.json(ACTIVITIES[rep.id] || []);
});

module.exports = router;
