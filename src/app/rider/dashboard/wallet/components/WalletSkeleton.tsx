'use client';

import React from 'react';

export default function WalletSkeleton() {
  return (
    <div className="animate-pulse space-y-6">

      <div className="h-56 rounded-3xl bg-neutral-900" />

      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-24 rounded-2xl bg-neutral-900"
          />
        ))}
      </div>

    </div>
  );
}