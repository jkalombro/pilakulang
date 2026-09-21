import React from 'react';
import { useTrackers } from '../context/TrackerContext';
import { Search, SlidersHorizontal, RotateCcw, Plus } from 'lucide-react';

interface FilterBarProps {
  onOpenAddModal: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ onOpenAddModal }) => {
  const {
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    resetDemoData,
    trackers,
  } = useTrackers();

  const CATEGORY_TABS = [
    { id: 'all', label: 'All Items' },
    { id: 'loan', label: 'Loans' },
    { id: 'lease', label: 'Leases' },
    { id: 'contract', label: 'Contracts' },
    { id: 'mortgage', label: 'Mortgages' },
    { id: 'subscription', label: 'Subscriptions' },
  ];

  return (
    <div className="space-y-3 mb-6">
      {/* Top row: Search, Filter, Sort, Add button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search trackers by label (e.g. car loan)..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors shadow-2xs"
          />
        </div>

        {/* Controls: Status & Sort */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="completed">Completed / Matured</option>
            <option value="upcoming">Upcoming</option>
          </select>

          {/* Sort selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs cursor-pointer"
          >
            <option value="remaining-asc">Fewest Months Remaining</option>
            <option value="remaining-desc">Most Months Remaining</option>
            <option value="created-desc">Recently Added</option>
            <option value="label-asc">Label (A–Z)</option>
          </select>

          {/* Reset Demo button if needed */}
          <button
            onClick={resetDemoData}
            title="Reset to sample presets (Car Loan, Lease, etc.)"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 bg-white border border-slate-200 rounded-lg transition-colors cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Add Tracker Button */}
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Tracker</span>
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORY_TABS.map((tab) => {
          const isActive = categoryFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCategoryFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
