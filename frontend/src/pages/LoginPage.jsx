import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, isFirebaseConfigured } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const DEMO_CREDS = [
  { label: 'Owner', email: 'owner@paintcon.com', password: 'demo1234' },
  { label: 'Rep — Sarah Chen', email: 'sarah.chen@paintcon.com', password: 'demo1234' },
  { label: 'Rep — Marcus Johnson', email: 'marcus.johnson@paintcon.com', password: 'demo1234' },
  { label: 'Rep — Emily Rodriguez', email: 'emily.rodriguez@paintcon.com', password: 'demo1234' },
  { label: 'Rep — David Kim', email: 'david.kim@paintcon.com', password: 'demo1234' },
  { label: 'Rep — Jessica Taylor', email: 'jessica.taylor@paintcon.com', password: 'demo1234' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { demoSignIn, isDemoMode, userRole, user } = useAuth();

  // Redirect if already logged in
  if (user) {
    if (userRole === 'owner') navigate('/owner', { replace: true });
    else if (userRole === 'rep') navigate('/rep', { replace: true });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isDemoMode) {
        const valid = DEMO_CREDS.find((c) => c.email === email && c.password === password);
        if (!valid) throw new Error('Invalid demo credentials. Use the credentials listed below.');
        demoSignIn(email);
        const role = email.includes('owner') ? 'owner' : 'rep';
        navigate(role === 'owner' ? '/owner' : '/rep', { replace: true });
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const role = result.user.email?.includes('owner') ? 'owner' : 'rep';
        navigate(role === 'owner' ? '/owner' : '/rep', { replace: true });
      }
    } catch (err) {
      setError(err.message.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '').trim());
    } finally {
      setLoading(false);
    }
  }

  function quickLogin(cred) {
    setEmail(cred.email);
    setPassword(cred.password);
  }

  return (
    <div className="min-h-screen bg-[#080f1e] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/30 mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">PaintCon Sales</h1>
          <p className="text-slate-500 text-sm mt-1">Campaign Dashboard</p>
          {isDemoMode && (
            <div className="mt-3 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-medium">
              Demo Mode — No Firebase required
            </div>
          )}
        </div>

        {/* Form card */}
        <div className="bg-[#1e293b] rounded-2xl p-8 border border-white/10 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-6">Sign in to your account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@paintcon.com"
                className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5 font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-2.5 rounded-lg">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-lg py-2.5 text-sm transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 mt-2"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-slate-500 mb-3 font-medium uppercase tracking-wide">Demo credentials (password: demo1234)</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_CREDS.map((cred) => (
                <button
                  key={cred.email}
                  onClick={() => quickLogin(cred)}
                  className="text-left px-3 py-2 rounded-lg bg-[#0f172a] hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600 transition-all group"
                >
                  <p className="text-xs text-slate-300 font-medium group-hover:text-white truncate">{cred.label}</p>
                  <p className="text-xs text-slate-600 truncate">{cred.email}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
