import { Link, useLocation } from "wouter";
import { Home, Search, ShoppingCart, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart";

export function BottomNav() {
  const [location] = useLocation();
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/products", icon: Search, label: "Shop" },
    { href: "/cart", icon: ShoppingCart, label: "Cart", badge: itemCount },
    { href: "/admin", icon: User, label: "Admin" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background border-t">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <button
                className={`flex flex-col items-center justify-center gap-1 w-16 h-full relative ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
                data-testid={`button-nav-${item.label.toLowerCase()}`}
              >
                <div className="relative">
                  <item.icon className="h-5 w-5" />
                  {item.badge && item.badge > 0 && (
                    <Badge
                      variant="default"
                      className="absolute -top-2 -right-3 h-4 min-w-4 p-0 flex items-center justify-center text-xs"
                    >
                      {item.badge > 99 ? "99+" : item.badge}
                    </Badge>
                  )}
                </div>
                <span className="text-xs">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
