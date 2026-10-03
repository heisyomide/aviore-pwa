"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, User, Mail, Phone, Lock } from "lucide-react";
import { step1CustomerSchema, Step1CustomerData } from "../types";

interface Step1Props {
  onSubmit: (data: Step1CustomerData) => void;
  defaultValues?: Step1CustomerData;
}

export default function Step1CreateAccount({ onSubmit, defaultValues }: Step1Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step1CustomerData>({
    resolver: zodResolver(step1CustomerSchema),
    defaultValues: defaultValues ?? {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl border border-zinc-200 p-8 shadow-sm space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Create Your Account</h2>
        <p className="text-sm text-zinc-500">Let's get started. Fill in your details below.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Fields Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-zinc-400">
                <User className="h-5 w-5 stroke-[1.5]" />
              </span>
              <input
                type="text"
                placeholder="First Name"
                {...register("firstName")}
                className={`w-full rounded-xl border bg-zinc-50 pl-11 pr-4 py-3.5 text-sm text-zinc-900 outline-none transition focus:bg-white focus:ring-1 ${
                  errors.firstName
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-zinc-200 focus:border-emerald-600 focus:ring-emerald-600"
                }`}
              />
            </div>
            {errors.firstName && <p className="text-xs text-red-500 mt-1 ml-1">{errors.firstName.message}</p>}
          </div>

          <div>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-zinc-400">
                <User className="h-5 w-5 stroke-[1.5]" />
              </span>
              <input
                type="text"
                placeholder="Last Name"
                {...register("lastName")}
                className={`w-full rounded-xl border bg-zinc-50 pl-11 pr-4 py-3.5 text-sm text-zinc-900 outline-none transition focus:bg-white focus:ring-1 ${
                  errors.lastName
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-zinc-200 focus:border-emerald-600 focus:ring-emerald-600"
                }`}
              />
            </div>
            {errors.lastName && <p className="text-xs text-red-500 mt-1 ml-1">{errors.lastName.message}</p>}
          </div>
        </div>

        {/* Email Address */}
        <div>
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-zinc-400">
              <Mail className="h-5 w-5 stroke-[1.5]" />
            </span>
            <input
              type="email"
              placeholder="Email Address"
              {...register("email")}
              className={`w-full rounded-xl border bg-zinc-50 pl-11 pr-4 py-3.5 text-sm text-zinc-900 outline-none transition focus:bg-white focus:ring-1 ${
                errors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-zinc-200 focus:border-emerald-600 focus:ring-emerald-600"
              }`}
            />
          </div>
          {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email.message}</p>}
        </div>

        {/* Phone Number */}
        <div>
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-zinc-400">
              <Phone className="h-5 w-5 stroke-[1.5]" />
            </span>
            <input
              type="tel"
              placeholder="Phone Number"
              {...register("phoneNumber")}
              className={`w-full rounded-xl border bg-zinc-50 pl-11 pr-4 py-3.5 text-sm text-zinc-900 outline-none transition focus:bg-white focus:ring-1 ${
                errors.phoneNumber
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-zinc-200 focus:border-emerald-600 focus:ring-emerald-600"
              }`}
            />
          </div>
          {errors.phoneNumber && <p className="text-xs text-red-500 mt-1 ml-1">{errors.phoneNumber.message}</p>}
        </div>

        {/* Password */}
        <div>
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-zinc-400">
              <Lock className="h-5 w-5 stroke-[1.5]" />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
              className={`w-full rounded-xl border bg-zinc-50 pl-11 pr-12 py-3.5 text-sm text-zinc-900 outline-none transition focus:bg-white focus:ring-1 ${
                errors.password
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-zinc-200 focus:border-emerald-600 focus:ring-emerald-600"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 text-zinc-400 hover:text-zinc-600 transition"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500 mt-1 ml-1">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-zinc-400">
              <Lock className="h-5 w-5 stroke-[1.5]" />
            </span>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              {...register("confirmPassword")}
              className={`w-full rounded-xl border bg-zinc-50 pl-11 pr-12 py-3.5 text-sm text-zinc-900 outline-none transition focus:bg-white focus:ring-1 ${
                errors.confirmPassword
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-zinc-200 focus:border-emerald-600 focus:ring-emerald-600"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-3.5 text-zinc-400 hover:text-zinc-600 transition"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-500 mt-1 ml-1">{errors.confirmPassword.message}</p>}
        </div>

        {/* Informative Help Context Card */}
        <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-150">
          <p className="text-xs leading-relaxed text-zinc-500">
            <span className="font-bold text-zinc-700">Notice:</span> Please use your real phone number. Riders will use this number to contact you regarding pickups and deliveries.
          </p>
        </div>

        {/* Explicit Action Button */}
        <button
          type="submit"
          className="h-12 w-full mt-2 rounded-xl bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-800 transition flex items-center justify-center cursor-pointer shadow-sm tracking-wide"
        >
          Continue
        </button>
      </form>
    </div>
  );
}