import React from 'react';
import { DateRangeItem } from '../types';
import { calculateMonthProgress } from '../utils/dateCalculations';
import { Calendar, Clock, CheckCircle, TrendingUp } from 'lucide-react';

interface DashboardStatsProps {
  trackers: DateRangeItem[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ trackers }) => {
  if (trackers.length === 0) return null;

  const analyzed = trackers.map((t) => ({
    tracker: t,
    progress: calculateMonthProgress(t.startDate, t.endDate),
  }));

  const activeCount = analyzed.filter((a) => a.progress.status === 'active').length;
  const completedCount = analyzed.filter((a) => a.progress.status === 'completed').length;
  
  // Find soonest ending active tracker
  const activeOnly = analyzed.filter((a) => a.progress.status === 'active');
  const soonest = activeOnly.length > 0
    ? [...activeOnly].sort((a, b) => a.progress.remainingTotalDays - b.progress.remainingTotalDays)[0]
    : null;

  // Find longest remaining active tracker (e.g. a 48 or 60 month loan)
  const longest = activeOnly.length > 0
    ? [...activeOnly].sort((a, b) => b.progress.remainingMonths - a.progress.remainingMonths)[0]
    : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Metric 1 */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Tracked</span>
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">{trackers.length}</span>
          <span className="text-xs text-slate-500 font-medium">date ranges</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">Active: {activeCount} • Matured: {completedCount}</p>
      </div>

      {/* Metric 2 */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Commitments</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">{activeCount}</span>
          <span className="text-xs text-emerald-700 font-medium font-mono">in progress</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">Currently counting down months</p>
      </div>

      {/* Metric 3: Soonest Ending */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Next to Complete</span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        {soonest ? (
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-slate-900">
                {soonest.progress.remainingMonths > 0 
                  ? `${soonest.progress.remainingMonths} mo${soonest.progress.remainingMonths === 1 ? '' : 's'}`
                  : `${soonest.progress.remainingDays} days`}
              </span>
              <span className="text-xs text-amber-700 font-medium">left</span>
            </div>
            <p className="text-xs text-slate-500 truncate mt-1" title={soonest.tracker.label}>
              {soonest.tracker.label}
            </p>
          </div>
        ) : (
          <div>
            <span className="text-lg font-bold text-slate-400">None active</span>
            <p className="text-xs text-slate-400 mt-1">All commitments finished</p>
          </div>
        )}
      </div>

      {/* Metric 4: Longest remaining */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Longest Horizon</span>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>
        {longest ? (
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-slate-900">
                {longest.progress.remainingMonths} mos
              </span>
              <span className="text-xs text-indigo-700 font-medium">remaining</span>
            </div>
            <p className="text-xs text-slate-500 truncate mt-1" title={longest.tracker.label}>
              {longest.tracker.label}
            </p>
          </div>
        ) : (
          <div>
            <span className="text-lg font-bold text-slate-400">None active</span>
            <p className="text-xs text-slate-400 mt-1">No commitments</p>
          </div>
        )}
      </div>
    </div>
  );
};
