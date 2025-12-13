import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useSearch } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BottomNav } from "@/components/layout/bottom-nav";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductFilters } from "@/components/products/product-filters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Product, Category } from "@shared/schema";

type SortOption = "newest" | "price-low" | "price-high" | "name";

export default function Products() {
  const search = useSearch();
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(search);

  const initialCategory = searchParams.get("category") as Category | null;
  const initialSearch = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filters, setFilters] = useState({
    categories: initialCategory ? [initialCategory] : [] as Category[],
    priceRange: [0, 500000] as [number, number],
    inStockOnly: false,
  });

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const maxPrice = useMemo(() => {
    if (products.length === 0) return 500000;
    return Math.max(...products.map((p) => p.price), 500000);
  }, [products]);

  useEffect(() => {
    if (initialCategory && !filters.categories.includes(initialCategory)) {
      setFilters((prev) => ({
        ...prev,
        categories: [initialCategory],
      }));
    }
  }, [initialCategory]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const params = new URLSearchParams(search);
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    setLocation(`/products${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.category));
    }

    result = result.filter(
      (p) =>
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    if (filters.inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        break;
    }

    return result;
  }, [products, searchQuery, filters, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onSearch={handleSearch} searchQuery={searchQuery} />

      <main className="flex-1 pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          <div className="flex flex-col md:flex-row gap-6">
            <ProductFilters
              filters={filters}
              onFiltersChange={setFilters}
              maxPrice={maxPrice}
            />

            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h1
                    className="text-2xl md:text-3xl font-bold"
                    data-testid="text-products-title"
                  >
                    {searchQuery ? `Results for "${searchQuery}"` : "All Products"}
                  </h1>
                  <p className="text-muted-foreground mt-1" data-testid="text-products-count">
                    {filteredProducts.length} product
                    {filteredProducts.length !== 1 ? "s" : ""} found
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <ProductFilters
                    filters={filters}
                    onFiltersChange={setFilters}
                    maxPrice={maxPrice}
                  />
                  <Select
                    value={sortBy}
                    onValueChange={(value) => setSortBy(value as SortOption)}
                  >
                    <SelectTrigger
                      className="w-40"
                      data-testid="select-sort"
                    >
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <ProductGrid products={filteredProducts} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
