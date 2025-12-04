"use client";

import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import { useAuth } from './auth-context';

export type Product = {
  id: string;
  name: string;
  score: number;
  status: string;
  labels: string[];
  createdAt: Date;
  societalImpact: "Positive" | "Neutral";
  co2Footprint: number;
  userId?: string;
};

export type AddProductData = {
    name: string;
    score: number;
    status: "In Stock" | "Low Stock" | "Out of Stock";
    labels?: string;
    societalImpact: "Positive" | "Neutral";
    co2Footprint: number;
};

// Initial mock data
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Organic Cotton Tote Bag',
    score: 95,
    status: 'In Stock',
    labels: ['Organic', 'Fair Trade'],
    createdAt: new Date('2024-05-01T10:00:00Z'),
    societalImpact: 'Positive',
    co2Footprint: 1.5,
  },
  {
    id: '2',
    name: 'Bamboo Toothbrush Set',
    score: 92,
    status: 'In Stock',
    labels: ['Biodegradable', 'Vegan'],
    createdAt: new Date('2024-05-15T11:30:00Z'),
    societalImpact: 'Neutral',
    co2Footprint: 0.8,
  },
  {
    id: '3',
    name: 'Reusable Beeswax Wraps',
    score: 88,
    status: 'Low Stock',
    labels: ['Plastic-Free', 'Handmade'],
    createdAt: new Date('2024-06-02T14:00:00Z'),
    societalImpact: 'Positive',
    co2Footprint: 0.5,
  },
  {
    id: '4',
    name: 'Recycled Glass Water Bottle',
    score: 90,
    status: 'In Stock',
    labels: ['Recycled', 'BPA-Free'],
    createdAt: new Date('2024-06-10T09:00:00Z'),
    societalImpact: 'Neutral',
    co2Footprint: 2.1,
  },
  {
    id: '5',
    name: 'Solar-Powered Phone Charger',
    score: 85,
    status: 'Out of Stock',
    labels: ['Renewable Energy'],
    createdAt: new Date('2023-11-20T16:45:00Z'),
    societalImpact: 'Positive',
    co2Footprint: 5.3,
  },
];


interface ProductsContextType {
  products: Product[];
  addProduct: (productData: AddProductData) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  loading: boolean;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // When a user logs in or out, we reset to the initial list.
    // This demonstrates the app with a consistent starting dataset.
    setProducts(initialProducts);
  }, [user]);


  const addProduct = async (productData: AddProductData) => {
    setLoading(true);
    const newProduct: Product = {
        ...productData,
        id: (new Date().getTime()).toString(), // Simple unique ID
        createdAt: new Date(),
        labels: productData.labels ? productData.labels.split(',').map(label => label.trim()) : [],
    };
    setProducts(prevProducts => [newProduct, ...prevProducts].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    setLoading(false);
  };

  const deleteProduct = async (productId: string) => {
    setLoading(true);
    setProducts(products.filter(p => p.id !== productId));
    setLoading(false);
  };

  const value = {
    products,
    addProduct,
    deleteProduct,
    loading,
  };

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}
