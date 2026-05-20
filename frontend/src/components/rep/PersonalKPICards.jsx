import KPICard from '../shared/KPICard';

const PHONE = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.9a16 16 0 0 0 6.29 6.29l1.06-1.06a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const USER = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const CHAT = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const TROPHY = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="8 7 4 7 4 4 20 4 20 7 16 7" /><line x1="12" y1="20" x2="12" y2="7" />
    <path d="M8 20h8" /><path d="M4 7c0 4.4 3.6 8 8 8s8-3.6 8-8" />
  </svg>
);

export default function PersonalKPICards({ kpis }) {
  if (!kpis) return null;
  const { today, thisWeek } = kpis;

  const cards = [
    {
      title: 'Dials Today',
      value: today.dials,
      subtitle: `This week: ${thisWeek.dials}`,
      icon: PHONE,
      accentColor: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Contacts Today',
      value: today.contacts,
      subtitle: `This week: ${thisWeek.contacts}`,
      icon: USER,
      accentColor: 'from-teal-500 to-emerald-500',
    },
    {
      title: 'Conversations Today',
      value: today.conversations,
      subtitle: `This week: ${thisWeek.conversations}`,
      icon: CHAT,
      accentColor: 'from-violet-500 to-purple-600',
    },
    {
      title: 'Closes Today',
      value: today.closes,
      subtitle: `This week: ${thisWeek.closes}`,
      icon: TROPHY,
      accentColor: 'from-emerald-500 to-green-500',
      trend: today.closes > 0 ? 'up' : 'neutral',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <KPICard key={card.title} {...card} />
      ))}
    </div>
  );
}
