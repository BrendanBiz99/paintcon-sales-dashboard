const express = require('express');
const router = express.Router();
const {
  CAMPAIGN,
  REPS,
  DAILY_TREND,
  WEEKLY_TREND,
  PIPELINE,
  TODAY_KPIS,
  WEEK_KPIS,
  TOTAL_CLOSES,
  TOTAL_REVENUE,
  DAYS_REMAINING,
  PERCENT_COMPLETE,
  AVG_SPEED_TO_LEAD,
} = require('../data/mockData');

// GET /api/team — campaign overview
router.get('/', (req, res) => {
  res.json({
    ticketsSold: TOTAL_CLOSES,
    goal: CAMPAIGN.goal,
    campaignStartDate: CAMPAIGN.startDate,
    campaignEndDate: CAMPAIGN.endDate,
    pricePerTicket: CAMPAIGN.pricePerTicket,
    totalRevenue: TOTAL_REVENUE,
    avgSpeedToLead: parseFloat(AVG_SPEED_TO_LEAD),
    daysRemaining: DAYS_REMAINING,
    percentComplete: parseFloat(PERCENT_COMPLETE),
  });
});

// GET /api/team/kpis — aggregated team KPIs
router.get('/kpis', (req, res) => {
  const totals = REPS.reduce(
    (acc, rep) => {
      acc.totalDials += rep.allTime.dials;
      acc.totalContacts += rep.allTime.contacts;
      acc.totalConversations += rep.allTime.conversations;
      acc.totalCloses += rep.allTime.closes;
      return acc;
    },
    { totalDials: 0, totalContacts: 0, totalConversations: 0, totalCloses: 0 }
  );

  res.json({
    ...totals,
    totalRevenue: TOTAL_REVENUE,
  });
});

// GET /api/team/leaderboard — all reps with KPIs
router.get('/leaderboard', (req, res) => {
  const leaderboard = REPS.map((rep) => ({
    id: rep.id,
    name: rep.name,
    initials: rep.initials,
    email: rep.email,
    speedToLead: rep.speedToLead,
    dials: rep.allTime.dials,
    contacts: rep.allTime.contacts,
    conversations: rep.allTime.conversations,
    closes: rep.allTime.closes,
    revenue: rep.allTime.closes * CAMPAIGN.pricePerTicket,
    closeRate: ((rep.allTime.closes / rep.allTime.dials) * 100).toFixed(1),
  }));

  res.json(leaderboard);
});

// GET /api/team/sales-trend — daily and weekly trend data
router.get('/sales-trend', (req, res) => {
  res.json({
    daily: DAILY_TREND,
    weekly: WEEKLY_TREND,
  });
});

// GET /api/team/pipeline — pipeline stages
router.get('/pipeline', (req, res) => {
  res.json(PIPELINE);
});

module.exports = router;
