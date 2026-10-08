"use client";

import Link from "next/link";
import { useState } from "react";
import QuickAdd from "./QuickAdd";
import { money, type Product } from "@/lib/menu";

export default function ProductCard({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  return <article className="product-card" data-reveal>
    <Link href={`/menu/${product.slug}`} className="product-image" aria-label={`View ${product.name}`}><img src={product.image} alt="" loading="lazy"/></Link>
    <div className="product-body"><span className="product-category">{product.badge || product.category}</span><div className="product-heading"><Link href={`/menu/${product.slug}`} className="product-title">{product.name}</Link><strong className="product-price">{product.variants.length > 1 && "From "}{money(product.variants[0].price)}</strong></div>
      <div className="card-bottom"><Link href={`/menu/${product.slug}`}>View details <span>↗</span></Link><button type="button" className="add-button" onClick={() => setOpen(true)} aria-label={`Quick add ${product.name}`}>+</button></div>
    </div>
    {open && <QuickAdd product={product} onClose={() => setOpen(false)}/>}
  </article>;
}
