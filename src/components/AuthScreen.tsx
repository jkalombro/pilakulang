import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CalendarRange, Lock, Mail, User as UserIcon, ArrowRight, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { login, register, quickDemoLogin } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    if (isRegistering) {
      const res = register(name, email, password);
      if (!res.success) {
        setErrorMessage(res.error || 'Registration failed.');
      }
    } else {
      const res = login(email, password);
      if (!res.success) {
        setErrorMessage(res.error || 'Login failed.');
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Left Side: Value & Context */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-6 sm:p-8 text-white flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-300 text-xs font-semibold mb-6 backdrop-blur-sm border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Timeline Horizon</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
              Track your dates & remaining months
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Enter any start and end date range — like a 48-month car loan or a 12-month apartment lease — and see exactly how many months and days remain at a glance.
            </p>

            <div className="space-y-3.5 text-xs text-slate-200">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                <span>Automatic month countdown and calendar synchronization</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                <span>Preset durations (+12, +24, +36, +48, +60, +72 months) for auto loans</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                <span>Isolated private tracker list saved safely to your account</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700/60 flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Private & secure client-side profile storage</span>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">
            {/* Header Tabs */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {isRegistering ? 'Create your account' : 'Sign in to your account'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {isRegistering
                    ? 'Start tracking your loans, leases, and contract terms'
                    : 'Access your saved date ranges and countdowns'}
                </p>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                  type="button"
                  id="tab-btn-signin"
                  onClick={() => {
                    setIsRegistering(false);
                    setErrorMessage('');
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    !isRegistering
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  id="tab-btn-register"
                  onClick={() => {
                    setIsRegistering(true);
                    setErrorMessage('');
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    isRegistering
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Register
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <span className="font-semibold">Error:</span> {errorMessage}
              </div>
            )}

            {/* Quick Demo Login Option */}
            <div className="mb-5">
              <button
                type="button"
                id="btn-quick-demo-login"
                onClick={quickDemoLogin}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-800 font-semibold text-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span>Instant Sign-In with Demo Account (Pre-loaded with Car Loan)</span>
              </button>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-slate-400 font-medium">Or continue with email</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegistering && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="input-name">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-name"
                      type="text"
                      required={isRegistering}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Jordan Miller"
                      className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="input-email">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jordan@example.com"
                    className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700" htmlFor="input-password">
                    Password
                  </label>
                  <span className="text-[11px] text-slate-400">(Optional for local session)</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="btn-auth-submit"
                disabled={isSubmitting}
                className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors shadow-sm cursor-pointer"
              >
                <span>{isRegistering ? 'Create Account & Continue' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <p className="text-center text-xs text-slate-500 mt-5">
              {isRegistering ? (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsRegistering(false)}
                    className="text-sky-600 hover:text-sky-700 font-semibold cursor-pointer underline"
                  >
                    Sign in here
                  </button>
                </>
              ) : (
                <>
                  New to the tracker?{' '}
                  <button
                    type="button"
                    onClick={() => setIsRegistering(true)}
                    className="text-sky-600 hover:text-sky-700 font-semibold cursor-pointer underline"
                  >
                    Create an account
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
