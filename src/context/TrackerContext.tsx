import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DateRangeItem } from '../types';
import { useAuth, getDefaultDemoTrackers } from './AuthContext';

interface TrackerContextType {
  trackers: DateRangeItem[];
  isLoading: boolean;
  addTracker: (item: Omit<DateRangeItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  updateTracker: (id: string, updates: Partial<DateRangeItem>) => void;
  deleteTracker: (id: string) => void;
  resetDemoData: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  statusFilter: 'all' | 'active' | 'completed' | 'upcoming';
  setStatusFilter: (status: 'all' | 'active' | 'completed' | 'upcoming') => void;
  sortBy: 'remaining-asc' | 'remaining-desc' | 'created-desc' | 'label-asc';
  setSortBy: (sort: 'remaining-asc' | 'remaining-desc' | 'created-desc' | 'label-asc') => void;
}

const TrackerContext = createContext<TrackerContextType | undefined>(undefined);
const ITEMS_STORAGE_KEY_PREFIX = 'date_range_tracker_items_';

export const TrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [trackers, setTrackers] = useState<DateRangeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'upcoming'>('all');
  const [sortBy, setSortBy] = useState<'remaining-asc' | 'remaining-desc' | 'created-desc' | 'label-asc'>('remaining-asc');

  // Load items whenever user changes
  useEffect(() => {
    if (!currentUser) {
      setTrackers([]);
      setIsLoading(false);
      return;
    }

    try {
      const storageKey = ITEMS_STORAGE_KEY_PREFIX + currentUser.id;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setTrackers(JSON.parse(stored));
      } else {
        const initial = getDefaultDemoTrackers(currentUser.id);
        localStorage.setItem(storageKey, JSON.stringify(initial));
        setTrackers(initial);
      }
    } catch (err) {
      console.error('Failed to load trackers from storage', err);
      setTrackers([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  // Persist items
  const persistTrackers = useCallback((newTrackers: DateRangeItem[]) => {
    if (!currentUser) return;
    try {
      const storageKey = ITEMS_STORAGE_KEY_PREFIX + currentUser.id;
      localStorage.setItem(storageKey, JSON.stringify(newTrackers));
    } catch (err) {
      console.error('Failed to persist trackers', err);
    }
  }, [currentUser]);

  const addTracker = (item: Omit<DateRangeItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!currentUser) return;
    const now = new Date().toISOString();
    const newItem: DateRangeItem = {
      ...item,
      id: 'tracker_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      userId: currentUser.id,
      createdAt: now,
      updatedAt: now,
    };

    setTrackers((prev) => {
      const updated = [newItem, ...prev];
      persistTrackers(updated);
      return updated;
    });
  };

  const updateTracker = (id: string, updates: Partial<DateRangeItem>) => {
    if (!currentUser) return;
    setTrackers((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t));
      persistTrackers(updated);
      return updated;
    });
  };

  const deleteTracker = (id: string) => {
    if (!currentUser) return;
    setTrackers((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      persistTrackers(updated);
      return updated;
    });
  };

  const resetDemoData = () => {
    if (!currentUser) return;
    const initial = getDefaultDemoTrackers(currentUser.id);
    persistTrackers(initial);
    setTrackers(initial);
  };

  return (
    <TrackerContext.Provider
      value={{
        trackers,
        isLoading,
        addTracker,
        updateTracker,
        deleteTracker,
        resetDemoData,
        searchQuery,
        setSearchQuery,
        categoryFilter,
        setCategoryFilter,
        statusFilter,
        setStatusFilter,
        sortBy,
        setSortBy,
      }}
    >
      {children}
    </TrackerContext.Provider>
  );
};

export function useTrackers() {
  const context = useContext(TrackerContext);
  if (!context) {
    throw new Error('useTrackers must be used within a TrackerProvider');
  }
  return context;
}
