import { z } from "zod";

export const categories = [
  "clothing",
  "electronics",
  "accessories",
  "beauty",
  "home",
  "shoes",
] as const;

export type Category = (typeof categories)[number];

export const categoryLabels: Record<Category, string> = {
  clothing: "Clothing",
  electronics: "Electronics",
  accessories: "Accessories",
  beauty: "Beauty",
  home: "Home",
  shoes: "Shoes",
};

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  stock: number;
  images: string[];
  featured: boolean;
}

export const insertProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be positive"),
  category: z.enum(categories),
  stock: z.number().int().min(0, "Stock must be non-negative"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  featured: z.boolean().default(false),
});

export type InsertProduct = z.infer<typeof insertProductSchema>;

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
}

export const customerInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(8, "Valid phone number is required"),
  address: z.string().min(5, "Address is required"),
});

export type InsertCustomerInfo = z.infer<typeof customerInfoSchema>;

export interface Order {
  id: string;
  customerInfo: CustomerInfo;
  items: Array<{
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  status: "pending" | "confirmed" | "delivered";
  createdAt: string;
}

export const insertOrderSchema = z.object({
  customerInfo: customerInfoSchema,
  items: z.array(
    z.object({
      productId: z.string(),
      productName: z.string(),
      price: z.number(),
      quantity: z.number().int().positive(),
    })
  ),
  total: z.number().positive(),
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;

export interface User {
  id: string;
  username: string;
  password: string;
}

export const insertUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
