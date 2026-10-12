"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  { image: "/images/hero-v2.png", title: <>Crave it.<br/>Share it.</>, subtitle: "Your favorites, the P4 way.", alt: "Fresh pizza ready to share" },
  { image: "/images/pizza.jpg", title: <>A slice for<br/>the table.</>, subtitle: "Pizza made for good company.", alt: "P4 pizza with fresh toppings" },
  { image: "/images/burger-editorial.png", title: <>Make room<br/>for more.</>, subtitle: "Burgers, rolls and all the sides.", alt: "Freshly made P4 burger" },
];

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 5000);
    return () => window.clearInterval(timer);
  }, []);
  const select = (index: number) => setActive((index + slides.length) % slides.length);
  return <section className="hero" aria-label="P4 Pizza highlights" aria-roledescription="carousel">
    <div className="hero-media" data-parallax aria-hidden="true">{slides.map((slide, index) => <img key={slide.image} className={`hero-slide${active === index ? " active" : ""}`} src={slide.image} alt="" fetchPriority={index === 0 ? "high" : "auto"} loading={index === 0 ? "eager" : "lazy"}/>)}</div>
    <div className="container hero-content" aria-live="polite"><span className="kicker light">P4 Pizza & Fast Food</span><h1 key={active}>{slides[active].title}</h1><p className="hero-subtitle">{slides[active].subtitle}</p><Link href="/menu" className="hero-cta"><span>Explore the menu</span><span>↗</span></Link></div>
    <div className="hero-index"><span>Rawalpindi, Pakistan</span><span>Scroll to explore ↓</span></div>
    <div className="hero-pagination" aria-label="Banner navigation">{slides.map((slide, index) => <button type="button" key={slide.image} aria-label={`Show banner ${index + 1}: ${slide.alt}`} aria-current={active === index ? "true" : undefined} className={active === index ? "active" : ""} onClick={() => select(index)}/>)}</div>
    <svg className="section-wave hero-wave" viewBox="0 0 1440 72" preserveAspectRatio="none" aria-hidden="true"><path d="M0 38 C270 70 490 9 745 34 C1030 64 1190 17 1440 43 L1440 72 H0 Z"/></svg>
  </section>;
}
