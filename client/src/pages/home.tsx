import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Truck, MessageCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BottomNav } from "@/components/layout/bottom-nav";
import { ProductGrid } from "@/components/products/product-grid";
import { CategoryCard } from "@/components/products/category-card";
import { categories, type Product } from "@shared/schema";

export default function Home() {
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);
  const newArrivals = products.slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pb-20 md:pb-0">
        <section className="relative min-h-[50vh] md:min-h-[60vh] lg:min-h-[70vh] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=1080&fit=crop)",
            }}
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-center">
            <h1
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
              data-testid="text-hero-title"
            >
              Shop the Best in Benin
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
              Quality products at affordable prices. Cash on delivery available
              across the country.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-white/90 text-foreground backdrop-blur-md border border-white/20"
                  data-testid="button-shop-now"
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-8 bg-card border-y">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 flex items-center gap-4" data-testid="card-feature-delivery">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Cash on Delivery</h3>
                  <p className="text-sm text-muted-foreground">
                    Pay when you receive your order
                  </p>
                </div>
              </Card>
              <Card className="p-6 flex items-center gap-4" data-testid="card-feature-whatsapp">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">WhatsApp Ordering</h3>
                  <p className="text-sm text-muted-foreground">
                    Order easily via WhatsApp
                  </p>
                </div>
              </Card>
              <Card className="p-6 flex items-center gap-4" data-testid="card-feature-quality">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Quality Guarantee</h3>
                  <p className="text-sm text-muted-foreground">
                    Authentic products only
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold" data-testid="text-categories-title">
                Shop by Category
              </h2>
              <Link href="/products">
                <Button variant="ghost" size="sm" data-testid="button-view-all-categories">
                  View All
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <CategoryCard key={category} category={category} />
              ))}
            </div>
          </div>
        </section>

        {featuredProducts.length > 0 && (
          <section className="py-12 md:py-20 bg-card">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-bold" data-testid="text-featured-title">
                  Featured Products
                </h2>
                <Link href="/products">
                  <Button variant="ghost" size="sm" data-testid="button-view-all-featured">
                    View All
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <ProductGrid products={featuredProducts} isLoading={isLoading} />
            </div>
          </section>
        )}

        <section className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold" data-testid="text-new-arrivals-title">
                New Arrivals
              </h2>
              <Link href="/products">
                <Button variant="ghost" size="sm" data-testid="button-view-all-new">
                  View All
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <ProductGrid products={newArrivals} isLoading={isLoading} />
          </div>
        </section>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
