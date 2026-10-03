'use client';

import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  seconds?: number;

  onExpire: () => void;
}

export default function CountdownTimer({
  seconds = 15,
  onExpire,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] =
    useState(seconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, onExpire]);

  const percentage =
    (timeLeft / seconds) * 100;

  return (
    <div className="space-y-4">

      <div className="flex justify-between items-center">

        <span className="text-sm text-neutral-400">
          Offer expires in
        </span>

        <span className="text-3xl font-black text-amber-400">
          {timeLeft}s
        </span>

      </div>

      <div className="h-2 rounded-full bg-neutral-800 overflow-hidden">

        <div
          className="h-full bg-amber-500 transition-all duration-1000"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

      <p className="text-xs text-neutral-500 text-center">
        This delivery will automatically disappear if
        no rider accepts it.
      </p>

    </div>
  );
}