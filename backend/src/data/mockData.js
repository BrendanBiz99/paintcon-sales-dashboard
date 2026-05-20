// ─────────────────────────────────────────────────────────────────────────────
// PaintCon Sales Mock Data
// Campaign: 2025-12-01 → 2026-05-31  |  Goal: 1000 tickets @ $149
// ─────────────────────────────────────────────────────────────────────────────

const CAMPAIGN = {
  startDate: '2025-12-01',
  endDate: '2026-05-31',
  goal: 1000,
  pricePerTicket: 149,
};

// ── Reps ────────────────────────────────────────────────────────────────────
const REPS = [
  {
    id: 'rep1',
    name: 'Sarah Chen',
    initials: 'SC',
    email: 'sarah.chen@paintcon.com',
    allTime: { dials: 2847, contacts: 1142, conversations: 487, closes: 187 },
    speedToLead: 4.2,
  },
  {
    id: 'rep2',
    name: 'Marcus Johnson',
    initials: 'MJ',
    email: 'marcus.johnson@paintcon.com',
    allTime: { dials: 2531, contacts: 1018, conversations: 423, closes: 164 },
    speedToLead: 5.8,
  },
  {
    id: 'rep3',
    name: 'Emily Rodriguez',
    initials: 'ER',
    email: 'emily.rodriguez@paintcon.com',
    allTime: { dials: 3124, contacts: 1089, conversations: 389, closes: 142 },
    speedToLead: 3.1,
  },
  {
    id: 'rep4',
    name: 'David Kim',
    initials: 'DK',
    email: 'david.kim@paintcon.com',
    allTime: { dials: 2234, contacts: 867, conversations: 312, closes: 118 },
    speedToLead: 7.4,
  },
  {
    id: 'rep5',
    name: 'Jessica Taylor',
    initials: 'JT',
    email: 'jessica.taylor@paintcon.com',
    allTime: { dials: 1876, contacts: 623, conversations: 245, closes: 72 },
    speedToLead: 8.9,
  },
];

// Verify total closes = 683
// 187 + 164 + 142 + 118 + 72 = 683 ✓

// ── Daily Sales Trend (deterministic) ───────────────────────────────────────
function generateDailyTrend() {
  // Build date range 2025-12-01 to 2026-05-20 (141 days)
  const dates = [];
  const start = new Date('2025-12-01');
  const end = new Date('2026-05-20');
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().slice(0, 10));
  }

  // Base weights per period to create realistic ramp pattern
  // Dec: slow (weight 1), Jan-Feb: ramp (weight 1.8), Mar-Apr: peak (weight 2.2), May: dip (weight 1.5)
  const weights = dates.map((date) => {
    const month = parseInt(date.slice(5, 7));
    if (month === 12) return 1.0;
    if (month === 1 || month === 2) return 1.8;
    if (month === 3 || month === 4) return 2.2;
    return 1.5; // May
  });

  const weightSum = weights.reduce((a, b) => a + b, 0);
  const TARGET_TOTAL = 683;

  // Distribute 683 tickets proportionally, then use deterministic pseudo-random nudges
  // Use a simple seeded random based on date index to avoid variation
  const rawAllocations = weights.map((w) => (w / weightSum) * TARGET_TOTAL);

  // Floor everything and fix the remainder
  let floored = rawAllocations.map(Math.floor);
  let remainder = TARGET_TOTAL - floored.reduce((a, b) => a + b, 0);

  // Distribute remainder to highest-fractional entries deterministically
  const fractionals = rawAllocations
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);

  for (let k = 0; k < remainder; k++) {
    floored[fractionals[k].i] += 1;
  }

  // Build day objects with cumulative
  let cumulative = 0;
  const daily = dates.map((date, i) => {
    cumulative += floored[i];
    return { date, tickets: floored[i], cumulative };
  });

  return daily;
}

const DAILY_TREND = generateDailyTrend();

// Verify sum
const _totalCheck = DAILY_TREND.reduce((s, d) => s + d.tickets, 0);
if (_totalCheck !== 683) {
  throw new Error(`Daily trend sum mismatch: expected 683, got ${_totalCheck}`);
}

// ── Weekly rollup ────────────────────────────────────────────────────────────
function generateWeeklyTrend(daily) {
  const weeks = [];
  let weekBucket = [];
  let weekNum = 1;
  let cumulative = 0;

  daily.forEach((day, i) => {
    const dayOfWeek = new Date(day.date).getDay(); // 0=Sun
    weekBucket.push(day);

    const isLastDay = i === daily.length - 1;
    // End week on Saturday (6) or last day
    if (dayOfWeek === 6 || isLastDay) {
      const tickets = weekBucket.reduce((s, d) => s + d.tickets, 0);
      cumulative += tickets;
      weeks.push({
        week: weekNum++,
        startDate: weekBucket[0].date,
        endDate: weekBucket[weekBucket.length - 1].date,
        tickets,
        cumulative,
      });
      weekBucket = [];
    }
  });

  return weeks;
}

const WEEKLY_TREND = generateWeeklyTrend(DAILY_TREND);

// ── Per-rep daily trend (distribute proportionally) ──────────────────────────
function buildRepDailyTrend(repId) {
  const rep = REPS.find((r) => r.id === repId);
  const totalCloses = REPS.reduce((s, r) => s + r.allTime.closes, 0); // 683
  const repShare = rep.allTime.closes / totalCloses;

  // Distribute daily tickets proportionally to this rep's share
  let rawTotal = 0;
  const raw = DAILY_TREND.map((d) => {
    const v = d.tickets * repShare;
    return { date: d.date, raw: v };
  });

  const floored = raw.map((d) => ({ date: d.date, tickets: Math.floor(d.raw), frac: d.raw - Math.floor(d.raw) }));
  rawTotal = floored.reduce((s, d) => s + d.tickets, 0);
  let remainder = rep.allTime.closes - rawTotal;

  floored
    .map((d, i) => ({ i, frac: d.frac }))
    .sort((a, b) => b.frac - a.frac)
    .slice(0, remainder)
    .forEach(({ i }) => {
      floored[i].tickets += 1;
    });

  let cumulative = 0;
  return floored.map((d) => {
    cumulative += d.tickets;
    return { date: d.date, tickets: d.tickets, cumulative };
  });
}

// ── Pipeline ─────────────────────────────────────────────────────────────────
const PIPELINE = [
  { stage: 'Prospecting', count: 234, color: '#6366f1' },
  { stage: 'Contacted', count: 178, color: '#8b5cf6' },
  { stage: 'Conversation', count: 145, color: '#a78bfa' },
  { stage: 'Proposal', count: 89, color: '#06b6d4' },
  { stage: 'Negotiation', count: 56, color: '#10b981' },
  { stage: 'Closed Won', count: 683, color: '#34d399' },
  { stage: 'Closed Lost', count: 312, color: '#ef4444' },
];

// ── Today / This Week KPIs ───────────────────────────────────────────────────
// Today is 2026-05-20 (Wednesday)
const TODAY_KPIS = {
  rep1: { dials: 31, contacts: 12, conversations: 5, closes: 2 },
  rep2: { dials: 27, contacts: 10, conversations: 4, closes: 1 },
  rep3: { dials: 38, contacts: 13, conversations: 4, closes: 2 },
  rep4: { dials: 24, contacts: 9, conversations: 3, closes: 1 },
  rep5: { dials: 19, contacts: 6, conversations: 2, closes: 0 },
};

// This week (Mon-Wed) ~ 3.5x today
const WEEK_KPIS = {
  rep1: { dials: 109, contacts: 42, conversations: 18, closes: 7 },
  rep2: { dials: 95,  contacts: 35, conversations: 14, closes: 4 },
  rep3: { dials: 133, contacts: 46, conversations: 14, closes: 7 },
  rep4: { dials: 84,  contacts: 32, conversations: 11, closes: 4 },
  rep5: { dials: 67,  contacts: 21, conversations: 7,  closes: 0 },
};

const DAILY_TARGET = 5;

// ── Activity Feeds ────────────────────────────────────────────────────────────
const now = new Date('2026-05-20T17:00:00Z');

function minsAgo(m) { return new Date(now - m * 60 * 1000).toISOString(); }
function hoursAgo(h) { return new Date(now - h * 60 * 60 * 1000).toISOString(); }
function daysAgo(d, h = 10) { return new Date(now - (d * 24 - (24 - h)) * 60 * 60 * 1000).toISOString(); }

const ACTIVITIES = {
  rep1: [
    { id: 'a1-1', type: 'close', description: 'Closed 2 tickets – Riverside Painting Co.', timestamp: minsAgo(42) },
    { id: 'a1-2', type: 'conversation', description: 'Discovery call with Alpine Contractors', timestamp: hoursAgo(1.5) },
    { id: 'a1-3', type: 'contact', description: 'Reached Blue Ridge Renovations', timestamp: hoursAgo(3) },
    { id: 'a1-4', type: 'close', description: 'Closed 1 ticket – Summit Surfaces LLC', timestamp: daysAgo(1, 14) },
    { id: 'a1-5', type: 'meeting', description: 'Follow-up scheduled: Metro Paint Group', timestamp: daysAgo(1, 11) },
    { id: 'a1-6', type: 'conversation', description: 'Pitch call – Coastal Coat Masters', timestamp: daysAgo(1, 9) },
    { id: 'a1-7', type: 'contact', description: 'Connected with Harbor View Finishes', timestamp: daysAgo(2, 15) },
    { id: 'a1-8', type: 'close', description: 'Closed 2 tickets – Northstar Painting', timestamp: daysAgo(2, 13) },
    { id: 'a1-9', type: 'meeting', description: 'Demo booked: Pinnacle Pro Painters', timestamp: daysAgo(2, 10) },
  ],
  rep2: [
    { id: 'a2-1', type: 'close', description: 'Closed 1 ticket – Greenfield Interiors', timestamp: hoursAgo(2) },
    { id: 'a2-2', type: 'conversation', description: 'Negotiation call – Vantage Paint Works', timestamp: hoursAgo(4) },
    { id: 'a2-3', type: 'contact', description: 'First touch – Lakewood Coatings Inc.', timestamp: hoursAgo(5.5) },
    { id: 'a2-4', type: 'meeting', description: 'Strategy demo – Silver Creek Contractors', timestamp: daysAgo(1, 15) },
    { id: 'a2-5', type: 'close', description: 'Closed 1 ticket – Westpoint Decorators', timestamp: daysAgo(1, 13) },
    { id: 'a2-6', type: 'conversation', description: 'Qualification call – Horizon Brush Co.', timestamp: daysAgo(1, 10) },
    { id: 'a2-7', type: 'contact', description: 'Reconnected – Maple Ridge Finishes', timestamp: daysAgo(2, 16) },
    { id: 'a2-8', type: 'close', description: 'Closed 2 tickets – Clearview Coatings', timestamp: daysAgo(2, 12) },
  ],
  rep3: [
    { id: 'a3-1', type: 'close', description: 'Closed 2 tickets – Sundown Surfaces', timestamp: minsAgo(28) },
    { id: 'a3-2', type: 'contact', description: 'Connected – Pacific Edge Painting', timestamp: hoursAgo(1) },
    { id: 'a3-3', type: 'conversation', description: 'Intro call – Desert Bloom Contractors', timestamp: hoursAgo(2.5) },
    { id: 'a3-4', type: 'close', description: 'Closed 1 ticket – Valley Coat Masters', timestamp: daysAgo(1, 16) },
    { id: 'a3-5', type: 'meeting', description: 'Webinar follow-up – Mesa Painting Co.', timestamp: daysAgo(1, 14) },
    { id: 'a3-6', type: 'conversation', description: 'Pricing discussion – Cactus Brush LLC', timestamp: daysAgo(1, 11) },
    { id: 'a3-7', type: 'contact', description: 'Cold outreach – Sonoran Finishes', timestamp: daysAgo(2, 15) },
    { id: 'a3-8', type: 'close', description: 'Closed 3 tickets – Ironwood Painters', timestamp: daysAgo(2, 11) },
    { id: 'a3-9', type: 'meeting', description: 'Scheduled discovery – Red Rock Renovations', timestamp: daysAgo(2, 9) },
  ],
  rep4: [
    { id: 'a4-1', type: 'close', description: 'Closed 1 ticket – Sterling Coat Works', timestamp: hoursAgo(3) },
    { id: 'a4-2', type: 'conversation', description: 'Proposal review – Keystone Painters', timestamp: hoursAgo(4.5) },
    { id: 'a4-3', type: 'contact', description: 'New lead – Blueprint Surfaces Group', timestamp: hoursAgo(6) },
    { id: 'a4-4', type: 'meeting', description: 'Product demo – Capitol Finishing Co.', timestamp: daysAgo(1, 15) },
    { id: 'a4-5', type: 'close', description: 'Closed 1 ticket – Granite Peak Painting', timestamp: daysAgo(1, 12) },
    { id: 'a4-6', type: 'conversation', description: 'Objection handling – Ironclad Coatings', timestamp: daysAgo(1, 10) },
    { id: 'a4-7', type: 'contact', description: 'Outreach – Liberty Brush & Coat', timestamp: daysAgo(2, 16) },
    { id: 'a4-8', type: 'close', description: 'Closed 2 tickets – Apex Finish Pros', timestamp: daysAgo(2, 13) },
  ],
  rep5: [
    { id: 'a5-1', type: 'conversation', description: 'Discovery call – Bayside Renovators', timestamp: hoursAgo(1) },
    { id: 'a5-2', type: 'contact', description: 'First touch – Pebble Creek Painters', timestamp: hoursAgo(3) },
    { id: 'a5-3', type: 'conversation', description: 'Qualification – Tidal Wave Finishes', timestamp: hoursAgo(5) },
    { id: 'a5-4', type: 'meeting', description: 'Demo scheduled – Driftwood Décor Co.', timestamp: daysAgo(1, 16) },
    { id: 'a5-5', type: 'contact', description: 'Follow-up call – Sandbar Surfaces', timestamp: daysAgo(1, 13) },
    { id: 'a5-6', type: 'conversation', description: 'Price objection – Coral Coast Coating', timestamp: daysAgo(1, 11) },
    { id: 'a5-7', type: 'contact', description: 'Cold call – Seabreeze Painters LLC', timestamp: daysAgo(2, 15) },
    { id: 'a5-8', type: 'close', description: 'Closed 1 ticket – Harbor Light Finishes', timestamp: daysAgo(2, 12) },
  ],
};

// ── Derived / computed values ─────────────────────────────────────────────────
const TOTAL_CLOSES = REPS.reduce((s, r) => s + r.allTime.closes, 0); // 683
const TOTAL_REVENUE = TOTAL_CLOSES * CAMPAIGN.pricePerTicket; // 101767

const CAMPAIGN_START = new Date('2025-12-01');
const CAMPAIGN_END = new Date('2026-05-31');
const TODAY = new Date('2026-05-20');
const DAYS_REMAINING = Math.ceil((CAMPAIGN_END - TODAY) / (1000 * 60 * 60 * 24));
const PERCENT_COMPLETE = ((TOTAL_CLOSES / CAMPAIGN.goal) * 100).toFixed(1);

const AVG_SPEED_TO_LEAD = (
  REPS.reduce((s, r) => s + r.speedToLead, 0) / REPS.length
).toFixed(1);

module.exports = {
  CAMPAIGN,
  REPS,
  DAILY_TREND,
  WEEKLY_TREND,
  PIPELINE,
  TODAY_KPIS,
  WEEK_KPIS,
  DAILY_TARGET,
  ACTIVITIES,
  TOTAL_CLOSES,
  TOTAL_REVENUE,
  DAYS_REMAINING,
  PERCENT_COMPLETE,
  AVG_SPEED_TO_LEAD,
  buildRepDailyTrend,
};
