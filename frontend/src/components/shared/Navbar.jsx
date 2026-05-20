import { useAuth } from '../../contexts/AuthContext';

export default function Navbar({ title }) {
  const { user, userRole, logout } = useAuth();

  const roleColor =
    userRole === 'owner'
      ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
      : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30';

  return (
    <nav className="sticky top-0 z-50 bg-surface-900/95 backdrop-blur border-b border-white/10">
      <div className="max-w-screen-2xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left: Logo + title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-bold text-white text-lg tracking-tight">PaintCon</span>
          </div>
          {title && (
            <>
              <div className="w-px h-5 bg-white/20" />
              <span className="text-slate-400 text-sm font-medium">{title}</span>
            </>
          )}
        </div>

        {/* Right: user info + logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-white text-sm font-medium leading-tight">
              {user?.displayName || user?.email?.split('@')[0] || user?.email}
            </span>
            <span className="text-slate-500 text-xs">{user?.email}</span>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${roleColor}`}>
            {userRole}
          </span>
          <button
            onClick={logout}
            className="ml-2 text-slate-400 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
