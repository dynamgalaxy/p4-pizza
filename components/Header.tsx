"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PICKUP_BRANCH_NAME } from "@/lib/config";
import { useCart } from "@/lib/cart";

const links = [{ href: "/menu", label: "Menu" }, { href: "/about", label: "About" }, { href: "/contact", label: "Contact" }];
const mobileCategories = [["Pizza", "Pizzas"], ["Burgers", "Burgers"], ["Shawarma & Rolls", "Shawarma & Rolls"], ["Crispy Chicken", "Crispy Chicken"], ["Fries", "Fries"], ["Deals", "Deals"]];

export default function Header() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const { count, orderType, setOrderType, openOrderPicker } = useCart();
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", onKey); toggleRef.current?.focus(); };
  }, [open]);

  const orderTypeSwitch = <div className="order-type-switch" role="group" aria-label="Choose delivery or pickup">
    <button type="button" className={orderType === "delivery" ? "selected" : ""} aria-pressed={orderType === "delivery"} onClick={() => setOrderType("delivery")}>Delivery</button>
    <button type="button" className={orderType === "pickup" ? "selected" : ""} aria-pressed={orderType === "pickup"} onClick={() => setOrderType("pickup")}>Pick-up</button>
  </div>;

  return <>
    <div className="location-bar"><span className="location-message"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" stroke="currentColor" strokeWidth="1.7"/><circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.7"/></svg>Serving {PICKUP_BRANCH_NAME}, Rawalpindi</span></div>
    <header className="site-header"><div className="container header-inner">
      <nav className="main-nav" aria-label="Main navigation">{links.map((link) => <Link key={link.href} href={link.href} className={pathname === link.href ? "active" : ""}>{link.label}</Link>)}</nav>
      <Link href="/" className="brand" aria-label="P4 Pizza home"><img className="brand-logo" src="/images/logo.png" alt="P4 Pizza & Fast Food" /></Link>
      <div className="header-actions">{orderTypeSwitch}<Link href="/cart" className="cart-link" aria-label={`Cart with ${count} items`}>Cart <span>{count}</span></Link><Link href={count ? "/checkout" : "/menu"} className="header-order">Order <span>↗︎</span></Link><button ref={toggleRef} className="menu-toggle" onClick={() => setOpen(true)} aria-label="Open menu" aria-controls="mobile-menu" aria-expanded={open}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.8"/></svg></button></div>
    </div><div className="mobile-order-row"><div className="container">{orderTypeSwitch}</div></div></header>
    <nav id="mobile-menu" className={`mobile-menu ${open ? "open" : ""}`} aria-label="Mobile navigation" aria-hidden={!open}>
      <div className="mobile-menu-top"><button ref={closeRef} type="button" onClick={() => setOpen(false)}>× <span>Close</span></button><Link href="/" onClick={() => setOpen(false)} aria-label="P4 Pizza home"><img className="mobile-brand-logo" src="/images/logo.png" alt="P4 Pizza & Fast Food" /></Link></div>
      <div className="mobile-menu-content"><Link className="mobile-menu-all" href="/menu" onClick={() => setOpen(false)}>Full menu <span>↗︎</span></Link>{mobileCategories.map(([label, category], index) => <Link href={`/menu?category=${encodeURIComponent(category)}`} key={category} onClick={() => setOpen(false)}><small>0{index + 1}</small>{label}<span>↗︎</span></Link>)}</div>
      <div className="mobile-menu-bottom"><button type="button" onClick={() => { setOpen(false); openOrderPicker(); }}>{orderType === "pickup" ? "Pickup" : orderType === "delivery" ? "Delivery" : "Choose order type"} ⌄</button><Link href="/about" onClick={() => setOpen(false)}>About</Link><Link href="/contact" onClick={() => setOpen(false)}>Contact</Link><Link href="/cart" onClick={() => setOpen(false)}>Cart ({count})</Link><Link href={count ? "/checkout" : "/menu"} onClick={() => setOpen(false)}>Order ↗︎</Link></div>
    </nav>
    <nav className="mobile-action-bar" aria-label="Quick actions"><Link href="/menu" className={pathname.startsWith("/menu") ? "active" : ""}>Menu</Link><Link href="/cart" className={pathname === "/cart" ? "active" : ""}>Cart <span>{count}</span></Link><Link href={count ? "/checkout" : "/menu"} className="mobile-order">Order ↗︎</Link></nav>
  </>;
}
