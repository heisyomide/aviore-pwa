"use client";

import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Eye,
  Database,
  UserCheck,
  Globe,
  Mail,
  ArrowLeft,
  FileText,
} from "lucide-react";

export default function PrivacyPage() {
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
            <ShieldCheck size={14} />
            <span>NDPA & Global Data Compliance</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-neutral-500 font-mono">
            Last Updated: {lastUpdated} &bull; Aviorè Logistics Technologies Inc.
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-neutral-900/50 border border-neutral-800/80 rounded-3xl p-6 sm:p-10 space-y-10">
          
          {/* Executive Summary */}
          <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 space-y-2 text-xs leading-relaxed text-emerald-200">
            <p className="font-bold text-sm text-emerald-400">At a Glance</p>
            <p>
              Aviorè Go (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) respects your privacy. We collect only necessary data—such as location, contact details, and dispatch parameters—to route logistics orders, process secure escrow payments, and prevent fraud across Osun and Oyo States. We never sell your personal information.
            </p>
          </div>

          {/* Section 1: Information We Collect */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <Database className="text-emerald-500" size={20} />
              <h2>1. Information We Collect</h2>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              When you interact with our web applications or API, we gather data to provide real-time dispatch routing and financial accounting:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-neutral-400 leading-relaxed">
              <li>
                <strong className="text-neutral-200">Account Credentials:</strong> Full name, phone number, email address, and authentication tokens provided during registration.
              </li>
              <li>
                <strong className="text-neutral-200">Delivery & Location Metadata:</strong> Precise GPS coordinates, pickup/destination street addresses, landmarks, recipient contacts, and delivery verification PIN codes.
              </li>
              <li>
                <strong className="text-neutral-200">Financial Data:</strong> Transaction histories, platform ledger shares, and payment gateway references (processed via secure PCI-DSS compliant payment providers).
              </li>
              <li>
                <strong className="text-neutral-200">Device & Telemetry Data:</strong> IP addresses, browser types, device IDs, and page access timestamps collected for system health monitoring.
              </li>
            </ul>
          </section>

          {/* Section 2: How We Use Your Data */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <Eye className="text-emerald-500" size={20} />
              <h2>2. How We Use Your Information</h2>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              We process data strictly under lawful legal bases for operational necessity:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-1">
                <p className="text-xs font-bold text-neutral-200">Dispatch Optimization</p>
                <p className="text-[11px] text-neutral-500">Calculating distance fees, assigning local riders, and broadcasting live shipment tracking links.</p>
              </div>
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-1">
                <p className="text-xs font-bold text-neutral-200">Escrow Security</p>
                <p className="text-[11px] text-neutral-500">Holding and releasing delivery payouts safely upon successful delivery PIN confirmation.</p>
              </div>
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-1">
                <p className="text-xs font-bold text-neutral-200">Fraud Prevention</p>
                <p className="text-[11px] text-neutral-500">Detecting irregular order generation, duplicate tracking numbers, and unauthorized access.</p>
              </div>
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-1">
                <p className="text-xs font-bold text-neutral-200">Automated Communications</p>
                <p className="text-[11px] text-neutral-500">Sending SMS notifications, email waybills, and operational dispatch updates.</p>
              </div>
            </div>
          </section>

          {/* Section 3: Data Sharing & Third Parties */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <Globe className="text-emerald-500" size={20} />
              <h2>3. Data Sharing & Disclosure</h2>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              We do not sell, rent, or trade personal information to third-party marketers. Data is shared exclusively with authorized partners essential to fulfillment:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-neutral-400 leading-relaxed">
              <li>
                <strong className="text-neutral-200">Assigned Dispatch Riders:</strong> Riders receive pickup/delivery addresses, recipient contact numbers, and parcel handling flags.
              </li>
              <li>
                <strong className="text-neutral-200">Infrastructure & Mapping Providers:</strong> Anonymized coordinate points are processed through mapping APIs (e.g., Google Maps API) for geocoding and distance calculation.
              </li>
              <li>
                <strong className="text-neutral-200">Regulatory & Legal Authorities:</strong> We disclose data if required by Nigerian law or court order to investigate fraud or security breaches.
              </li>
            </ul>
          </section>

          {/* Section 4: Storage & Security */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <Lock className="text-emerald-500" size={20} />
              <h2>4. Security & Data Retention</h2>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              We implement industry-standard encryption protocols (TLS 1.3 in transit, AES-256 at rest) to safeguard user records. Auth tokens are secured with JSON Web Token (JWT) standards.
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Shipment records are retained for audit and accounting purposes in accordance with local financial regulations, after which they are archived or permanently anonymized.
            </p>
          </section>

          {/* Section 5: Your Rights */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <UserCheck className="text-emerald-500" size={20} />
              <h2>5. Your Privacy Rights</h2>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Under applicable regulations (such as the Nigeria Data Protection Act), you hold the following rights regarding your personal information:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
              <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 text-center">
                <span className="font-bold text-neutral-200 block mb-1">Access & Export</span>
                <span className="text-[11px] text-neutral-500">Request a copy of your personal data and shipment records.</span>
              </div>
              <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 text-center">
                <span className="font-bold text-neutral-200 block mb-1">Rectification</span>
                <span className="text-[11px] text-neutral-500">Update or correct inaccurate profile or account details.</span>
              </div>
              <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 text-center">
                <span className="font-bold text-neutral-200 block mb-1">Account Deletion</span>
                <span className="text-[11px] text-neutral-500">Request account erasure subject to pending ledger obligations.</span>
              </div>
            </div>
          </section>

          {/* Section 6: Contact Us */}
          <section className="space-y-3 border-t border-neutral-800/80 pt-6">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <Mail className="text-emerald-500" size={20} />
              <h2>6. Contact Data Protection Officer</h2>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              For questions regarding this policy or to exercise your data rights, reach our Data Protection team:
            </p>
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-xs text-neutral-300 space-y-1">
              <p><strong className="text-white">Aviorè Logistics Technologies Inc.</strong></p>
              <p>Email: <a href="mailto:privacy@aviore.com" className="text-emerald-400 hover:underline">privacy@aviore.com</a></p>
              <p>Support: <a href="mailto:support@aviore.com" className="text-emerald-400 hover:underline">support@aviore.com</a></p>
              <p className="text-neutral-500 text-[11px] pt-1">Coverage Hubs: Osogbo, Ede, Ilesa, Ibadan, Ogbomoso</p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}