import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import {
  ShoppingCart,
  Check,
  ArrowLeft,
  Minus,
  Plus,
  Package,
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BottomNav } from "@/components/layout/bottom-nav";
import { useCart, formatPrice } from "@/lib/cart";
import { categoryLabels, type Product } from "@shared/schema";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products", id],
  });

  const handleAddToCart = () => {
    if (product && product.stock >= quantity) {
      addItem(product.id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  const handleWhatsAppInquiry = () => {
    if (!product) return;
    const message = encodeURIComponent(
      `Hello! I'm interested in: ${product.name}\nPrice: ${formatPrice(product.price)}\nPlease provide more information.`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pb-20 md:pb-0">
          <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
            <div className="grid md:grid-cols-2 gap-8">
              <Skeleton className="aspect-[4/5] rounded-md" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center pb-20 md:pb-0">
          <div className="text-center">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2" data-testid="text-product-not-found">
              Product Not Found
            </h1>
            <p className="text-muted-foreground mb-4">
              The product you're looking for doesn't exist.
            </p>
            <Link href="/products">
              <Button data-testid="button-back-to-shop">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Shop
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
        <BottomNav />
      </div>
    );
  }

  const stockStatus =
    product.stock === 0
      ? { label: "Out of Stock", variant: "destructive" as const }
      : product.stock <= 5
      ? { label: `Only ${product.stock} left`, variant: "secondary" as const }
      : { label: "In Stock", variant: "default" as const };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pb-24 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          <Link href="/products">
            <Button
              variant="ghost"
              size="sm"
              className="mb-4"
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>

          <div className="grid md:grid-cols-[60%_40%] gap-8">
            <div>
              <div className="aspect-[4/5] rounded-md overflow-hidden bg-muted mb-4">
                {product.images[selectedImage] ? (
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    data-testid="img-product-main"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No Image
                  </div>
                )}
              </div>

              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                        selectedImage === index
                          ? "border-primary"
                          : "border-transparent"
                      }`}
                      data-testid={`button-thumbnail-${index}`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="mb-2">
                  {categoryLabels[product.category]}
                </Badge>
                <h1
                  className="text-2xl md:text-3xl font-bold mb-2"
                  data-testid="text-product-name"
                >
                  {product.name}
                </h1>
                <Badge variant={stockStatus.variant} data-testid="badge-stock">
                  {stockStatus.label}
                </Badge>
              </div>

              <p
                className="text-3xl md:text-4xl font-bold"
                data-testid="text-product-price"
              >
                {formatPrice(product.price)}
              </p>

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p
                  className="text-muted-foreground leading-relaxed"
                  data-testid="text-product-description"
                >
                  {product.description}
                </p>
              </div>

              {product.stock > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Quantity</h3>
                  <div className="flex items-center gap-3">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      data-testid="button-quantity-minus"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span
                      className="w-12 text-center font-semibold"
                      data-testid="text-quantity"
                    >
                      {quantity}
                    </span>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      disabled={quantity >= product.stock}
                      data-testid="button-quantity-plus"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-3 pt-4">
                <Button
                  size="lg"
                  className="w-full"
                  disabled={product.stock === 0}
                  onClick={handleAddToCart}
                  data-testid="button-add-to-cart"
                >
                  {added ? (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </>
                  )}
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="w-full"
                  onClick={handleWhatsAppInquiry}
                  data-testid="button-whatsapp-inquiry"
                >
                  <SiWhatsapp className="h-5 w-5 mr-2" />
                  Inquire on WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-16 md:hidden left-0 right-0 p-4 bg-background border-t">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-xl font-bold">{formatPrice(product.price)}</p>
          </div>
          <Button
            className="flex-1"
            disabled={product.stock === 0}
            onClick={handleAddToCart}
            data-testid="button-add-to-cart-sticky"
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

      <Footer />
      <BottomNav />
    </div>
  );
}
