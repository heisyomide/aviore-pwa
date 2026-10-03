"use client";

import React from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Lock, 
  PackageCheck, 
  Wallet, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle,
  Truck
} from "lucide-react";

export default function HowEscrowWorksPage() {
  const steps = [
    {
      number: "01",
      title: "Create Shipment & Fund Escrow",
      description:
        "When you create a dispatch request, your payment is securely deposited into our locked Escrow account—not sent to the dispatch rider directly.",
      icon: Wallet,
      badge: "Step 1",
    },
    {
      number: "02",
      title: "Rider Picks Up & Delivers",
      description:
        "The assigned driver accepts the order, collects your item, and safely transports it to the destination using real-time GPS tracking.",
      icon: Truck,
      badge: "Step 2",
    },
    {
      number: "03",
      title: "Recipient Verifies Package",
      description:
        "Upon delivery, the recipient inspects the item and provides a 4-digit verification PIN (or confirms in-app) to confirm successful receipt.",
      icon: PackageCheck,
      badge: "Step 3",
    },
    {
      number: "04",
      title: "Funds Automatically Released",
      description:
        "Once confirmed, the escrow vault instantly unlocks and releases payment to the rider's wallet. Total peace of mind guaranteed.",
      icon: ShieldCheck,
      badge: "Step 4",
    },
  ];

  const features = [
    {
      title: "100% Protection against Fraud",
      desc: "Riders are only paid after successful delivery verification.",
    },
    {
      title: "Dispute Resolution Engine",
      desc: "If an item is damaged or missing, funds remain locked while our 24/7 support investigates.",
    },
    {
      title: "Automated Refunds",
      desc: "If a delivery is cancelled or unfulfilled, your funds are returned to your wallet instantly.",
    },
    {
      title: "Bank-Grade Encryption",
      desc: "All transactions and vault balances are secured with high-level SSL and AES-256 encryption.",
    },
  ];

  const faqs = [
    {
      q: "What happens if my package is lost or damaged?",
      a: "Because the funds are held safely in Escrow, the rider does not get paid. Our support team steps in immediately to process a claim and refund your money.",
    },
    {
      q: "How does the rider know they will get paid?",
      a: "The rider receives proof that the funds are reserved in Escrow before they accept the job, giving them 100% confidence to complete the delivery.",
    },
    {
      q: "Are there extra fees for Escrow protection?",
      a: "No! Escrow protection is built directly into all Aviorè Go delivery transactions at zero extra cost to you.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6">
            <Lock className="w-3.5 h-3.5" />
            <span>Guaranteed Secure Deliveries</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-6">
            How <span className="text-emerald-400">Aviorè Escrow</span> Protects You
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8">
            Never worry about unfulfilled deliveries again. Our smart Escrow system holds funds safely until your package reaches its destination.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard/shipment/create"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
            >
              Send Package Safely
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#faqs"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-center transition-all"
            >
              Read FAQs
            </a>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-10">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900">
              The 4-Step Escrow Lifecycle
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Simple, transparent, and completely automated.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="relative flex flex-col justify-between p-6 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-2xl font-black text-slate-200 group-hover:text-emerald-200 transition-colors">
                        {step.number}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{step.badge}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Escrow Matters */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 sm:p-12 text-white">
          <div className="max-w-3xl mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Built for Total Confidence
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Whether you are an e-commerce vendor sending goods to customers or an individual dispatching urgent documents, our Escrow mechanism guarantees protection for both parties.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700/50"
              >
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-100 text-sm sm:text-base">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section id="faqs" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Escrow FAQs
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm"
            >
              <h3 className="font-bold text-slate-900 text-base mb-2">
                {faq.q}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="text-center p-8 sm:p-10 rounded-2xl bg-emerald-50 border border-emerald-100">
          <h3 className="text-xl font-bold text-emerald-950 mb-2">
            Ready to experience risk-free delivery?
          </h3>
          <p className="text-sm text-emerald-800 mb-6">
            Dispatch items across town with complete peace of mind.
          </p>
          <Link
            href="/dashboard/shipment/create"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors shadow-md"
          >
            Create Protected Shipment
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}