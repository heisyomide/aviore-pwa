import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

const popularRestaurants = [
  {
    name: 'Chicken Republic',
    category: 'Fast Food & Rice',
    badge: 'Coming Soon',
    image: '/chicken.PNG',
    tag: 'Rotisserie & Fried Chicken',
    bgLight: 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-100 hover:from-amber-100 hover:to-orange-200',
    borderColor: 'border-amber-300/60',
    textColor: 'text-amber-950',
    accentColor: 'bg-amber-500 text-white',
    badgeStyle: 'bg-amber-500/20 text-amber-900 border-amber-300',
  },
  {
    name: "Domino's Pizza",
    category: 'Pizza & Fast Food',
    badge: 'Coming Soon',
    image: '/dominos.jpg',
    tag: 'Hot & Fresh Pizzas',
    bgLight: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-100 hover:from-blue-100 hover:to-sky-200',
    borderColor: 'border-blue-300/60',
    textColor: 'text-blue-950',
    accentColor: 'bg-blue-600 text-white',
    badgeStyle: 'bg-blue-500/20 text-blue-900 border-blue-300',
  },
  {
    name: 'Mama Cass',
    category: 'Nigerian & Continental',
    badge: 'Coming Soon',
    image: '/mama.jpg',
    tag: 'Authentic Local Dishes',
    bgLight: 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 hover:from-emerald-100 hover:to-teal-200',
    borderColor: 'border-emerald-300/60',
    textColor: 'text-emerald-950',
    accentColor: 'bg-emerald-600 text-white',
    badgeStyle: 'bg-emerald-500/20 text-emerald-900 border-emerald-300',
  },
  {
    name: 'KFC',
    category: 'Fried Chicken & Burgers',
    badge: 'Coming Soon',
    image: '/kfc.jpg',
    tag: "Finger Lickin' Good",
    bgLight: 'bg-gradient-to-br from-red-50 via-rose-50 to-orange-100 hover:from-red-100 hover:to-orange-200',
    borderColor: 'border-red-300/60',
    textColor: 'text-red-950',
    accentColor: 'bg-red-600 text-white',
    badgeStyle: 'bg-red-500/20 text-red-900 border-red-300',
  },
  {
    name: 'The Place',
    category: 'Restaurant & Bar',
    badge: 'Coming Soon',
    image: '/grill.jpg',
    tag: 'Grills & Continental',
    bgLight: 'bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-100 hover:from-purple-100 hover:to-indigo-200',
    borderColor: 'border-purple-300/60',
    textColor: 'text-purple-950',
    accentColor: 'bg-purple-600 text-white',
    badgeStyle: 'bg-purple-500/20 text-purple-900 border-purple-300',
  },
];

export default function PopularRestaurantsSection() {
  return (
    <section className="py-6 bg-white text-neutral-900 overflow-hidden border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Partnering Soon</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900">
              Popular <span className="text-emerald-600">Restaurants</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600">
              Get ready to order your favorite meals from top brands coming to our platform soon.
            </p>
          </div>
          <Link
            href="/food/restaurants"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <span>See all restaurants</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Horizontal Scrollable on Mobile, Grid on Desktop */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {popularRestaurants.map((restaurant) => (
            <div
              key={restaurant.name}
              className={`group relative flex flex-col justify-between ${restaurant.bgLight} rounded-3xl border ${restaurant.borderColor} transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 shrink-0 w-[240px] sm:w-auto overflow-hidden`}
            >
              {/* Image & Badge Wrapper */}
              <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-neutral-100">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Coming Soon Pill Overlay */}
                <div className="absolute top-3 right-3">
                  <span className={`text-[10px] font-bold backdrop-md px-2.5 py-1 rounded-full border shadow-md ${restaurant.badgeStyle} bg-white/90`}>
                    {restaurant.badge}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider block drop-shadow">
                    {restaurant.category}
                  </span>
                </div>
              </div>

              {/* Content Details */}
              <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className={`text-sm sm:text-base font-black ${restaurant.textColor} mb-0.5`}>
                    {restaurant.name}
                  </h3>
                  <p className="text-[11px] text-neutral-600 font-medium">
                    {restaurant.tag}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-neutral-600">
                    Launching Soon
                  </span>
                  <div className={`w-7 h-7 rounded-full ${restaurant.accentColor} flex items-center justify-center shadow-xs group-hover:translate-x-1 transition-transform`}>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}