"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { categories, products } from "@/lib/menu";
import { itemUnitPrice, useCart, type CartItem } from "@/lib/cart";
import { money } from "@/lib/menu";
import ProductCard from "@/components/ProductCard";

const choices = ["All", "Pizzas", "Burgers", "Shawarma & Rolls", "Pasta", "Calzone", "Platter", "Crispy Chicken", "Hot Wings", "Fries", "Nuggets", "Deals", "Add Ons"];
const categoryFromParam = (value: string | null) => value?.includes("Deal") ? "Deals" : value?.includes("Pizza") ? "Pizzas" : choices.includes(value || "") ? value! : "All";
const matchesCategory = (category: string, selected: string) => selected === "All" || (selected === "Pizzas" ? category === "Classic Pizzas" || category === "Special Pizzas" : selected === "Deals" ? category.includes("Deal") : category === selected);

function MenuCart() {
  const { items, count, total, ready, update, remove } = useCart();
  return <aside className="menu-cart" aria-label="Your cart">
    <div className="menu-cart-heading"><div><span className="kicker">Your order</span><h2>Cart <span>{count}</span></h2></div></div>
    {!ready ? <p className="menu-cart-empty-copy">Loading your cart…</p> : items.length === 0 ? <div className="menu-cart-empty"><span className="menu-cart-mark" aria-hidden="true">P4</span><h3>Your cart is empty</h3><p>Find something you love and it’ll show up here.</p><a href="#menu-items" className="text-link">Explore the menu <span>↓</span></a></div> : <>
      <div className="menu-cart-items" aria-label="Cart items">{items.map((item: CartItem) => {
        const product = products.find((entry) => entry.slug === item.slug);
        if (!product) return null;
        return <div className="menu-cart-item" key={`${item.slug}-${item.variant}-${item.addOn || ""}`}>
          <img src={product.image} alt=""/>
          <div className="menu-cart-item-info"><strong>{product.name}</strong><span>{item.variant}{item.addOn ? ` · ${item.addOn}` : ""}</span><b>{money(itemUnitPrice(item) * item.quantity)}</b><div className="menu-cart-quantity"><button type="button" aria-label={`Decrease ${product.name} quantity`} onClick={() => update(item, item.quantity - 1)}>−</button><span>{item.quantity}</span><button type="button" aria-label={`Increase ${product.name} quantity`} onClick={() => update(item, item.quantity + 1)}>+</button><button type="button" className="menu-cart-remove" aria-label={`Remove ${product.name}`} onClick={() => remove(item)}>Remove</button></div></div>
        </div>;
      })}</div>
      <div className="menu-cart-total"><span>Total</span><strong>{money(total)}</strong></div><Link href="/checkout" className="button button-red menu-cart-checkout">Checkout ↗</Link><Link href="/cart" className="menu-cart-view">View full cart</Link>
    </>}
  </aside>;
}

export default function MenuContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState(() => categoryFromParam(searchParams.get("category")));
  const [search, setSearch] = useState("");
  useEffect(() => setSelected(categoryFromParam(searchParams.get("category"))), [searchParams]);
  function choose(category: string) {
    setSelected(category);
    router.replace(category === "All" ? "/menu" : `/menu?category=${encodeURIComponent(category)}`, { scroll: false });
  }
  const query = search.trim().toLowerCase();
  const visible = products.filter((product) => matchesCategory(product.category, selected) && (!query || `${product.name} ${product.category} ${product.description || ""} ${product.badge || ""} ${product.variants.map((variant) => variant.name).join(" ")}`.toLowerCase().includes(query)));
  const groups = categories.filter((category) => visible.some((product) => product.category === category));
  return <section className="menu-layout"><div className="menu-toolbar"><div className="container"><nav className="filters" aria-label="Menu categories">{choices.map((category) => <button key={category} type="button" className={selected === category ? "selected" : ""} aria-current={selected === category ? "page" : undefined} onClick={() => choose(category)}>{category}</button>)}</nav><label className="menu-search"><span className="sr-only">Search menu</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search the menu"/></label>{(search || selected !== "All") && <button type="button" className="menu-reset" onClick={() => { setSearch(""); choose("All"); }}>Clear</button>}</div></div><div className="container menu-results"><MenuCart/><div className="menu-products" id="menu-items"><p className="menu-count">{visible.length} {visible.length === 1 ? "item" : "items"} · {selected === "All" ? "Full menu" : selected}</p>{groups.length ? groups.map((category) => <div className="menu-group" key={`${selected}-${query}-${category}`}><h2>{category}</h2><div className="product-grid">{visible.filter((product) => product.category === category).map((product) => <ProductCard key={product.slug} product={product}/>)}</div></div>) : <div className="empty-state"><h2>No matches</h2><p>Try another search or category.</p><button type="button" className="button button-outline" onClick={() => { setSearch(""); choose("All"); }}>Show full menu</button></div>}</div></div></section>;
}
