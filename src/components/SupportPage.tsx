'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Headset, MessageSquare, ShieldAlert, Phone, FileText, ChevronRight } from 'lucide-react';

export default function SupportPage({ userRole = 'CUSTOMER' }: { userRole?: 'CUSTOMER' | 'RIDER' }) {
  const [activeTab, setActiveTab] = useState<'faq' | 'tickets'>('faq');

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-neutral-900 text-white p-6 rounded-2xl">
        <div className="flex items-center gap-3">
          <Headset className="w-8 h-8 text-emerald-400" />
          <div>
            <h1 className="text-xl font-bold">How can we help you?</h1>
            <p className="text-xs text-neutral-400">
              {userRole === 'RIDER' ? 'Rider Support Desk' : 'Customer Support Desk'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Disputed Orders / Active Job Support */}
        <Link 
          href="/support/disputes"
          className="p-4 bg-white border border-neutral-200 rounded-2xl flex items-center justify-between hover:border-neutral-900 transition"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-neutral-900">Report an Issue / Dispute</h3>
              <p className="text-[11px] text-neutral-500">Order issues, missing items, delays</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </Link>

        {/* Live Admin Support Chat */}
        <Link 
          href="/support/chat"
          className="p-4 bg-white border border-neutral-200 rounded-2xl flex items-center justify-between hover:border-neutral-900 transition"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-neutral-900">Chat with Support</h3>
              <p className="text-[11px] text-neutral-500">Talk to live support team</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </Link>
      </div>

      {/* FAQ Section */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {userRole === 'RIDER' ? (
            <>
              <FaqItem question="How do I report a delivery issue?" answer="Go to your Active Job screen, tap the Support icon, or submit a dispute ticket under Disputes." />
              <FaqItem question="What if the customer is not responding?" answer="Use the in-app calling or messaging tool. If they don't answer after 10 minutes, contact support." />
            </>
          ) : (
            <>
              <FaqItem question="Where is my order?" answer="You can track your rider in real time on the live dispatch map or chat with them directly." />
              <FaqItem question="How do I request a refund?" answer="Navigate to your Order History, select the job, and click 'Open Dispute'." />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-neutral-100 pb-3">
      <button 
        onClick={() => setOpen(!open)} 
        className="w-full flex justify-between items-center text-left text-xs font-bold text-neutral-800"
      >
        <span>{question}</span>
        <span className="text-neutral-400">{open ? '−' : '+'}</span>
      </button>
      {open && <p className="text-xs text-neutral-500 mt-2">{answer}</p>}
    </div>
  );
}