import { Link, useLocation } from "wouter";
import { ShoppingCart, Search, Menu, Moon, Sun, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { useTheme } from "@/lib/theme";
import { useState } from "react";
import { categories, categoryLabels } from "@shared/schema";

interface HeaderProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

export function Header({ onSearch, searchQuery = "" }: HeaderProps) {
  const [location] = useLocation();
  const { getItemCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const itemCount = getItemCount();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(localSearch);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Shop" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between gap-4 h-16">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="md:hidden"
                  data-testid="button-mobile-menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link href="/">
                    <span className="text-2xl font-bold text-foreground" data-testid="link-logo-mobile">
                      AfriShop
                    </span>
                  </Link>
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <span
                        className={`text-lg ${
                          location === link.href
                            ? "text-foreground font-semibold"
                            : "text-muted-foreground"
                        }`}
                        data-testid={`link-nav-mobile-${link.label.toLowerCase()}`}
                      >
                        {link.label}
                      </span>
                    </Link>
                  ))}
                  <div className="border-t pt-4 mt-2">
                    <p className="text-sm font-medium mb-3 text-muted-foreground">
                      Categories
                    </p>
                    {categories.map((cat) => (
                      <Link key={cat} href={`/products?category=${cat}`}>
                        <span
                          className="block py-2 text-foreground"
                          data-testid={`link-category-mobile-${cat}`}
                        >
                          {categoryLabels[cat]}
                        </span>
                      </Link>
                    ))}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>

            <Link href="/">
              <span
                className="text-xl md:text-2xl font-bold text-foreground"
                data-testid="link-logo"
              >
                AfriShop
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 ml-6">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    className={`text-sm font-medium transition-colors ${
                      location === link.href
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    data-testid={`link-nav-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md mx-4"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pl-10 pr-4"
                data-testid="input-search"
              />
            </div>
          </form>

          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            <Link href="/admin">
              <Button
                size="icon"
                variant="ghost"
                data-testid="button-admin"
              >
                <User className="h-5 w-5" />
              </Button>
            </Link>

            <Link href="/cart">
              <Button
                size="icon"
                variant="ghost"
                className="relative"
                data-testid="button-cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge
                    variant="default"
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                    data-testid="badge-cart-count"
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>
        </div>

        <form
          onSubmit={handleSearch}
          className="md:hidden pb-3"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-10 pr-4"
              data-testid="input-search-mobile"
            />
          </div>
        </form>
      </div>
    </header>
  );
}
