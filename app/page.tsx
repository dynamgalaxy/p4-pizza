import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import ExploreMenu from "@/components/ExploreMenu";
import DealsExplorer from "@/components/DealsExplorer";
import { products } from "@/lib/menu";

const categories = [
  ["Pizzas", "Pizzas"], ["Burgers", "Burgers"], ["Shawarma & Rolls", "Shawarma & Rolls"],
  ["Pasta", "Pasta"], ["Calzone", "Calzone"], ["Platter", "Platter"], ["Crispy Chicken", "Crispy Chicken"],
  ["Hot Wings", "Hot Wings"], ["Fries", "Fries"], ["Nuggets", "Nuggets"], ["Deals", "Deals"],
];
const featured = ["chicken-tikka-pizza", "p4-special-pizza", "zinger-burger", "fries"]
  .map((slug) => products.find((product) => product.slug === slug)).filter((product) => product !== undefined);
export default function Home() {
  return <>
    <section className="hero">
      <div className="hero-media" data-parallax><img src="/images/hero-v2.png" alt="Chicken pizza shared fresh from the oven"/></div>
      <div className="container hero-content"><span className="kicker light">P4 Pizza & Fast Food</span><h1>Crave it.<br/>Share it.</h1><p className="hero-subtitle">Your favorites, the P4 way.</p><Link href="/menu" className="hero-cta"><span>Explore the menu</span><span>↗</span></Link></div>
      <div className="hero-index"><span>Rawalpindi, Pakistan</span><span>Scroll to explore ↓</span></div>
      <svg className="section-wave hero-wave" viewBox="0 0 1440 72" preserveAspectRatio="none" aria-hidden="true"><path d="M0 38 C270 70 490 9 745 34 C1030 64 1190 17 1440 43 L1440 72 H0 Z"/></svg>
    </section>

    <ExploreMenu />

    <section className="brand-intro"><div className="container" data-reveal><span className="kicker light">Made in Rawalpindi</span><h2>For every craving.<br/><span>For everyone.</span></h2></div></section>

    <DealsExplorer />

    <section className="deal-catalog most-loved"><div className="container"><div className="section-topline" data-reveal><span className="kicker light">P4 favorites</span><Link href="/menu" className="text-link">Full menu <span>↗</span></Link></div><h2 data-reveal>Most loved.</h2><div className="deal-cards">{featured.map((product) => <ProductCard key={product.slug} product={product}/>)}</div></div><svg className="section-wave deals-wave" viewBox="0 0 1440 110" preserveAspectRatio="none" aria-hidden="true"><path d="M0 70 C150 18 335 20 480 67 C660 122 785 108 950 50 C1130 -5 1280 22 1440 69 L1440 110 H0 Z"/></svg></section>

    <section className="category-section"><div className="container"><div className="section-topline" data-reveal><span className="kicker">Explore P4</span><span>What are you in the mood for?</span></div><div className="category-index">{categories.map(([label, category], index) => <Link href={`/menu?category=${encodeURIComponent(category)}`} key={label} data-reveal style={{transitionDelay:`${index * 45}ms`}}><span className="category-number">{String(index + 1).padStart(2,"0")}</span><span>{label}</span><span className="category-arrow">↗</span></Link>)}</div><Link href="/menu" className="button button-red category-all">Explore full menu ↗</Link></div><svg className="section-wave category-wave" viewBox="0 0 1440 70" preserveAspectRatio="none" aria-hidden="true"><path d="M0 44 C380 7 580 75 920 35 C1150 9 1270 22 1440 38 L1440 70 H0 Z"/></svg></section>

    <section className="order-promo"><div className="container" data-reveal><div className="promo-copy"><span className="kicker light">Your P4 moment</span><h2>Ready when<br/>you are.</h2><Link href="/menu" className="hero-cta"><span>Build your order</span><span>↗</span></Link></div><div className="promo-visual" role="img" aria-label="A feast of P4 favorites"><img className="promo-photo-main" src="/images/pizza.jpg" alt="" loading="lazy"/><img className="promo-photo-float promo-photo-burger" src="/images/burger-editorial.png" alt="" loading="lazy"/><img className="promo-photo-float promo-photo-fries" src="/images/fries.jpg" alt="" loading="lazy"/><span className="promo-stamp" aria-hidden="true">P4<br/>GOOD<br/>MOOD</span></div></div></section>

  </>;
}
