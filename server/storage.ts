import {
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  getOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private orders: Map<string, Order>;

  constructor() {
    this.products = new Map();
    this.orders = new Map();
    this.seedProducts();
  }

  private seedProducts() {
    const sampleProducts: InsertProduct[] = [
      {
        name: "African Print Dress",
        description: "Beautiful handmade African print dress with vibrant colors. Perfect for special occasions and everyday wear.",
        price: 25000,
        category: "clothing",
        stock: 15,
        images: ["https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=800&h=1000&fit=crop"],
        featured: true,
      },
      {
        name: "Wireless Bluetooth Earbuds",
        description: "High-quality wireless earbuds with noise cancellation and long battery life. Compatible with all devices.",
        price: 18000,
        category: "electronics",
        stock: 30,
        images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=1000&fit=crop"],
        featured: true,
      },
      {
        name: "Men's Leather Watch",
        description: "Classic leather strap watch with a modern design. Water-resistant and durable.",
        price: 35000,
        category: "accessories",
        stock: 20,
        images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=1000&fit=crop"],
        featured: true,
      },
      {
        name: "Natural Shea Butter",
        description: "100% pure organic shea butter from Ghana. Perfect for skin and hair care.",
        price: 5000,
        category: "beauty",
        stock: 50,
        images: ["https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800&h=1000&fit=crop"],
        featured: false,
      },
      {
        name: "Decorative Woven Basket",
        description: "Handcrafted traditional African woven basket. Great for storage or decoration.",
        price: 12000,
        category: "home",
        stock: 25,
        images: ["https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=800&h=1000&fit=crop"],
        featured: false,
      },
      {
        name: "Leather Sandals",
        description: "Comfortable handmade leather sandals. Perfect for the African climate.",
        price: 15000,
        category: "shoes",
        stock: 40,
        images: ["https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800&h=1000&fit=crop"],
        featured: true,
      },
      {
        name: "Ankara Print Shirt",
        description: "Men's stylish Ankara print shirt. Comfortable cotton fabric with bold patterns.",
        price: 18000,
        category: "clothing",
        stock: 22,
        images: ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=1000&fit=crop"],
        featured: false,
      },
      {
        name: "Smartphone Power Bank",
        description: "20000mAh portable power bank with fast charging. Charge multiple devices at once.",
        price: 12000,
        category: "electronics",
        stock: 35,
        images: ["https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&h=1000&fit=crop"],
        featured: false,
      },
      {
        name: "Beaded Necklace Set",
        description: "Traditional African beaded necklace and earring set. Handmade with love.",
        price: 8000,
        category: "accessories",
        stock: 18,
        images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=1000&fit=crop"],
        featured: false,
      },
      {
        name: "African Black Soap",
        description: "Authentic African black soap made with natural ingredients. Great for all skin types.",
        price: 3000,
        category: "beauty",
        stock: 60,
        images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=1000&fit=crop"],
        featured: false,
      },
      {
        name: "Canvas Sneakers",
        description: "Comfortable canvas sneakers for everyday wear. Lightweight and stylish.",
        price: 22000,
        category: "shoes",
        stock: 28,
        images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=1000&fit=crop"],
        featured: false,
      },
      {
        name: "African Wall Art",
        description: "Beautiful canvas print featuring African landscape. Ready to hang.",
        price: 28000,
        category: "home",
        stock: 10,
        images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1000&fit=crop"],
        featured: false,
      },
    ];

    sampleProducts.forEach((product) => {
      const id = randomUUID();
      this.products.set(id, { ...product, id });
    });
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(
    id: string,
    updates: Partial<InsertProduct>
  ): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;

    const updated: Product = { ...existing, ...updates };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = {
      ...insertOrder,
      id,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    this.orders.set(id, order);
    return order;
  }
}

export const storage = new MemStorage();
