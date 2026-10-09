"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { itemUnitPrice, useCart } from "@/lib/cart";
import { ORDER_WHATSAPP_NUMBER } from "@/lib/config";
import { money, products } from "@/lib/menu";

export default function CheckoutPage() {
  const { items, ready, total } = useCart();
  const [form, setForm] = useState({ name: "", whatsapp: "", email: "", address: "", note: "" });
  const lines = items.flatMap((item, index) => {
    const product = products.find((p) => p.slug === item.slug)!;
    const variant = item.variant === "Deal" || (item.variant === "Regular" && product.variants.length === 1) ? "" : ` — ${item.variant}`;
    const addOn = item.addOn ? ` + ${item.addOn}` : "";
    return [`${index + 1}. ${product.name}${variant}${addOn} × ${item.quantity}`, `   ${money(itemUnitPrice(item) * item.quantity)}`];
  });
  const message = [
    "🍕 *P4 PIZZA & FAST FOOD*", "━━━━━━━━━━━━━━━━", "Assalam-o-Alaikum! 👋", "", "I'd like to place an order:", "",
    "🛒 *ORDER DETAILS*", "", ...lines, "", "━━━━━━━━━━━━━━━━", `💰 *TOTAL: ${money(total)}*`, "", "👤 *CUSTOMER DETAILS*",
    `Name: ${form.name.trim()}`, `📱 WhatsApp: ${form.whatsapp.trim()}`, `📧 Email: ${form.email.trim()}`, `📍 Address: ${form.address.trim()}`,
    ...(form.note.trim() ? ["", `📝 Note: ${form.note.trim()}`] : []), "", "Please confirm my order. Thank you!",
  ].join("\n");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!items.length) return;
    window.open(`https://wa.me/${ORDER_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }
  if (!ready) return <div className="container cart-loading" role="status">Loading your order…</div>;
  return <><section className="page-heading"><div className="container"><span className="eyebrow">One final step</span><h1>Checkout.</h1><p>Review your order, then send it through WhatsApp.</p></div></section><div className="container">{ready && items.length === 0 ? <div className="empty-state"><h2>No items to check out</h2><p>Add your favorites first.</p><Link href="/menu" className="button button-red">Browse menu ↗</Link></div> : <div className="checkout-layout"><aside className="summary"><h2>Your order</h2>{items.map((item) => { const product = products.find((p) => p.slug === item.slug); const variant = item.variant === "Deal" || (item.variant === "Regular" && product?.variants.length === 1) ? "" : ` — ${item.variant}`; return product ? <div className="summary-line" key={`${item.slug}-${item.variant}-${item.addOn || ""}`}><span>{product.name}{variant}{item.addOn && <><br/>+ {item.addOn}</>} × {item.quantity}</span><strong>{money(itemUnitPrice(item) * item.quantity)}</strong></div> : null; })}<div className="summary-line total"><span>Total</span><span>{money(total)}</span></div><Link href="/cart" className="button button-outline">Edit cart</Link></aside><form onSubmit={submit}><h2>Your details</h2><p className="checkout-intro">All fields except the note are required.</p><div className="form-grid"><label className="field"><span>Name *</span><input required autoComplete="name" value={form.name} onChange={(e) => setForm({...form,name:e.target.value})} placeholder="Your full name"/></label><label className="field"><span>WhatsApp number *</span><input required type="tel" autoComplete="tel" value={form.whatsapp} onChange={(e) => setForm({...form,whatsapp:e.target.value})} placeholder="03XX XXXXXXX"/></label></div><label className="field"><span>Email *</span><input required type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({...form,email:e.target.value})} placeholder="you@example.com"/></label><label className="field"><span>Address *</span><textarea required autoComplete="street-address" value={form.address} onChange={(e) => setForm({...form,address:e.target.value})} placeholder="House, street, area, city"/></label><label className="field"><span>Additional note</span><textarea value={form.note} onChange={(e) => setForm({...form,note:e.target.value})} placeholder="Any instructions for your order?"/></label><div className="message-preview"><span className="option-label">WhatsApp message preview</span><pre>{message}</pre></div><button type="submit" className="button button-red checkout-submit">Order on WhatsApp ↗</button><p className="subtle-note">WhatsApp opens with this message ready to send.</p></form></div>}</div></>;
}
