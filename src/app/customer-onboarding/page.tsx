"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { registerCustomer } from "./api";
import { Step1CustomerData, CustomerRegistrationPayload } from "./types";

import Step1CreateAccount from "./components/Step1CreateAccount";
import Step2TermsAndPrivacy from "./components/Step2TermsAndPrivacy";
import Step3Success from "./components/Step3Success";

export default function CustomerOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [step1Data, setStep1Data] = useState<Step1CustomerData | null>(null);

  const signupMutation = useMutation({
    mutationFn: registerCustomer,
    onSuccess: () => {
      setCurrentStep(3); // Go to Success Step
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "An error occurred during registration. Please try again.";
      alert(Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage);
    },
  });

  const handleStep1Submit = (data: Step1CustomerData) => {
    setStep1Data(data);
    setCurrentStep(2);
  };

  const handleStep2Submit = () => {
    if (!step1Data) {
      setCurrentStep(1);
      return;
    }

    // Combine step outputs into final payload
    const { confirmPassword, ...accountDetails } = step1Data;
    const finalPayload: CustomerRegistrationPayload = {
      ...accountDetails,
      agreeToTerms: true,
      agreeToPrivacy: true,
    };

    signupMutation.mutate(finalPayload);
  };

  return (
    <main className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-auto">
        {currentStep === 1 && (
          <Step1CreateAccount 
            onSubmit={handleStep1Submit} 
            defaultValues={step1Data ?? undefined} 
          />
        )}
        
        {currentStep === 2 && (
          <Step2TermsAndPrivacy 
            onSubmit={handleStep2Submit} 
            onBack={() => setCurrentStep(1)} 
            isPending={signupMutation.isPending}
          />
        )}

        {currentStep === 3 && (
          <Step3Success />
        )}
      </div>
    </main>
  );
}