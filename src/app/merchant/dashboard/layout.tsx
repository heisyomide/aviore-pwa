"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store, ShoppingBag, UtensilsCrossed, Wallet, MoreHorizontal } from "lucide-react";

export default function MerchantDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: "/merchant/dashboard", label: "Home", icon: Store, exact: true },
    { href: "/merchant/dashboard/orders", label: "Orders", icon: ShoppingBag },
    { href: "/merchant/dashboard/menu", label: "Menu", icon: UtensilsCrossed },
    { href: "/merchant/dashboard/wallet", label: "Wallet", icon: Wallet },
    { href: "/merchant/dashboard/more", label: "More", icon: MoreHorizontal },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 pb-24 text-neutral-950">
      <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-8 sm:pt-8">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200 bg-white/90 backdrop-blur-lg px-4 py-2">
        <div className="mx-auto grid max-w-md grid-cols-5 text-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact 
              ? pathname === item.href 
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-2 rounded-2xl transition-all ${
                  isActive 
                    ? "text-emerald-600 font-bold bg-emerald-50/70" 
                    : "text-neutral-400 hover:text-neutral-600 font-medium"
                }`}
              >
                <Icon size={18} />
                <span className="text-[10px] mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}