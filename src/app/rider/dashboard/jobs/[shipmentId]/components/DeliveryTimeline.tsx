'use client';

import { ShipmentDetails, ShipmentStatus } from '../types';

interface Props {
  shipment: ShipmentDetails;
}

const steps: {
  key: ShipmentStatus;
  label: string;
}[] = [
  {
    key: 'ACCEPTED',
    label: 'Accepted',
  },
  {
    key: 'PICKED_UP',
    label: 'Arrived at Pickup',
  },
  {
    key: 'IN_TRANSIT',
    label: 'Package Picked Up',
  },
  {
    key: 'OUT_FOR_DELIVERY',
    label: 'Arrived at Destination',
  },
  {
    key: 'DELIVERED',
    label: 'Delivered',
  },
];

export default function DeliveryTimeline({
  shipment,
}: Props) {
  const currentStep = steps.findIndex(
    (step) => step.key === shipment.status,
  );

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
      <h2 className="mb-6 text-sm font-bold uppercase tracking-widest text-neutral-400">
        Delivery Progress
      </h2>

      <div className="space-y-5">
        {steps.map((step, index) => {
          const completed = index <= currentStep;

          return (
            <div
              key={step.key}
              className="flex items-start gap-4"
            >
              <div
                className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  completed
                    ? 'bg-emerald-600 text-white'
                    : 'bg-neutral-800 text-neutral-500'
                }`}
              >
                {completed ? '✓' : index + 1}
              </div>

              <div className="flex-1">
                <p
                  className={`font-semibold ${
                    completed
                      ? 'text-white'
                      : 'text-neutral-500'
                  }`}
                >
                  {step.label}
                </p>

                {completed && (
                  <p className="mt-1 text-xs text-emerald-400">
                    Completed
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}