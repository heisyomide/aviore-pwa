"use client";

import React, { useEffect } from "react";
import { triggerEarningsCelebration } from "../../../../../../utils/audioCelebration";

export interface DailySummaryData {
  earnedAmount: number; // e.g. 2000
  todayTotal: number; // e.g. 12500
  dailyGoal: number; // e.g. 20000
  progressPercentage: number; // e.g. 62.5
  promptMessage: string; // e.g. "Only ₦7,500 left to reach your daily goal!"
}

interface RiderEarningsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAcceptNextJob?: () => void;
  summary: DailySummaryData;
}

export const RiderEarningsModal: React.FC<RiderEarningsModalProps> = ({
  isOpen,
  onClose,
  onAcceptNextJob,
  summary,
}) => {
  if (!isOpen) return null;

  const earnedFormatted = `₦${summary.earnedAmount.toLocaleString()}`;
  const todayTotalFormatted = `₦${summary.todayTotal.toLocaleString()}`;
  const goalFormatted = `₦${summary.dailyGoal.toLocaleString()}`;

  // Trigger sound effect on open
  useEffect(() => {
    if (isOpen) {
      triggerEarningsCelebration(earnedFormatted, todayTotalFormatted);
    }
  }, [isOpen, earnedFormatted, todayTotalFormatted]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
      {/* Modal Container */}
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 text-white shadow-2xl transform transition-all animate-slideUp">
        
        {/* Celebration Icon Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-20 h-20 bg-emerald-500/20 border-2 border-emerald-500/40 rounded-full flex items-center justify-center text-4xl mb-3 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            🎉
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Delivery Complete
          </span>
          <h2 className="text-3xl font-black mt-1 text-white">
            +{earnedFormatted}
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Added to your wallet balance
          </p>
        </div>

        {/* Daily Goal Tracker Card */}
        <div className="bg-neutral-800/80 border border-neutral-700/60 rounded-2xl p-4 mb-6">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-neutral-400 font-medium">Today's Progress</span>
            <span className="font-bold text-white">
              {todayTotalFormatted} / <span className="text-neutral-400">{goalFormatted}</span>
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-neutral-700 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(summary.progressPercentage, 100)}%` }}
            />
          </div>

          <p className="text-xs text-center font-medium text-emerald-300">
            {summary.promptMessage || `Only ₦${(summary.dailyGoal - summary.todayTotal).toLocaleString()} left to reach your daily goal!`}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          {onAcceptNextJob && (
            <button
              onClick={onAcceptNextJob}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-base rounded-2xl shadow-lg transition-all"
            >
              Look for Next Order 🚀
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full py-3.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-sm rounded-2xl transition-all border border-neutral-700/50"
          >
            Back to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};