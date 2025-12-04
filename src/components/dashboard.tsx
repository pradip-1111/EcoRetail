"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { Package, Star, CheckCircle, Footprints } from "lucide-react";
import { useProducts } from "@/contexts/products-context";
import { useMemo } from "react";

const chartConfig = {
  products: {
    label: "Products",
    color: "hsl(var(--chart-1))",
  },
  inStock: {
    label: "In Stock",
    color: "hsl(var(--chart-1))",
  },
  lowStock: {
      label: "Low Stock",
      color: "hsl(var(--chart-2))",
  },
  outOfStock: {
      label: "Out of Stock",
      color: "hsl(var(--chart-5))",
  }
};

export default function Dashboard() {
  const { products } = useProducts();

  const dashboardStats = useMemo(() => {
    if (products.length === 0) {
      return {
        totalProducts: 0,
        averageScore: 0,
        inStockRate: 0,
        totalCO2: 0,
        productsByMonth: [],
        statusDistribution: [],
      };
    }

    const totalProducts = products.length;
    const averageScore = Math.round(products.reduce((acc, p) => acc + p.score, 0) / totalProducts);
    const inStockCount = products.filter(p => p.status === "In Stock").length;
    const inStockRate = Math.round((inStockCount / totalProducts) * 100);
    
    const totalCO2 = products.reduce((acc, p) => acc + p.co2Footprint, 0);
    
    const productsByMonth = [...products]
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        .reduce((acc, product) => {
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const month = monthNames[product.createdAt.getMonth()];
            const year = product.createdAt.getFullYear().toString().slice(-2);
            const monthYear = `${month} '${year}`;
            
            const existing = acc.find(item => item.month === monthYear);
            if (existing) {
                existing.products++;
            } else {
                acc.push({ month: monthYear, products: 1 });
            }
            return acc;
      }, [] as { month: string; products: number }[]).slice(-6);

    const statusDistribution = [
      { name: 'In Stock', value: products.filter(p => p.status === 'In Stock').length, fill: 'var(--color-inStock)' },
      { name: 'Low Stock', value: products.filter(p => p.status === 'Low Stock').length, fill: 'var(--color-lowStock)' },
      { name: 'Out of Stock', value: products.filter(p => p.status === 'Out of Stock').length, fill: 'var(--color-outOfStock)' },
    ].filter(d => d.value > 0);

    return { totalProducts, averageScore, inStockRate, totalCO2, productsByMonth, statusDistribution };
  }, [products]);


  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Product Dashboard</h1>
        <p className="text-muted-foreground">Overview of your eco-product catalog.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">items in your catalog</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Sustainability Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.averageScore} / 100</div>
            <p className="text-xs text-muted-foreground">across all products</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Stock Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.inStockRate}%</div>
            <p className="text-xs text-muted-foreground">of products are available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total CO₂ Footprint</CardTitle>
            <Footprints className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalCO2.toFixed(2)} kg</div>
            <p className="text-xs text-muted-foreground">total emissions from all products</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Products Added Over Time</CardTitle>
            <CardDescription>Number of new products added per month.</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={dashboardStats.productsByMonth}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                 <YAxis allowDecimals={false} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="products" fill="var(--color-products)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Product Status Distribution</CardTitle>
            <CardDescription>Breakdown of products by stock status.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <PieChart>
                    <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Legend content={<ChartLegendContent nameKey="name" />} />
                    <Pie 
                      data={dashboardStats.statusDistribution} 
                      dataKey="value" 
                      nameKey="name" 
                      innerRadius={60} 
                      outerRadius={100} 
                      paddingAngle={5} 
                      labelLine={false}
                    >
                       {dashboardStats.statusDistribution.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.fill} className="stroke-background" />
                      ))}
                    </Pie>
                </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
