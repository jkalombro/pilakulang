import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, DateRangeItem } from '../types';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password?: string) => { success: boolean; error?: string };
  register: (name: string, email: string, password?: string) => { success: boolean; error?: string };
  logout: () => void;
  quickDemoLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'date_range_tracker_users';
const CURRENT_USER_KEY = 'date_range_tracker_active_user';
const ITEMS_STORAGE_KEY_PREFIX = 'date_range_tracker_items_';

// Initial default demo items when demo user or new user starts
export function getDefaultDemoTrackers(userId: string): DateRangeItem[] {
  const today = new Date();
  
  // Format date helper
  const toDateString = (d: Date) => d.toISOString().split('T')[0];

  // Car loan: Started 18 months ago, ends 30 months from now (48 months total)
  const carLoanStart = new Date(today);
  carLoanStart.setMonth(today.getMonth() - 18);
  const carLoanEnd = new Date(today);
  carLoanEnd.setMonth(today.getMonth() + 30);

  // Apartment Lease: Started 7 months ago, ends in 5 months (12 months total)
  const leaseStart = new Date(today);
  leaseStart.setMonth(today.getMonth() - 7);
  const leaseEnd = new Date(today);
  leaseEnd.setMonth(today.getMonth() + 5);

  // Phone / Equipment Contract: Started 15 months ago, ends in 9 months (24 months total)
  const phoneStart = new Date(today);
  phoneStart.setMonth(today.getMonth() - 15);
  const phoneEnd = new Date(today);
  phoneEnd.setMonth(today.getMonth() + 9);

  return [
    {
      id: 'demo-car-loan-1',
      userId,
      label: 'Vehicle Financing (Car Loan)',
      category: 'loan',
      startDate: toDateString(carLoanStart),
      endDate: toDateString(carLoanEnd),
      monthlyPayment: 425,
      totalAmount: 20400,
      notes: '48-month auto loan with credit union. Automatic monthly debit on the 15th.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-lease-2',
      userId,
      label: 'Apartment Residential Lease',
      category: 'lease',
      startDate: toDateString(leaseStart),
      endDate: toDateString(leaseEnd),
      monthlyPayment: 1650,
      notes: '1-year fixed term. Landlord requires 60-day renewal notice before termination.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-contract-3',
      userId,
      label: 'Device & Mobile Plan Contract',
      category: 'contract',
      startDate: toDateString(phoneStart),
      endDate: toDateString(phoneEnd),
      monthlyPayment: 85,
      notes: '24-month hardware installment plan. Upgrades eligible upon completion.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUserJson = localStorage.getItem(CURRENT_USER_KEY);
      if (savedUserJson) {
        const parsed = JSON.parse(savedUserJson);
        setCurrentUser(parsed);
      }
    } catch (err) {
      console.error('Failed to load authenticated user from localStorage', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (email: string, _password?: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    try {
      const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];

      let user = users.find((u) => u.email.toLowerCase() === trimmedEmail);

      if (!user) {
        // If user doesn't exist yet, auto-create friendly profile so user isn't blocked
        const namePart = trimmedEmail.split('@')[0];
        const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        user = {
          id: 'user_' + Date.now(),
          name: displayName,
          email: trimmedEmail,
          avatarColor: 'bg-sky-600',
          createdAt: new Date().toISOString(),
        };
        users.push(user);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

        // Seed demo items for this user
        const itemsKey = ITEMS_STORAGE_KEY_PREFIX + user.id;
        if (!localStorage.getItem(itemsKey)) {
          localStorage.setItem(itemsKey, JSON.stringify(getDefaultDemoTrackers(user.id)));
        }
      }

      setCurrentUser(user);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return { success: true };
    } catch (err) {
      return { success: false, error: 'An unexpected error occurred during login.' };
    }
  };

  const register = (name: string, email: string, _password?: string) => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      return { success: false, error: 'Please provide your name.' };
    }
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    try {
      const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];

      const existing = users.find((u) => u.email.toLowerCase() === trimmedEmail);
      if (existing) {
        // Log them in if already registered
        setCurrentUser(existing);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(existing));
        return { success: true };
      }

      const colors = ['bg-indigo-600', 'bg-blue-600', 'bg-emerald-600', 'bg-amber-600', 'bg-rose-600', 'bg-purple-600'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const newUser: User = {
        id: 'user_' + Date.now(),
        name: trimmedName,
        email: trimmedEmail,
        avatarColor: randomColor,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

      // Seed initial example trackers including the requested Car Loan
      const itemsKey = ITEMS_STORAGE_KEY_PREFIX + newUser.id;
      localStorage.setItem(itemsKey, JSON.stringify(getDefaultDemoTrackers(newUser.id)));

      setCurrentUser(newUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to create account.' };
    }
  };

  const quickDemoLogin = () => {
    const demoUser: User = {
      id: 'demo_user_1',
      name: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      avatarColor: 'bg-indigo-600',
      createdAt: new Date().toISOString(),
    };

    const itemsKey = ITEMS_STORAGE_KEY_PREFIX + demoUser.id;
    if (!localStorage.getItem(itemsKey)) {
      localStorage.setItem(itemsKey, JSON.stringify(getDefaultDemoTrackers(demoUser.id)));
    }

    setCurrentUser(demoUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(demoUser));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        login,
        register,
        logout,
        quickDemoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
