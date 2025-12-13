import { Link } from "wouter";
import { ShoppingCart, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart, formatPrice } from "@/lib/cart";
import type { Product } from "@shared/schema";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock > 0) {
      addItem(product.id);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  const stockStatus =
    product.stock === 0
      ? { label: "Out of Stock", variant: "destructive" as const }
      : product.stock <= 5
      ? { label: "Low Stock", variant: "secondary" as const }
      : { label: "In Stock", variant: "default" as const };

  return (
    <Link href={`/products/${product.id}`}>
      <Card
        className="group overflow-visible cursor-pointer h-full flex flex-col hover-elevate"
        data-testid={`card-product-${product.id}`}
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-t-md bg-muted">
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
          {product.featured && (
            <Badge
              variant="default"
              className="absolute top-2 left-2"
              data-testid={`badge-featured-${product.id}`}
            >
              Featured
            </Badge>
          )}
        </div>

        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <Badge variant="secondary" size="sm">
              {stockStatus.label}
            </Badge>
          </div>

          <h3
            className="font-semibold text-base line-clamp-2 mb-1"
            data-testid={`text-product-name-${product.id}`}
          >
            {product.name}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
            {product.description}
          </p>

          <div className="mt-auto pt-2">
            <p
              className="text-xl font-semibold mb-3"
              data-testid={`text-product-price-${product.id}`}
            >
              {formatPrice(product.price)}
            </p>

            <Button
              className="w-full"
              size="sm"
              disabled={product.stock === 0}
              onClick={handleAddToCart}
              data-testid={`button-add-cart-${product.id}`}
            >
              {added ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Added
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
