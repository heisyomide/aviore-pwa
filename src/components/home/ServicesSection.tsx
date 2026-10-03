import Link from "next/link";
import { Send, ArrowRight, Store, ShieldCheck } from "lucide-react";

const services = [
  {
    title: "Send a Package",
    description: "Book instant doorstep pick-up and delivery for personal items, documents, or gifts across towns.",
    href: "/dashboard",
    icon: Send,
    badge: "Instant",
    bgLight: "bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 hover:from-emerald-100 hover:to-teal-200",
    borderColor: "border-emerald-300/60",
    textColor: "text-emerald-950",
    accentColor: "bg-emerald-600 text-white",
    linkColor: "text-emerald-700 hover:text-emerald-800",
    badgeStyle: "bg-emerald-500/20 text-emerald-900 border-emerald-300",
  },
  {
    title: "Business Deliveries",
    description: "Tailored logistics for online merchants, SMEs, and enterprise retail stores with bulk rates.",
    href: "/for-business",
    icon: Store,
    badge: "Merchant",
    bgLight: "bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-100 hover:from-indigo-100 hover:to-purple-200",
    borderColor: "border-indigo-300/60",
    textColor: "text-indigo-950",
    accentColor: "bg-indigo-600 text-white",
    linkColor: "text-indigo-700 hover:text-indigo-800",
    badgeStyle: "bg-indigo-500/20 text-indigo-900 border-indigo-300",
  },
  {
    title: "Escrow Deliveries",
    description: "Protected transactions where payment is securely held until buyer inspects and approves parcel.",
    href: "/escrow",
    icon: ShieldCheck,
    badge: "Protected",
    bgLight: "bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-100 hover:from-orange-100 hover:to-yellow-200",
    borderColor: "border-orange-300/60",
    textColor: "text-orange-950",
    accentColor: "bg-orange-500 text-white",
    linkColor: "text-orange-600 hover:text-orange-700",
    badgeStyle: "bg-orange-500/20 text-orange-900 border-orange-300",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
            Core Services
          </h2>
          <h3 className="text-3xl font-black text-neutral-900">
            What do you want to do today?
          </h3>
        </div>

        {/* Horizontal Scrollable on Mobile, Grid on Desktop */}
        <div className="flex sm:grid sm:grid-cols-3 gap-5 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className={`group relative flex flex-col justify-between p-6 rounded-3xl ${service.bgLight} border ${service.borderColor} transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 shrink-0 w-[260px] sm:w-auto`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-2xl ${service.accentColor} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon size={22} />
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-xs ${service.badgeStyle} bg-white/90`}>
                      {service.badge}
                    </span>
                  </div>
                  <h4 className={`text-lg font-black ${service.textColor} mb-2`}>
                    {service.title}
                  </h4>
                  <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                    {service.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-black/5">
                  <Link
                    href={service.href}
                    className={`inline-flex items-center gap-1.5 text-xs font-bold ${service.linkColor} transition-colors group-hover:translate-x-1 duration-200`}
                  >
                    <span>Learn More</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}