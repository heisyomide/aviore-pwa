"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  MessageSquare,
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Package,
  ShieldCheck,
  CreditCard,
  Truck,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  LifeBuoy,
} from "lucide-react";

export default function SupportPage() {
  // Ticket form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [category, setCategory] = useState("GENERAL");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    // Simulate ticket submission
    setIsSubmitted(true);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="bg-neutral-950 text-neutral-300 min-h-screen font-sans">
      {/* Top Banner Header */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 border-b border-neutral-900 bg-neutral-900/30">
        <div className="max-w-4xl mx-auto space-y-4 text-center sm:text-left">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-emerald-400 transition-colors mb-2"
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>

          <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 px-3.5 py-1 rounded-full text-xs font-semibold">
            <LifeBuoy size={14} />
            <span>24/7 Operations & Helpdesk</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            How can we help you today?
          </h1>
          <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
            Get instant support for shipment tracking, escrow payments, rider assignments, or submit a direct ticket to our operational team.
          </p>
        </div>
      </section>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {/* Quick Help Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-neutral-900/60 border border-neutral-800 p-5 rounded-2xl space-y-2 hover:border-emerald-500/50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Truck size={20} />
            </div>
            <h3 className="font-bold text-sm text-white">Live Tracking & Rider</h3>
            <p className="text-[11px] text-neutral-400">Issues with ongoing dispatch, GPS updates, or contacting your rider.</p>
          </div>

          <div className="bg-neutral-900/60 border border-neutral-800 p-5 rounded-2xl space-y-2 hover:border-emerald-500/50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-bold text-sm text-white">Escrow & PIN Release</h3>
            <p className="text-[11px] text-neutral-400">Confirmation PIN errors, delayed ledger payouts, or escrow disputes.</p>
          </div>

          <div className="bg-neutral-900/60 border border-neutral-800 p-5 rounded-2xl space-y-2 hover:border-emerald-500/50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <CreditCard size={20} />
            </div>
            <h3 className="font-bold text-sm text-white">Billing & Pricing</h3>
            <p className="text-[11px] text-neutral-400">Distance fee calculations, invoice receipts, and wallet top-ups.</p>
          </div>

          <div className="bg-neutral-900/60 border border-neutral-800 p-5 rounded-2xl space-y-2 hover:border-emerald-500/50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Package size={20} />
            </div>
            <h3 className="font-bold text-sm text-white">Merchant Accounts</h3>
            <p className="text-[11px] text-neutral-400">API key setup, bulk manifest uploads, and enterprise discounts.</p>
          </div>
        </div>

        {/* Contact Form & Direct Channels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Direct Channels Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MessageSquare size={20} className="text-emerald-500" />
                Direct Communication Channels
              </h2>
              <p className="text-xs text-neutral-400">
                Reach out directly to our central dispatch hubs in Osun and Oyo State.
              </p>
            </div>

            <div className="space-y-3">
              {/* Emergency Hotline */}
              <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                  <PhoneCall size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 font-mono uppercase font-semibold">24/7 Support Line</span>
                  <p className="text-sm font-bold text-white font-mono">+234 (0) 800-AVIORE-GO</p>
                </div>
              </div>

              {/* Email Support */}
              <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 font-mono uppercase font-semibold">Email Desk</span>
                  <p className="text-sm font-bold text-white">support@aviore.com</p>
                </div>
              </div>

              {/* Regional Hubs */}
              <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={18} />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-500 font-mono uppercase font-semibold">Operational Coverage Hubs</span>
                  <p className="text-xs text-neutral-300 font-medium">Osogbo, Ede, Ilesa (Osun State)</p>
                  <p className="text-xs text-neutral-300 font-medium">Ibadan, Ogbomoso, Oyo Town (Oyo State)</p>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 font-mono uppercase font-semibold">Dispatch Response Time</span>
                  <p className="text-xs font-semibold text-emerald-400">Average response &lt; 15 minutes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Ticket Form */}
          <div className="lg:col-span-7 bg-neutral-900/50 border border-neutral-800/80 rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Send size={18} className="text-emerald-500" />
                Submit a Support Ticket
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Fill out the details below and an operations specialist will review your request.
              </p>
            </div>

            {isSubmitted ? (
              <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 p-6 rounded-2xl space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2 font-bold text-base text-emerald-400">
                  <CheckCircle2 size={20} />
                  <span>Ticket Logged Successfully!</span>
                </div>
                <p className="text-xs text-emerald-300/80 leading-relaxed">
                  Thank you for contacting us. Ticket reference <strong className="font-mono text-white">#AV-{Math.floor(100000 + Math.random() * 900000)}</strong> has been opened. Our dispatch team will reply via email shortly.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors"
                >
                  Submit Another Ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-300">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Adewale Adebayo"
                      className="w-full bg-neutral-950 border border-neutral-800 text-xs text-white rounded-xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-300">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="adewale@example.com"
                      className="w-full bg-neutral-950 border border-neutral-800 text-xs text-white rounded-xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-300">Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 text-xs text-white rounded-xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="GENERAL">General Enquiry</option>
                      <option value="TRACKING">Shipment Tracking Issue</option>
                      <option value="ESCROW">Escrow / PIN Code Problem</option>
                      <option value="PAYMENT">Billing / Payment Dispute</option>
                      <option value="MERCHANT">Merchant / API Assistance</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-300">Tracking Code (Optional)</label>
                    <input
                      type="text"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                      placeholder="e.g. TRK-89201"
                      className="w-full bg-neutral-950 border border-neutral-800 text-xs text-white rounded-xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">How can we help? *</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details regarding your issue or inquiry..."
                    className="w-full bg-neutral-950 border border-neutral-800 text-xs text-white rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950"
                >
                  <Send size={15} />
                  <span>Send Support Request</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-8 max-w-4xl mx-auto pt-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
              <HelpCircle size={22} className="text-emerald-500" />
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-neutral-400">Quick solutions to common operational questions.</p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "What should I do if my recipient loses their delivery PIN code?",
                a: "Senders can view or resend the 4-digit verification PIN anytime from their Active Manifest dashboard. Alternatively, contact support with the tracking reference for emergency pin override verification."
              },
              {
                q: "What happens if a rider does not show up at the pickup location?",
                a: "If a rider is delayed past the estimated arrival window, our automated dispatch system automatically re-assigns the nearest available standby rider to ensure minimal disruption."
              },
              {
                q: "How are refunds handled for cancelled orders?",
                a: "If an order is cancelled prior to rider dispatch, escrow funds are instantly refunded to your platform wallet balance. For post-dispatch cancellations, partial trip charges apply."
              },
              {
                q: "How can I integrate Aviorè Go with my e-commerce store?",
                a: "Merchants can generate production API keys directly in their Merchant Dashboard under API Settings to automate rate estimations and order creations."
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex justify-between items-center text-xs font-bold text-white hover:text-emerald-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-5 sm:px-5 text-xs text-neutral-400 leading-relaxed border-t border-neutral-800/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}