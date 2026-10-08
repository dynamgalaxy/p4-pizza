"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { products } from "./menu";

export type CartItem = { slug: string; variant: string; quantity: number; addOn?: string };
export const addOnFor = (category: string) => category === "Classic Pizzas" || category === "Special Pizzas" ? "Extra Chicken & Cheese Toppings" : category === "Burgers" || category === "Shawarma & Rolls" ? "Cheese Slice" : undefined;
export const addOnPrice = (item: Pick<CartItem, "variant" | "addOn">) => item.addOn === "Cheese Slice" ? 60 : item.addOn === "Extra Chicken & Cheese Toppings" ? ({ Small: 100, Medium: 200, Large: 300, "X-Large": 400 } as Record<string, number>)[item.variant] || 0 : 0;
export const itemUnitPrice = (item: CartItem) => (products.find((product) => product.slug === item.slug)?.variants.find((variant) => variant.name === item.variant)?.price || 0) + addOnPrice(item);
type CartContextValue = {
  items: CartItem[];
  ready: boolean;
  count: number;
  total: number;
  add: (slug: string, variant: string, quantity?: number, addOn?: string) => void;
  update: (item: CartItem, quantity: number) => void;
  remove: (item: CartItem) => void;
  replace: (item: CartItem, variant: string, quantity: number, addOn?: string) => void;
  clear: () => void;
};
const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "p4-pizza-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "[]") as CartItem[];
      if (Array.isArray(saved)) setItems(saved.filter((item) => products.some((p) => p.slug === item.slug && p.variants.some((v) => v.name === item.variant)) && Number.isInteger(item.quantity) && item.quantity > 0));
    } catch { /* Ignore invalid old cart data. */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem(storageKey, JSON.stringify(items)); }, [items, ready]);
  const add = (slug: string, variant: string, quantity = 1, addOn?: string) => setItems((current) => {
    const existing = current.find((item) => item.slug === slug && item.variant === variant && item.addOn === addOn);
    return existing ? current.map((item) => item === existing ? { ...item, quantity: item.quantity + quantity } : item) : [...current, { slug, variant, quantity, addOn }];
  });
  const update = (target: CartItem, quantity: number) => setItems((current) => current.map((item) => item.slug === target.slug && item.variant === target.variant && item.addOn === target.addOn ? { ...item, quantity } : item).filter((item) => item.quantity > 0));
  const remove = (target: CartItem) => setItems((current) => current.filter((item) => item.slug !== target.slug || item.variant !== target.variant || item.addOn !== target.addOn));
  const replace = (target: CartItem, variant: string, quantity: number, addOn?: string) => setItems((current) => {
    const remaining = current.filter((item) => item.slug !== target.slug || item.variant !== target.variant || item.addOn !== target.addOn);
    const existing = remaining.find((item) => item.slug === target.slug && item.variant === variant && item.addOn === addOn);
    return existing ? remaining.map((item) => item === existing ? { ...item, quantity: item.quantity + quantity } : item) : [...remaining, { slug: target.slug, variant, quantity, addOn }];
  });
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + itemUnitPrice(item) * item.quantity, 0);
  return <CartContext.Provider value={{ items, ready, count, total, add, update, remove, replace, clear: () => setItems([]) }}>{children}</CartContext.Provider>;
}
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
