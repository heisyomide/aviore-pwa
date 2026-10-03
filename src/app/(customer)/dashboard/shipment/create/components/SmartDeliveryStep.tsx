'use client';

interface SmartDeliveryStepProps {
  onNext: () => void;
  onBack?: () => void;     // ← Added optional onBack
}

export default function SmartDeliveryStep({
  onNext,
  onBack,
}: SmartDeliveryStepProps) {
  return (
    <div className="flex flex-col justify-between h-full">
      {/* ... your existing content ... */}

      <div className="space-y-3">
        {onBack && (
          <button
            onClick={onBack}
            className="w-full rounded-xl border border-neutral-300 py-3 font-semibold"
          >
            Back
          </button>
        )}
        <button
          onClick={onNext}
          className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-4 font-bold transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
}