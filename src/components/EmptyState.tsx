import React from 'react';
import { CalendarRange, Plus, Sparkles, Car } from 'lucide-react';

interface EmptyStateProps {
  hasFilters: boolean;
  onOpenAddModal: () => void;
  onLoadDemoCarLoan: () => void;
  onClearFilters: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  hasFilters,
  onOpenAddModal,
  onLoadDemoCarLoan,
  onClearFilters,
}) => {
  if (hasFilters) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 sm:p-12 text-center max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <CalendarRange className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">No trackers match your filter</h3>
        <p className="text-xs text-slate-500 mb-4">
          Try clearing your search query, status, or category filters to see all date ranges.
        </p>
        <button
          onClick={onClearFilters}
          className="px-4 py-2 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors cursor-pointer"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-2xs">
      <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-4 border border-sky-100">
        <CalendarRange className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">No Date Ranges Tracked Yet</h3>
      <p className="text-sm text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
        Add your car loan, apartment lease, phone contract, or any date range. The app will immediately calculate and display how many months are remaining.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onOpenAddModal}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Date Range</span>
        </button>

        <button
          onClick={onLoadDemoCarLoan}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-semibold transition-colors cursor-pointer"
        >
          <Car className="w-4 h-4 text-sky-600" />
          <span>Load Example Car Loan</span>
        </button>
      </div>
    </div>
  );
};
