import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTrackers } from '../context/TrackerContext';
import { DateRangeItem } from '../types';
import { calculateMonthProgress } from '../utils/dateCalculations';
import { DashboardStats } from './DashboardStats';
import { FilterBar } from './FilterBar';
import { TrackerCard } from './TrackerCard';
import { EmptyState } from './EmptyState';
import { AddEditTrackerModal } from './AddEditTrackerModal';
import { TrackerDetailModal } from './TrackerDetailModal';
import { Calendar, Plus, Car, Clock } from 'lucide-react';

interface HomeDashboardProps {
  isAddModalOpen: boolean;
  onCloseAddModal: () => void;
  onOpenAddModal: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  isAddModalOpen,
  onCloseAddModal,
  onOpenAddModal,
}) => {
  const { currentUser } = useAuth();
  const {
    trackers,
    addTracker,
    updateTracker,
    deleteTracker,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    sortBy,
    resetDemoData,
  } = useTrackers();

  const [editingTracker, setEditingTracker] = useState<DateRangeItem | null>(null);
  const [inspectingTracker, setInspectingTracker] = useState<DateRangeItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter and sort trackers
  const filteredTrackers = useMemo(() => {
    return trackers
      .filter((item) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchLabel = item.label.toLowerCase().includes(q);
          const matchNotes = item.notes?.toLowerCase().includes(q);
          const matchCat = item.category.toLowerCase().includes(q);
          if (!matchLabel && !matchNotes && !matchCat) return false;
        }

        // Category filter
        if (categoryFilter !== 'all' && item.category !== categoryFilter) {
          return false;
        }

        // Status filter
        if (statusFilter !== 'all') {
          const p = calculateMonthProgress(item.startDate, item.endDate);
          if (p.status !== statusFilter) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const progA = calculateMonthProgress(a.startDate, a.endDate);
        const progB = calculateMonthProgress(b.startDate, b.endDate);

        if (sortBy === 'remaining-asc') {
          // Put completed at the very end
          if (progA.status === 'completed' && progB.status !== 'completed') return 1;
          if (progB.status === 'completed' && progA.status !== 'completed') return -1;
          return progA.remainingTotalDays - progB.remainingTotalDays;
        }
        if (sortBy === 'remaining-desc') {
          if (progA.status === 'completed' && progB.status !== 'completed') return 1;
          if (progB.status === 'completed' && progA.status !== 'completed') return -1;
          return progB.remainingTotalDays - progA.remainingTotalDays;
        }
        if (sortBy === 'label-asc') {
          return a.label.localeCompare(b.label);
        }
        // created-desc
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [trackers, searchQuery, categoryFilter, statusFilter, sortBy]);

  const handleEditClick = (tracker: DateRangeItem) => {
    setEditingTracker(tracker);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      deleteTracker(deleteConfirmId);
      setDeleteConfirmId(null);
      if (inspectingTracker?.id === deleteConfirmId) {
        setInspectingTracker(null);
      }
    }
  };

  const handleSaveModal = (data: Omit<DateRangeItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (editingTracker) {
      updateTracker(editingTracker.id, data);
      setEditingTracker(null);
    } else {
      addTracker(data);
    }
  };

  const hasFiltersApplied = Boolean(
    searchQuery.trim() || categoryFilter !== 'all' || statusFilter !== 'all'
  );

  const clearAllFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setStatusFilter('all');
  };

  const handleLoadDemoCarLoan = () => {
    const today = new Date();
    const toDateString = (d: Date) => d.toISOString().split('T')[0];
    const carLoanStart = new Date(today);
    carLoanStart.setMonth(today.getMonth() - 14);
    const carLoanEnd = new Date(today);
    carLoanEnd.setMonth(today.getMonth() + 34);

    addTracker({
      label: '48-Month Car Financing (Auto Loan)',
      category: 'loan',
      startDate: toDateString(carLoanStart),
      endDate: toDateString(carLoanEnd),
      monthlyPayment: 385,
      notes: 'Monthly loan payment auto-debited on the 10th.',
    });
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome & Overview Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {currentUser?.name || 'Explorer'}
            </h2>
          </div>
          <p className="text-sm text-slate-500">
            Monitor and forecast remaining months across all your loans, contracts, and lease terms.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-add-quick-car-loan"
            onClick={handleLoadDemoCarLoan}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            <Car className="w-3.5 h-3.5 text-slate-500" />
            <span>+ Quick Car Loan Example</span>
          </button>
          <button
            id="btn-add-new-range"
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Track New Range</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <DashboardStats trackers={trackers} />

      {/* Filters and Controls */}
      <FilterBar onOpenAddModal={onOpenAddModal} />

      {/* Cards Grid or Empty State */}
      {filteredTrackers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTrackers.map((item) => (
            <TrackerCard
              key={item.id}
              tracker={item}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onViewDetails={(t) => setInspectingTracker(t)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          hasFilters={hasFiltersApplied}
          onOpenAddModal={onOpenAddModal}
          onLoadDemoCarLoan={handleLoadDemoCarLoan}
          onClearFilters={clearAllFilters}
        />
      )}

      {/* Add / Edit Tracker Modal */}
      <AddEditTrackerModal
        isOpen={isAddModalOpen || editingTracker !== null}
        onClose={() => {
          onCloseAddModal();
          setEditingTracker(null);
        }}
        onSave={handleSaveModal}
        initialData={editingTracker}
      />

      {/* Inspect Tracker Detail Modal */}
      <TrackerDetailModal
        tracker={inspectingTracker}
        onClose={() => setInspectingTracker(null)}
        onEdit={(t) => {
          setInspectingTracker(null);
          setEditingTracker(t);
        }}
        onDelete={(id) => {
          deleteTracker(id);
          setInspectingTracker(null);
        }}
      />

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-sm w-full p-5 text-center">
            <h4 className="text-base font-bold text-slate-900 mb-2">Delete this date range?</h4>
            <p className="text-xs text-slate-500 mb-5">
              This will remove this tracker and its remaining month calculations from your account.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
