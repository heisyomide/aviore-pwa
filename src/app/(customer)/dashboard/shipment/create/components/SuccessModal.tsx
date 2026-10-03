'use client';

interface SuccessModalProps {
    pin: string
  open: boolean;
  trackingCode: string;     // ← Changed from pin
  onClose: () => void;
}

export default function SuccessModal({
  open,
  trackingCode,
  onClose,
}: SuccessModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl w-full max-w-sm p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-4xl mb-6">
          ✓
        </div>

        <h2 className="text-2xl font-black">Shipment Created!</h2>
        <p className="text-neutral-600 mt-2">Your tracking code is:</p>

        <div className="mt-6 bg-neutral-900 text-white font-mono text-2xl tracking-widest py-4 rounded-2xl">
          {trackingCode}
        </div>

        <button
          onClick={onClose}
          className="mt-8 w-full bg-black text-white py-4 rounded-2xl font-semibold"
        >
          Done
        </button>
      </div>
    </div>
  );
}