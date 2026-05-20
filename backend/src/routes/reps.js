const express = require('express');
const router = express.Router();
const { reps, campaign } = require('../data/mockData');

// GET /api/reps — list all reps
router.get('/', (req, res) => {
  res.json(
    reps.map((r) => ({ id: r.id, name: r.name, initials: r.initials, email: r.email, role: r.role }))
  );
});

// GET /api/reps/:id/kpis
router.get('/:id/kpis', (req, res) => {
  const rep = reps.find((r) => r.id === req.params.id);
  if (!rep) return res.status(404).json({ error: 'Rep not found' });

  const todayStr   = new Date().toISOString().slice(0, 10);
  const weekStart  = (() => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay() + 1); // Monday
    return d.toISOString().slice(0, 10);
  })();

  const todayTickets  = rep.tickets.filter((t) => (t.date || '').slice(0, 10) === todayStr).length;
  const weekTickets   = rep.tickets.filter((t) => (t.date || '').slice(0, 10) >= weekStart).length;

  res.json({
    allTime: {
      dials:         rep.dials,
      contacts:      rep.contacts,
      conversations: rep.conversations,
      closes:        rep.closes,
      revenue:       rep.revenue,
    },
    today:    { closes: todayTickets },
    thisWeek: { closes: weekTickets  },
    speedToLead:   rep.speedToLead,
    dailyTarget:   5,
    dailyProgress: todayTickets,
    role:          rep.role,
  });
});

// GET /api/reps/:id/sales-trend — last 30 days from rep.tickets
router.get('/:id/sales-trend', (req, res) => {
  const rep = reps.find((r) => r.id === req.params.id);
  if (!rep) return res.status(404).json({ error: 'Rep not found' });

  if (!rep.tickets.length) return res.json([]);

  const byDate = {};
  for (const t of rep.tickets) {
    const date = (t.date || '').slice(0, 10);
    if (date) byDate[date] = (byDate[date] || 0) + 1;
  }
  const dates = Object.keys(byDate).sort().slice(-30);
  let cumulative = 0;
  const trend = dates.map((date) => {
    cumulative += byDate[date];
    return { date, tickets: byDate[date], cumulative };
  });
  res.json(trend);
});

// GET /api/reps/:id/activities — recent ticket activity from rep.tickets
router.get('/:id/activities', (req, res) => {
  const rep = reps.find((r) => r.id === req.params.id);
  if (!rep) return res.status(404).json({ error: 'Rep not found' });

  const activities = rep.tickets
    .slice()
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 20)
    .map((t, i) => ({
      id:          t.id || `${rep.id}-${i}`,
      type:        'close',
      description: `Sold ${t.tierId || 'ticket'} to ${t.contact || 'a contact'}`,
      timestamp:   t.date || t.timestamp || new Date().toISOString(),
      amount:      t.amount || t.revenue || 0,
    }));

  res.json(activities);
});

module.exports = router;
