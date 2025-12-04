'use client';

import { BarChart, Bot, Mail, Recycle, Link as LinkIcon, BrainCircuit, LineChart, Film } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import React from 'react';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Image from 'next/image';

const features = [
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: 'AI-Powered Insights',
    description: 'Leverage generative AI to predict waste, optimize supply chains, and reduce your carbon footprint.',
  },
  {
    icon: <BarChart className="h-8 w-8 text-primary" />,
    title: 'Sustainability Dashboards',
    description: 'Visualize your environmental impact with comprehensive, real-time analytics and reporting.',
  },
  {
    icon: <Recycle className="h-8 w-8 text-primary" />,
    title: 'Circular Supply Chain',
    description: 'Track and manage returnable assets, reduce packaging waste, and close your supply loop.',
  },
];

const howItWorks = [
    {
        icon: <LinkIcon className="h-8 w-8 text-primary" />,
        title: "1. Connect Your Data",
        description: "Securely integrate your sales, supply chain, and operational data sources with our easy-to-use connectors."
    },
    {
        icon: <BrainCircuit className="h-8 w-8 text-primary" />,
        title: "2. Receive AI Insights",
        description: "Our AI models analyze your data to uncover insights, predict trends, and provide actionable recommendations."
    },
    {
        icon: <LineChart className="h-8 w-8 text-primary" />,
        title: "3. Track & Improve",
        description: "Use the dashboard to monitor your progress, track key metrics, and report on your sustainability achievements."
    }
];

const carouselImages = [
    {
        src: "/sustain2.jpg",
        alt: "A hand holding a digital recycling symbol, representing technology and sustainability.",
        hint: "recycling technology"
    },
    {
        src: "/sustain3.jpg",
        alt: "A retail store with green signage and plants, indicating an eco-friendly business.",
        hint: "eco-friendly retail"
    },
    {
        src: "/sustain4.jpg",
        alt: "A futuristic dashboard showing graphs and data related to sustainability metrics.",
        hint: "sustainability dashboard"
    }
];


export default function Welcome() {
    
  return (
    <div className="flex flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none animate-in fade-in slide-in-from-bottom-4 duration-700">
                    Unlock Sustainable Retail with EcoRetail Insight
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                    Monitor, optimize, and reduce your environmental impact with our AI-driven sustainability platform.
                  </p>
                </div>
              </div>
              <div className="w-full max-w-xl mx-auto animate-in fade-in zoom-in-95 duration-700 delay-400">
                <Carousel className="w-full">
                    <CarouselContent>
                        {carouselImages.map((image, index) => (
                            <CarouselItem key={index}>
                                <div className="p-1">
                                    <Card>
                                        <CardContent className="flex aspect-video items-center justify-center p-0">
                                            <Image
                                                src={image.src}
                                                width={600}
                                                height={400}
                                                alt={image.alt}
                                                data-ai-hint={image.hint}
                                                className="object-cover w-full h-full rounded-lg"
                                                priority={index === 0}
                                            />
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
              </div>
            </div>
          </div>
        </section>
        
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Actionable Insights for a Greener Future</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform provides the tools you need to make data-driven decisions that benefit your business and the planet.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-1 md:gap-12 md:grid-cols-3 mt-12">
              {features.map((feature, index) => (
                <Card key={feature.title} className="transition-transform duration-300 hover:scale-105 animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${index * 150}ms` }}>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                        {feature.icon}
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                 <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">How It Works</div>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Three Simple Steps to Sustainability</h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Getting started with EcoRetail Insight is quick and straightforward.
                        </p>
                    </div>
                </div>
                <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-1 md:grid-cols-3 md:gap-12 mt-12">
                    {howItWorks.map((step, index) => (
                        <div key={step.title} className="flex flex-col items-center text-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${index * 150}ms` }}>
                            <div className="bg-primary/10 p-4 rounded-full transition-transform duration-300 hover:scale-110">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold">{step.title}</h3>
                            <p className="text-muted-foreground">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <section id="video-demo" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
                 <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                            <Film className="inline-block h-4 w-4 mr-1" />
                            Video Demo
                        </div>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">See EcoRetail Insight in Action</h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Watch this short video to see how our platform can transform your retail sustainability.
                        </p>
                    </div>
                </div>
                <div className="mx-auto max-w-4xl mt-12">
                    <div className="aspect-video overflow-hidden rounded-xl border shadow-lg animate-in fade-in zoom-in-95 duration-700">
                        <iframe 
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/lzVWXyXnarI" 
                            title="Towards a Green and Sustainable Singapore" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowFullScreen>
                        </iframe>
                    </div>
                </div>
            </div>
        </section>

      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 EcoRetail Insight. All rights reserved.</p>
      </footer>
    </div>
  );
}
