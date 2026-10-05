'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/src/lib/api';

type TargetAudience = 'Everyone' | 'Customers' | 'Riders' | 'Organizers' | 'Merchants';
type BroadcastChannel = 'PUSH' | 'EMAIL';
type CampaignCategory = 'FOOD' | 'SHIPMENT' | 'EVENT_LOGISTICS' | 'PROMOTION' | 'GENERAL_BRAND';
type CampaignFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ONCE';

interface Campaign {
  id: string;
  title: string;
  body: string;
  category: CampaignCategory;
  audience: string;
  startDate: string;
  endDate?: string;
  scheduledTime: string;
  frequency: CampaignFrequency;
  isActive: boolean;
  sentCount: number;
}

interface SupportTicket {
  id: string;
  code: string;
  subject: string;
  user: string;
  role: 'Customer' | 'Rider' | 'Organizer' | 'Merchant';
  priority: 'High' | 'Medium' | 'Low';
}

export default function AdminSettingsPage() {
  // Active Tab State ('broadcast' | 'campaigns' | 'support')
  const [activeTab, setActiveTab] = useState<'broadcast' | 'campaigns' | 'support'>('campaigns');

  // Broadcast State
  const [broadcastTarget, setBroadcastTarget] = useState<TargetAudience>('Everyone');
  const [channels, setChannels] = useState<BroadcastChannel[]>(['PUSH']);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastFeedback, setBroadcastFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Campaign State
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignForm, setCampaignForm] = useState({
    title: '',
    body: '',
    category: 'GENERAL_BRAND' as CampaignCategory,
    audience: 'ALL' as string,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    scheduledTime: '08:00',
    frequency: 'DAILY' as CampaignFrequency,
  });
  const [isSubmittingCampaign, setIsSubmittingCampaign] = useState(false);
  const [campaignFeedback, setCampaignFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Support Tickets State
  const [tickets, setTickets] = useState<SupportTicket[]>([
    { id: '1', code: '#104', subject: 'Delayed Delivery', user: 'Sarah L.', role: 'Customer', priority: 'High' },
    { id: '2', code: '#105', subject: 'Payout Withdrawal Issue', user: 'Emeka O.', role: 'Rider', priority: 'High' },
    { id: '3', code: '#106', subject: 'Event Validation Error', user: 'Apex Events', role: 'Organizer', priority: 'Medium' },
    { id: '4', code: '#107', subject: 'KYC Document Re-upload', user: 'Kitchen 9ja', role: 'Merchant', priority: 'High' },
  ]);

  // Fetch Campaigns from NestJS backend (/admin/campaigns)
  const fetchCampaigns = async () => {
    try {
      const res = await api.get('/admin/campaigns');
      setCampaigns(res.data);
    } catch (err) {
      console.error('Failed to load campaigns:', err);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleChannelToggle = (channel: BroadcastChannel) => {
    if (channels.includes(channel)) {
      if (channels.length === 1) return;
      setChannels(channels.filter((c) => c !== channel));
    } else {
      setChannels([...channels, channel]);
    }
  };

  // Submit Instant Broadcast (/admin/broadcast)
  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastBody.trim()) {
      setBroadcastFeedback({ type: 'error', message: 'Please provide both a title and message body.' });
      return;
    }

    setIsBroadcasting(true);
    setBroadcastFeedback(null);

    const targetAudienceMap: Record<TargetAudience, string | undefined> = {
      Everyone: undefined,
      Customers: 'CUSTOMER',
      Riders: 'RIDER',
      Organizers: 'ORGANIZER',
      Merchants: 'MERCHANT',
    };

    try {
      const response = await api.post('/admin/broadcast', {
        title: broadcastTitle,
        body: broadcastBody,
        targetAudience: targetAudienceMap[broadcastTarget],
        channels,
      });

      setBroadcastFeedback({
        type: 'success',
        message: `Broadcast successfully dispatched to ${response.data.recipientCount ?? 'selected'} recipient(s)!`,
      });
      setBroadcastTitle('');
      setBroadcastBody('');
    } catch (err: any) {
      setBroadcastFeedback({
        type: 'error',
        message: err.response?.data?.message || err.message || 'An unexpected error occurred while broadcasting.',
      });
    } finally {
      setIsBroadcasting(false);
    }
  };

  // Create Automated Cron Campaign (/admin/campaigns)
  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignForm.title.trim() || !campaignForm.body.trim()) {
      setCampaignFeedback({ type: 'error', message: 'Please provide both a title and message body.' });
      return;
    }

    setIsSubmittingCampaign(true);
    setCampaignFeedback(null);

    try {
      await api.post('/admin/campaigns', {
        title: campaignForm.title,
        body: campaignForm.body,
        category: campaignForm.category,
        audience: campaignForm.audience,
        startDate: campaignForm.startDate,
        endDate: campaignForm.endDate ? campaignForm.endDate : undefined,
        scheduledTime: campaignForm.scheduledTime,
        frequency: campaignForm.frequency,
      });

      setCampaignFeedback({ type: 'success', message: 'Cron campaign successfully created and scheduled!' });
      setCampaignForm({
        title: '',
        body: '',
        category: 'GENERAL_BRAND',
        audience: 'ALL',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        scheduledTime: '08:00',
        frequency: 'DAILY',
      });
      fetchCampaigns();
    } catch (err: any) {
      setCampaignFeedback({
        type: 'error',
        message: err.response?.data?.message || err.message || 'Failed to create campaign.',
      });
    } finally {
      setIsSubmittingCampaign(false);
    }
  };

  // Toggle Campaign Status (/admin/campaigns/:id/toggle)
  const handleToggleCampaign = async (id: string) => {
    try {
      await api.patch(`/admin/campaigns/${id}/toggle`);
      fetchCampaigns();
    } catch (err) {
      console.error('Failed to toggle campaign status', err);
    }
  };

  const handleResolveTicket = (id: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 p-4">
      {/* Header & Navigation Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-200 pb-4 gap-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-neutral-900">
            Admin Hub & Settings
          </h2>
          <p className="text-xs text-neutral-500 font-medium">
            Manage automated cron campaigns, multi-channel broadcasts, and support queues.
          </p>
        </div>

        <div className="flex bg-neutral-100 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition ${
              activeTab === 'campaigns' ? 'bg-white text-neutral-950 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Cron Campaigns ({campaigns.length})
          </button>
          <button
            onClick={() => setActiveTab('broadcast')}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition ${
              activeTab === 'broadcast' ? 'bg-white text-neutral-950 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Instant Broadcast
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition ${
              activeTab === 'support' ? 'bg-white text-neutral-950 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Support Queue ({tickets.length})
          </button>
        </div>
      </div>

      {/* TAB 1: CRON CAMPAIGNS (GET /admin/campaigns & POST /admin/campaigns) */}
      {activeTab === 'campaigns' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Create Campaign Form */}
          <form onSubmit={handleCreateCampaign} className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
            <h3 className="font-black uppercase text-xs tracking-wider text-neutral-800">
              Schedule Recurring Campaign
            </h3>

            {campaignFeedback && (
              <div className={`p-3 rounded-xl text-xs font-bold ${campaignFeedback.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {campaignFeedback.message}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1">Title</label>
              <input
                type="text"
                value={campaignForm.title}
                onChange={(e) => setCampaignForm({ ...campaignForm, title: e.target.value })}
                className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-medium focus:outline-none"
                placeholder="e.g. 🚀 Flash Delivery Promo"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1">Message Body</label>
              <textarea
                rows={3}
                value={campaignForm.body}
                onChange={(e) => setCampaignForm({ ...campaignForm, body: e.target.value })}
                className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-medium focus:outline-none"
                placeholder="Enter notification content..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1">Category</label>
                <select
                  value={campaignForm.category}
                  onChange={(e) => setCampaignForm({ ...campaignForm, category: e.target.value as CampaignCategory })}
                  className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-medium"
                >
                  <option value="FOOD">Food</option>
                  <option value="SHIPMENT">Shipment</option>
                  <option value="EVENT_LOGISTICS">Event Logistics</option>
                  <option value="PROMOTION">Promotion</option>
                  <option value="GENERAL_BRAND">General Brand</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1">Audience Role</label>
                <select
                  value={campaignForm.audience}
                  onChange={(e) => setCampaignForm({ ...campaignForm, audience: e.target.value })}
                  className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-medium"
                >
                  <option value="ALL">All Users</option>
                  <option value="CUSTOMER">Customers</option>
                  <option value="RIDER">Riders</option>
                  <option value="ORGANIZER">Organizers</option>
                  <option value="MERCHANT">Merchants</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1">Time (HH:mm)</label>
                <input
                  type="time"
                  value={campaignForm.scheduledTime}
                  onChange={(e) => setCampaignForm({ ...campaignForm, scheduledTime: e.target.value })}
                  className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1">Frequency</label>
                <select
                  value={campaignForm.frequency}
                  onChange={(e) => setCampaignForm({ ...campaignForm, frequency: e.target.value as CampaignFrequency })}
                  className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-medium"
                >
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="ONCE">Once</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1">Start Date</label>
                <input
                  type="date"
                  value={campaignForm.startDate}
                  onChange={(e) => setCampaignForm({ ...campaignForm, startDate: e.target.value })}
                  className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1">End Date (Opt)</label>
                <input
                  type="date"
                  value={campaignForm.endDate}
                  onChange={(e) => setCampaignForm({ ...campaignForm, endDate: e.target.value })}
                  className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmittingCampaign}
              className="w-full py-3.5 bg-neutral-950 hover:bg-neutral-900 disabled:bg-neutral-300 text-white rounded-xl font-black uppercase text-xs transition shadow-sm"
            >
              {isSubmittingCampaign ? 'Saving Campaign...' : 'Save & Schedule Campaign'}
            </button>
          </form>

          {/* Campaign List & Toggle */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
            <h3 className="font-black uppercase text-xs tracking-wider text-neutral-800">
              Active Cron Campaigns ({campaigns.length})
            </h3>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {campaigns.length === 0 ? (
                <p className="text-xs text-neutral-400">No campaigns found in database.</p>
              ) : (
                campaigns.map((c) => (
                  <div key={c.id} className="p-4 border border-neutral-100 rounded-2xl flex justify-between items-center bg-neutral-50/50">
                    <div>
                      <h4 className="font-bold text-xs text-neutral-900">{c.title}</h4>
                      <p className="text-[10px] text-neutral-500 mt-0.5">
                        {c.category} • {c.scheduledTime} ({c.audience}) • {c.frequency}
                      </p>
                      <span className="text-[10px] text-emerald-600 font-bold block mt-1">
                        Dispatched: {c.sentCount} devices
                      </span>
                    </div>
                    <button
                      onClick={() => handleToggleCampaign(c.id)}
                      className={`px-3 py-1.5 text-[10px] font-black rounded-xl transition ${
                        c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Paused'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INSTANT BROADCAST (POST /admin/broadcast) */}
      {activeTab === 'broadcast' && (
        <section className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black uppercase text-xs tracking-wider text-neutral-800">
              Multi-Channel Instant Broadcast
            </h3>
            <span className="text-[10px] bg-neutral-100 font-bold px-2.5 py-1 rounded-full text-neutral-600">
              Push & Email
            </span>
          </div>

          {broadcastFeedback && (
            <div className={`p-3.5 mb-4 rounded-xl text-xs font-bold ${broadcastFeedback.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              {broadcastFeedback.message}
            </div>
          )}

          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-neutral-400 mb-2">Target Audience</label>
              <div className="flex flex-wrap gap-2">
                {(['Customers', 'Riders', 'Organizers', 'Merchants', 'Everyone'] as TargetAudience[]).map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setBroadcastTarget(opt)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                      broadcastTarget === opt ? 'bg-neutral-950 text-white shadow-sm' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-neutral-400 mb-2">Delivery Channels</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-700">
                  <input
                    type="checkbox"
                    checked={channels.includes('PUSH')}
                    onChange={() => handleChannelToggle('PUSH')}
                    className="rounded border-neutral-300 text-neutral-950"
                  />
                  Push Notification
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-700">
                  <input
                    type="checkbox"
                    checked={channels.includes('EMAIL')}
                    onChange={() => handleChannelToggle('EMAIL')}
                    className="rounded border-neutral-300 text-neutral-950"
                  />
                  Email (Brevo)
                </label>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1">Title</label>
              <input
                type="text"
                placeholder="e.g. 🎉 Special Platform Update"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1">Message Body</label>
              <textarea
                rows={3}
                placeholder="Enter message content..."
                value={broadcastBody}
                onChange={(e) => setBroadcastBody(e.target.value)}
                className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-medium"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isBroadcasting}
              className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-neutral-300 text-white rounded-xl font-black uppercase text-xs transition shadow-sm"
            >
              {isBroadcasting ? 'Dispatching Broadcast...' : 'Send Instant Broadcast'}
            </button>
          </form>
        </section>
      )}

      {/* TAB 3: SUPPORT TICKETS QUEUE */}
      {activeTab === 'support' && (
        <section className="max-w-2xl mx-auto space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-black uppercase text-xs tracking-wider text-neutral-800">
              Escalated Support Tickets
            </h3>
            <span className="text-[10px] font-bold text-neutral-400">{tickets.length} Pending</span>
          </div>

          <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm">
            {tickets.length === 0 ? (
              <div className="p-8 text-center text-xs font-bold text-neutral-400">
                No open tickets requiring admin attention.
              </div>
            ) : (
              tickets.map((t) => (
                <div key={t.id} className="p-4 border-b last:border-b-0 border-neutral-100 flex justify-between items-center hover:bg-neutral-50/50 transition">
                  <div>
                    <p className="font-bold text-xs text-neutral-900">
                      {t.subject} <span className="text-neutral-400">{t.code}</span>
                    </p>
                    <p className="text-[10px] text-neutral-500 font-medium mt-0.5">
                      {t.user} ({t.role}) • <span className="text-red-600 font-bold">{t.priority} Priority</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => alert(`Opening chat for ticket ${t.code}`)}
                      className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-[9px] font-black uppercase transition text-neutral-800"
                    >
                      Reply
                    </button>
                    <button
                      onClick={() => handleResolveTicket(t.id)}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[9px] font-black uppercase transition"
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}
    </div>
  );
}