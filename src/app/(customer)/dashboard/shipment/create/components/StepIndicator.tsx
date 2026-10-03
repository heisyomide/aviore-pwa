'use client';

import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepIndicator({
  currentStep,
  totalSteps,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const step = index + 1;

        const completed = step < currentStep;
        const active = step === currentStep;

        return (
          <React.Fragment key={step}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                ${
                  completed
                    ? 'bg-green-600 text-white'
                    : active
                    ? 'bg-black text-white'
                    : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
                }`}
            >
              {completed ? '✓' : step}
            </div>

            {step !== totalSteps && (
              <div
                className={`h-[2px] w-10 transition-all duration-300 ${
                  completed ? 'bg-green-600' : 'bg-neutral-200'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}