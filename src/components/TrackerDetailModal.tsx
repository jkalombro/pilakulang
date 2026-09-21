import React from 'react';
import { DateRangeItem } from '../types';
import { calculateMonthProgress, formatDate, getCategoryConfig } from '../utils/dateCalculations';
import { 
  X, 
  Calendar, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  TrendingUp, 
  Edit3, 
  Trash2,
  CalendarRange,
  ArrowRight
} from 'lucide-react';

interface TrackerDetailModalProps {
  tracker: DateRangeItem | null;
  onClose: () => void;
  onEdit: (tracker: DateRangeItem) => void;
  onDelete: (id: string) => void;
}

export const TrackerDetailModal: React.FC<TrackerDetailModalProps> = ({
  tracker,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!tracker) return null;

  const progress = calculateMonthProgress(tracker.startDate, tracker.endDate);
  const categoryConfig = getCategoryConfig(tracker.category);

  // Financial calculations if payment is present
  const monthlyPay = tracker.monthlyPayment || 0;
  const estimatedRemainingAmount = monthlyPay * progress.remainingMonths;
  const estimatedPaidAmount = monthlyPay * progress.elapsedMonths;
  const estimatedTotalAmount = tracker.totalAmount || (monthlyPay * progress.totalMonths);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between">
          <div className="pr-4">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded text-xs font-semibold border ${categoryConfig.color}`}>
                {categoryConfig.name}
              </span>
              <span className="text-xs font-medium text-slate-500">
                Created on {new Date(tracker.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">
              {tracker.label}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Main Big Months Remaining Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 mb-4">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Countdown Horizon
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white tracking-tight">
                    {progress.remainingMonths}
                  </span>
                  <span className="text-xl font-bold text-sky-400">
                    {progress.remainingMonths === 1 ? 'Month Remaining' : 'Months Remaining'}
                  </span>
                </div>
                {progress.remainingDays > 0 && (
                  <p className="text-xs text-slate-300 mt-1">
                    Plus {progress.remainingDays} days until exact calendar maturity
                  </p>
                )}
              </div>

              <div className="sm:text-right">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Overall Completion
                </span>
                <span className="text-3xl font-extrabold text-emerald-400">
                  {progress.percentageComplete}%
                </span>
                <p className="text-xs text-slate-300">
                  {progress.elapsedMonths} of {progress.totalMonths} total months
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-slate-700/80 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${progress.percentageComplete}%` }}
              />
            </div>
          </div>

          {/* Timeline Range Visualizer */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Date Horizon Range
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-[11px] font-medium text-slate-400 block">Start Date</span>
                <span className="text-sm font-bold text-slate-800">{formatDate(tracker.startDate)}</span>
              </div>
              <div className="flex items-center justify-center text-slate-400">
                <ArrowRight className="w-5 h-5 hidden sm:block" />
                <span className="text-xs font-semibold text-slate-500 sm:hidden">to</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-[11px] font-medium text-slate-400 block">Maturity / End Date</span>
                <span className="text-sm font-bold text-slate-800">{formatDate(tracker.endDate)}</span>
              </div>
            </div>
          </div>

          {/* Detailed Units Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
              <span className="text-xs text-slate-500 font-medium block">Total Term</span>
              <span className="text-lg font-bold text-slate-900">{progress.totalMonths} mos</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
              <span className="text-xs text-slate-500 font-medium block">Elapsed</span>
              <span className="text-lg font-bold text-slate-900">{progress.elapsedMonths} mos</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
              <span className="text-xs text-slate-500 font-medium block">Approx. Weeks</span>
              <span className="text-lg font-bold text-slate-900">
                ~{Math.round(progress.remainingTotalDays / 7)} wks
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
              <span className="text-xs text-slate-500 font-medium block">Days Left</span>
              <span className="text-lg font-bold text-slate-900">{progress.remainingTotalDays} days</span>
            </div>
          </div>

          {/* Financial Breakdown if Payment Specified */}
          {monthlyPay > 0 && (
            <div className="p-4 rounded-xl border border-sky-100 bg-sky-50/50">
              <div className="flex items-center gap-2 mb-3 text-sky-900 font-bold text-sm">
                <DollarSign className="w-4 h-4 text-sky-600" />
                <span>Financial Commitment Summary</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white p-3 rounded-lg border border-sky-100">
                  <span className="text-[11px] text-slate-400 font-medium block">Monthly Installment</span>
                  <span className="text-sm font-bold text-slate-800">${monthlyPay.toLocaleString()} / mo</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-sky-100">
                  <span className="text-[11px] text-slate-400 font-medium block">Paid to Date (~est)</span>
                  <span className="text-sm font-bold text-emerald-700">${estimatedPaidAmount.toLocaleString()}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-sky-100">
                  <span className="text-[11px] text-slate-400 font-medium block">Balance Remaining (~est)</span>
                  <span className="text-sm font-bold text-slate-900">${estimatedRemainingAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {tracker.notes && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Attached Notes & Account Reference
              </h4>
              <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {tracker.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              onDelete(tracker.id);
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Tracker</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                onClose();
                onEdit(tracker);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Dates / Details</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
