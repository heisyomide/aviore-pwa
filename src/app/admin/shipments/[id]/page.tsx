'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/src/lib/api';

export interface ShipmentDetails {
  id: string;
  trackingCode: string;
  status: 'PENDING' | 'WAITING_RIDER' | 'ACCEPTED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  pickupAddress: string;
  dropoffAddress: string;
  recipientPhone: string;
  weight: number;
  totalPrice: number;
  platformShare: number;
  deliveryPin?: string | null;
  createdAt: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  rider?: {
    user: {
      firstName: string;
      lastName: string;
    };
  } | null;
}

export default function ShipmentDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [shipment, setShipment] = useState<ShipmentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchShipmentDetails() {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await api.get<ShipmentDetails>(`/admin/shipments/${id}`);
        setShipment(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Fatal gateway sync error while reading database variables.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchShipmentDetails();
  }, [id]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'IN_TRANSIT': return 'bg-blue-50 text-blue-600 border border-blue-100';
      case 'PENDING': return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'WAITING_RIDER': return 'bg-purple-50 text-purple-600 border border-purple-100';
      case 'ACCEPTED': return 'bg-indigo-50 text-indigo-600 border border-indigo-100';
      case 'PICKED_UP': return 'bg-cyan-50 text-cyan-600 border border-cyan-100';
      case 'DELIVERED': return 'bg-green-50 text-green-600 border border-green-100';
      case 'CANCELLED': return 'bg-red-50 text-red-600 border border-red-100';
      default: return 'bg-neutral-100 text-neutral-600 border border-neutral-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center font-mono text-[10px] tracking-widest text-neutral-400 uppercase animate-pulse">
        Ingesting package metrics...
      </div>
    );
  }

  if (error || !shipment) {
    return (
      <div className="space-y-4 font-mono text-xs max-w-xl mx-auto py-12">
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl font-bold">
          ⚠️ Operational Notice: {error || 'Requested manifest entity not encountered.'}
        </div>
        <button onClick={() => router.back()} className="text-neutral-900 font-black uppercase tracking-wider hover:underline">
          ← Return to pipeline list
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24 space-y-6">
      {/* Header Context Frame */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-5">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-neutral-400 font-bold hover:text-neutral-950 transition-colors">
            ← Back
          </button>
          <div>
            <h2 className="text-xl font-black text-neutral-950 uppercase tracking-tight">Shipment #{String(shipment.id).slice(-6).toUpperCase()}</h2>
            <p className="text-[10px] font-mono text-neutral-400 mt-0.5 tracking-tight">System Global UUID: {shipment.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[10px] font-mono font-bold tracking-widest border border-neutral-200 rounded px-2 py-0.5 bg-neutral-50 text-neutral-600">
            {shipment.trackingCode}
          </span>
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusStyle(shipment.status)}`}>
            {shipment.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Synchronized Core Metrics Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DetailCard title="Tracking Details" items={[
          { label: 'Weight Payload Metrics', value: shipment.weight ? `${shipment.weight} kg` : 'Weight unlogged' },
          { label: 'Delivery PIN Validation', value: shipment.deliveryPin || 'Not provisioned' },
          { label: 'Created At', value: new Date(shipment.createdAt).toLocaleString('en-NG') },
        ]} />
        
        <DetailCard title="Nodes & Addresses" items={[
          { label: 'Pickup Point (A)', value: shipment.pickupAddress },
          { label: 'Dropoff Point (B)', value: shipment.dropoffAddress },
        ]} />
        
        <DetailCard title="Parties & Entities" items={[
          { 
            label: 'Ordering Customer', 
            value: `${shipment.customer?.firstName} ${shipment.customer?.lastName}`, 
            subValue: shipment.customer?.email 
          },
          { 
            label: 'Assigned Courier Transporter', 
            value: shipment.rider?.user ? `🏍️ ${shipment.rider.user.firstName} ${shipment.rider.user.lastName}` : 'Unassigned pipeline vacancy',
            subValue: shipment.recipientPhone ? `Recipient Contact: ${shipment.recipientPhone}` : undefined
          },
        ]} />
        
        <DetailCard title="Financial Allocations" items={[
          { label: 'Total Gross Escrow Cost', value: `₦${Number(shipment.totalPrice).toLocaleString()}` },
          { label: 'Platform Revenue Split', value: `₦${Number(shipment.platformShare || 0).toLocaleString()}` },
        ]} />
      </div>

      {/* Operations Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <ActionButton label="Reassign Rider Node" color="bg-neutral-950 hover:bg-neutral-900" onClick={() => alert('Invoking Transporter Assignment Grid...')} />
        <ActionButton label="Execute Financial Refund" color="bg-red-600 hover:bg-red-700" onClick={() => alert('Invoking Gateway Refund Trigger...')} />
        <ActionButton label="Open Intercom Chat" color="bg-neutral-200 text-neutral-900 hover:bg-neutral-300" onClick={() => alert('Loading socket room...')} />
        <ActionButton label="Log System Exception" color="bg-neutral-200 text-neutral-900 hover:bg-neutral-300" onClick={() => alert('Creating support ticket...')} />
      </div>

      {/* Dynamic Visual Log */}
      <div className="border border-neutral-200 rounded-2xl p-6 bg-neutral-50 flex flex-col items-center justify-center text-center space-y-1 h-48 font-mono">
        <p className="font-black text-[10px] text-neutral-900 uppercase tracking-widest">Dynamic Vector Tracking Interface</p>
        <p className="text-neutral-400 text-[11px] font-sans max-w-sm">
          Active real-time map plotting tools and historical timeline updates tie into this segment layout container framework.
        </p>
      </div>
    </div>
  );
}

interface CardItem {
  label: string;
  value: string;
  subValue?: string;
}

function DetailCard({ title, items }: { title: string; items: CardItem[] }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-neutral-200 flex flex-col justify-between shadow-xs">
      <div>
        <h3 className="text-[10px] font-black uppercase text-neutral-400 mb-4 tracking-wider">{title}</h3>
        <div className="space-y-4">
          {items.map((i, idx) => (
            <div key={idx} className="font-mono">
              <p className="text-[9px] text-neutral-400 uppercase tracking-wide font-sans">{i.label}</p>
              <p className="text-xs font-bold text-neutral-950 mt-0.5 break-words">{i.value}</p>
              {i.subValue && <p className="text-[10px] text-neutral-400 font-sans mt-0.5 break-words">{i.subValue}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActionButton({ label, color, onClick }: { label: string; color: string; onClick?: () => void }) {
  return (
    <button 
      type="button"
      onClick={onClick}
      className={`${color} text-white py-4 px-2 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-wider transition-all duration-200 shadow-xs cursor-pointer select-none text-center`}
    >
      {label}
    </button>
  );
}