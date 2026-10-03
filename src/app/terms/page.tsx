"use client";

import Link from "next/link";
import {
  FileText,
  ShieldAlert,
  CreditCard,
  Truck,
  Scale,
  AlertTriangle,
  Mail,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

export default function TermsPage() {
  const lastUpdated = "July 24, 2026";

  return (
    <div className="bg-neutral-950 text-neutral-300 min-h-screen font-sans">
      {/* Top Banner Header */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 border-b border-neutral-900 bg-neutral-900/30">
        <div className="max-w-4xl mx-auto space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-emerald-400 transition-colors mb-2"
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>

          <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 px-3.5 py-1 rounded-full text-xs font-semibold">
            <Scale size={14} />
            <span>Operational Governance Agreement</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-neutral-500 font-mono">
            Effective Date: {lastUpdated} &bull; Aviorè Logistics Technologies Inc.
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-neutral-900/50 border border-neutral-800/80 rounded-3xl p-6 sm:p-10 space-y-10">

          {/* Quick Summary Note */}
          <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 space-y-2 text-xs leading-relaxed text-emerald-200">
            <p className="font-bold text-sm text-emerald-400">Agreement Overview</p>
            <p>
              By accessing or using Aviorè Go (&quot;Platform&quot;), including booking deliveries, dispatching packages, or registering as a merchant or rider, you agree to be bound by these Terms of Service. Please read them carefully before initiating shipments.
            </p>
          </div>

          {/* Section 1: User Accounts & Eligibility */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <FileText className="text-emerald-500" size={20} />
              <h2>1. Account Registration & Responsibilities</h2>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              To use our automated logistics engine, you must register an account and adhere to the following rules:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-neutral-400 leading-relaxed">
              <li>
                <strong className="text-neutral-200">Age & Identity Requirement:</strong> You must be at least 18 years old and provide valid, accurate personal or business details during signup.
              </li>
              <li>
                <strong className="text-neutral-200">Account Security:</strong> You are responsible for safeguarding your login credentials and tracking authentication access. Any activity under your account remains your legal responsibility.
              </li>
              <li>
                <strong className="text-neutral-200">Account Termination:</strong> We reserve the right to suspend or terminate accounts engaging in fraud, harassment of riders, or non-payment of delivery fees.
              </li>
            </ul>
          </section>

          {/* Section 2: Prohibited Items */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <AlertTriangle className="text-amber-500" size={20} />
              <h2>2. Prohibited & Hazardous Packages</h2>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              For public safety and regulatory compliance, customers are strictly prohibited from submitting shipments containing any of the following:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-1">
                <p className="text-xs font-bold text-amber-400">Illegal Substances & Contraband</p>
                <p className="text-[11px] text-neutral-500">Narcotics, illicit drugs, unapproved pharmaceuticals, or contraband under Nigerian Law.</p>
              </div>
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-1">
                <p className="text-xs font-bold text-amber-400">Weapons & Explosives</p>
                <p className="text-[11px] text-neutral-500">Firearms, ammunition, fireworks, flammable liquids, corrosive chemicals, or toxic materials.</p>
              </div>
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-1">
                <p className="text-xs font-bold text-amber-400">High-Value Uninsured Cash</p>
                <p className="text-[11px] text-neutral-500">Physical fiat currency, bullion, bearer bonds, or uncertified precious metals.</p>
              </div>
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-1">
                <p className="text-xs font-bold text-amber-400">Hazardous Waste</p>
                <p className="text-[11px] text-neutral-500">Biohazardous waste, radioactive materials, or improperly sealed organic hazards.</p>
              </div>
            </div>
            <p className="text-[11px] text-neutral-500 italic pt-1">
              Attempting to send prohibited items will result in immediate police referral and permanent account termination.
            </p>
          </section>

          {/* Section 3: Delivery Fees, Escrow & Payments */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <CreditCard className="text-emerald-500" size={20} />
              <h2>3. Pricing, Escrow Protection & Settlements</h2>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Shipping calculations, merchant ledger splitting, and escrow operations adhere to strict automated rules:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-neutral-400 leading-relaxed">
              <li>
                <strong className="text-neutral-200">Dynamic Pricing Engine:</strong> Delivery fees are calculated dynamically based on distance (km), weight range, and optional flags (Express, Fragile, Waterproof).
              </li>
              <li>
                <strong className="text-neutral-200">Escrow Release Protocol:</strong> Funds are safely escrowed upon order creation and are released to the rider/platform upon successful recipient confirmation using the 4-digit verification PIN.
              </li>
              <li>
                <strong className="text-neutral-200">Cancellation Policy:</strong> Orders cancelled before rider dispatch incur no penalty. Cancellations made after a rider arrives at the pickup point are subject to a standard cancellation fee.
              </li>
            </ul>
          </section>

          {/* Section 4: Dispatch & Recipient Verification */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <Truck className="text-emerald-500" size={20} />
              <h2>4. Dispatch Operations & Verification PINs</h2>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              To guarantee successful handoffs, senders and recipients must follow standard doorstep rules:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-neutral-400 leading-relaxed">
              <li>
                <strong className="text-neutral-200">Verification PIN:</strong> The recipient must provide the unique delivery PIN generated on the sender&apos;s manifest to complete the handoff.
              </li>
              <li>
                <strong className="text-neutral-200">Waiting Time Allowance:</strong> Riders offer a complimentary 10-minute waiting period at pickup and drop-off locations. Idle time exceeding 10 minutes may incur waiting surcharges.
              </li>
              <li>
                <strong className="text-neutral-200">Undeliverable Packages:</strong> If the recipient is unreachable after reasonable attempts, packages are returned to the origin address at the sender&apos;s expense.
              </li>
            </ul>
          </section>

          {/* Section 5: Liability & Claims */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <ShieldAlert className="text-emerald-500" size={20} />
              <h2>5. Limitation of Liability & Damage Claims</h2>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Aviorè Go provides logistics coordination technology. While we enforce strict rider verification, limits on liability apply:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-neutral-400 leading-relaxed">
              <li>
                <strong className="text-neutral-200">Declared Value Limit:</strong> Standard liability for lost or damaged non-fragile packages is capped at the maximum insured package threshold unless declared under special coverage.
              </li>
              <li>
                <strong className="text-neutral-200">Packaging Compliance:</strong> Fragile or delicate items must be properly packed by the sender. Claims for improperly packaged items without appropriate handling tags will be declined.
              </li>
              <li>
                <strong className="text-neutral-200">Force Majeure:</strong> We are not liable for delays or losses caused by acts of God, severe weather, civil unrest, or major road blockades beyond reasonable operational control.
              </li>
            </ul>
          </section>

          {/* Section 6: Contact & Support */}
          <section className="space-y-3 border-t border-neutral-800/80 pt-6">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <Mail className="text-emerald-500" size={20} />
              <h2>6. Contact Legal & Operational Support</h2>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              For questions, dispute resolutions, or legal inquiries regarding these Terms of Service, reach out to our team:
            </p>
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-xs text-neutral-300 space-y-1">
              <p><strong className="text-white">Aviorè Logistics Technologies Inc.</strong></p>
              <p>Legal & Compliance: <a href="mailto:legal@aviore.com" className="text-emerald-400 hover:underline">legal@aviore.com</a></p>
              <p>General Support: <a href="mailto:support@aviore.com" className="text-emerald-400 hover:underline">support@aviore.com</a></p>
              <p className="text-neutral-500 text-[11px] pt-1">Coverage Hubs: Osun State & Oyo State, Nigeria</p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}