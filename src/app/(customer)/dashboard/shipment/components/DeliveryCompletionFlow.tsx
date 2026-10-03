"use client";

import React, { useState } from "react";
import { RiderEarningsModal, DailySummaryData } from "../../../../rider/dashboard/jobs/[shipmentId]/components/RiderEarningsModal";

export const DeliveryPinVerification: React.FC<{ shipmentId: string; authToken: string }> = ({
  shipmentId,
  authToken,
}) => {
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [summaryData, setSummaryData] = useState<DailySummaryData | null>(null);

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const response = await fetch(`${apiUrl}/shipments/${shipmentId}/verify-pin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ pin }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Invalid PIN. Please check with recipient.");
      }

      // Populate summary & show earnings modal!
      setSummaryData({
        earnedAmount: result.earnedAmount || result.shipment?.riderShare || 2000,
        todayTotal: result.dailySummary?.todayTotal || 12500,
        dailyGoal: result.dailySummary?.dailyGoal || 20000,
        progressPercentage: result.dailySummary?.progressPercentage || 62.5,
        promptMessage: result.dailySummary?.promptMessage || "",
      });

      setIsModalOpen(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
      <h3 className="text-lg font-bold text-white mb-2">Complete Delivery</h3>
      <p className="text-xs text-neutral-400 mb-4">
        Ask recipient for the 4-digit verification code to complete order and unlock funds.
      </p>

      <form onSubmit={handleVerifyPin} className="flex flex-col gap-3">
        <input
          type="text"
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="Enter Delivery PIN"
          className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 text-white font-mono text-lg text-center rounded-xl focus:border-emerald-500 outline-none"
        />

        {error && <p className="text-xs text-rose-400 font-semibold">{error}</p>}

        <button
          type="submit"
          disabled={isLoading || !pin}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-800 text-white font-bold rounded-xl transition-all"
        >
          {isLoading ? "Verifying PIN..." : "Confirm Delivery"}
        </button>
      </form>

      {/* RIDER EARNINGS PROMPT MODAL */}
      {summaryData && (
        <RiderEarningsModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            window.location.href = "/rider/dashboard";
          }}
          onAcceptNextJob={() => {
            setIsModalOpen(false);
            window.location.href = "/rider/dashboard/available-jobs";
          }}
          summary={summaryData}
        />
      )}
    </div>
  );
};