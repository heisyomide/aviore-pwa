"use client";

import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: string;
  subtitle?: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  subtitle,
  color = "text-white",
}: StatsCardProps) {
  return (
    <div className="group rounded-3xl border border-neutral-800 bg-neutral-900 p-5 transition-all duration-300 hover:border-neutral-700 hover:bg-neutral-950">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400">
            {title}
          </p>

          <h3
            className={`mt-3 text-3xl font-black tracking-tight ${color}`}
          >
            {value}
          </h3>

          {subtitle && (
            <p className="mt-2 text-xs text-neutral-500">
              {subtitle}
            </p>
          )}

        </div>

        <div className="rounded-2xl border border-neutral-700 bg-neutral-800 p-3 text-neutral-300 transition group-hover:border-neutral-600">
          {icon}
        </div>

      </div>

    </div>
  );
}