"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { categories, products } from "@/lib/menu";
import ProductCard from "@/components/ProductCard";

const choices = ["All", "Pizzas", "Burgers", "Shawarma & Rolls", "Pasta", "Calzone", "Platter", "Crispy Chicken", "Hot Wings", "Fries", "Nuggets", "Deals", "Add Ons"];
const categoryFromParam = (value: string | null) => value?.includes("Deal") ? "Deals" : value?.includes("Pizza") ? "Pizzas" : choices.includes(value || "") ? value! : "All";
const matchesCategory = (category: string, selected: string) => selected === "All" || (selected === "Pizzas" ? category === "Classic Pizzas" || category === "Special Pizzas" : selected === "Deals" ? category.includes("Deal") : category === selected);

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
  const visible = products.filter((product) => matchesCategory(product.category, selected) && (!query || `${product.name} ${product.category} ${product.description || ""} ${product.badge || ""}`.toLowerCase().includes(query)));
  const groups = categories.filter((category) => visible.some((product) => product.category === category));
  return <section className="menu-layout"><div className="menu-toolbar"><div className="container"><nav className="filters" aria-label="Menu categories">{choices.map((category) => <button key={category} type="button" className={selected === category ? "selected" : ""} aria-current={selected === category ? "page" : undefined} onClick={() => choose(category)}>{category}</button>)}</nav><label className="menu-search"><span className="sr-only">Search menu</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search the menu"/></label></div></div><div className="container menu-results"><p className="menu-count">{visible.length} {visible.length === 1 ? "item" : "items"} · {selected === "All" ? "Full menu" : selected}</p>{groups.length ? groups.map((category) => <div className="menu-group" key={`${selected}-${query}-${category}`}><h2>{category}</h2><div className="product-grid">{visible.filter((product) => product.category === category).map((product) => <ProductCard key={product.slug} product={product}/>)}</div></div>) : <div className="empty-state"><h2>No matches</h2><p>Try another search or category.</p><button type="button" className="button button-outline" onClick={() => { setSearch(""); choose("All"); }}>Show full menu</button></div>}</div></section>;
}
