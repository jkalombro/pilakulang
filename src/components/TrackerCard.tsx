import React from 'react';
import { DateRangeItem } from '../types';
import { calculateMonthProgress, formatDate, getCategoryConfig } from '../utils/dateCalculations';
import { 
  Car, 
  Home, 
  FileText, 
  CreditCard, 
  GraduationCap, 
  Calendar, 
  Clock, 
  Edit3, 
  Trash2, 
  ExternalLink,
  DollarSign,
  AlertCircle
} from 'lucide-react';

interface TrackerCardProps {
  tracker: DateRangeItem;
  onEdit: (tracker: DateRangeItem) => void;
  onDelete: (id: string) => void;
  onViewDetails: (tracker: DateRangeItem) => void;
}

export const TrackerCard: React.FC<TrackerCardProps> = ({
  tracker,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  const progress = calculateMonthProgress(tracker.startDate, tracker.endDate);
  const categoryConfig = getCategoryConfig(tracker.category);

  // Category Icon helper
  const getCategoryIcon = () => {
    switch (tracker.category) {
      case 'loan':
        return <Car className="w-4 h-4" />;
      case 'lease':
      case 'mortgage':
        return <Home className="w-4 h-4" />;
      case 'contract':
        return <FileText className="w-4 h-4" />;
      case 'subscription':
        return <CreditCard className="w-4 h-4" />;
      case 'education':
        return <GraduationCap className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getStatusBadge = () => {
    if (progress.status === 'completed') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          Completed
        </span>
      );
    }
    if (progress.status === 'upcoming') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          Starts Soon
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
        In Progress
      </span>
    );
  };

  return (
    <div
      id={`tracker-card-${tracker.id}`}
      className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
    >
      {/* Card Header */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          {/* Category Tag & Status */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${categoryConfig.color}`}
            >
              {getCategoryIcon()}
              <span>{categoryConfig.name}</span>
            </span>
            {getStatusBadge()}
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(tracker)}
              title="Edit tracker"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(tracker.id)}
              title="Delete tracker"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title / Label */}
        <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-1 mb-1">
          {tracker.label}
        </h3>

        {/* Date Range Subtitle */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{formatDate(tracker.startDate)}</span>
          <span className="text-slate-300">→</span>
          <span>{formatDate(tracker.endDate)}</span>
        </div>

        {/* PROMINENT MONTHS REMAINING HERO BOX */}
        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100/90 relative overflow-hidden">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                Time Remaining
              </span>
              <div className="flex items-baseline gap-2">
                {progress.status === 'completed' ? (
                  <span className="text-2xl font-extrabold text-emerald-600 tracking-tight">
                    0 months
                  </span>
                ) : progress.remainingMonths > 0 ? (
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                      {progress.remainingMonths}
                    </span>
                    <span className="text-base font-bold text-slate-700">
                      {progress.remainingMonths === 1 ? 'month' : 'months'}
                    </span>
                    {progress.remainingDays > 0 && (
                      <span className="text-xs font-semibold text-slate-500 ml-1">
                        + {progress.remainingDays}d
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-amber-600 tracking-tight">
                      {progress.remainingDays}
                    </span>
                    <span className="text-base font-bold text-amber-700">
                      {progress.remainingDays === 1 ? 'day left' : 'days left'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Total Duration Badge */}
            <div className="text-right">
              <span className="text-[11px] font-medium text-slate-400 block">Total Term</span>
              <span className="text-xs font-bold text-slate-700">
                {progress.totalMonths} months
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3.5">
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-1.5">
              <span>{progress.elapsedMonths} of {progress.totalMonths} months elapsed</span>
              <span className="font-semibold text-slate-700">{progress.percentageComplete}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  progress.status === 'completed'
                    ? 'bg-emerald-500'
                    : progress.percentageComplete > 80
                    ? 'bg-indigo-600'
                    : 'bg-sky-600'
                }`}
                style={{ width: `${progress.percentageComplete}%` }}
              />
            </div>
          </div>
        </div>

        {/* Optional Financial / Monthly Payment Info */}
        {(tracker.monthlyPayment || tracker.notes) && (
          <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            {tracker.monthlyPayment ? (
              <div className="flex items-center gap-1 font-medium">
                <span className="text-slate-400">Monthly:</span>
                <span className="font-bold text-slate-800">${tracker.monthlyPayment.toLocaleString()}</span>
                {progress.remainingMonths > 0 && (
                  <span className="text-slate-400 text-[11px]">
                    (~${(tracker.monthlyPayment * progress.remainingMonths).toLocaleString()} left)
                  </span>
                )}
              </div>
            ) : (
              <span className="text-slate-400 italic text-[11px] truncate max-w-[200px]">
                {tracker.notes}
              </span>
            )}

            <button
              onClick={() => onViewDetails(tracker)}
              className="text-sky-600 hover:text-sky-700 font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer text-xs ml-auto"
            >
              <span>Details</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Card Footer Bar */}
      <div className="px-5 py-2.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{progress.detailedText}</span>
        </div>
        <button
          onClick={() => onViewDetails(tracker)}
          className="text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
        >
          Inspect timeline →
        </button>
      </div>
    </div>
  );
};
