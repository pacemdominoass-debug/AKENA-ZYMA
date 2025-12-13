import { Link } from "wouter";
import { Phone, MapPin, Clock } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

export function Footer() {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4" data-testid="text-footer-brand">
              AfriShop
            </h3>
            <p className="text-sm text-muted-foreground">
              Your trusted online store in Benin. Quality products, affordable
              prices, and cash on delivery.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/">
                <span className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-home">
                  Home
                </span>
              </Link>
              <Link href="/products">
                <span className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-shop">
                  Shop
                </span>
              </Link>
              <Link href="/cart">
                <span className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-cart">
                  Cart
                </span>
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+229 XX XX XX XX</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <SiWhatsapp className="h-4 w-4" />
                <span>WhatsApp Available</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Cotonou, Benin</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Store Hours</h4>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mt-0.5" />
              <div>
                <p>Monday - Saturday</p>
                <p>8:00 AM - 8:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p data-testid="text-copyright">
            &copy; {new Date().getFullYear()} AfriShop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
