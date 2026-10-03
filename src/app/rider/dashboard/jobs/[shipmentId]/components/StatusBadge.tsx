'use client';

import type { ShipmentStatus } from '../types';

interface Props {
  status: ShipmentStatus;
}

const styles: Record<ShipmentStatus, string> = {
  PENDING:
    'bg-yellow-500/20 text-yellow-400',

  ACCEPTED:
    'bg-blue-500/20 text-blue-400',

  PICKED_UP:
    'bg-purple-500/20 text-purple-400',

  IN_TRANSIT:
    'bg-orange-500/20 text-orange-400',

  OUT_FOR_DELIVERY:
    'bg-cyan-500/20 text-cyan-400',

  DELIVERED:
    'bg-emerald-500/20 text-emerald-400',

  CANCELLED:
    'bg-red-500/20 text-red-400',
};

const labels: Record<ShipmentStatus, string> = {
  PENDING:
    'Pending',

  ACCEPTED:
    'Accepted',

  PICKED_UP:
    'Picked Up',

  IN_TRANSIT:
    'In Transit',

  OUT_FOR_DELIVERY:
    'Out For Delivery',

  DELIVERED:
    'Delivered',

  CANCELLED:
    'Cancelled',
};

export default function StatusBadge({
  status,
}: Props) {
  return (
    <span
      className={`inline-flex rounded-full px-4 py-2 text-xs font-semibold ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}