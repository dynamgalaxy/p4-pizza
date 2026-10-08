"use client";

import Link from "next/link";
import { useState } from "react";
import { addOnFor, addOnPrice, useCart } from "@/lib/cart";
import { money, type Product } from "@/lib/menu";

export default function ProductDetail({ product }: { product: Product }) {
  const [variant, setVariant] = useState(product.variants[0].name);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [withAddOn, setWithAddOn] = useState(false);
  const { add } = useCart();
  const addOn = addOnFor(product.category);
  const addOnCost = addOnPrice({ variant, addOn });
  const price = (product.variants.find((item) => item.name === variant)?.price || product.variants[0].price) + (withAddOn ? addOnCost : 0);
  return <div className="container detail-layout"><div className="detail-photo" style={{ backgroundImage: `url('${product.image}')` }} role="img" aria-label={product.name}/><div className="detail-info"><div className="breadcrumb"><Link href="/menu">Menu</Link> / {product.category}</div><h1>{product.name}</h1><p>{product.description || "Freshly prepared and ready to enjoy."}</p><strong className="detail-price">{money(price)}</strong><span className="option-label">{product.variants.length > 1 ? "Choose your option" : "Option"}</span><div className="variant-buttons">{product.variants.map((item) => <button type="button" key={item.name} aria-pressed={variant === item.name} className={variant === item.name ? "selected" : ""} onClick={() => setVariant(item.name)}>{item.name}</button>)}</div>{addOn && <label className="add-on-option"><input type="checkbox" checked={withAddOn} onChange={(event) => setWithAddOn(event.target.checked)}/><span>{addOn}</span><strong>+ {money(addOnCost)}</strong></label>}<span className="option-label">Quantity</span><div className="quantity-row"><button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity">−</button><span>{quantity}</span><button type="button" onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity">+</button></div><button className="button button-red detail-add" onClick={() => { add(product.slug, variant, quantity, withAddOn ? addOn : undefined); setAdded(true); window.setTimeout(() => setAdded(false), 1500); }}>{added ? "Added to cart ✓" : `Add to cart — ${money(price * quantity)} ↗`}</button><p className="subtle-note">Order checkout is completed through WhatsApp.</p></div></div>;
}
