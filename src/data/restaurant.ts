export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  isPopular?: boolean;
}

export interface RestaurantData {
  id: string;
  name: string;
  coverImage: string;
  tagline: string;
  cuisine: string;
  rating: number;
  reviewsCount: number;
  deliveryTime: string;
  distance: string;
  menu: MenuItem[];
}

export const RESTAURANT_DATABASE: Record<string, RestaurantData> = {
  "1": {
    id: "1",
    name: "Mama Ibadan Kitchen",
    coverImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80",
    tagline: "Authentic Nigerian local delicacies made fresh daily with love.",
    cuisine: "Local Dishes & Swallow",
    rating: 4.8,
    reviewsCount: 240,
    deliveryTime: "20-30m",
    distance: "1.2 km",
    menu: [
      {
        id: "item-1",
        name: "Special Amala with Ewedu, Gbegiri & Assorted Meat",
        description: "Fluffy hot amala served with smooth freshly blended ewedu, savory gbegiri, and tender assorted beef/pomo.",
        price: "₦3,200",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=60",
        category: "swallow",
        isPopular: true,
      },
      {
        id: "item-2",
        name: "Party Jollof Rice & Fried Turkey Wing",
        description: "Smokey firewood-style party jollof served with crisp plantain and a massive seasoned turkey wing.",
        price: "₦4,500",
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60",
        category: "rice",
        isPopular: true,
      }
    ]
  },
  "2": {
    id: "2",
    name: "Crispy Bites Fast Food",
    coverImage: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=1200&auto=format&fit=crop&q=80",
    tagline: "Juicy gourmet burgers, crunchy fries, and crispy fried chicken.",
    cuisine: "Fast Food • Burgers",
    rating: 4.6,
    reviewsCount: 180,
    deliveryTime: "15-25m",
    distance: "0.8 km",
    menu: [
      {
        id: "item-201",
        name: "Double Cheese Smash Burger & Fries",
        description: "Two juicy beef patties loaded with melted cheddar, special sauce, and crisp golden fries.",
        price: "₦4,800",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60",
        category: "popular",
        isPopular: true,
      }
    ]
  },
  "3": {
    id: "3",
    name: "FreshPro Groceries & Mart",
    coverImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80",
    tagline: "Your one-stop shop for farm-fresh fruits, vegetables, and household essentials.",
    cuisine: "Groceries • Supermarket",
    rating: 4.9,
    reviewsCount: 95,
    deliveryTime: "30-45m",
    distance: "2.4 km",
    menu: [
      {
        id: "item-301",
        name: "Organic Fresh Fruit Basket (Mixed)",
        description: "Assorted handpicked bananas, apples, oranges, and pineapples.",
        price: "₦6,000",
        image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&auto=format&fit=crop&q=60",
        category: "popular",
        isPopular: true,
      }
    ]
  },
  "4": {
    id: "4",
    name: "Buka Express & Grill",
    coverImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop&q=80",
    tagline: "Pounded yam, rich egusi soup, and sizzling assorted grills.",
    cuisine: "Local Dishes • Grills",
    rating: 4.7,
    reviewsCount: 310,
    deliveryTime: "25-35m",
    distance: "1.9 km",
    menu: [
      {
        id: "item-401",
        name: "Pounded Yam with Egusi & Croaker Fish",
        description: "Smooth hand-pounded yam with rich melon soup and grilled fish.",
        price: "₦5,500",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=60",
        category: "popular",
        isPopular: true,
      }
    ]
  },
  "5": {
    id: "5",
    name: "SugarRush Bakery & Cakes",
    coverImage: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&auto=format&fit=crop&q=80",
    tagline: "Custom celebration cakes, pastries, and sweet treats.",
    cuisine: "Bakery & Cakes",
    rating: 4.9,
    reviewsCount: 140,
    deliveryTime: "20-35m",
    distance: "1.5 km",
    menu: [
      {
        id: "item-501",
        name: "Chocolate Fudge Layer Cake Slice",
        description: "Rich, moist chocolate sponge layered with decadent fudge frosting.",
        price: "₦2,500",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60",
        category: "popular",
        isPopular: true,
      }
    ]
  },
  "6": {
    id: "6",
    name: "Urban Sip & Bar",
    coverImage: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=1200&auto=format&fit=crop&q=80",
    tagline: "Exotic cocktails, fine wines, and chilled drinks.",
    cuisine: "Drinks & Bar",
    rating: 4.5,
    reviewsCount: 88,
    deliveryTime: "15-25m",
    distance: "1.1 km",
    menu: [
      {
        id: "item-601",
        name: "Signature Tropical Chapman Cocktail",
        description: "Classic Nigerian cocktail loaded with fresh citrus fruits and crushed ice.",
        price: "₦2,000",
        image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=60",
        category: "popular",
        isPopular: true,
      }
    ]
  }
};