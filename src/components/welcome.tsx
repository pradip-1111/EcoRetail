'use client';

import { BarChart, Bot, Mail, Recycle, Link as LinkIcon, BrainCircuit, LineChart, Film, ArrowRight, Leaf, TrendingDown, Shield, Zap, Globe, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import React, { useEffect, useRef, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Image from 'next/image';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/auth-context';
import { LoginDialog } from './auth/login-dialog';
import { RegisterDialog } from './auth/register-dialog';

const features = [
  {
    icon: <Bot className="h-7 w-7" />,
    title: 'AI-Powered Insights',
    description: 'Leverage generative AI to predict waste, optimize supply chains, and reduce your carbon footprint with real-time intelligence.',
    gradient: 'from-emerald-500 to-teal-600',
    bgGlow: 'bg-emerald-400/20',
  },
  {
    icon: <BarChart className="h-7 w-7" />,
    title: 'Sustainability Dashboards',
    description: 'Visualize environmental impact with comprehensive analytics, interactive charts, and automated ESG reporting.',
    gradient: 'from-blue-500 to-cyan-600',
    bgGlow: 'bg-blue-400/20',
  },
  {
    icon: <Recycle className="h-7 w-7" />,
    title: 'Circular Supply Chain',
    description: 'Track returnable assets, reduce packaging waste, and close your supply loop for maximum resource efficiency.',
    gradient: 'from-amber-500 to-orange-600',
    bgGlow: 'bg-amber-400/20',
  },
  {
    icon: <Shield className="h-7 w-7" />,
    title: 'Certification Tracking',
    description: 'Manage eco-certifications, ensure compliance, and build consumer trust with verified sustainability badges.',
    gradient: 'from-purple-500 to-violet-600',
    bgGlow: 'bg-purple-400/20',
  },
  {
    icon: <TrendingDown className="h-7 w-7" />,
    title: 'Waste Reduction AI',
    description: 'Predict expiry patterns, optimize stock rotation, and reduce food waste with machine learning models.',
    gradient: 'from-rose-500 to-pink-600',
    bgGlow: 'bg-rose-400/20',
  },
  {
    icon: <Mail className="h-7 w-7" />,
    title: 'Smart Email Campaigns',
    description: 'Engage customers with AI-generated sustainability-focused email campaigns and impact reports.',
    gradient: 'from-indigo-500 to-blue-600',
    bgGlow: 'bg-indigo-400/20',
  },
];

const howItWorks = [
  {
    icon: <LinkIcon className="h-8 w-8" />,
    step: '01',
    title: 'Connect Your Data',
    description: 'Securely integrate your sales, supply chain, and operational data sources with our easy-to-use connectors.',
  },
  {
    icon: <BrainCircuit className="h-8 w-8" />,
    step: '02',
    title: 'Receive AI Insights',
    description: 'Our AI models analyze your data to uncover insights, predict trends, and provide actionable recommendations.',
  },
  {
    icon: <LineChart className="h-8 w-8" />,
    step: '03',
    title: 'Track & Improve',
    description: 'Monitor your progress, track key sustainability metrics, and report on achievements with exportable dashboards.',
  },
];

const stats = [
  { value: '40%', label: 'Waste Reduction', suffix: 'avg.' },
  { value: '2.5x', label: 'ROI on Sustainability', suffix: '' },
  { value: '95%', label: 'Customer Satisfaction', suffix: 'rating' },
  { value: '10k+', label: 'Products Tracked', suffix: 'daily' },
];

const carouselImages = [
  {
    src: '/assets/sustain2.jpg',
    alt: 'A hand holding a digital recycling symbol, representing technology and sustainability.',
    hint: 'recycling technology',
  },
  {
    src: '/assets/sustain3.jpg',
    alt: 'A retail store with green signage and plants, indicating an eco-friendly business.',
    hint: 'eco-friendly retail',
  },
  {
    src: '/assets/sustain4.jpg',
    alt: 'A futuristic dashboard showing graphs and data related to sustainability metrics.',
    hint: 'sustainability dashboard',
  },
];

function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function AnimatedCounter({ value, duration = 2000 }: { value: string; duration?: number }) {
  const [displayed, setDisplayed] = useState('0');
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const numericMatch = value.match(/[\d.]+/);
          if (!numericMatch) { setDisplayed(value); return; }
          const target = parseFloat(numericMatch[0]);
          const prefix = value.slice(0, value.indexOf(numericMatch[0]));
          const suffix = value.slice(value.indexOf(numericMatch[0]) + numericMatch[0].length);
          const isFloat = numericMatch[0].includes('.');
          const steps = 40;
          const stepDuration = duration / steps;
          let step = 0;
          const interval = setInterval(() => {
            step++;
            const progress = step / steps;
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = target * eased;
            setDisplayed(`${prefix}${isFloat ? current.toFixed(1) : Math.round(current)}${suffix}`);
            if (step >= steps) { clearInterval(interval); setDisplayed(value); }
          }, stepDuration);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, duration]);

  return <span ref={ref}>{displayed}</span>;
}


export default function Welcome() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <div className="flex flex-col overflow-hidden">
      <main className="flex-1">
        {/* ══════════════════════════════════════════ */}
        {/* Hero Section                              */}
        {/* ══════════════════════════════════════════ */}
        <section className="relative w-full min-h-[90vh] flex items-center gradient-hero overflow-hidden">
          {/* Animated background blobs */}
          <div className="blob-shape w-[500px] h-[500px] bg-emerald-300 dark:bg-emerald-700 -top-32 -left-32 animate-blob" />
          <div className="blob-shape w-[400px] h-[400px] bg-cyan-300 dark:bg-cyan-700 top-1/2 -right-20 animate-blob delay-300" style={{ animationDelay: '2s' }} />
          <div className="blob-shape w-[300px] h-[300px] bg-amber-200 dark:bg-amber-800 bottom-0 left-1/3 animate-blob" style={{ animationDelay: '4s' }} />

          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{
            backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }} />

          <div className="container relative z-10 px-4 md:px-6 py-16 md:py-24">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              {/* Left: Text Content */}
              <div className="flex flex-col space-y-8 max-w-xl">
                <div className="animate-fade-up">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                    <Sparkles className="h-4 w-4" />
                    <span>AI-Driven Sustainability Platform</span>
                  </div>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] animate-fade-up delay-100">
                  Make Retail{' '}
                  <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
                    Sustainable
                  </span>
                  {' '}with Intelligence
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed animate-fade-up delay-200">
                  Monitor, optimize, and reduce your environmental impact. 
                  Our AI-powered platform turns sustainability data into actionable insights for smarter retail.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 animate-fade-up delay-300">
                  <Button
                    size="lg"
                    className="btn-premium gradient-primary text-white border-0 text-base px-8 h-12 rounded-xl font-semibold gap-2"
                    onClick={() => setRegisterOpen(true)}
                  >
                    Get Started Free
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-base px-8 h-12 rounded-xl font-semibold gap-2 border-2"
                    onClick={() => setLoginOpen(true)}
                  >
                    Sign In
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex items-center gap-6 text-sm text-muted-foreground animate-fade-up delay-400">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Free 14-day trial</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>No credit card</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>

              {/* Right: Image Carousel */}
              <div className="relative animate-fade-in-scale delay-300">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-transparent to-accent/20 rounded-3xl blur-2xl" />
                <div className="relative">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {carouselImages.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="overflow-hidden rounded-2xl border border-border/50 shadow-2xl">
                            <Image
                              src={image.src}
                              width={700}
                              height={460}
                              alt={image.alt}
                              data-ai-hint={image.hint}
                              className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
                              priority={index === 0}
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════ */}
        {/* Stats Bar                                 */}
        {/* ══════════════════════════════════════════ */}
        <section className="w-full py-12 border-y bg-card/50 backdrop-blur-sm">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <AnimatedSection key={stat.label} delay={index * 100}>
                  <div className="text-center space-y-1">
                    <div className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-emerald-600 dark:from-primary dark:to-teal-400 bg-clip-text text-transparent stat-value">
                      <AnimatedCounter value={stat.value} />
                    </div>
                    <p className="text-sm font-medium text-foreground">{stat.label}</p>
                    {stat.suffix && <p className="text-xs text-muted-foreground">{stat.suffix}</p>}
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════ */}
        {/* Features Section                          */}
        {/* ══════════════════════════════════════════ */}
        <section id="features" className="relative w-full py-20 md:py-28 overflow-hidden">
          <div className="blob-shape w-[400px] h-[400px] bg-primary/30 -top-20 right-0 animate-blob" style={{ animationDelay: '1s' }} />
          
          <div className="container relative z-10 px-4 md:px-6">
            <AnimatedSection>
              <div className="flex flex-col items-center text-center space-y-4 mb-16 section-divider pb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                  <Zap className="h-4 w-4" />
                  Key Features
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight max-w-3xl">
                  Everything You Need for{' '}
                  <span className="bg-gradient-to-r from-primary to-teal-500 dark:from-primary dark:to-teal-400 bg-clip-text text-transparent">
                    Green Retail
                  </span>
                </h2>
                <p className="max-w-2xl text-muted-foreground text-base md:text-lg">
                  A comprehensive platform that transforms how retailers approach sustainability with AI-powered tools.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <AnimatedSection key={feature.title} delay={index * 80}>
                  <div className="group relative glass-card rounded-2xl p-6 h-full cursor-default">
                    {/* Glow effect on hover */}
                    <div className={`absolute -inset-1 ${feature.bgGlow} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />
                    
                    <div className="relative z-10">
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} text-white mb-4 shadow-lg`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════ */}
        {/* How It Works                              */}
        {/* ══════════════════════════════════════════ */}
        <section id="how-it-works" className="w-full py-20 md:py-28 bg-muted/50">
          <div className="container px-4 md:px-6">
            <AnimatedSection>
              <div className="flex flex-col items-center text-center space-y-4 mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                  <Globe className="h-4 w-4" />
                  How It Works
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                  Three Steps to{' '}
                  <span className="bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                    Sustainability
                  </span>
                </h2>
                <p className="max-w-2xl text-muted-foreground text-base md:text-lg">
                  Getting started with EcoRetail Insight is quick and straightforward.
                </p>
              </div>
            </AnimatedSection>

            <div className="relative max-w-5xl mx-auto">
              {/* Connector line */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 -translate-y-1/2" />
              
              <div className="grid gap-8 md:grid-cols-3">
                {howItWorks.map((step, index) => (
                  <AnimatedSection key={step.title} delay={index * 150}>
                    <div className="group relative flex flex-col items-center text-center gap-5">
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative z-10 w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500">
                          {step.icon}
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-card border-2 border-primary flex items-center justify-center text-xs font-bold text-primary shadow-md">
                          {step.step}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold">{step.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{step.description}</p>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════ */}
        {/* Video Demo                                */}
        {/* ══════════════════════════════════════════ */}
        <section id="video-demo" className="relative w-full py-20 md:py-28 overflow-hidden">
          <div className="blob-shape w-[350px] h-[350px] bg-violet-300 dark:bg-violet-700 bottom-10 left-10 animate-blob" style={{ animationDelay: '3s' }} />
          
          <div className="container relative z-10 px-4 md:px-6">
            <AnimatedSection>
              <div className="flex flex-col items-center text-center space-y-4 mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                  <Film className="h-4 w-4" />
                  Video Demo
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                  See EcoRetail{' '}
                  <span className="bg-gradient-to-r from-violet-500 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                    in Action
                  </span>
                </h2>
                <p className="max-w-2xl text-muted-foreground text-base md:text-lg">
                  Watch this short video to see how our platform transforms your retail sustainability.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <div className="relative max-w-4xl mx-auto">
                <div className="absolute -inset-4 bg-gradient-to-r from-violet-500/20 via-primary/20 to-amber-500/20 rounded-3xl blur-2xl" />
                <div className="relative aspect-video overflow-hidden rounded-2xl border border-border/50 shadow-2xl bg-card">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/lzVWXyXnarI"
                    title="Towards a Green and Sustainable Singapore"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ══════════════════════════════════════════ */}
        {/* CTA Section                               */}
        {/* ══════════════════════════════════════════ */}
        <section className="relative w-full py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 gradient-primary opacity-95" />
          <div className="blob-shape w-[400px] h-[400px] bg-white/20 -top-20 -right-20 animate-blob" />
          <div className="blob-shape w-[300px] h-[300px] bg-white/10 bottom-0 left-0 animate-blob" style={{ animationDelay: '3s' }} />

          <div className="container relative z-10 px-4 md:px-6">
            <AnimatedSection>
              <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
                <Leaf className="h-12 w-12 text-white/80 animate-float" />
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                  Ready to Transform Your Retail Sustainability?
                </h2>
                <p className="text-white/80 text-lg max-w-xl">
                  Join thousands of retailers already using AI to reduce waste, cut emissions, and build a greener future.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 text-base px-8 h-12 rounded-xl font-semibold gap-2 shadow-xl"
                    onClick={() => setRegisterOpen(true)}
                  >
                    Start Free Trial
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-white/30 text-white hover:bg-white/10 text-base px-8 h-12 rounded-xl font-semibold"
                    onClick={() => setLoginOpen(true)}
                  >
                    Sign In
                  </Button>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm">
        <div className="container px-4 md:px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-1.5 rounded-lg">
                <Leaf className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">EcoRetail Insight</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} EcoRetail Insight. All rights reserved. Built with 🌱 for a greener future.
            </p>
          </div>
        </div>
      </footer>

      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
      <RegisterDialog open={registerOpen} onOpenChange={setRegisterOpen} onRegister={() => setLoginOpen(true)} />
    </div>
  );
}

