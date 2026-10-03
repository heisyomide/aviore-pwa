// app/dashboard/shipment/create/page.tsx

'use client';

import ShipmentWizard from './components/ShipmentWizard';

export default function CreateShipmentPage() {
  return (
    <main className="min-h-screen bg-neutral-100">
      <div className="mx-auto max-w-md py-6 px-4">
        <ShipmentWizard />
      </div>
    </main>
  );
}