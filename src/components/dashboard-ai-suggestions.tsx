"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  RefreshCw, 
  TrendingDown, 
  Leaf, 
  Trash2, 
  Footprints, 
  Star, 
  Lightbulb, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchDashboardAiSuggestions } from "@/app/actions/dashboard-ai";
import type { DashboardAiSuggestion } from "@/lib/ai-fallbacks";
import type { Product } from "@/contexts/products-context";

interface DashboardAiSuggestionsProps {
  products: Product[];
}

export function DashboardAiSuggestions({ products }: DashboardAiSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<DashboardAiSuggestion[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'inventory' | 'carbon' | 'score' | 'supply-chain'>('all');
  const [source, setSource] = useState<'live-ai' | 'smart-analytics'>('smart-analytics');
  const [isPending, startTransition] = useTransition();
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  const loadSuggestions = () => {
    startTransition(async () => {
      const simplified = products.map(p => ({
        name: p.name,
        score: p.score,
        status: p.status,
        co2Footprint: p.co2Footprint,
        labels: p.labels,
      }));

      const res = await fetchDashboardAiSuggestions(simplified);
      if (res.success) {
        setSuggestions(res.suggestions);
        setSource(res.source);
      }
    });
  };

  useEffect(() => {
    loadSuggestions();
  }, [products]);

  const toggleComplete = (id: string) => {
    setCompletedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filtered = suggestions.filter(s => {
    if (selectedFilter === 'all') return true;
    return s.category === selectedFilter;
  });

  const getCategoryIcon = (category: DashboardAiSuggestion['category']) => {
    switch (category) {
      case 'inventory':
        return <Trash2 className="h-5 w-5 text-amber-500" />;
      case 'carbon':
        return <Footprints className="h-5 w-5 text-emerald-500" />;
      case 'score':
        return <Star className="h-5 w-5 text-blue-500" />;
      case 'supply-chain':
        return <Lightbulb className="h-5 w-5 text-purple-500" />;
      default:
        return <Leaf className="h-5 w-5 text-primary" />;
    }
  };

  const getImpactBadge = (impact: DashboardAiSuggestion['impact']) => {
    switch (impact) {
      case 'High':
        return <Badge variant="destructive" className="text-xs">High Impact</Badge>;
      case 'Medium':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 text-xs">Medium Impact</Badge>;
      case 'Low':
        return <Badge variant="outline" className="text-xs">Low Impact</Badge>;
    }
  };

  return (
    <Card className="border-primary/20 shadow-sm relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/15 text-primary p-2.5 rounded-xl border border-primary/20 shadow-inner">
              <Sparkles className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl font-bold tracking-tight">
                  AI Sustainability Copilot
                </CardTitle>
                <Badge variant="outline" className="text-xs font-medium border-primary/30 text-primary bg-primary/5">
                  {source === 'live-ai' ? '✨ Gemini Live' : '🌱 Smart Analytics'}
                </Badge>
              </div>
              <CardDescription className="text-sm mt-0.5">
                Proactive intelligence analyzing your inventory, emissions, and retail velocity.
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadSuggestions}
              disabled={isPending}
              className="gap-1.5 text-xs font-medium"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isPending ? 'animate-spin' : ''}`} />
              Refresh Suggestions
            </Button>
          </div>
        </div>

        {/* Filter categories */}
        <div className="flex flex-wrap gap-1.5 pt-3">
          {[
            { id: 'all', label: 'All Insights' },
            { id: 'inventory', label: 'Inventory & Waste' },
            { id: 'carbon', label: 'Carbon Abatement' },
            { id: 'score', label: 'Eco-Ratings' },
            { id: 'supply-chain', label: 'Shelf & Logistics' },
          ].map(tab => (
            <Button
              key={tab.id}
              variant={selectedFilter === tab.id ? 'default' : 'ghost'}
              size="sm"
              className="h-7 text-xs rounded-full px-3"
              onClick={() => setSelectedFilter(tab.id as any)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        {isPending ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="p-4 border rounded-xl space-y-3">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-8 w-1/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground border border-dashed rounded-xl">
            <CheckCircle2 className="h-8 w-8 text-primary mx-auto mb-2 opacity-80" />
            <p className="font-medium text-sm">All clear! No current issues in this category.</p>
            <p className="text-xs text-muted-foreground mt-1">Your store is running with peak eco-efficiency.</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {filtered.map(suggestion => {
              const isDone = completedIds.has(suggestion.id);
              return (
                <div
                  key={suggestion.id}
                  className={`group relative p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                    isDone 
                      ? 'bg-muted/40 border-border/50 opacity-60' 
                      : 'bg-card hover:border-primary/40 hover:shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-muted border">
                          {getCategoryIcon(suggestion.category)}
                        </div>
                        <div>
                          <h4 className={`text-sm font-semibold leading-tight ${isDone ? 'line-through text-muted-foreground' : ''}`}>
                            {suggestion.title}
                          </h4>
                          {suggestion.metricBadge && (
                            <span className="text-[11px] font-medium text-primary inline-block mt-0.5">
                              {suggestion.metricBadge}
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        {getImpactBadge(suggestion.impact)}
                      </div>
                    </div>

                    <p className={`text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed ${isDone ? 'line-through' : ''}`}>
                      {suggestion.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-border/60">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleComplete(suggestion.id)}
                      className="h-8 text-xs text-muted-foreground hover:text-foreground px-2"
                    >
                      <CheckCircle2 className={`h-3.5 w-3.5 mr-1.5 ${isDone ? 'text-primary fill-primary/20' : ''}`} />
                      {isDone ? 'Completed' : 'Mark done'}
                    </Button>

                    {suggestion.actionHref ? (
                      <Button asChild size="sm" variant="default" className="h-8 text-xs gap-1 font-medium shadow-none">
                        <Link href={suggestion.actionHref}>
                          {suggestion.actionLabel}
                          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="h-8 text-xs">
                        {suggestion.actionLabel}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
