export interface User {
  id: string;
  name: string;
  email: string;
  avatarColor?: string;
  createdAt: string;
}

export type TrackerCategory = 
  | 'loan' 
  | 'lease' 
  | 'mortgage' 
  | 'subscription' 
  | 'contract' 
  | 'education' 
  | 'personal' 
  | 'other';

export interface DateRangeItem {
  id: string;
  userId: string;
  label: string;
  category: TrackerCategory;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  monthlyPayment?: number;
  totalAmount?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MonthRemainingResult {
  status: 'upcoming' | 'active' | 'completed';
  totalMonths: number;
  elapsedMonths: number;
  remainingMonths: number;
  remainingDays: number;
  totalDays: number;
  elapsedDays: number;
  remainingTotalDays: number;
  percentageComplete: number;
  formattedRemaining: string;
  detailedText: string;
  isCompleted: boolean;
  isUpcoming: boolean;
}
