'use client';

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Package, Calendar, Briefcase, Users, Bus } from "lucide-react";

const carouselSlides = [
  {
    id: 1,
    badge: "Express Delivery",
    titleLine1: "Fast & Reliable",
    titleHighlight: "Package Delivery",
    description: "Send and receive parcels seamlessly across cities from local stores straight to your doorstep with real-time tracking.",
    primaryCta: { label: "Send a Package Now", href: "/dashboard/shipment/create" },
    secondaryCta: { label: "Track Shipment", href: "#track" },
    badgeIcon: Package,
  },
  {
    id: 2,
    badge: "Event Experiences",
    titleLine1: "Discover & Attend",
    titleHighlight: "Unforgettable Events",
    description: "Explore recent concerts, festivals, and conferences. Secure your entry passes and guarantee your travel ride.",
    primaryCta: { label: "Explore Events", href: "/dashboard/events" },
    secondaryCta: { label: "View Upcoming", href: "/events#upcoming" },
    badgeIcon: Calendar,
  },
  {
    id: 3,
    badge: "Business Partnerships",
    titleLine1: "Scale Your Business With",
    titleHighlight: "Our Logistics Network",
    description: "Partner with us to power your fulfillment, store deliveries, and corporate logistics while we handle the movement.",
    primaryCta: { label: "Partner With Us", href: "/for-business" },
    secondaryCta: { label: "Learn More", href: "/about" },
    badgeIcon: Briefcase,
  },
  {
    id: 4,
    badge: "Organizer Management",
    titleLine1: "Manage Fleet & Logistics",
    titleHighlight: "Effortlessly For Your Event",
    description: "Take full control of your event transportation. Coordinate bus fleets, verified drivers, and passenger manifests.",
    primaryCta: { label: "Create Organizer Account", href: "/organizer/signup" },
    secondaryCta: { label: "Organizer Portal", href: "/events/dashboard" },
    badgeIcon: Users,
  },
  {
    id: 5,
    badge: "Intra-State Rides",
    titleLine1: "Comfortable Group Transit",
    titleHighlight: "Across Cities & States",
    description: "Reliable movement connecting Osogbo, Ede, Ibadan, and Ogbomoso. Safe rides designed for group transit and event commuters.",
    primaryCta: { label: "Book a Ride", href: "/trips" },
    secondaryCta: { label: "View Routes", href: "/trips" },
    badgeIcon: Bus,
  }
];

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide effect every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + carouselSlides.length) % carouselSlides.length);
  };

  const currentSlide = carouselSlides[currentIndex];
  const BadgeIcon = currentSlide.badgeIcon;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-neutral-950 via-emerald-950 to-neutral-950 py-10 md:py-16 text-white">
      {/* Subtle background glow overlays */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-green-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b9810a_1px,transparent_1px),linear-gradient(to_bottom,#10b9810a_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold backdrop-blur-md shadow-md">
            <BadgeIcon size={13} className="text-emerald-400 animate-pulse" />
            <span>{currentSlide.badge}</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
            {currentSlide.titleLine1} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400">
              {currentSlide.titleHighlight}
            </span>
          </h1>

          {/* Description */}
          <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto leading-relaxed">
            {currentSlide.description}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
            <Link
              href={currentSlide.primaryCta.href}
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs px-6 py-3 rounded-full shadow-lg shadow-emerald-500/25 transition-all hover:scale-105"
            >
              <span>{currentSlide.primaryCta.label}</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href={currentSlide.secondaryCta.href}
              className="inline-flex items-center gap-2 bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 font-bold text-xs px-6 py-3 rounded-full transition-colors backdrop-blur-md shadow-md"
            >
              {currentSlide.secondaryCta.label}
            </Link>
          </div>

          {/* Carousel Controls & Indicators */}
          <div className="flex items-center justify-between pt-6 border-t border-neutral-800/80 max-w-xs mx-auto mt-4">
            <div className="flex items-center gap-1.5">
              {carouselSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentIndex === idx ? 'w-6 bg-emerald-400' : 'w-1.5 bg-neutral-700 hover:bg-neutral-500'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                className="w-8 h-8 rounded-full border border-neutral-700 bg-neutral-900/80 flex items-center justify-center text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors shadow-sm"
                aria-label="Previous slide"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={nextSlide}
                className="w-8 h-8 rounded-full border border-neutral-700 bg-neutral-900/80 flex items-center justify-center text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors shadow-sm"
                aria-label="Next slide"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}