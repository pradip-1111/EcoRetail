// src/app/waste-reduction/waste-prediction-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles } from "lucide-react";
import { useProducts } from "@/contexts/products-context";

const formSchema = z.object({
  productName: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
});

type WastePredictionFormProps = {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  isLoading: boolean;
};

export function WastePredictionForm({ onSubmit, isLoading }: WastePredictionFormProps) {
  const { products } = useProducts();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
    },
  });

  const handleSelectProduct = (name: string) => {
    form.setValue("productName", name);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="productName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Organic Bananas" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {products.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-primary" />
              Quick select from catalog:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {products.slice(0, 4).map(product => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleSelectProduct(product.name)}
                  className="text-xs px-2.5 py-1 rounded-full border bg-muted/60 hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-colors text-left"
                >
                  {product.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Predict Waste
        </Button>
      </form>
    </Form>
  );
}
