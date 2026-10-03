'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, QrCode as QrIcon, MapPin, Bus, Copy, Check, Navigation } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { eventsApi } from '@/src/lib/eventsApi';

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const data = await eventsApi.getMyTickets();
      setTickets(data);
    } catch (error) {
      console.error('Failed to load tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl py-9 mx-auto pb-12">
      {/* Top Navigation / Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/profile"
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-900 transition hover:bg-neutral-50 shadow-sm"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-neutral-950">My Event Tickets</h1>
            <p className="text-xs text-neutral-500">Your official transit bus passes and boarding QR tokens.</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-neutral-400 font-mono text-sm">Loading your tickets...</div>
      ) : tickets.length === 0 ? (
        <div className="rounded-3xl border border-neutral-200 bg-white p-12 text-center space-y-4 shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
            <Bus className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900">No active tickets found</h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">You haven't booked any event transit seats yet. Explore upcoming events to secure your ride.</p>
          </div>
          <Link
            href="/dashboard/events"
            className="inline-block rounded-2xl bg-green-600 px-6 py-3 text-xs font-bold text-white transition hover:bg-green-700 shadow-md"
          >
            Explore Events & Transit
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm hover:border-green-500 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            >
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase ${ticket.boardingStatus === 'CHECKED_IN' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                    {ticket.boardingStatus.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-mono text-neutral-400">Ref: {ticket.id.slice(0, 8)}</span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-neutral-950">{ticket.event?.title}</h3>
                  <p className="text-xs font-medium text-neutral-600 mt-1 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-green-600" />
                    <span>Route: {ticket.route?.originCity} ➔ {ticket.route?.destination}</span>
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-0.5 ml-5">
                    Pickup: {ticket.pickupPoint?.name} ({ticket.pickupPoint?.address})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                {/* Track on Map Button */}
                {ticket.tripId && (
                  <Link
                    href={`/dashboard/events/trips/${ticket.tripId}/map`}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-2xl bg-green-50 px-4 py-3 text-xs font-bold text-green-700 border border-green-200 transition hover:bg-green-100 shadow-sm"
                  >
                    <Navigation className="h-4 w-4" />
                    <span>Live Map</span>
                  </Link>
                )}

                {/* View QR Code Button */}
                <button
                  onClick={() => setSelectedTicket(ticket)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-5 py-3 text-xs font-bold text-white transition hover:bg-neutral-900 shadow-sm"
                >
                  <QrIcon className="h-4 w-4" />
                  <span>View QR Pass</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Code Modal Drawer with Safe Scrolling */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 space-y-5 shadow-2xl my-auto max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 shrink-0">
              <div className="text-left">
                <h3 className="text-base font-black text-neutral-950">{selectedTicket.event?.title}</h3>
                <p className="text-xs text-neutral-500 font-mono">Boarding Pass</p>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-neutral-600 hover:bg-neutral-200"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="space-y-4 overflow-y-auto pr-1">
              {/* Real Scannable QR Code Box */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 flex flex-col items-center justify-center space-y-3">
                <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex items-center justify-center">
                  <QRCodeSVG
                    value={selectedTicket.qrToken}
                    size={160}
                    level="H"
                    includeMargin={false}
                  />
                </div>
                <p className="text-xs text-neutral-600 font-medium text-center">
                  Show this QR code to the bus driver or checkpoint marshal at <span className="font-bold text-neutral-950">{selectedTicket.pickupPoint?.name}</span>.
                </p>
              </div>

              {/* Manual Copy Booking ID Box for fallback check-ins */}
              <div className="bg-neutral-100/80 border border-neutral-200 rounded-2xl p-3 flex items-center justify-between">
                <div className="space-y-0.5 overflow-hidden pr-2">
                  <p className="text-[10px] uppercase font-mono tracking-wider text-neutral-500 font-bold">Booking / Ticket ID (Manual Entry)</p>
                  <p className="text-xs font-mono font-bold text-neutral-900 truncate">{selectedTicket.qrToken}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(selectedTicket.qrToken)}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-neutral-200 text-neutral-800 hover:bg-neutral-50 text-xs font-bold shadow-sm transition-all"
                >
                  {copied ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Status & Payment info */}
              <div className="space-y-2 text-left bg-neutral-50 p-4 rounded-2xl text-xs border border-neutral-200">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Status:</span>
                  <span className="font-bold text-green-600">{selectedTicket.boardingStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Amount Paid:</span>
                  <span className="font-bold text-neutral-950">₦{Number(selectedTicket.amountPaid).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Fixed Action Button at Bottom */}
            <div className="pt-2 shrink-0">
              <button
                onClick={() => setSelectedTicket(null)}
                className="w-full bg-neutral-950 hover:bg-neutral-900 text-white font-bold py-3.5 rounded-2xl text-xs transition-colors shadow-md"
              >
                Close Pass
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}