"use client";

import Link from "next/link";
import { useState } from "react";
import QuickAdd from "@/components/QuickAdd";
import { itemUnitPrice, useCart, type CartItem } from "@/lib/cart";
import { money, products } from "@/lib/menu";

export default function CartPage() {
  const { items, ready, count, total, update, remove } = useCart();
  const [editing, setEditing] = useState<CartItem | null>(null);
  const editingProduct = products.find((product) => product.slug === editing?.slug);
  if (!ready) return <div className="container cart-loading" role="status">Loading your cart…</div>;
  return <><section className="page-heading"><div className="container"><span className="eyebrow">Your order</span><h1>Your cart.</h1>{count > 0 && <p>{count} {count === 1 ? "item" : "items"} ready to order.</p>}</div></section><div className="container">{items.length === 0 ? <div className="empty-state"><h2>Your cart is empty</h2><p>There’s plenty of good food waiting on the menu.</p><Link href="/menu" className="button button-red">Explore menu ↗</Link></div> : <div className="cart-layout"><div>{items.map((item) => {
    const product = products.find((p) => p.slug === item.slug);
    if (!product) return null;
    const unitPrice = itemUnitPrice(item);
    return <div className="cart-item" key={`${item.slug}-${item.variant}-${item.addOn || ""}`}><button type="button" onClick={() => setEditing(item)} className="cart-item-image" style={{backgroundImage:`url('${product.image}')`}} aria-label={`Edit ${product.name}`}/><div><h3>{product.name}</h3><p>{item.variant} · {money(unitPrice)} each{item.addOn && <><br/>+ {item.addOn}</>}</p><div className="quantity-row"><button onClick={() => update(item,item.quantity-1)} aria-label={`Decrease ${product.name} quantity`}>−</button><span>{item.quantity}</span><button onClick={() => update(item,item.quantity+1)} aria-label={`Increase ${product.name} quantity`}>+</button></div></div><div className="cart-item-price">{money(unitPrice * item.quantity)}<br/><button className="text-button" onClick={() => setEditing(item)}>Edit</button><span className="cart-action-gap"> · </span><button className="text-button" onClick={() => remove(item)}>Remove</button></div></div>;
  })}<Link href="/menu" className="text-link cart-continue">Continue browsing <span>↗</span></Link></div><aside className="summary"><h2>Order summary</h2><div className="summary-line"><span>Subtotal</span><strong>{money(total)}</strong></div><div className="summary-line total"><span>Total</span><span>{money(total)}</span></div><Link href="/checkout" className="button button-red">Checkout ↗</Link><p className="subtle-note">Your order will be sent through WhatsApp.</p></aside></div>}</div>{editing && editingProduct && <QuickAdd product={editingProduct} editing={editing} onClose={() => setEditing(null)}/>}</>;
}
