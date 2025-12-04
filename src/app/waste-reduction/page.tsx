// src/app/waste-reduction/page.tsx
"use client";

import { useState } from "react";
import type { PredictWasteOutput } from "@/ai/flows/predict-waste";
import { handleWastePrediction } from "./actions";
import { WastePredictionForm } from "./waste-prediction-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function WasteReductionPage() {
  const [prediction, setPrediction] = useState<PredictWasteOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: { productName: string }) => {
    setIsLoading(true);
    setError(null);
    setPrediction(null);
    try {
      const response = await handleWastePrediction(data);
      if (response.success && response.data) {
        setPrediction(response.data);
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
        <h1 className="text-3xl font-bold tracking-tight">AI Waste Predictor</h1>
        <p className="text-muted-foreground">
          Predict overstock and spoilage to optimize inventory and reduce waste.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle>New Prediction</CardTitle>
                    <CardDescription>Enter a product name to start.</CardDescription>
                </CardHeader>
                <CardContent>
                    <WastePredictionForm onSubmit={handleSubmit} isLoading={isLoading} />
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

          {prediction && (
            <Card>
              <CardHeader>
                <CardTitle>Prediction Result</CardTitle>
                 <CardDescription>AI-powered insights for waste reduction.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Predicted Waste Quantity</h3>
                  <p className="text-4xl font-bold text-primary">{prediction.predictedWasteQuantity.toLocaleString()} units</p>
                  <p className="text-sm text-muted-foreground">Estimated potential overstock or spoilage.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Waste Reduction Suggestions</h3>
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: prediction.wasteReductionSuggestions.replace(/\n/g, '<br />') }}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {!prediction && !isLoading && !error && (
             <Card className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center text-muted-foreground">
                    <p>Your prediction results will appear here.</p>
                </div>
            </Card>
          )}

          {isLoading && (
            <Card className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center text-muted-foreground">
                    <p>Generating prediction...</p>
                </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
