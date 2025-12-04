"use client";

import { useProducts } from "@/contexts/products-context";
import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const chartConfig = {
  emissions: {
    label: "kg CO₂e",
    color: "hsl(var(--chart-1))",
  },
};

export default function CarbonFootprintPage() {
  const { products } = useProducts();
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

  const { yearlyData, availableYears } = useMemo(() => {
    const dataByYear: Record<string, { total: number, months: Record<string, number> }> = {};
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    products.forEach(product => {
      const year = product.createdAt.getFullYear().toString();
      const month = monthNames[product.createdAt.getMonth()];
      
      if (!dataByYear[year]) {
        dataByYear[year] = { total: 0, months: {} };
      }
      dataByYear[year].total += product.co2Footprint;

      if (!dataByYear[year].months[month]) {
        dataByYear[year].months[month] = 0;
      }
      dataByYear[year].months[month] += product.co2Footprint;
    });

    const availableYears = Object.keys(dataByYear).sort((a, b) => Number(b) - Number(a));
    return { yearlyData: dataByYear, availableYears };
  }, [products]);

  useEffect(() => {
    if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    } else if (availableYears.length === 0) {
      setSelectedYear(new Date().getFullYear().toString());
    }
  }, [availableYears, selectedYear]);

  const chartData = useMemo(() => {
    const yearData = yearlyData[selectedYear];
    if (!yearData) return [];

    const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    return monthOrder.map(month => ({
      month,
      emissions: yearData.months[month] || 0
    }));
  }, [yearlyData, selectedYear]);
  
  const totalEmissionsForYear = yearlyData[selectedYear]?.total || 0;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">CO₂ Footprint Calculator</h1>
        <p className="text-muted-foreground">Calculate the total CO₂ emissions from your products.</p>
      </div>

      <Card>
        <CardHeader className="flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Emissions by Month</CardTitle>
            <CardDescription>
              Total emissions for {selectedYear}: {totalEmissionsForYear.toFixed(2)} kg CO₂e
            </CardDescription>
          </div>
          {availableYears.length > 0 && (
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select a year" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Bar dataKey="emissions" fill="var(--color-emissions)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

       <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Yearly Summaries</h2>
        {Object.keys(yearlyData).length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(yearlyData).map(([year, data]) => (
                    <Card key={year}>
                        <CardHeader>
                            <CardTitle>Summary for {year}</CardTitle>
                            <CardDescription>Total emissions: <span className="font-bold text-primary">{data.total.toFixed(2)} kg CO₂e</span></CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {Object.entries(data.months).sort(([a], [b]) => chartData.findIndex(d => d.month === a) - chartData.findIndex(d => d.month === b)).map(([month, emissions]) => (
                                    <li key={month} className="flex justify-between text-sm border-b pb-2">
                                        <span>{month}</span>
                                        <span className="font-medium">{emissions.toFixed(2)} kg</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                ))}
            </div>
        ) : (
            <p className="text-muted-foreground">No emissions data available. Add products with CO₂ footprint values to see summaries.</p>
        )}
      </div>
    </div>
  );
}
