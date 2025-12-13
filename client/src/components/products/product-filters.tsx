import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SlidersHorizontal, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { categories, categoryLabels, type Category } from "@shared/schema";
import { formatPrice } from "@/lib/cart";

interface FiltersState {
  categories: Category[];
  priceRange: [number, number];
  inStockOnly: boolean;
}

interface ProductFiltersProps {
  filters: FiltersState;
  onFiltersChange: (filters: FiltersState) => void;
  maxPrice: number;
}

export function ProductFilters({
  filters,
  onFiltersChange,
  maxPrice,
}: ProductFiltersProps) {
  const activeFilterCount =
    filters.categories.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0);

  const handleCategoryToggle = (category: Category) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handlePriceChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      priceRange: [value[0], value[1]] as [number, number],
    });
  };

  const handleStockToggle = (checked: boolean) => {
    onFiltersChange({ ...filters, inStockOnly: checked });
  };

  const clearFilters = () => {
    onFiltersChange({
      categories: [],
      priceRange: [0, maxPrice],
      inStockOnly: false,
    });
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium mb-3 block">Categories</Label>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center gap-2">
              <Checkbox
                id={`category-${category}`}
                checked={filters.categories.includes(category)}
                onCheckedChange={() => handleCategoryToggle(category)}
                data-testid={`checkbox-category-${category}`}
              />
              <label
                htmlFor={`category-${category}`}
                className="text-sm cursor-pointer"
              >
                {categoryLabels[category]}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-3 block">Price Range</Label>
        <Slider
          value={[filters.priceRange[0], filters.priceRange[1]]}
          min={0}
          max={maxPrice}
          step={1000}
          onValueChange={handlePriceChange}
          className="mb-2"
          data-testid="slider-price"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{formatPrice(filters.priceRange[0])}</span>
          <span>{formatPrice(filters.priceRange[1])}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="in-stock"
          checked={filters.inStockOnly}
          onCheckedChange={handleStockToggle}
          data-testid="checkbox-in-stock"
        />
        <label htmlFor="in-stock" className="text-sm cursor-pointer">
          In Stock Only
        </label>
      </div>

      {activeFilterCount > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="w-full"
          data-testid="button-clear-filters"
        >
          <X className="h-4 w-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="md:hidden"
            data-testid="button-open-filters"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="default" className="ml-2" size="sm">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>

      <div className="hidden md:block w-64 shrink-0">
        <div className="sticky top-24 p-4 bg-card rounded-md border">
          <h3 className="font-semibold mb-4">Filters</h3>
          <FilterContent />
        </div>
      </div>
    </>
  );
}
