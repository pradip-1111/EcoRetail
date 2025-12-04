"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { handleEmailGeneration } from "./actions";
import type { GenerateEmailOutput } from "@/ai/flows/generate-email-flow";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Terminal, Mail } from "lucide-react";

const formSchema = z.object({
  productName: z.string().min(2, { message: "Product name must be at least 2 characters." }),
  productFeatures: z.string().min(10, { message: "Please list at least one feature (min 10 characters)." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function EmailMarketingPage() {
  const [emailContent, setEmailContent] = useState<GenerateEmailOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      productFeatures: "",
    },
  });

  const handleSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setError(null);
    setEmailContent(null);
    try {
      const response = await handleEmailGeneration(data);
      if (response.success && response.data) {
        setEmailContent(response.data);
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
        <h1 className="text-3xl font-bold tracking-tight">AI Email Marketing Assistant</h1>
        <p className="text-muted-foreground">
          Generate compelling promotional emails for your products in seconds.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Email Details</CardTitle>
              <CardDescription>Enter product details to generate an email.</CardDescription>
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
                          <Input placeholder="e.g., Bamboo Toothbrush Set" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="productFeatures"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Features</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="e.g., Sustainable, biodegradable handle, charcoal bristles, plastic-free packaging" 
                            className="resize-none"
                            {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Generate Email
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

          {emailContent && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Mail className="text-primary"/>Generated Email Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Subject</p>
                      <p className="font-semibold">{emailContent.subject}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Body</p>
                    <div className="p-4 border rounded-md bg-background">
                         <div
                            className="prose prose-sm dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: emailContent.body }}
                        />
                    </div>
                  </div>
              </CardContent>
            </Card>
          )}

          {!emailContent && !isLoading && !error && (
            <Card className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center text-muted-foreground">
                <p>Your AI-generated email will appear here.</p>
              </div>
            </Card>
          )}

          {isLoading && (
            <Card className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center text-muted-foreground">
                <p>Generating email content...</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
