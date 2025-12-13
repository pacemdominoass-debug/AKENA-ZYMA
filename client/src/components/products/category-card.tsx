import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import type { Category } from "@shared/schema";
import { categoryLabels } from "@shared/schema";
import {
  Shirt,
  Smartphone,
  Watch,
  Sparkles,
  Home,
  Footprints,
} from "lucide-react";

const categoryIcons: Record<Category, typeof Shirt> = {
  clothing: Shirt,
  electronics: Smartphone,
  accessories: Watch,
  beauty: Sparkles,
  home: Home,
  shoes: Footprints,
};

const categoryImages: Record<Category, string> = {
  clothing: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop",
  electronics: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop",
  accessories: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=400&fit=crop",
  beauty: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop",
  home: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=400&fit=crop",
  shoes: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
};

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = categoryIcons[category];

  return (
    <Link href={`/products?category=${category}`}>
      <Card
        className="group overflow-visible cursor-pointer hover-elevate"
        data-testid={`card-category-${category}`}
      >
        <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
          <img
            src={categoryImages[category]}
            alt={categoryLabels[category]}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white transition-colors group-hover:bg-black/50">
            <Icon className="h-8 w-8 mb-2" />
            <span className="font-semibold text-sm md:text-base text-center px-2">
              {categoryLabels[category]}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
