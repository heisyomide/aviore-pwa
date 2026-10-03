import type { Metadata, Viewport } from "next";
// 🟢 Import Fontsource fonts instead of next/font/google
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "./globals.css";
import ReactQueryProvider from "../providers/ReactQueryProvider";
import { AuthProvider } from "../context/AuthContext";
import SplashGate from "../components/SplashGate";
import PushNotificationManager from "../components/PushNotificationManager";
import RealtimeNotificationListener from "../components/RealtimeNotificationListener"; 
import AppUpdateBanner from "../components/AppUpdateBanner";
import UniversalBottomNav from "@/src/components/home/UniversalBottomNav";
import { AppLocationProvider } from "../context/AppLocationContext";

export const viewport: Viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// 🟢 Updated domain base URL
const DOMAIN_URL = "https://www.aviorego.com.ng";

export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN_URL),
  title: {
    default: "Aviorè Go | Order Food Online, High-End Logistics & Event Fulfillment in Osun & Oyo",
    template: "%s | Aviorè Go",
  },
  description:
    "Order delicious meals from top local restaurants and kitchens with instant food delivery. Plus premier logistics, express parcel shipping, and dedicated event transit management across Osogbo, Ibadan, Osun, and Oyo State.",
  keywords: [
    "Aviorè Go",
    "Aviore",
    "Food Delivery Osogbo",
    "Order Food Online Ibadan",
    "Best Restaurants Osun State",
    "Food Marketplace Nigeria",
    "Online Food Ordering Oyo",
    "High-End Logistics Nigeria",
    "Event Logistics Osogbo",
    "Ibadan Corporate Logistics",
    "Event Fulfillment Oyo",
    "Osun State Courier Service",
    "Secure Parcel Delivery Nigeria",
    "Same Day Delivery Osun",
    "Verified Courier Riders",
  ],
  authors: [{ name: "Aviorè", url: DOMAIN_URL }],
  creator: "Aviorè",
  publisher: "Aviorè",
  applicationName: "Aviorè Go",
  category: "Food Marketplace, Logistics, Supply Chain & Event Operations",
  
  // 🟢 iOS / Safari PWA Installability Config
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Aviorè Go",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Aviorè Go | Food Marketplace, High-End Logistics & Event Fulfillment",
    description:
      "Order food online from top local kitchens, enjoy lightning-fast delivery, precision parcel shipping, and robust event transit solutions across Osun & Oyo State.",
    url: DOMAIN_URL,
    siteName: "Aviorè Go",
    locale: "en_NG",
    type: "website",
    images: [
      {
        url: `${DOMAIN_URL}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Aviorè Go Food Delivery, Logistics and Event Fulfillment",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@aviorego",
    creator: "@aviore",
    title: "Aviorè Go | Food Delivery, Logistics & Event Fulfillment",
    description:
      "Order food online, advanced parcel shipping, comprehensive event logistics, and real-time tracking across Osun & Oyo State.",
    images: [`${DOMAIN_URL}/images/og-image.jpg`],
  },
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 🟢 Advanced Rich Schema.org Structured Data for Local Business, Food Service & Logistics Enterprise
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "FoodEstablishment", "DeliveryService"],
        "@id": `${DOMAIN_URL}/#business`,
        name: "Aviorè Go",
        url: DOMAIN_URL,
        logo: `${DOMAIN_URL}/images/logo.png`,
        image: `${DOMAIN_URL}/images/og-image.jpg`,
        description:
          "Premier food ordering marketplace, high-end logistics, enterprise courier services, and specialized event fulfillment solutions across Osun and Oyo State.",
        servesCuisine: "Local and Continental Cuisine",
        priceRange: "₦₦",
        areaServed: [
          { "@type": "AdministrativeArea", name: "Osun State" },
          { "@type": "AdministrativeArea", name: "Oyo State" },
          { "@type": "City", name: "Osogbo" },
          { "@type": "City", name: "Ibadan" }
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Aviorè Go Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Online Food Delivery & Marketplace"
              }
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Parcel Courier & Express Delivery"
              }
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Event Logistics & Transit Management"
              }
            }
          ]
        },
        provider: {
          "@type": "Organization",
          name: "Aviorè",
          url: DOMAIN_URL,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${DOMAIN_URL}/#website`,
        url: DOMAIN_URL,
        name: "Aviorè Go",
        publisher: {
          "@type": "Organization",
          name: "Aviorè",
          logo: {
            "@type": "ImageObject",
            url: `${DOMAIN_URL}/images/logo.png`,
          },
        },
      },
    ],
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
        {/* 🟢 Force browser to load Aviorè logo as favicon */}
        <link rel="icon" href="/images/logo.png" sizes="any" />
        <link rel="shortcut icon" href="/images/logo.png" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#f8fafc] text-neutral-900 font-sans antialiased selection:bg-emerald-500 selection:text-white pb-24">
       <ReactQueryProvider>
 <AuthProvider>
    <AppLocationProvider>
      <SplashGate>
        {/* 🟢 App Update & Notification Managers */}
        <AppUpdateBanner />
        <PushNotificationManager />
        <RealtimeNotificationListener />
        
        {/* Main App Workspace */}
        {children}

        {/* Universal Role-Based Bottom Navigation Bar */}
        <UniversalBottomNav />
      </SplashGate>
    </AppLocationProvider>
 </AuthProvider>
</ReactQueryProvider>
      </body>
    </html>
  );
}