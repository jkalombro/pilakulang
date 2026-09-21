import { MonthRemainingResult } from '../types';

/**
 * Calculates accurate calendar months and days between two dates.
 */
export function calculateMonthsDifference(from: Date, to: Date): { months: number; days: number; totalApproxMonths: number } {
  if (to < from) {
    return { months: 0, days: 0, totalApproxMonths: 0 };
  }

  let yearDiff = to.getFullYear() - from.getFullYear();
  let monthDiff = to.getMonth() - from.getMonth();
  let dayDiff = to.getDate() - from.getDate();

  let months = yearDiff * 12 + monthDiff;

  if (dayDiff < 0) {
    months -= 1;
    // Get days in previous month of 'to' date
    const prevMonthLastDay = new Date(to.getFullYear(), to.getMonth(), 0).getDate();
    dayDiff += prevMonthLastDay;
  }

  if (months < 0) {
    months = 0;
    dayDiff = 0;
  }

  const daysInCurrentMonth = new Date(from.getFullYear(), from.getMonth() + 1, 0).getDate();
  const fractionalMonth = dayDiff / (daysInCurrentMonth || 30);
  const totalApproxMonths = Math.round((months + fractionalMonth) * 10) / 10;

  return {
    months,
    days: dayDiff,
    totalApproxMonths,
  };
}

/**
 * Calculates comprehensive remaining months and progress for a date range
 */
export function calculateMonthProgress(
  startDateStr: string,
  endDateStr: string,
  referenceDate: Date = new Date()
): MonthRemainingResult {
  const start = new Date(startDateStr + 'T00:00:00');
  const end = new Date(endDateStr + 'T23:59:59');
  const now = new Date(referenceDate);
  // Normalize time to beginning of day for comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const oneDayMs = 1000 * 60 * 60 * 24;
  const totalDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / oneDayMs));

  // Total duration in months
  const totalDuration = calculateMonthsDifference(start, end);
  // Total nominal months (e.g. 36 or 48 for standard loans)
  const nominalTotalMonths = Math.max(
    1,
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + (end.getDate() >= start.getDate() ? 0 : -1)
  );

  // If already ended
  if (today > end) {
    return {
      status: 'completed',
      totalMonths: nominalTotalMonths,
      elapsedMonths: nominalTotalMonths,
      remainingMonths: 0,
      remainingDays: 0,
      totalDays,
      elapsedDays: totalDays,
      remainingTotalDays: 0,
      percentageComplete: 100,
      formattedRemaining: '0 months',
      detailedText: 'Term completed and fully matured',
      isCompleted: true,
      isUpcoming: false,
    };
  }

  // If upcoming
  if (today < start) {
    const untilStartDays = Math.round((start.getTime() - today.getTime()) / oneDayMs);
    const startDiff = calculateMonthsDifference(today, start);
    return {
      status: 'upcoming',
      totalMonths: nominalTotalMonths,
      elapsedMonths: 0,
      remainingMonths: nominalTotalMonths,
      remainingDays: totalDuration.days,
      totalDays,
      elapsedDays: 0,
      remainingTotalDays: totalDays,
      percentageComplete: 0,
      formattedRemaining: `${nominalTotalMonths} months`,
      detailedText: startDiff.months > 0 
        ? `Starts in ${startDiff.months} mo${startDiff.months === 1 ? '' : 's'}` 
        : `Starts in ${untilStartDays} day${untilStartDays === 1 ? '' : 's'}`,
      isCompleted: false,
      isUpcoming: true,
    };
  }

  // Currently active
  const elapsedDays = Math.max(0, Math.round((today.getTime() - start.getTime()) / oneDayMs));
  const remainingTotalDays = Math.max(0, Math.round((end.getTime() - today.getTime()) / oneDayMs));
  
  const remainingCalc = calculateMonthsDifference(today, end);
  const elapsedCalc = calculateMonthsDifference(start, today);

  const percentageComplete = Math.min(100, Math.max(0, Math.round((elapsedDays / totalDays) * 100)));

  // Display months remaining:
  // If there are days left in the final month, display e.g. "14 mos" or if exact, etc.
  let formattedRemaining = '';
  if (remainingCalc.months === 0) {
    if (remainingCalc.days === 0) {
      formattedRemaining = 'Ends today';
    } else {
      formattedRemaining = `${remainingCalc.days} day${remainingCalc.days === 1 ? '' : 's'}`;
    }
  } else {
    // If days are 0 or few, just show months, else indicate precise or approx
    formattedRemaining = `${remainingCalc.months} mo${remainingCalc.months === 1 ? '' : 's'}${
      remainingCalc.days > 0 ? ` ${remainingCalc.days}d` : ''
    }`;
  }

  const detailedText = remainingCalc.months > 0
    ? `${remainingCalc.months} month${remainingCalc.months === 1 ? '' : 's'} and ${remainingCalc.days} day${remainingCalc.days === 1 ? '' : 's'} left`
    : `${remainingTotalDays} day${remainingTotalDays === 1 ? '' : 's'} left`;

  return {
    status: 'active',
    totalMonths: nominalTotalMonths,
    elapsedMonths: elapsedCalc.months,
    remainingMonths: remainingCalc.months,
    remainingDays: remainingCalc.days,
    totalDays,
    elapsedDays,
    remainingTotalDays,
    percentageComplete,
    formattedRemaining,
    detailedText,
    isCompleted: false,
    isUpcoming: false,
  };
}

/**
 * Format date nicely e.g. "Oct 15, 2026"
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Add N months to a starting date string (useful for quick presets: +36m, +48m, +60m for loans)
 */
export function addMonthsToDate(dateStr: string, monthsToAdd: number): string {
  const date = new Date(dateStr + 'T00:00:00');
  const d = date.getDate();
  date.setMonth(date.getMonth() + +monthsToAdd);
  if (date.getDate() !== d) {
    date.setDate(0);
  }
  return date.toISOString().split('T')[0];
}

/**
 * Get category icon and badge styling
 */
export function getCategoryConfig(category: string) {
  switch (category) {
    case 'loan':
      return {
        name: 'Auto / Loan',
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        badgeBg: 'bg-amber-100 text-amber-800',
        accent: 'amber',
      };
    case 'lease':
      return {
        name: 'Lease',
        color: 'text-blue-700 bg-blue-50 border-blue-200',
        badgeBg: 'bg-blue-100 text-blue-800',
        accent: 'blue',
      };
    case 'mortgage':
      return {
        name: 'Mortgage',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        badgeBg: 'bg-emerald-100 text-emerald-800',
        accent: 'emerald',
      };
    case 'subscription':
      return {
        name: 'Subscription',
        color: 'text-purple-700 bg-purple-50 border-purple-200',
        badgeBg: 'bg-purple-100 text-purple-800',
        accent: 'purple',
      };
    case 'contract':
      return {
        name: 'Contract',
        color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
        badgeBg: 'bg-indigo-100 text-indigo-800',
        accent: 'indigo',
      };
    case 'education':
      return {
        name: 'Education',
        color: 'text-rose-700 bg-rose-50 border-rose-200',
        badgeBg: 'bg-rose-100 text-rose-800',
        accent: 'rose',
      };
    default:
      return {
        name: 'General',
        color: 'text-slate-700 bg-slate-50 border-slate-200',
        badgeBg: 'bg-slate-100 text-slate-800',
        accent: 'slate',
      };
  }
}
