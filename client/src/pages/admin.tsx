import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Package, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BottomNav } from "@/components/layout/bottom-nav";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/cart";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  insertProductSchema,
  categories,
  categoryLabels,
  type Product,
  type InsertProduct,
  type Category,
} from "@shared/schema";
import { z } from "zod";

const productFormSchema = insertProductSchema.extend({
  imagesText: z.string().min(1, "At least one image URL is required"),
});

type ProductFormData = z.infer<typeof productFormSchema>;

export default function Admin() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "clothing" as Category,
      stock: 0,
      images: [],
      imagesText: "",
      featured: false,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertProduct) =>
      apiRequest("POST", "/api/products", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.refetchQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product created successfully" });
      closeDialog();
    },
    onError: () => {
      toast({ title: "Failed to create product", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: InsertProduct }) =>
      apiRequest("PATCH", `/api/products/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.refetchQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product updated successfully" });
      closeDialog();
    },
    onError: () => {
      toast({ title: "Failed to update product", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.refetchQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product deleted successfully" });
      setDeletingProductId(null);
    },
    onError: () => {
      toast({ title: "Failed to delete product", variant: "destructive" });
    },
  });

  const openCreateDialog = () => {
    form.reset({
      name: "",
      description: "",
      price: 0,
      category: "clothing" as Category,
      stock: 0,
      images: [],
      imagesText: "",
      featured: false,
    });
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    form.reset({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      images: product.images,
      imagesText: product.images.join("\n"),
      featured: product.featured,
    });
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
    form.reset();
  };

  const onSubmit = (data: ProductFormData) => {
    const images = data.imagesText
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const productData: InsertProduct = {
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      stock: data.stock,
      images,
      featured: data.featured,
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: productData });
    } else {
      createMutation.mutate(productData);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pb-20 md:pb-0">
        <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold" data-testid="text-admin-title">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your products and inventory
              </p>
            </div>
            <Button onClick={openCreateDialog} data-testid="button-add-product">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>

          {isLoading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2" data-testid="text-no-products-admin">
                No Products Yet
              </h2>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Start by adding your first product to your store.
              </p>
              <Button onClick={openCreateDialog} data-testid="button-add-first-product">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Product
              </Button>
            </div>
          ) : (
            <>
              <div className="hidden md:block">
                <div className="grid grid-cols-[80px_1fr_120px_100px_100px_100px] gap-4 py-3 px-4 bg-muted rounded-t-md font-medium text-sm">
                  <div>Image</div>
                  <div>Product</div>
                  <div>Category</div>
                  <div className="text-right">Price</div>
                  <div className="text-right">Stock</div>
                  <div className="text-right">Actions</div>
                </div>
                <div className="border rounded-b-md divide-y">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="grid grid-cols-[80px_1fr_120px_100px_100px_100px] gap-4 py-3 px-4 items-center"
                      data-testid={`row-product-${product.id}`}
                    >
                      <div className="w-16 h-16 rounded-md overflow-hidden bg-muted">
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
                      <div className="min-w-0">
                        <p className="font-medium truncate">{product.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {product.description}
                        </p>
                        {product.featured && (
                          <Badge variant="default" className="mt-1" text-xs px-2 py-0.5">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <div>
                        <Badge variant="secondary">
                          {categoryLabels[product.category]}
                        </Badge>
                      </div>
                      <div className="text-right font-medium">
                        {formatPrice(product.price)}
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            product.stock === 0
                              ? "destructive"
                              : product.stock <= 5
                              ? "secondary"
                              : "default"
                          }
                        >
                          {product.stock}
                        </Badge>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => openEditDialog(product)}
                          data-testid={`button-edit-${product.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setDeletingProductId(product.id)}
                          data-testid={`button-delete-${product.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:hidden space-y-4">
                {products.map((product) => (
                  <Card
                    key={product.id}
                    className="p-4"
                    data-testid={`card-product-admin-${product.id}`}
                  >
                    <div className="flex gap-4">
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
                            <p className="font-medium truncate">{product.name}</p>
                            <p className="text-lg font-semibold mt-1">
                              {formatPrice(product.price)}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge variant="secondary" size="sm">
                            {categoryLabels[product.category]}
                          </Badge>
                          <Badge
                            variant={
                              product.stock === 0
                                ? "destructive"
                                : product.stock <= 5
                                ? "secondary"
                                : "default"
                            }
                          >
                            Stock: {product.stock}
                          </Badge>
                          {product.featured && (
                            <Badge variant="default">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => openEditDialog(product)}
                        data-testid={`button-edit-mobile-${product.id}`}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setDeletingProductId(product.id)}
                        data-testid={`button-delete-mobile-${product.id}`}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter product name"
                        {...field}
                        data-testid="input-product-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter product description"
                        rows={3}
                        {...field}
                        data-testid="input-product-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (FCFA)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          data-testid="input-product-price"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          data-testid="input-product-stock"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-product-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {categoryLabels[category]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imagesText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URLs (one per line)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                        rows={3}
                        {...field}
                        data-testid="input-product-images"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="checkbox-featured"
                      />
                    </FormControl>
                    <FormLabel className="!mt-0 cursor-pointer">
                      Featured Product
                    </FormLabel>
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={closeDialog}
                  disabled={isPending}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isPending}
                  data-testid="button-save-product"
                >
                  {isPending
                    ? "Saving..."
                    : editingProduct
                    ? "Update Product"
                    : "Add Product"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deletingProductId}
        onOpenChange={() => setDeletingProductId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deletingProductId && deleteMutation.mutate(deletingProductId)
              }
              className="bg-destructive text-destructive-foreground"
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
      <BottomNav />
    </div>
  );
}
