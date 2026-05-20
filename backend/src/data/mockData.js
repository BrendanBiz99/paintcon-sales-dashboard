// ─────────────────────────────────────────────────────────────────────────────
// PaintCon Sales Mock Data
// ─────────────────────────────────────────────────────────────────────────────

const campaign = {
  name: "PaintCon 2025",
  goal: 1000,
  startDate: "2025-06-01",
  endDate: "2025-11-30",
};

const ticketTiers = [
  { id: "ga",        name: "General Admission" },
  { id: "vip",       name: "VIP" },
  { id: "ceo",       name: "CEO" },
  { id: "super_ceo", name: "Super CEO" },
];

const reps = [
  {
    id: "brendan",
    name: "Brendan Whiting",
    email: "brendan@paintcon.com",
    role: "manager",
    initials: "BW",
    dials: 0,
    contacts: 0,
    conversations: 0,
    closes: 0,
    revenue: 0,
    speedToLead: 0,
    tickets: [],
  },
  {
    id: "lucas",
    name: "Lucas Jensen",
    email: "lucas@paintcon.com",
    role: "owner",
    initials: "LJ",
    dials: 0,
    contacts: 0,
    conversations: 0,
    closes: 0,
    revenue: 0,
    speedToLead: 0,
    tickets: [],
  },
  {
    id: "malcolm",
    name: "Malcolm McDonald",
    email: "malcolm@paintcon.com",
    role: "rep",
    initials: "MM",
    dials: 0,
    contacts: 0,
    conversations: 0,
    closes: 0,
    revenue: 0,
    speedToLead: 0,
    tickets: [],
  },
];

const ticketSales = [];

module.exports = { campaign, ticketTiers, reps, ticketSales };
