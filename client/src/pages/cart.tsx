import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BottomNav } from "@/components/layout/bottom-nav";
import { useCart, formatPrice } from "@/lib/cart";
import type { Product } from "@shared/schema";

export default function Cart() {
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCart();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const cartProducts = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter(Boolean) as Array<{ productId: string; quantity: number; product: Product }>;

  const total = getTotal(products);
  const hasItems = cartProducts.length > 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pb-20 md:pb-0">
          <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
            <Skeleton className="h-8 w-40 mb-6" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold" data-testid="text-cart-title">
              Shopping Cart
            </h1>
            {hasItems && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-muted-foreground"
                data-testid="button-clear-cart"
              >
                Clear All
              </Button>
            )}
          </div>

          {!hasItems ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <ShoppingBag className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2" data-testid="text-empty-cart">
                Your Cart is Empty
              </h2>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Looks like you haven't added anything to your cart yet. Start
                shopping to fill it up!
              </p>
              <Link href="/products">
                <Button data-testid="button-start-shopping">
                  Start Shopping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_320px] gap-6">
              <div className="space-y-4">
                {cartProducts.map(({ productId, quantity, product }) => (
                  <Card
                    key={productId}
                    className="p-4 flex gap-4"
                    data-testid={`card-cart-item-${productId}`}
                  >
                    <div className="w-20 h-20 rounded-md overflow-hidden bg-muted shrink-0">
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link href={`/products/${productId}`}>
                            <h3
                              className="font-semibold truncate hover:underline"
                              data-testid={`text-cart-product-name-${productId}`}
                            >
                              {product.name}
                            </h3>
                          </Link>
                          <p
                            className="text-lg font-semibold mt-1"
                            data-testid={`text-cart-product-price-${productId}`}
                          >
                            {formatPrice(product.price)}
                          </p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeItem(productId)}
                          className="text-muted-foreground shrink-0"
                          data-testid={`button-remove-${productId}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(productId, quantity - 1)}
                          data-testid={`button-minus-${productId}`}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span
                          className="w-8 text-center font-medium"
                          data-testid={`text-quantity-${productId}`}
                        >
                          {quantity}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(
                              productId,
                              Math.min(product.stock, quantity + 1)
                            )
                          }
                          disabled={quantity >= product.stock}
                          data-testid={`button-plus-${productId}`}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        {product.stock <= 5 && product.stock > 0 && (
                          <span className="text-xs text-muted-foreground ml-2">
                            Only {product.stock} left
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="lg:sticky lg:top-24 h-fit">
                <Card className="p-6" data-testid="card-cart-summary">
                  <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-muted-foreground">
                      <span>
                        Subtotal ({cartProducts.reduce((a, c) => a + c.quantity, 0)}{" "}
                        items)
                      </span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Delivery</span>
                      <span className="text-foreground">Cash on Delivery</span>
                    </div>
                  </div>

                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span data-testid="text-cart-total">{formatPrice(total)}</span>
                    </div>
                  </div>

                  <Link href="/checkout">
                    <Button
                      size="lg"
                      className="w-full"
                      data-testid="button-checkout"
                    >
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    You'll be redirected to WhatsApp to complete your order
                  </p>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
