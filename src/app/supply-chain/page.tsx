"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { handleShelfPlacementSuggestion } from "./actions";
import type { SuggestShelfPlacementOutput } from "@/ai/flows/suggest-shelf-placement";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Terminal, Lightbulb, Truck } from "lucide-react";

const formSchema = z.object({
  productName: z.string().min(2, { message: "Product name must be at least 2 characters." }),
  currentShelfPlacement: z.string().min(3, { message: "Please describe the current placement." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ShelfPlacementPage() {
  const [suggestion, setSuggestion] = useState<SuggestShelfPlacementOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      currentShelfPlacement: "",
    },
  });

  const handleSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setError(null);
    setSuggestion(null);
    try {
      const response = await handleShelfPlacementSuggestion(data);
      if (response.success && response.data) {
        setSuggestion(response.data);
      } else {
        setError(response.error || "An unknown error occurred.");
      }
    } catch (e: any) {
      setError(e.message || "A network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Shelf Placement Advisor</h1>
        <p className="text-muted-foreground">
          Get AI-powered suggestions to optimize product placement and reduce loss.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Analyze Product</CardTitle>
              <CardDescription>Enter product details to get suggestions.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="productName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Organic Avocados" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currentShelfPlacement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Shelf Placement</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Aisle 3, middle shelf" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Get Suggestions
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {error && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {suggestion && (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Lightbulb className="text-primary"/>Shelf Placement Suggestion</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div
                            className="prose prose-sm dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: suggestion.shelfPlacementSuggestion.replace(/\n/g, '<br />') }}
                        />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Truck className="text-primary"/>Transportation Adjustment</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <div
                            className="prose prose-sm dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: suggestion.transportationAdjustmentSuggestion.replace(/\n/g, '<br />') }}
                        />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Reasoning</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{suggestion.reasoning}</p>
                    </CardContent>
                </Card>
            </div>
          )}

          {!suggestion && !isLoading && !error && (
            <Card className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center text-muted-foreground">
                <p>Your AI-powered suggestions will appear here.</p>
              </div>
            </Card>
          )}

          {isLoading && (
            <Card className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center text-muted-foreground">
                <p>Generating suggestions...</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
