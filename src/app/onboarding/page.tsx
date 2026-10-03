"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const onboardingSteps = [
  {
    id: "food",
    title: "Food Marketplace",
    description:
      "Discover great meals from local restaurants and have them delivered conveniently to you.",
    image: "/images/solo-3.png",
  },
  {
    id: "delivery",
    title: "Local Delivery",
    description:
      "Send parcels and packages around your city with fast, reliable and convenient local delivery.",
    image: "/images/solo-2.jpeg",
  },
  {
    id: "events",
    title: "Event Logistics",
    description:
      "Move people, items and event essentials with dependable logistics built around your event.",
    image: "/images/bus.jpeg",
  },
];

const ONBOARDING_KEY = "aviorego_onboarding_complete";

export default function OnboardingPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const completed = localStorage.getItem(ONBOARDING_KEY);

    if (completed === "true") {
      router.replace("/login");
      return;
    }

    setChecking(false);
  }, [router]);

  const current = onboardingSteps[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep((step) => step + 1);
      return;
    }

    localStorage.setItem(ONBOARDING_KEY, "true");
    router.replace("/login");
  };

  const handleSkip = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    router.replace("/login");
  };

  if (checking) {
    return (
      <main className="flex min-h-[100svh] items-center justify-center bg-[#00412e]">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
            <span className="text-2xl font-black text-white">
              Avior<span className="text-emerald-400">è</span>Go
            </span>
          </div>

          <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#00412e] text-white">
      {/* Image */}
      <div className="absolute inset-x-0 top-0 h-[58svh]">
        <Image
          src={current.image}
          alt={current.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        {/* Image → green fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#00412e]" />
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-7">
        <div className="text-xl font-extrabold tracking-[-0.04em]">
          Avior<span className="text-emerald-400">è</span>Go
        </div>

        {!isLastStep && (
          <button
            type="button"
            onClick={handleSkip}
            className="text-xs font-semibold text-white/65 transition hover:text-white"
          >
            Skip
          </button>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-[100svh] flex-col justify-end px-6 pb-8">
        <div className="mb-8">
          {/* Step indicator */}
          <div className="mb-5 flex items-center gap-2">
            {onboardingSteps.map((step, index) => (
              <div
                key={step.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? "w-8 bg-emerald-400"
                    : index < currentStep
                      ? "w-5 bg-white/70"
                      : "w-5 bg-white/20"
                }`}
              />
            ))}
          </div>

          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
            {String(currentStep + 1).padStart(2, "0")} /{" "}
            {String(onboardingSteps.length).padStart(2, "0")}
          </p>

          <h1 className="max-w-[340px] text-[36px] font-extrabold leading-[0.98] tracking-[-0.045em]">
            {current.title}
          </h1>

          <p className="mt-4 max-w-[350px] text-sm leading-6 text-white/70">
            {current.description}
          </p>
        </div>

        {/* Bottom controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleNext}
            className="flex h-14 flex-1 items-center justify-center rounded-full bg-white px-6 text-sm font-bold text-[#00412e] shadow-xl transition active:scale-[0.98]"
          >
            {isLastStep ? "Continue to Login" : "Next"}
          </button>

          {currentStep > 0 && (
            <button
              type="button"
              onClick={() => setCurrentStep((step) => step - 1)}
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur-sm transition active:scale-[0.95]"
              aria-label="Previous"
            >
              ←
            </button>
          )}
        </div>
      </div>
    </main>
  );
}