'use client';

import { useEffect } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { ShipmentFormData } from '../../types';

interface ReceiverStepProps {
  formData: ShipmentFormData;
  updateForm: (data: Partial<ShipmentFormData>) => void;
  onNext: () => void;
}

export default function ReceiverStep({
  formData,
  updateForm,
  onNext,
}: ReceiverStepProps) {
  const { user } = useAuth();

  // Sender details (Pre-fill from logged-in user or existing state)
  const senderName =
    formData.sender?.senderName ||
    (user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.firstName || '');

  const senderPhone =
    formData.sender?.senderPhone ||
    (user as any)?.phone ||
    (user as any)?.phoneNumber ||
    '';

  // Auto-populate sender details on mount if they aren't set yet
  useEffect(() => {
    if (!formData.sender?.senderName || !formData.sender?.senderPhone) {
      updateForm({
        sender: {
          senderName: formData.sender?.senderName || senderName,
          senderPhone: formData.sender?.senderPhone || senderPhone,
        },
      });
    }
  }, []);

  // Receiver details
  const receiverName = formData.receiver?.receiverName || '';
  const receiverPhone = formData.receiver?.receiverPhone || '';

  // Validation: Both Sender and Receiver details must be provided
  const canContinue =
    senderName.trim() !== '' &&
    senderPhone.trim() !== '' &&
    receiverName.trim() !== '' &&
    receiverPhone.trim() !== '';

  return (
    <div className="flex flex-col h-full justify-between gap-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black">Contact & Receiver Details</h2>
          <p className="text-sm text-neutral-500 mt-1">
            Provide sender and receiver contact details for dispatch communication.
          </p>
        </div>

        {/* Sender Section */}
        <div className="space-y-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
          <h3 className="text-sm font-bold text-neutral-700 uppercase tracking-wide">
            Sender Details (Your Info)
          </h3>

          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">
              Sender Name
            </label>
            <input
              type="text"
              value={senderName}
              onChange={(e) =>
                updateForm({
                  sender: {
                    ...formData.sender,
                    senderPhone: senderPhone,
                    senderName: e.target.value,
                  },
                })
              }
              placeholder="Your Full Name"
              className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">
              Sender Phone Number
            </label>
            <input
              type="tel"
              value={senderPhone}
              onChange={(e) =>
                updateForm({
                  sender: {
                    ...formData.sender,
                    senderName: senderName,
                    senderPhone: e.target.value,
                  },
                })
              }
              placeholder="08012345678"
              className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
        </div>

        {/* Receiver Section */}
        <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-4">
          <h3 className="text-sm font-bold text-neutral-700 uppercase tracking-wide">
            Receiver Details
          </h3>

          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">
              Receiver Name
            </label>
            <input
              type="text"
              value={receiverName}
              onChange={(e) =>
                updateForm({
                  receiver: {
                    ...formData.receiver,
                    receiverName: e.target.value,
                  },
                })
              }
              placeholder="John Doe"
              className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">
              Receiver Phone Number
            </label>
            <input
              type="tel"
              value={receiverPhone}
              onChange={(e) =>
                updateForm({
                  receiver: {
                    ...formData.receiver,
                    receiverPhone: e.target.value,
                  },
                })
              }
              placeholder="08012345678"
              className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!canContinue}
        className={`w-full py-4 rounded-xl font-bold transition-all ${
          canContinue
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>
  );
}