import React from 'react';
import { CalendarRange, Plus, LogOut, User as UserIcon, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenAddModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAddModal }) => {
  const { currentUser, logout, quickDemoLogin } = useAuth();

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <header id="app-navbar" className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-sky-500/20">
              <CalendarRange className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">Date Range Month Tracker</h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-sky-50 text-sky-700 border border-sky-100">
                  Today: {todayFormatted}
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">Real-time remaining months & contract horizon monitor</p>
            </div>
          </div>

          {/* Actions & User profile */}
          <div className="flex items-center space-x-3">
            {currentUser ? (
              <>
                <button
                  id="btn-add-tracker-nav"
                  onClick={onOpenAddModal}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-lg text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Tracker</span>
                </button>

                <div className="h-6 w-px bg-slate-200 hidden sm:block" />

                <div className="flex items-center space-x-2.5">
                  <div
                    className={`w-9 h-9 rounded-full ${currentUser.avatarColor || 'bg-sky-600'} text-white flex items-center justify-center font-semibold text-sm shadow-inner`}
                    title={currentUser.email}
                  >
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-semibold text-slate-800 leading-tight">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 truncate max-w-[130px] leading-tight">{currentUser.email}</p>
                  </div>
                  <button
                    id="btn-logout"
                    onClick={logout}
                    title="Sign Out"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <button
                id="btn-demo-login-nav"
                onClick={quickDemoLogin}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span>Quick Demo</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
