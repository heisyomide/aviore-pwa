'use client';

import React, { useState } from 'react';
import { api } from '@/src/lib/api';

type TargetAudience = 'Everyone' | 'Customers' | 'Riders' | 'Organizers' | 'Merchants';
type BroadcastChannel = 'PUSH' | 'EMAIL';

interface SupportTicket {
  id: string;
  code: string;
  subject: string;
  user: string;
  role: 'Customer' | 'Rider' | 'Organizer' | 'Merchant';
  priority: 'High' | 'Medium' | 'Low';
}

export default function AdminSettingsPage() {
  const [target, setTarget] = useState<TargetAudience>('Everyone');
  const [channels, setChannels] = useState<BroadcastChannel[]>(['PUSH']);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: '1',
      code: '#104',
      subject: 'Delayed Delivery',
      user: 'Sarah L.',
      role: 'Customer',
      priority: 'High',
    },
    {
      id: '2',
      code: '#105',
      subject: 'Payout Withdrawal Issue',
      user: 'Emeka O.',
      role: 'Rider',
      priority: 'High',
    },
    {
      id: '3',
      code: '#106',
      subject: 'Event Validation Error',
      user: 'Apex Events',
      role: 'Organizer',
      priority: 'Medium',
    },
    {
      id: '4',
      code: '#107',
      subject: 'KYC Document Re-upload',
      user: 'Kitchen 9ja',
      role: 'Merchant',
      priority: 'High',
    },
  ]);

  const handleChannelToggle = (channel: BroadcastChannel) => {
    if (channels.includes(channel)) {
      if (channels.length === 1) return;
      setChannels(channels.filter((c) => c !== channel));
    } else {
      setChannels([...channels, channel]);
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setFeedback({ type: 'error', message: 'Please provide both a title and message body.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    const targetAudienceMap: Record<TargetAudience, string | undefined> = {
      Everyone: undefined,
      Customers: 'CUSTOMER',
      Riders: 'RIDER',
      Organizers: 'ORGANIZER',
      Merchants: 'MERCHANT',
    };

    try {
      const response = await api.post('/admin/broadcast', {
        title,
        body,
        targetAudience: targetAudienceMap[target],
        channels,
      });

      setFeedback({
        type: 'success',
        message: `Broadcast successfully dispatched to ${response.data.recipientCount ?? 'selected'} recipient(s)!`,
      });
      setTitle('');
      setBody('');
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || err.message || 'An unexpected error occurred while broadcasting.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolveTicket = (id: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
  };

  const handleReplyTicket = (ticket: SupportTicket) => {
    alert(`Opening quick-reply channel for ticket ${ticket.code} (${ticket.user})...`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 p-4">
      <div className="flex justify-between items-center border-b border-neutral-200 pb-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-neutral-900">
            Admin Hub
          </h2>
          <p className="text-xs text-neutral-500 font-medium">
            System Operations, Multi-Audience Broadcasts & Escalation Queue
          </p>
        </div>
      </div>

      {/* 1. Broadcast Engine */}
      <section className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-black uppercase text-xs tracking-wider text-neutral-800">
            Broadcast Notifications
          </h3>
          <span className="text-[10px] bg-neutral-100 font-bold px-2.5 py-1 rounded-full text-neutral-600">
            Multi-Channel Dispatch
          </span>
        </div>

        {feedback && (
          <div
            className={`p-3.5 mb-4 rounded-xl text-xs font-bold ${
              feedback.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {feedback.message}
          </div>
        )}

        <form onSubmit={handleSendBroadcast} className="space-y-4">
          {/* Target Audience Picker */}
          <div>
            <label className="block text-[10px] font-black uppercase text-neutral-400 mb-2">
              Target Audience
            </label>
            <div className="flex flex-wrap gap-2">
              {(['Customers', 'Riders', 'Organizers', 'Merchants', 'Everyone'] as TargetAudience[]).map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setTarget(opt)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                    target === opt
                      ? 'bg-neutral-950 text-white shadow-sm'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Channels Picker */}
          <div>
            <label className="block text-[10px] font-black uppercase text-neutral-400 mb-2">
              Delivery Channels
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-700">
                <input
                  type="checkbox"
                  checked={channels.includes('PUSH')}
                  onChange={() => handleChannelToggle('PUSH')}
                  className="rounded border-neutral-300 text-neutral-950 focus:ring-neutral-950"
                />
                Push Notification
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-700">
                <input
                  type="checkbox"
                  checked={channels.includes('EMAIL')}
                  onChange={() => handleChannelToggle('EMAIL')}
                  className="rounded border-neutral-300 text-neutral-950 focus:ring-neutral-950"
                />
                Email Broadcast (Brevo)
              </label>
            </div>
          </div>

          {/* Message Form Fields */}
          <div>
            <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1">
              Title
            </label>
            <input
              type="text"
              placeholder="e.g. 🎉 Special Promo or System Alert"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-neutral-950"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1">
              Body Message
            </label>
            <textarea
              rows={3}
              placeholder="Enter message content to dispatch..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-neutral-950"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-green-600 hover:bg-green-700 disabled:bg-neutral-300 text-white rounded-xl font-black uppercase text-xs transition shadow-sm"
          >
            {isSubmitting ? 'Dispatching Broadcast...' : 'Send Broadcast'}
          </button>
        </form>
      </section>

      {/* 2. Support Ticket Queue */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-black uppercase text-xs tracking-wider text-neutral-800">
            Escalated Support Tickets
          </h3>
          <span className="text-[10px] font-bold text-neutral-400">
            {tickets.length} Pending
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          {tickets.length === 0 ? (
            <div className="p-8 text-center text-xs font-bold text-neutral-400">
              No open tickets requiring admin attention.
            </div>
          ) : (
            tickets.map((t) => (
              <div
                key={t.id}
                className="p-4 border-b last:border-b-0 border-neutral-100 flex justify-between items-center hover:bg-neutral-50/50 transition"
              >
                <div>
                  <p className="font-bold text-xs text-neutral-900">
                    {t.subject} <span className="text-neutral-400">{t.code}</span>
                  </p>
                  <p className="text-[10px] text-neutral-500 font-medium mt-0.5">
                    {t.user} ({t.role}) •{' '}
                    <span className="text-red-600 font-bold">{t.priority} Priority</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReplyTicket(t)}
                    className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-[9px] font-black uppercase transition text-neutral-800"
                  >
                    Reply
                  </button>
                  <button
                    onClick={() => handleResolveTicket(t.id)}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[9px] font-black uppercase transition"
                  >
                    Resolve
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 3. Live Support Link */}
      <button
        onClick={() => alert('Launching Live Admin Chat Dashboard...')}
        className="w-full py-4 border-2 border-dashed border-neutral-200 rounded-2xl font-black text-neutral-400 uppercase text-xs hover:border-neutral-400 hover:text-neutral-950 transition bg-neutral-50/50 hover:bg-white"
      >
        Enter Live Support Chat
      </button>
    </div>
  );
}