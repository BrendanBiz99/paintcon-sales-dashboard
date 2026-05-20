const express = require('express');
const router = express.Router();
const { campaign, ticketTiers, reps, ticketSales } = require('../data/mockData');

// Combine module-level ticketSales with per-rep tickets arrays
function allSales() {
  const perRep = reps.flatMap((r) => r.tickets.map((t) => ({ ...t, repId: r.id })));
  return [...ticketSales, ...perRep];
}

function totalRevenue(sales) {
  return sales.reduce((s, t) => s + (t.amount || t.revenue || 0), 0);
}

function salesByDate(sales) {
  const byDate = {};
  for (const s of sales) {
    const date = (s.date || s.timestamp || '').slice(0, 10);
    if (date) byDate[date] = (byDate[date] || 0) + 1;
  }
  const dates = Object.keys(byDate).sort();
  let cumulative = 0;
  return dates.map((date) => {
    cumulative += byDate[date];
    return { date, tickets: byDate[date], cumulative };
  });
}

function weeklyRollup(daily) {
  if (!daily.length) return [];
  const weeks = [];
  let bucket = [];
  let weekNum = 1;
  let cumulative = 0;
  daily.forEach((day, i) => {
    const dow = new Date(day.date).getDay();
    bucket.push(day);
    if (dow === 6 || i === daily.length - 1) {
      const tickets = bucket.reduce((s, d) => s + d.tickets, 0);
      cumulative += tickets;
      weeks.push({
        week: weekNum++,
        startDate: bucket[0].date,
        endDate: bucket[bucket.length - 1].date,
        tickets,
        cumulative,
      });
      bucket = [];
    }
  });
  return weeks;
}

const campaignEnd = new Date(campaign.endDate);
const today = new Date();
const daysRemaining = Math.max(0, Math.ceil((campaignEnd - today) / (1000 * 60 * 60 * 24)));

// GET /api/team — campaign overview
router.get('/', (req, res) => {
  const sales = allSales();
  const ticketsSold = reps.reduce((s, r) => s + r.closes, 0) + ticketSales.length;
  const revenue = reps.reduce((s, r) => s + r.revenue, 0) + totalRevenue(ticketSales);
  const percentComplete = ((ticketsSold / campaign.goal) * 100).toFixed(1);

  const speedReps = reps.filter((r) => r.speedToLead > 0);
  const avgSpeedToLead = speedReps.length
    ? (speedReps.reduce((s, r) => s + r.speedToLead, 0) / speedReps.length).toFixed(1)
    : '0.0';

  res.json({
    ticketsSold,
    goal: campaign.goal,
    campaignName: campaign.name,
    campaignStartDate: campaign.startDate,
    campaignEndDate: campaign.endDate,
    totalRevenue: revenue,
    avgSpeedToLead: parseFloat(avgSpeedToLead),
    daysRemaining,
    percentComplete: parseFloat(percentComplete),
    ticketTiers,
  });
});

// GET /api/team/kpis — aggregated team KPIs
router.get('/kpis', (req, res) => {
  const totals = reps.reduce(
    (acc, r) => {
      acc.totalDials         += r.dials;
      acc.totalContacts      += r.contacts;
      acc.totalConversations += r.conversations;
      acc.totalCloses        += r.closes;
      acc.totalRevenue       += r.revenue;
      return acc;
    },
    { totalDials: 0, totalContacts: 0, totalConversations: 0, totalCloses: 0, totalRevenue: 0 }
  );
  totals.totalCloses  += ticketSales.length;
  totals.totalRevenue += totalRevenue(ticketSales);
  res.json(totals);
});

// GET /api/team/leaderboard — all reps with KPIs
router.get('/leaderboard', (req, res) => {
  const leaderboard = reps.map((r) => ({
    id:            r.id,
    name:          r.name,
    initials:      r.initials,
    email:         r.email,
    role:          r.role,
    speedToLead:   r.speedToLead,
    dials:         r.dials,
    contacts:      r.contacts,
    conversations: r.conversations,
    closes:        r.closes,
    revenue:       r.revenue,
    closeRate:     r.dials > 0 ? ((r.closes / r.dials) * 100).toFixed(1) : '0.0',
  }));
  res.json(leaderboard);
});

// GET /api/team/sales-trend — daily and weekly breakdowns
router.get('/sales-trend', (req, res) => {
  const daily  = salesByDate(allSales());
  const weekly = weeklyRollup(daily);
  res.json({ daily, weekly });
});

// GET /api/team/pipeline — pipeline stages
router.get('/pipeline', (req, res) => {
  const pipeline = [
    { stage: 'Prospecting',  count: 0, color: '#6366f1' },
    { stage: 'Contacted',    count: 0, color: '#8b5cf6' },
    { stage: 'Conversation', count: 0, color: '#a78bfa' },
    { stage: 'Proposal',     count: 0, color: '#06b6d4' },
    { stage: 'Negotiation',  count: 0, color: '#10b981' },
    { stage: 'Closed Won',   count: reps.reduce((s, r) => s + r.closes, 0) + ticketSales.length, color: '#34d399' },
    { stage: 'Closed Lost',  count: 0, color: '#ef4444' },
  ];
  res.json(pipeline);
});

module.exports = router;
