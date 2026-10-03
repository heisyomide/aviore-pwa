"use client";

import { useState, useEffect } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

const steps = [
  { num: "01", title: "Book Pickup", desc: "Enter sender, receiver, and parcel details seamlessly in seconds." },
  { num: "02", title: "Driver Assigned", desc: "Our intelligent dispatch instantly pairs you with a verified courier nearby." },
  { num: "03", title: "Package Pickup", desc: "Your courier arrives promptly to collect the package right from your doorstep." },
  { num: "04", title: "Live Transit", desc: "Track every movement of your shipment on our interactive live GPS map." },
  { num: "05", title: "PIN Verification", desc: "Secure drop-off guaranteed when the receiver provides the confirmation PIN." },
  { num: "06", title: "Delivered", desc: "Successful delivery completed and payment released securely to the driver." },
];

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullText = steps[activeStep].desc;

    const handleTyping = () => {
      if (!isDeleting) {
        setDisplayedText(currentFullText.substring(0, displayedText.length + 1));
        if (displayedText === currentFullText) {
          setTimeout(() => setIsDeleting(true), 2500);
        }
      } else {
        setDisplayedText(currentFullText.substring(0, displayedText.length - 1));
        if (displayedText === "") {
          setIsDeleting(false);
          setActiveStep((prev) => (prev + 1) % steps.length);
        }
      }
    };

    const timer = setTimeout(handleTyping, isDeleting ? 20 : 45);
    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, activeStep]);

  return (
    <section id="how-it-works" className="py-6 bg-gradient-to-b from-white via-neutral-50/50 to-white border-t border-neutral-200/60 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-lg mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-extrabold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Simple Workflow</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
            How Aviorè Go Works
          </h2>
          <p className="text-xs text-neutral-500 font-medium">
            Experience lightning-fast deliveries in six simple steps.
          </p>
        </div>

        {/* Colorful, Compact Motion Typing Box */}
        <div className="relative rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 p-6 sm:p-8 shadow-xl text-white overflow-hidden">
          
          {/* Decorative glowing light effects */}
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-5">
            
            {/* Top Status & Counter Bar */}
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white tracking-wider">
                STEP {steps[activeStep].num} OF 06
              </span>
              <div className="flex gap-1.5">
                {steps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveStep(idx);
                      setDisplayedText("");
                      setIsDeleting(false);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeStep === idx ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Title & Dynamic Typing Description */}
            <div className="space-y-2 min-h-[90px] flex flex-col justify-center">
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {steps[activeStep].title}
              </h3>
              <p className="text-sm sm:text-base font-medium text-emerald-50 leading-relaxed min-h-[3rem]">
                {displayedText}
                <span className="animate-pulse ml-1 inline-block w-2 h-4 bg-white align-middle" />
              </p>
            </div>

            {/* Quick Interactive Clickable Step Pills */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-white/20">
              {steps.map((step, idx) => {
                const isActive = activeStep === idx;
                return (
                  <button
                    key={step.num}
                    onClick={() => {
                      setActiveStep(idx);
                      setDisplayedText("");
                      setIsDeleting(false);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1.5 ${
                      isActive
                        ? "bg-white text-emerald-900 shadow-md scale-105"
                        : "bg-white/10 hover:bg-white/20 text-white border border-white/15"
                    }`}
                  >
                    <span>{step.num}. {step.title}</span>
                  </button>
                );
              })}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}