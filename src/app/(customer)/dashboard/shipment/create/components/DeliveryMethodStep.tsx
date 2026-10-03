'use client';

import { ShipmentFormData } from "../../types";

interface DeliveryMethodStepProps {
  formData: ShipmentFormData;
  updateForm: (data: Partial<ShipmentFormData>) => void;
  onNext: () => void;
}

export default function DeliveryMethodStep({
  formData,
  updateForm,
  onNext,
}: DeliveryMethodStepProps) {
  return (
    <div className="flex flex-col h-full justify-between">

      <div className="space-y-8">

        <div>
          <h2 className="text-2xl font-black">
            Delivery Method
          </h2>

          <p className="text-sm text-neutral-500 mt-2">
            Choose how your package should be delivered.
          </p>
        </div>

        <div className="space-y-4">

          <button
            type="button"
            onClick={() =>
              updateForm({
                deliveryMethod: "hand",
              })
            }
            className={`w-full rounded-2xl border p-5 text-left transition

            ${
              formData.deliveryMethod === "hand"
                ? "border-green-600 bg-green-50"
                : "border-neutral-300"
            }`}
          >
            <div className="flex justify-between items-center">

              <div>

                <h3 className="font-bold">
                  🤝 Hand to Receiver
                </h3>

                <p className="text-sm text-neutral-500 mt-1">
                  Rider releases package only after PIN verification.
                </p>

              </div>

              {formData.deliveryMethod === "hand" && (
                <span className="text-green-600 text-xl">
                  ✓
                </span>
              )}

            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              updateForm({
                deliveryMethod: "smart",
              })
            }
            className={`w-full rounded-2xl border p-5 text-left transition

            ${
              formData.deliveryMethod === "smart"
                ? "border-green-600 bg-green-50"
                : "border-neutral-300"
            }`}
          >
            <div className="flex justify-between items-center">

              <div>

                <h3 className="font-bold">
                  📦 Smart Delivery
                </h3>

                <p className="text-sm text-neutral-500 mt-1">
                  Rider can safely leave the package if the receiver isn't available.
                </p>

              </div>

              {formData.deliveryMethod === "smart" && (
                <span className="text-green-600 text-xl">
                  ✓
                </span>
              )}

            </div>
          </button>

        </div>

        <div>

          <label className="block text-sm font-semibold mb-2">
            Delivery Note (Optional)
          </label>

          <textarea
            rows={4}
            value={formData.deliveryNote}
            onChange={(e) =>
              updateForm({
                deliveryNote: e.target.value,
              })
            }
            placeholder="Leave at the front desk..."
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 resize-none focus:ring-2 focus:ring-green-600 outline-none"
          />

        </div>

      </div>

      <button
        onClick={onNext}
        className="w-full py-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold transition"
      >
        Continue
      </button>

    </div>
  );
}