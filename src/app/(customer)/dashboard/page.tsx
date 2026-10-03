'use client';
import { useEffect, useState } from 'react';
import HomeSearchBarSection from "../../../components/home/HomeSearchBar";
import VerticalServicesSection from "../../../components/home/ServiceSection";
import PopularRestaurantsSection from "../../../components/home/PopularRestaurant";
import UpcomingEventsSection from "../../../components/home/UpcomingEvents";
import FeaturedRestaurantsSection from "../../../components/home/FeaturedRestaurant";
import PopularNearYouSection from "../../../components/home/PopularNearYou";
import HomeServiceCardsSection from '@/src/components/home/HomeService';
import LiveOrderTrackerBanner from '@/src/components/home/LiveOrder';
import MoreFromAviorGo from '@/src/components/home/MoreFromAviorGo';
import HeroBanner from '@/src/components/home/HeroBanner';

export default function HomePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/storefront/home`)
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load storefront homepage", err);
        setLoading(false);
      });
  }, []);

  // Map backend properties (businessName, coverUrl, cuisineType) to frontend component expectation (name, imageUrl, description)
  const formattedFeaturedMerchants = (data?.featuredMerchants || []).map((m: any) => ({
    id: m.id,
    name: m.businessName,
    imageUrl: m.coverUrl || m.logoUrl,
    description: m.cuisineType || "Restaurant • Meals",
    address: m.address,
  }));

  return (
    <>
      <HeroBanner/>
      <LiveOrderTrackerBanner/>
    
      <FeaturedRestaurantsSection merchants={formattedFeaturedMerchants} loading={loading} />
      <UpcomingEventsSection />
    </>
  );
}