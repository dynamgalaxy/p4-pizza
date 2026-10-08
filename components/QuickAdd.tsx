"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { addOnFor, addOnPrice, useCart, type CartItem } from "@/lib/cart";
import { money, type Product } from "@/lib/menu";

export default function QuickAdd({ product, onClose, editing }: { product: Product; onClose: () => void; editing?: CartItem }) {
  const { add, replace } = useCart();
  const [variant, setVariant] = useState(editing?.variant || product.variants[0].name);
  const [quantity, setQuantity] = useState(editing?.quantity || 1);
  const [withAddOn, setWithAddOn] = useState(Boolean(editing?.addOn));
  const [done, setDone] = useState(false);
  const sheetRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const addOn = addOnFor(product.category);
  const unitPrice = (product.variants.find((item) => item.name === variant)?.price || product.variants[0].price) + (withAddOn ? addOnPrice({ variant, addOn }) : 0);

  useEffect(() => {
    const oldOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const focusable = [...(sheetRef.current?.querySelectorAll<HTMLElement>("button:not(:disabled),a,input") || [])];
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = oldOverflow; window.removeEventListener("keydown", onKey); previousFocus?.focus(); };
  }, []);

  return createPortal(<div className="quick-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section ref={sheetRef} className="quick-sheet" role="dialog" aria-modal="true" aria-label={editing ? `Edit ${product.name}` : `Add ${product.name} to cart`}>
      <button ref={closeRef} type="button" className="quick-close" onClick={onClose} aria-label="Close quick add">×</button>
      {done ? <div className="quick-success"><span className="eyebrow">{editing ? "Cart updated" : "Added to your cart"}</span><h2>{product.name}</h2><p>{quantity} × {variant}{withAddOn && ` + ${addOn}`} · {money(unitPrice * quantity)}</p><div className="quick-success-actions"><button type="button" className="button button-outline" onClick={onClose}>{editing ? "Back to cart" : "Keep browsing"}</button><Link href="/cart" className="button button-red" onClick={onClose}>View cart ↗</Link></div></div> : <>
        <img className="quick-image" src={product.image} alt=""/>
        <div className="quick-content"><span className="eyebrow">{product.category}</span><h2>{product.name}</h2>{product.description && <p className="quick-description">{product.description}</p>}
          {product.variants.length > 1 && <><span className="option-label">Choose {product.category.includes("Pizza") ? "size" : "option"}</span><div className="variant-buttons">{product.variants.map((option) => <button type="button" key={option.name} className={variant === option.name ? "selected" : ""} aria-pressed={variant === option.name} onClick={() => setVariant(option.name)}>{option.name}</button>)}</div></>}
          {addOn && <label className="add-on-option"><input type="checkbox" checked={withAddOn} onChange={(event) => setWithAddOn(event.target.checked)}/><span>{addOn}</span><strong>+ {money(addOnPrice({ variant, addOn }))}</strong></label>}
          <div className="quick-purchase"><div><span className="option-label">Quantity</span><div className="quantity-row"><button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity">−</button><span>{quantity}</span><button type="button" onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity">+</button></div></div><strong>{money(unitPrice * quantity)}</strong></div>
          <button type="button" className="button button-red quick-submit" onClick={() => { if (editing) replace(editing, variant, quantity, withAddOn ? addOn : undefined); else add(product.slug, variant, quantity, withAddOn ? addOn : undefined); setDone(true); }}>{editing ? "Update cart" : "Add to cart"} — {money(unitPrice * quantity)} ↗</button>
        </div>
      </>}
    </section>
  </div>, document.body);
}
