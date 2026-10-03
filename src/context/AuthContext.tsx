'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { api } from '../lib/api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  phone?: string;
  phoneNumber?: string;
  lastName: string;
  role:
    | 'CUSTOMER'
    | 'RIDER'
    | 'MERCHANT'
    | 'ORGANIZER'
    | 'ADMIN'
    | 'SUPER_ADMIN';

  status: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper for VAPID key conversion
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Automated background push synchronizer
async function registerAndSyncPushToken() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
    return;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;

    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!publicVapidKey) return;

      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      });
    }

    await api.post('/notifications/subscribe', subscription);
    console.log('[Push Sync] Device successfully linked on login');
  } catch (err) {
    console.error('[Push Sync Error]:', err);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('aviore_token');
    const storedUser = localStorage.getItem('aviore_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
        registerAndSyncPushToken(); // Sync on hard reload if already logged in
      } catch (e) {
        console.error('Failed to parse stored user:', e);
      }
    }

    setLoading(false);
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem('aviore_token', token);
    localStorage.setItem('aviore_user', JSON.stringify(user));

    document.cookie = `aviore_token=${token}; path=/; max-age=86400; SameSite=Strict`;
    document.cookie = `user_role=${user.role}; path=/; max-age=86400; SameSite=Strict`;

    setToken(token);
    setUser(user);

    // 🌟 Trigger push subscription handshake immediately on login
    registerAndSyncPushToken();
  };

  const updateUser = (partialUser: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const updated = { ...prevUser, ...partialUser };
      localStorage.setItem('aviore_user', JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    localStorage.removeItem('aviore_token');
    localStorage.removeItem('aviore_user');

    document.cookie = 'aviore_token=; path=/; max-age=0';
    document.cookie = 'user_role=; path=/; max-age=0';

    setToken(null);
    setUser(null);

    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}