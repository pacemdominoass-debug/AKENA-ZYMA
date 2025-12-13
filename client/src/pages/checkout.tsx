import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BottomNav } from "@/components/layout/bottom-nav";
import { useCart, formatPrice } from "@/lib/cart";
import { customerInfoSchema, type InsertCustomerInfo, type Product } from "@shared/schema";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { items, getTotal, clearCart } = useCart();

  const { data: products = [] } = useQuery<Product[]>({
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

  const form = useForm<InsertCustomerInfo>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
    },
  });

  const onSubmit = async (data: InsertCustomerInfo) => {
    const orderItems = cartProducts.map(({ productId, quantity, product }) => ({
      productId,
      productName: product.name,
      price: product.price,
      quantity,
    }));

    let orderMessage = `*New Order from AfriShop*\n\n`;
    orderMessage += `*Customer Information:*\n`;
    orderMessage += `Name: ${data.name}\n`;
    orderMessage += `Phone: ${data.phone}\n`;
    orderMessage += `Address: ${data.address}\n\n`;
    orderMessage += `*Order Items:*\n`;

    cartProducts.forEach(({ quantity, product }) => {
      orderMessage += `- ${product.name} x${quantity} = ${formatPrice(product.price * quantity)}\n`;
    });

    orderMessage += `\n*Total: ${formatPrice(total)}*\n`;
    orderMessage += `\n*Payment Method: Cash on Delivery*`;

    const encodedMessage = encodeURIComponent(orderMessage);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    
    window.open(whatsappUrl, "_blank");
    
    clearCart();
    setLocation("/");
  };

  if (!hasItems) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center pb-20 md:pb-0">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2" data-testid="text-empty-checkout">
              No Items to Checkout
            </h1>
            <p className="text-muted-foreground mb-6">
              Add some items to your cart first.
            </p>
            <Link href="/products">
              <Button data-testid="button-browse-products">Browse Products</Button>
            </Link>
          </div>
        </main>
        <Footer />
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
          <Link href="/cart">
            <Button
              variant="ghost"
              size="sm"
              className="mb-4"
              data-testid="button-back-to-cart"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
          </Link>

          <h1 className="text-2xl md:text-3xl font-bold mb-6" data-testid="text-checkout-title">
            Checkout
          </h1>

          <div className="grid lg:grid-cols-[1fr_360px] gap-6">
            <div>
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-6">Your Information</h2>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your full name"
                              {...field}
                              data-testid="input-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="+229 XX XX XX XX"
                              {...field}
                              data-testid="input-phone"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Address</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter your full address including city and landmark"
                              rows={3}
                              {...field}
                              data-testid="input-address"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="pt-4">
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={form.formState.isSubmitting}
                        data-testid="button-complete-order"
                      >
                        <SiWhatsapp className="h-5 w-5 mr-2" />
                        Complete Order via WhatsApp
                      </Button>
                      <p className="text-xs text-muted-foreground text-center mt-3">
                        You'll be redirected to WhatsApp with your order details
                      </p>
                    </div>
                  </form>
                </Form>
              </Card>
            </div>

            <div className="lg:sticky lg:top-24 h-fit">
              <Card className="p-6" data-testid="card-order-summary">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                <div className="space-y-4 mb-4">
                  {cartProducts.map(({ productId, quantity, product }) => (
                    <div
                      key={productId}
                      className="flex gap-3"
                      data-testid={`summary-item-${productId}`}
                    >
                      <div className="w-14 h-14 rounded-md overflow-hidden bg-muted shrink-0">
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
                        <p className="font-medium text-sm truncate">
                          {product.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {quantity}
                        </p>
                      </div>
                      <p className="font-medium text-sm shrink-0">
                        {formatPrice(product.price * quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Payment</span>
                    <span className="text-foreground">Cash on Delivery</span>
                  </div>
                </div>

                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span data-testid="text-checkout-total">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
