"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"CUSTOMER" | "RIDER">("CUSTOMER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const baseData = Object.fromEntries(formData.entries());

    // Merge explicitly selected role type into final payload
    const payload = { ...baseData, role };

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Something went wrong during registration.");
      }

      // Smooth, immediate redirect to native login screen upon atomic database write confirmation
      router.push(`/auth/login?role=${role}&registered=true`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-neutral-200 p-8 rounded-2xl shadow-sm space-y-6">
        
        {/* Simple Platform Header */}
        <div className="text-center">
          <h1 className="text-2xl font-black tracking-tight text-neutral-900">Aviorè Go</h1>
          <p className="text-sm text-neutral-500 mt-1">Create your platform credentials</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-xs font-semibold text-red-600 rounded-xl border border-red-100">
            {error}
          </div>
        )}

        {/* Account Identity Switcher */}
        <div>
          <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
            Account Type
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 rounded-xl">
            <button
              type="button"
              onClick={() => setRole("CUSTOMER")}
              className={`h-10 rounded-lg text-sm font-bold transition-all ${
                role === "CUSTOMER"
                  ? "bg-white text-black shadow-sm"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              🟢 Customer
            </button>
            <button
              type="button"
              onClick={() => setRole("RIDER")}
              className={`h-10 rounded-lg text-sm font-bold transition-all ${
                role === "RIDER"
                  ? "bg-white text-black shadow-sm"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              🔵 Rider
            </button>
          </div>
        </div>

        {/* Standard Linear Native HTML Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Universal Shared Fields */}
          <div>
            <label className="block text-xs font-bold text-neutral-600 mb-1">Full Name</label>
            <input name="name" type="text" required className="h-11 w-full rounded-xl border border-neutral-200 px-4 outline-none focus:border-black text-sm" placeholder="John Doe" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-600 mb-1">Email Address</label>
              <input name="email" type="email" required className="h-11 w-full rounded-xl border border-neutral-200 px-4 outline-none focus:border-black text-sm" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-600 mb-1">Phone Number</label>
              <input name="phone" type="tel" maxLength={11} required className="h-11 w-full rounded-xl border border-neutral-200 px-4 outline-none focus:border-black text-sm" placeholder="08012345678" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-600 mb-1">Password</label>
              <input name="password" type="password" required className="h-11 w-full rounded-xl border border-neutral-200 px-4 outline-none focus:border-black text-sm" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-600 mb-1">Address</label>
              <input name="address" type="text" required className="h-11 w-full rounded-xl border border-neutral-200 px-4 outline-none focus:border-black text-sm" placeholder="123 Street Layout" />
            </div>
          </div>

          {/* Conditional Rider Additions (Flattens the data collection right into the main flow) */}
          {role === "RIDER" && (
            <div className="pt-4 border-t border-neutral-100 space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-600 mb-1">Vehicle Type</label>
                  <select name="vehicle" required className="h-11 w-full rounded-xl border border-neutral-200 px-3 bg-white text-sm outline-none focus:border-black">
                    <option value="">Select vehicle</option>
                    <option value="BICYCLE">Bicycle</option>
                    <option value="MOTORCYCLE">Motorcycle</option>
                    <option value="CAR">Car</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-600 mb-1">License Number</label>
                  <input name="license" type="text" required className="h-11 w-full rounded-xl border border-neutral-200 px-4 outline-none focus:border-black text-sm" placeholder="RC-XXXXX" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-neutral-600 mb-1">Bank Name</label>
                  <select name="bankName" required className="h-11 w-full rounded-xl border border-neutral-200 px-2 bg-white text-sm outline-none focus:border-black">
                    <option value="">Bank</option>
                    <option value="GTBank">GTBank</option>
                    <option value="Access">Access</option>
                    <option value="Opay">Opay</option>
                    <option value="Kuda">Kuda</option>
                  </select>
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-neutral-600 mb-1">Account No.</label>
                  <input name="accountNumber" type="text" maxLength={10} required className="h-11 w-full rounded-xl border border-neutral-200 px-3 outline-none focus:border-black text-sm" placeholder="10 digits" />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-neutral-600 mb-1">Account Name</label>
                  <input name="accountName" type="text" required className="h-11 w-full rounded-xl border border-neutral-200 px-3 outline-none focus:border-black text-sm" placeholder="Holder Name" />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-black hover:bg-neutral-900 text-white font-bold rounded-xl transition mt-4 text-sm disabled:opacity-50"
          >
            {loading ? "Processing Registration..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center text-xs text-neutral-400 font-medium">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-black font-semibold underline">
            Log in
          </Link>
        </div>
      </div>
    </main>
  );
}