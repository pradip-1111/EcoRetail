"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { Package, Star, CheckCircle, Footprints, TrendingUp, ArrowUpRight } from "lucide-react";
import { useProducts } from "@/contexts/products-context";
import { useMemo, useEffect, useRef, useState } from "react";
import { DashboardAiSuggestions } from "@/components/dashboard-ai-suggestions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Plus, Trash2, Lightbulb } from "lucide-react";

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

function AnimatedValue({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [displayed, setDisplayed] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) { setDisplayed(value); return; }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const steps = 30;
          const stepDuration = 1200 / steps;
          let step = 0;
          const interval = setInterval(() => {
            step++;
            const progress = step / steps;
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayed(parseFloat((value * eased).toFixed(2)));
            if (step >= steps) { clearInterval(interval); setDisplayed(value); }
          }, stepDuration);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  const isFloat = !Number.isInteger(value);
  return (
    <span ref={ref} className="stat-value">
      {isFloat ? displayed.toFixed(2) : Math.round(displayed)}{suffix}
    </span>
  );
}

const statCardConfig = [
  {
    key: 'totalProducts',
    title: 'Total Products',
    icon: Package,
    gradient: 'from-emerald-500 to-teal-600',
    bgGlow: 'bg-emerald-500/10',
    subtitle: 'items in your catalog',
    suffix: '',
  },
  {
    key: 'averageScore',
    title: 'Avg. Eco Score',
    icon: Star,
    gradient: 'from-amber-500 to-orange-600',
    bgGlow: 'bg-amber-500/10',
    subtitle: 'across all products',
    suffix: ' / 100',
  },
  {
    key: 'inStockRate',
    title: 'In Stock Rate',
    icon: CheckCircle,
    gradient: 'from-blue-500 to-cyan-600',
    bgGlow: 'bg-blue-500/10',
    subtitle: 'of products available',
    suffix: '%',
  },
  {
    key: 'totalCO2',
    title: 'Total CO₂',
    icon: Footprints,
    gradient: 'from-rose-500 to-pink-600',
    bgGlow: 'bg-rose-500/10',
    subtitle: 'total emissions',
    suffix: ' kg',
  },
];

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

  const statValues: Record<string, number> = {
    totalProducts: dashboardStats.totalProducts,
    averageScore: dashboardStats.averageScore,
    inStockRate: dashboardStats.inStockRate,
    totalCO2: dashboardStats.totalCO2,
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-up">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Sustainability Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Real-time catalog intelligence & AI recommendations.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="sm" className="gap-1.5 rounded-xl border-2 hover:border-amber-500/50 transition-colors">
            <Link href="/waste-reduction">
              <Trash2 className="h-4 w-4 text-amber-500" />
              <span>Predict Waste</span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="gap-1.5 rounded-xl border-2 hover:border-purple-500/50 transition-colors">
            <Link href="/supply-chain">
              <Lightbulb className="h-4 w-4 text-purple-500" />
              <span>Shelf Optimizer</span>
            </Link>
          </Button>
          <Button asChild size="sm" className="gap-1.5 rounded-xl btn-premium gradient-primary text-white border-0">
            <Link href="/products">
              <Plus className="h-4 w-4" />
              <span>Add Eco-Product</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCardConfig.map((config, index) => {
          const IconComponent = config.icon;
          return (
            <div
              key={config.key}
              className="group glass-card rounded-2xl p-5 animate-fade-up relative overflow-hidden"
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              {/* Background glow */}
              <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full ${config.bgGlow} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-muted-foreground">{config.title}</p>
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${config.gradient} text-white shadow-lg`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold tracking-tight animate-count-up" style={{ animationDelay: `${(index + 2) * 150}ms` }}>
                  <AnimatedValue value={statValues[config.key]} suffix={config.suffix} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{config.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Suggestions Copilot */}
      <div className="animate-fade-up delay-500">
        <DashboardAiSuggestions products={products} />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2 animate-fade-up delay-600">
        <Card className="glass-card rounded-2xl border-0 overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Products Added Over Time</CardTitle>
                <CardDescription>New products added per month.</CardDescription>
              </div>
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
             <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={dashboardStats.productsByMonth}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  fontSize={12}
                />
                 <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="products" fill="var(--color-products)" radius={[8, 8, 4, 4]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="glass-card rounded-2xl border-0 overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Product Status Distribution</CardTitle>
                <CardDescription>Breakdown by stock status.</CardDescription>
              </div>
              <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                <Package className="h-4 w-4" />
              </div>
            </div>
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