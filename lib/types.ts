//lib/types.ts

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string;        // Lucide icon name
  description: string;
  image: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  price: number; //selling price
  originalPrice?: number; //buying price - optional
  description: string;
  features: string[];
  image: string; // URL to product image cloudinary
  inStock: boolean; 
  badge?: string;
};

export type BusinessInfo = {
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  location: string;
  tagline: string;
  workingHours: string;
};


export type UserRole = "Super Admin" | "Admin" ;

export type UserStatus = "active" | "inactive";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  joinedAt: string; // yyyy-mm-dd
}

