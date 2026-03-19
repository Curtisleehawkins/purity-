//lib/mockData.ts

import { Category, Product, BusinessInfo, User } from "./types";


export const categories: Category[] = [
  {
    id: "tvs",
    name: "TVs & Displays",
    slug: "tvs",
    icon: "Tv",
    description: "Smart TVs, LED & Digital displays",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80",
  },
  {
    id: "solar",
    name: "Solar Systems",
    slug: "solar",
    icon: "Sun",
    description: "Solar panels, inverters & accessories",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80",
  },
  {
    id: "batteries",
    name: "Batteries & Power",
    slug: "batteries",
    icon: "Battery",
    description: "Batteries, UPS & power solutions",
    image: "https://images.unsplash.com/photo-1605191737662-98ba90cb953e?w=400&q=80",
  },
  {
    id: "fridges",
    name: "Fridges & Cooling",
    slug: "fridges",
    icon: "Refrigerator",
    description: "Refrigerators, freezers & coolers",
    image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&q=80",
  },
  {
    id: "beauty",
    name: "Beauty Electronics",
    slug: "beauty",
    icon: "Sparkles",
    description: "Hair dryers, straighteners & more",
    image: "https://images.unsplash.com/photo-1642844819197-5f5f21b89ff8?w=400&q=80",
  },
  {
    id: "audio",
    name: "Audio & Sound",
    slug: "audio",
    icon: "Speaker",
    description: "Speakers, headphones & sound systems",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&q=80",
  },
];

export const products: Product[] = [
  {
    id: "tv-1",
    name: 'Samsung 43" Smart TV',
    slug: "samsung-43-smart-tv",
    categoryId: "tvs",
    price: 42000,
    originalPrice: 48000,
    description:
      "Experience stunning 4K resolution with this Samsung Smart TV. Built-in Wi-Fi, streaming apps, and crystal-clear display.",
    features: [
      "4K UHD Resolution",
      "Smart TV with Wi-Fi",
      "HDR Support",
      "2 HDMI Ports",
      "1 Year Warranty",
    ],
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80",
    inStock: true,
    badge: "Hot Deal",
  },

 {
    id: "tv-2",
    name: "LG 32\" LED TV",
    slug: "lg-32-led-tv",
    categoryId: "tvs",
    price: 22000,
    description: "Compact and reliable LG LED TV, perfect for bedrooms and small living spaces.",
    features: ["HD Ready", "USB Playback", "HDMI Input", "Energy Efficient"],
    image: "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=600&q=80",
    inStock: true,
  },
  {
    id: "tv-3",
    name: "Hisense 55\" 4K Smart TV",
    slug: "hisense-55-4k-smart-tv",
    categoryId: "tvs",
    price: 58000,
    originalPrice: 65000,
    description: "Large screen entertainment with Hisense 4K Smart TV. Dolby Vision and built-in streaming.",
    features: ["55 Inch 4K Display", "Dolby Vision", "Bluetooth", "3 HDMI Ports", "Game Mode"],
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&q=80",
    inStock: true,
    badge: "Best Seller",
  },
  // Solar
  {
    id: "solar-1",
    name: "300W Solar Panel Kit",
    slug: "300w-solar-panel-kit",
    categoryId: "solar",
    price: 35000,
    description: "Complete 300W solar panel kit ideal for home use. Includes panel, charge controller, and cables.",
    features: ["300W Monocrystalline Panel", "30A Charge Controller", "MC4 Connectors", "Mounting Brackets Included"],
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80",
    inStock: true,
    badge: "Popular",
  },
  {
    id: "solar-2",
    name: "Solar Inverter 1.5KVA",
    slug: "solar-inverter-1500va",
    categoryId: "solar",
    price: 28000,
    description: "Pure sine wave solar inverter for reliable power conversion.",
    features: ["1.5KVA Output", "Pure Sine Wave", "LCD Display", "Overload Protection"],
    image: "https://images.unsplash.com/photo-1595437193398-f24279553f4f?w=600&q=80",
    inStock: true,
  },
  // Batteries
  {
    id: "bat-1",
    name: "100Ah Deep Cycle Battery",
    slug: "100ah-deep-cycle-battery",
    categoryId: "batteries",
    price: 18000,
    originalPrice: 22000,
    description: "Reliable 100Ah deep cycle battery for solar and backup power systems.",
    features: ["100Ah Capacity", "Deep Cycle Design", "Maintenance Free", "3 Year Warranty"],
    image: "https://images.unsplash.com/photo-1676337167498-ceac1d6dafba?w=600&q=80",
    inStock: true,
    badge: "Sale",
  },
  {
    id: "bat-2",
    name: "Portable Power Station 500W",
    slug: "portable-power-station-500w",
    categoryId: "batteries",
    price: 45000,
    description: "Take power anywhere with this portable 500W power station. Perfect for outdoor events and emergencies.",
    features: ["500W Output", "Multiple Outlets", "Solar Charging Compatible", "LED Flashlight"],
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80",
    inStock: true,
  },
  // Fridges
  {
    id: "fridge-1",
    name: "Samsung 300L Double Door Fridge",
    slug: "samsung-300l-double-door",
    categoryId: "fridges",
    price: 55000,
    originalPrice: 62000,
    description: "Spacious Samsung double door refrigerator with frost-free technology.",
    features: ["300L Capacity", "Frost Free", "Digital Inverter", "Energy Rating A+", "5 Year Compressor Warranty"],
    image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&q=80",
    inStock: true,
    badge: "Premium",
  },
  {
    id: "fridge-2",
    name: "Mini Bar Fridge 90L",
    slug: "mini-bar-fridge-90l",
    categoryId: "fridges",
    price: 15000,
    description: "Compact mini bar fridge, perfect for offices and hotel rooms.",
    features: ["90L Capacity", "Low Noise", "Adjustable Thermostat", "Compact Design"],
    image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&q=80",
    inStock: false,
  },
  // Beauty
  {
    id: "beauty-1",
    name: "Professional Hair Dryer 2200W",
    slug: "professional-hair-dryer-2200w",
    categoryId: "beauty",
    price: 4500,
    description: "Salon-grade hair dryer with ionic technology for smooth, frizz-free results.",
    features: ["2200W Power", "Ionic Technology", "3 Heat Settings", "Cool Shot Button", "Concentrator Nozzle"],
    image: "https://images.unsplash.com/photo-1755247339969-82685c3dc761?w=600&q=80",
    inStock: true,
  },
  {
    id: "beauty-2",
    name: "Hair Straightener Ceramic",
    slug: "hair-straightener-ceramic",
    categoryId: "beauty",
    price: 3500,
    originalPrice: 4500,
    description: "Ceramic plate hair straightener with adjustable temperature control.",
    features: ["Ceramic Plates", "Temperature Control", "Fast Heat Up", "Swivel Cord", "Auto Shut-off"],
    image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600&q=80",
    inStock: true,
    badge: "Sale",
  },
  // Audio
  {
    id: "audio-1",
    name: "Bluetooth Speaker 20W",
    slug: "bluetooth-speaker-20w",
    categoryId: "audio",
    price: 5500,
    description: "Powerful portable Bluetooth speaker with deep bass and 12-hour battery life.",
    features: ["20W Output", "Bluetooth 5.0", "12 Hour Battery", "IPX5 Water Resistant", "AUX Input"],
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80",
    inStock: true,
  },
  {
    id: "audio-2",
    name: "Home Theatre System 5.1",
    slug: "home-theatre-system-5-1",
    categoryId: "audio",
    price: 38000,
    originalPrice: 45000,
    description: "Immersive 5.1 surround sound home theatre system for the ultimate movie experience.",
    features: ["5.1 Channel", "Bluetooth & USB", "FM Radio", "Remote Control", "Wall Mountable"],
    image: "https://images.unsplash.com/photo-1743685889437-210ad44b6c5f?w=600&q=80",
    inStock: true,
    badge: "Best Value",
  },


  // 🔁 (all other products remain EXACTLY the same as you pasted)
];

export const BUSINESS_INFO: BusinessInfo = {
  name: "Purity Electronics Limited",
  phone: "+254111446888",
  whatsapp: "+254111446888",
  email: "info@purityelectronics.co.ke",
  location: "Nairobi, Kenya",
  tagline: "Quality Electronics, Affordable Prices",
  workingHours: "Mon - Sat: 8:00 AM - 7:00 PM",
};

export const formatPrice = (price: number): string => {
  return `KSh ${price.toLocaleString()}`;
};

export const getWhatsAppLink = (message: string): string => {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${BUSINESS_INFO.whatsapp.replace("+", "")}?text=${encoded}`;
};

export const getCallLink = (): string => {
  return `tel:${BUSINESS_INFO.phone}`;
};


export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Admin",
    email: "admin@example.com",
    password: "admin123",
    role: "Super Admin",
    status: "active",
    joinedAt: "2024-01-10",
  },
  {
    id: "2",
    name: "Sarah Manager",
    email: "manager@example.com",
    password: "manager123",
    role: "Admin",
    status: "active",
    joinedAt: "2024-02-05",
  },
  {
    id: "3",
    name: "Mike Editor",
    email: "editor@example.com",
    password: "editor123",
    role: "Admin",
    status: "inactive",
    joinedAt: "2024-03-15",
  },
   {
    id: "4",
    name: "Francis Developer",
    email: "admin@admin.com",
    password: "admin123",
    role: "Super Admin",
    status: "active",
    joinedAt: "2024-01-10",
  },
];
