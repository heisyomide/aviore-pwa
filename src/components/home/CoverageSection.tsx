'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, Sparkles } from "lucide-react";

const locations = [
  { id: 'ib', name: 'Ibadan', region: 'Oyo', x: 25, y: 75, type: 'hub' },
  { id: 'oy', name: 'Oyo Town', region: 'Oyo', x: 30, y: 50, type: 'node' },
  { id: 'og', name: 'Ogbomoso', region: 'Oyo', x: 35, y: 25, type: 'node' },
  { id: 'is', name: 'Iseyin', region: 'Oyo', x: 12, y: 45, type: 'node' },
  { id: 'if', name: 'OAU / Ife', region: 'Osun', x: 60, y: 70, type: 'hub' },
  { id: 'ed', name: 'Ede', region: 'Osun', x: 62, y: 50, type: 'node' },
  { id: 'os', name: 'Osogbo', region: 'Osun', x: 68, y: 35, type: 'hub' },
  { id: 'il', name: 'Ilesa', region: 'Osun', x: 85, y: 40, type: 'node' },
];

const routes = [
  { from: 'ib', to: 'oy' },
  { from: 'oy', to: 'og' },
  { from: 'oy', to: 'is' },
  { from: 'ib', to: 'if' },
  { from: 'if', to: 'ed' },
  { from: 'ed', to: 'os' },
  { from: 'os', to: 'il' },
  { from: 'if', to: 'il' },
];

export default function CoverageSection() {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const getCoord = (id: string) => locations.find(loc => loc.id === id);

  return (
    <section id="coverage" className="py-16 bg-white border-y border-neutral-200/60 overflow-hidden">
      {/* Container spans full screen width (end-to-end breadth) with no max-width restriction */}
      <div className="w-full px-4 sm:px-8 lg:px-12 space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-extrabold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Interactive Network Map</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
            Serving Key Hubs in <span className="text-emerald-600">Osun & Oyo State</span>
          </h2>
          <p className="text-xs text-neutral-600 font-medium">
            Connecting major cities and campuses with lightning-fast logistics. Explore our active delivery zones below.
          </p>
        </div>

        {/* End-to-End Breadth Map Container with balanced, compact height */}
        <div className="relative w-full bg-neutral-950 rounded-3xl p-4 sm:p-6 shadow-2xl border border-neutral-800 overflow-hidden group">
          
          {/* Radar Background Effects */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,theme(colors.emerald.500)_0%,transparent_70%)]" />
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] bg-size-[24px_24px]" />
          
          {/* Scanning Line Animation */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <div className="w-full h-1 bg-emerald-400 blur-sm animate-[scan_4s_ease-in-out_infinite]" />
          </div>

          <div className="relative w-full aspect-[21/9] sm:aspect-[3/1] max-h-[380px] rounded-2xl border border-neutral-800/50 bg-neutral-900/50 backdrop-blur-sm overflow-hidden">
            
            {/* SVG Lines connecting the routes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
              {routes.map((route, i) => {
                const from = getCoord(route.from);
                const to = getCoord(route.to);
                if (!from || !to) return null;
                return (
                  <line
                    key={i}
                    x1={`${from.x}%`}
                    y1={`${from.y}%`}
                    x2={`${to.x}%`}
                    y2={`${to.y}%`}
                    stroke="rgba(16, 185, 129, 0.3)"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    className="animate-[dash_20s_linear_infinite]"
                  />
                );
              })}
            </svg>

            {/* Location Pins */}
            {locations.map((loc) => {
              const isOyo = loc.region === 'Oyo';
              const isHub = loc.type === 'hub';
              const pinColor = isOyo ? 'bg-indigo-500' : 'bg-emerald-500';
              const shadowColor = isOyo ? 'shadow-indigo-500/50' : 'shadow-emerald-500/50';
              const textColor = isOyo ? 'text-indigo-400' : 'text-emerald-400';

              return (
                <div
                  key={loc.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group/pin cursor-pointer z-10"
                  style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                  onMouseEnter={() => setActiveNode(loc.id)}
                  onMouseLeave={() => setActiveNode(null)}
                >
                  <div className="relative flex items-center justify-center">
                    {isHub && (
                      <div className={`absolute w-7 h-7 rounded-full ${pinColor} opacity-20 animate-ping`} />
                    )}
                    <div className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full ${pinColor} ${shadowColor} shadow-lg border-2 border-neutral-900 transition-transform duration-300 group-hover/pin:scale-150`} />
                  </div>

                  <div className={`absolute left-1/2 -translate-x-1/2 mt-2 flex flex-col items-center transition-all duration-300 ${activeNode === loc.id ? 'opacity-100 translate-y-0 z-50' : 'opacity-70 translate-y-1 sm:opacity-100 sm:translate-y-0'}`}>
                    <div className="bg-neutral-800/90 backdrop-blur-md border border-neutral-700 px-2 py-0.5 rounded-lg shadow-xl whitespace-nowrap">
                      <p className="text-[10px] font-bold text-white">
                        {loc.name}
                      </p>
                      {activeNode === loc.id && (
                        <p className={`text-[8px] font-black uppercase tracking-wider ${textColor} mt-0.5`}>
                          {loc.region} {isHub ? 'Hub' : 'Node'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floating Legends */}
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 hidden sm:flex gap-3 pointer-events-none">
            <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-700/50 p-2.5 rounded-xl flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                <MapPin className="w-3 h-3 text-emerald-400" />
              </div>
              <div>
                <p className="text-[9px] text-neutral-400 font-bold uppercase">Osun Region</p>
                <p className="text-[11px] font-black text-white">Active Routing</p>
              </div>
            </div>
            <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-700/50 p-2.5 rounded-xl flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                <Navigation className="w-3 h-3 text-indigo-400" />
              </div>
              <div>
                <p className="text-[9px] text-neutral-400 font-bold uppercase">Oyo Region</p>
                <p className="text-[11px] font-black text-white">Active Routing</p>
              </div>
            </div>
          </div>

          {/* Live Status Indicator */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-neutral-900/80 backdrop-blur-md border border-neutral-700/50 px-2.5 py-1 rounded-full flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold text-neutral-300">Live Network</span>
          </div>

        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dash {
          to { stroke-dashoffset: -100; }
        }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          50% { transform: translateY(300px); }
          100% { transform: translateY(-100%); }
        }
      `}} />
    </section>
  );
}