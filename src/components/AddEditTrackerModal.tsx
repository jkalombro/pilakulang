import React, { useState, useEffect } from 'react';
import { DateRangeItem, TrackerCategory } from '../types';
import { addMonthsToDate, calculateMonthProgress, formatDate } from '../utils/dateCalculations';
import { X, Calendar, Sparkles, Check, DollarSign, Info } from 'lucide-react';

interface AddEditTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<DateRangeItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: DateRangeItem | null;
}

const CATEGORIES: { id: TrackerCategory; label: string }[] = [
  { id: 'loan', label: 'Car / Auto Loan' },
  { id: 'lease', label: 'Apartment / Auto Lease' },
  { id: 'mortgage', label: 'Mortgage / Property' },
  { id: 'contract', label: 'Device / Service Contract' },
  { id: 'subscription', label: 'Annual / Long Subscription' },
  { id: 'education', label: 'Tuition / Education' },
  { id: 'personal', label: 'Personal / Other Loan' },
];

const PRESET_LABELS = [
  'Vehicle Loan (Car Loan)',
  'Apartment Residential Lease',
  'iPhone Hardware Contract',
  'Home Mortgage Term',
  'Commercial Space Lease',
  'Graduate Student Loan',
];

const DURATION_PRESETS = [
  { label: '6 mos', months: 6 },
  { label: '12 mos (1 yr)', months: 12 },
  { label: '24 mos (2 yrs)', months: 24 },
  { label: '36 mos (3 yrs)', months: 36 },
  { label: '48 mos (4 yrs)', months: 48 },
  { label: '60 mos (5 yrs)', months: 60 },
  { label: '72 mos (6 yrs)', months: 72 },
];

export const AddEditTrackerModal: React.FC<AddEditTrackerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [label, setLabel] = useState('');
  const [category, setCategory] = useState<TrackerCategory>('loan');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // Initialize or reset form
  useEffect(() => {
    if (initialData) {
      setLabel(initialData.label);
      setCategory(initialData.category);
      setStartDate(initialData.startDate);
      setEndDate(initialData.endDate);
      setMonthlyPayment(initialData.monthlyPayment ? String(initialData.monthlyPayment) : '');
      setNotes(initialData.notes || '');
      setError('');
    } else {
      const todayStr = new Date().toISOString().split('T')[0];
      setLabel('');
      setCategory('loan');
      setStartDate(todayStr);
      // default end date 36 months from today for auto loan
      setEndDate(addMonthsToDate(todayStr, 36));
      setMonthlyPayment('');
      setNotes('');
      setError('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Handler for duration shortcut presets
  const handleApplyDuration = (months: number) => {
    const baseStart = startDate || new Date().toISOString().split('T')[0];
    const newEnd = addMonthsToDate(baseStart, months);
    setEndDate(newEnd);
  };

  const handleStartDateChange = (newStart: string) => {
    setStartDate(newStart);
    // If end date is now before start date, shift end date
    if (endDate && newStart && endDate <= newStart) {
      setEndDate(addMonthsToDate(newStart, 12));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedLabel = label.trim();
    if (!trimmedLabel) {
      setError('Please provide a label (e.g. Car Loan, Apartment Lease).');
      return;
    }
    if (!startDate) {
      setError('Please choose a start date.');
      return;
    }
    if (!endDate) {
      setError('Please choose an end date.');
      return;
    }
    if (endDate <= startDate) {
      setError('The end date must be after the start date.');
      return;
    }

    onSave({
      label: trimmedLabel,
      category,
      startDate,
      endDate,
      monthlyPayment: monthlyPayment ? parseFloat(monthlyPayment) : undefined,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  // Preview calculation
  const previewProgress = startDate && endDate && endDate > startDate
    ? calculateMonthProgress(startDate, endDate)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {initialData ? 'Edit Date Range Tracker' : 'Track New Date Range'}
            </h2>
            <p className="text-xs text-slate-500">
              Input dates to automatically compute and track months remaining.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Label Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="input-tracker-label">
              Tracker Label / Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="input-tracker-label"
              type="text"
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Car Loan (Honda CR-V)"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
            />
            {/* Preset Label Suggestions */}
            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-400 font-medium">Quick suggestions:</span>
              {PRESET_LABELS.slice(0, 4).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setLabel(preset);
                    if (preset.includes('Car') || preset.includes('Vehicle')) setCategory('loan');
                    else if (preset.includes('Lease')) setCategory('lease');
                    else if (preset.includes('Mortgage')) setCategory('mortgage');
                    else if (preset.includes('Contract')) setCategory('contract');
                  }}
                  className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium transition-colors cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TrackerCategory)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="input-start-date">
                Start Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="input-start-date"
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="input-end-date">
                End Date (Maturity) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="input-end-date"
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Quick Duration Helper Buttons (Essential for Loans & Leases) */}
          <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-900 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Or set duration from start date:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {DURATION_PRESETS.map((preset) => (
                <button
                  key={preset.months}
                  type="button"
                  onClick={() => handleApplyDuration(preset.months)}
                  className="px-2.5 py-1 text-xs font-medium rounded-md bg-white hover:bg-sky-100 text-sky-800 border border-sky-200 shadow-2xs transition-colors cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Live Preview of Calculation */}
          {previewProgress && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  Calculated Remaining
                </span>
                <span className="text-lg font-extrabold text-slate-900">
                  {previewProgress.formattedRemaining} remaining
                </span>
                <p className="text-xs text-slate-500">
                  Total Term: {previewProgress.totalMonths} months ({previewProgress.elapsedMonths} months elapsed)
                </p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {previewProgress.percentageComplete}% Complete
                </span>
              </div>
            </div>
          )}

          {/* Optional Monthly Payment & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="input-monthly-payment">
                Monthly Payment ($) <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">$</span>
                <input
                  id="input-monthly-payment"
                  type="number"
                  min="0"
                  step="0.01"
                  value={monthlyPayment}
                  onChange={(e) => setMonthlyPayment(e.target.value)}
                  placeholder="395.00"
                  className="w-full pl-8 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="input-notes">
                Notes / Account # <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                id="input-notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Loan acct #40291, autopay enabled"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-save-tracker"
              className="px-5 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              {initialData ? 'Save Changes' : 'Create Tracker'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
