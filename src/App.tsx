import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TrackerProvider } from './context/TrackerContext';
import { Navbar } from './components/Navbar';
import { AuthScreen } from './components/AuthScreen';
import { HomeDashboard } from './components/HomeDashboard';
import { CalendarRange, ShieldCheck, Clock } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentUser, isLoading } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-sky-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading your timeline horizon...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-sky-100 selection:text-sky-900">
      <Navbar onOpenAddModal={() => setIsAddModalOpen(true)} />

      <div className="flex-1">
        {currentUser ? (
          <TrackerProvider>
            <HomeDashboard
              isAddModalOpen={isAddModalOpen}
              onCloseAddModal={() => setIsAddModalOpen(false)}
              onOpenAddModal={() => setIsAddModalOpen(true)}
            />
          </TrackerProvider>
        ) : (
          <AuthScreen />
        )}
      </div>

      {/* Subtle Footer */}
      <footer className="border-t border-slate-200/80 bg-white/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <CalendarRange className="w-4 h-4 text-sky-600" />
            <span className="font-semibold text-slate-700">Date Range Month Tracker</span>
            <span>•</span>
            <span>Accurate calendar horizon & loan countdown</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Client-side protected storage</span>
            <span>•</span>
            <span>Reference Date: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
