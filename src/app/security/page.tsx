"use client";

import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Server,
  Zap,
  Eye,
  FileCode,
  Mail,
  ArrowLeft,
  CheckCircle2,
  Cpu,
} from "lucide-react";

export default function SecurityPage() {
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
            <span>Bank-Grade Encryption & Escrow Safeguards</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Security Policy & Architecture
          </h1>
          <p className="text-xs text-neutral-500 font-mono">
            Last Reviewed: {lastUpdated} &bull; Aviorè Logistics Technologies Inc.
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-neutral-900/50 border border-neutral-800/80 rounded-3xl p-6 sm:p-10 space-y-10">

          {/* Core Security Commitments Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                <Lock size={18} />
              </div>
              <h3 className="font-bold text-xs text-white">TLS 1.3 & AES-256</h3>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                All data in transit is encrypted with TLS 1.3. Static databases utilize AES-256 military-grade encryption.
              </p>
            </div>

            <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                <KeyRound size={18} />
              </div>
              <h3 className="font-bold text-xs text-white">PIN Verification</h3>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Automated 4-digit token generated on manifest creation. Escrow funds unlock only upon valid PIN entry.
              </p>
            </div>

            <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                <Server size={18} />
              </div>
              <h3 className="font-bold text-xs text-white">Isolated Infrastructure</h3>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Server clusters run within isolated VPC subnets with automated rate limiting and threat telemetry.
              </p>
            </div>
          </div>

          {/* Section 1: Authentication & Access Control */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <KeyRound className="text-emerald-500" size={20} />
              <h2>1. Account & API Authentication Security</h2>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              We enforce strict identity verification layers across user accounts, merchant API endpoints, and rider applications:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-neutral-400 leading-relaxed">
              <li>
                <strong className="text-neutral-200">Stateless JWT Auth:</strong> Sessions are authorized via cryptographically signed JSON Web Tokens (JWT) with short expiration lifetimes and automatic refresh routines.
              </li>
              <li>
                <strong className="text-neutral-200">Merchant API Keys:</strong> Enterprise integration keys are hashed and masked in database storage. Rotation tools allow merchants to invalidate compromised credentials instantly.
              </li>
              <li>
                <strong className="text-neutral-200">Rider Verification:</strong> Dispatch riders undergo multi-step identity verification including biometric verification and physical hub onboarding before receiving live orders.
              </li>
            </ul>
          </section>

          {/* Section 2: Escrow & Financial Protection */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <Zap className="text-emerald-500" size={20} />
              <h2>2. Escrow & Settlement Integrity</h2>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Financial ledger operations are segregated from core routing systems to prevent unauthorized manipulation or duplicate payouts:
            </p>
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Automated Ledger Auditing</strong>
                  <span className="text-neutral-400 text-[11px]">System balances are verified in real time. Discrepancies automatically lock payout triggers until verified by human compliance teams.</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">PCI-DSS Compliant Partners</strong>
                  <span className="text-neutral-400 text-[11px]">We never store raw debit card numbers or bank account PINs. Payment tokenization is handled via PCI-DSS Level 1 certified payment gateways.</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Telemetry, Tracking & GPS Integrity */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <Eye className="text-emerald-500" size={20} />
              <h2>3. Real-Time Telemetry & Anti-Spoofing</h2>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Dispatch coordinates are calculated using secured spatial algorithms with anti-tampering checks:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-neutral-400 leading-relaxed">
              <li>
                <strong className="text-neutral-200">GPS Spoof Detection:</strong> Rider applications evaluate location velocity vectors to flag mock location generators or unnatural spatial jumps.
              </li>
              <li>
                <strong className="text-neutral-200">Public Tracking Hash:</strong> Recipient delivery tracking links utilize non-predictable, unique 32-character hashes to prevent unauthorized package enumeration.
              </li>
            </ul>
          </section>

          {/* Section 4: Infrastructure & Threat Mitigation */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <Cpu className="text-emerald-500" size={20} />
              <h2>4. Infrastructure Defense & DDoS Protection</h2>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Our cloud architecture is hardened against distributed denial-of-service (DDoS) attacks, automated bot abuse, and injection threats:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-1">
                <p className="text-xs font-bold text-neutral-200">Rate Limiting & Web Firewall</p>
                <p className="text-[11px] text-neutral-500">Intelligent edge filtering blocks malicious scraping, brute-force login attempts, and request flooding.</p>
              </div>
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-1">
                <p className="text-xs font-bold text-neutral-200">Automated Daily Backups</p>
                <p className="text-[11px] text-neutral-500">Database snapshots are encrypted and redundantly stored in separate geographical availability zones.</p>
              </div>
            </div>
          </section>

          {/* Section 5: Responsible Disclosure */}
          <section className="space-y-3 border-t border-neutral-800/80 pt-6">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <FileCode className="text-emerald-500" size={20} />
              <h2>5. Vulnerability Reporting & Responsible Disclosure</h2>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              We welcome security researchers and developers to test our public systems responsibly. If you discover a vulnerability or security flaw, please report it directly to our security response team:
            </p>
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-xs text-neutral-300 space-y-1">
              <p><strong className="text-white">Aviorè Security Engineering</strong></p>
              <p>Security Contact: <a href="mailto:security@aviore.com" className="text-emerald-400 hover:underline">security@aviore.com</a></p>
              <p className="text-neutral-500 text-[11px] pt-1">Please include reproduction steps and proof-of-concept details in your submission. We pledge to acknowledge reports within 24 hours.</p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}