'use client';

import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, Megaphone, CreditCard, AlertCircle, RefreshCw } from 'lucide-react';
import { api } from '@/src/lib/api';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'PAYMENT' | 'ADMIN' | 'SYSTEM' | 'PUSH';
  isRead: boolean;
  createdAt: string;
}

export default function OrganizerNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotifications = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/notifications/my-notifications');
      // Fix: Extract the array from the backend response object { notifications, unreadCount }
      const items = response.data?.notifications || response.data || [];
      setNotifications(Array.isArray(items) ? items : []);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
      );
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'PAYMENT':
        return <CreditCard className="h-4 w-4 text-emerald-400" />;
      case 'ADMIN':
        return <Megaphone className="h-4 w-4 text-blue-400" />;
      default:
        return <Bell className="h-4 w-4 text-amber-400" />;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto bg-[#0e131f] min-h-screen text-white font-mono">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-5">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white uppercase">Organizer Notifications</h1>
          <p className="text-xs text-neutral-400">Track customer payments, admin announcements, and app updates in real time.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={markAllAsRead}
            className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-xs font-bold text-neutral-300 transition-colors"
          >
            Mark All Read
          </button>
          <button
            onClick={fetchNotifications}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-white transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs text-red-400 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-16 text-center text-xs text-neutral-500 border border-neutral-800 rounded-3xl bg-neutral-950/40">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-16 text-center text-xs text-neutral-500 border border-neutral-800 rounded-3xl bg-neutral-950/40">
            No notifications available right now.
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => !item.isRead && markAsRead(item.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                item.isRead
                  ? 'bg-neutral-950/30 border-neutral-900 text-neutral-400'
                  : 'bg-neutral-900/60 border-neutral-800 text-white shadow-lg'
              }`}
            >
              <div className={`p-2.5 rounded-xl border ${item.isRead ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-800 border-neutral-700'}`}>
                {getIconForType(item.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold uppercase tracking-wide flex items-center gap-2">
                    {item.title}
                    {!item.isRead && (
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    )}
                  </h2>
                  <span className="text-[10px] text-neutral-500">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">{item.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}