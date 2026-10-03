"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ArrowLeft, ShieldCheck } from "lucide-react";

const localStep2Schema = z.object({
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms of Service",
  }),
  agreeToPrivacy: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Privacy Policy",
  }),
});

type LocalStep2Data = z.infer<typeof localStep2Schema>;

interface Step2Props {
  onSubmit: (data: { agreeToTerms: boolean; agreeToPrivacy: boolean }) => void;
  onBack: () => void;
  isPending: boolean;
}

export default function Step2TermsAndPrivacy({ onSubmit, onBack, isPending }: Step2Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LocalStep2Data>({
    resolver: zodResolver(localStep2Schema),
    defaultValues: {
      agreeToTerms: false,
      agreeToPrivacy: false,
    },
  });

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl border border-zinc-200 p-8 shadow-sm space-y-6">
      
      {/* Back Button + Title Container */}
      <div className="relative text-center">
        <button
          type="button"
          onClick={onBack}
          disabled={isPending}
          className="absolute left-0 top-1 text-zinc-500 hover:text-zinc-800 transition disabled:opacity-40"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Terms & Privacy</h2>
        <p className="mt-1 text-sm text-zinc-500">Review and agree to our rules to finalize account access.</p>
      </div>

      {/* Decorative Icon Visual Feature */}
      <div className="flex justify-center py-2">
        <div className="h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-700">
          <ShieldCheck className="h-8 w-8 stroke-[1.5]" />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-4">
          
          {/* Terms Agreement Panel */}
          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 transition hover:bg-zinc-50/70">
            <div className="flex items-start gap-3.5">
              <input
                type="checkbox"
                id="agreeToTerms"
                {...register("agreeToTerms")}
                className="mt-1 h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-600 accent-emerald-700 cursor-pointer"
              />
              <label htmlFor="agreeToTerms" className="text-sm text-zinc-600 cursor-pointer select-none leading-relaxed">
                I understand and agree to the <span className="text-emerald-700 font-semibold hover:underline">Terms of Service</span> governing usage rules and customer guidelines.
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-xs text-red-500 font-medium mt-1.5 pl-7">{errors.agreeToTerms.message}</p>
            )}
          </div>

          {/* Privacy Policy Panel */}
          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 transition hover:bg-zinc-50/70">
            <div className="flex items-start gap-3.5">
              <input
                type="checkbox"
                id="agreeToPrivacy"
                {...register("agreeToPrivacy")}
                className="mt-1 h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-600 accent-emerald-700 cursor-pointer"
              />
              <label htmlFor="agreeToPrivacy" className="text-sm text-zinc-600 cursor-pointer select-none leading-relaxed">
                I accept the <span className="text-emerald-700 font-semibold hover:underline">Privacy Policy</span> regarding how information is handled, secured, and retained safely.
              </label>
            </div>
            {errors.agreeToPrivacy && (
              <p className="text-xs text-red-500 font-medium mt-1.5 pl-7">{errors.agreeToPrivacy.message}</p>
            )}
          </div>
        </div>

        {/* Action Button Split Row Grid */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            disabled={isPending}
            className="h-12 flex-1 rounded-xl border border-zinc-200 text-zinc-700 text-sm font-semibold hover:bg-zinc-50 transition cursor-pointer disabled:opacity-50"
          >
            Back
          </button>
          
          <button
            type="submit"
            disabled={isPending}
            className="h-12 flex-[2] rounded-xl bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-800 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isPending ? "Registering..." : "Create Account"}
          </button>
        </div>
      </form>
    </div>
  );
}