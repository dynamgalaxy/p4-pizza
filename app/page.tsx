import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/menu";

const categories = [
  ["Pizza", "Pizzas"], ["Burgers", "Burgers"], ["Chicken", "Crispy Chicken"],
  ["Rolls", "Shawarma & Rolls"], ["Fries", "Fries"], ["Deals", "Deals"],
];
const featured = ["chicken-tikka-pizza", "p4-special-pizza", "zinger-burger", "fries"]
  .map((slug) => products.find((product) => product.slug === slug)).filter((product) => product !== undefined);
const deals = ["wow-deal-w1", "mid-night-deal-n1", "birthday-deal-bd1", "bumper-deal-b1", "tripple-pizza-deal"]
  .map((slug) => products.find((product) => product.slug === slug)).filter((product) => product !== undefined);

export default function Home() {
  return <>
    <section className="hero">
      <div className="hero-media" data-parallax><img src="/images/hero-v2.png" alt="Chicken pizza shared fresh from the oven"/></div>
      <div className="container hero-content"><span className="kicker light">P4 Pizza & Fast Food</span><h1>Crave it.<br/>Share it.</h1><p className="hero-subtitle">Your favorites, the P4 way.</p><Link href="/menu" className="hero-cta"><span>Explore the menu</span><span>↗</span></Link></div>
      <div className="hero-index"><span>Rawalpindi, Pakistan</span><span>Scroll to explore ↓</span></div>
      <svg className="section-wave hero-wave" viewBox="0 0 1440 72" preserveAspectRatio="none" aria-hidden="true"><path d="M0 38 C270 70 490 9 745 34 C1030 64 1190 17 1440 43 L1440 72 H0 Z"/></svg>
    </section>

    <section className="brand-intro"><div className="container" data-reveal><span className="kicker light">Made in Rawalpindi</span><h2>For every craving.<br/><span>For everyone.</span></h2></div></section>

    <section className="featured-section"><div className="container"><div className="section-topline" data-reveal><span className="kicker">The favorites</span><Link href="/menu" className="text-link">Full menu <span>↗</span></Link></div><div className="featured-heading" data-reveal><h2>Find your<br/>favorite.</h2></div><div className="product-grid">{featured.map((product) => <ProductCard key={product.slug} product={product}/>)}</div></div></section>

    <section className="deal-catalog"><div className="container"><div className="section-topline" data-reveal><span className="kicker light">P4 deals</span><Link href="/menu?category=Deals" className="text-link">View all deals <span>↗</span></Link></div><h2 data-reveal>More to share.</h2><div className="deal-cards">{deals.map((product) => <ProductCard key={product.slug} product={product}/>)}</div></div><svg className="section-wave deals-wave" viewBox="0 0 1440 110" preserveAspectRatio="none" aria-hidden="true"><path d="M0 70 C150 18 335 20 480 67 C660 122 785 108 950 50 C1130 -5 1280 22 1440 69 L1440 110 H0 Z"/></svg></section>

    <section className="category-section"><div className="container"><div className="section-topline" data-reveal><span className="kicker">Explore P4</span><span>What are you in the mood for?</span></div><div className="category-index">{categories.map(([label, category], index) => <Link href={`/menu?category=${encodeURIComponent(category)}`} key={label} data-reveal style={{transitionDelay:`${index * 45}ms`}}><span className="category-number">0{index + 1}</span><span>{label}</span><span className="category-arrow">↗</span></Link>)}</div><Link href="/menu" className="button button-red category-all">Explore full menu ↗</Link></div><svg className="section-wave category-wave" viewBox="0 0 1440 70" preserveAspectRatio="none" aria-hidden="true"><path d="M0 44 C380 7 580 75 920 35 C1150 9 1270 22 1440 38 L1440 70 H0 Z"/></svg></section>

    <section className="order-promo"><div className="container" data-reveal><span className="kicker light">Your P4 moment</span><h2>Ready when<br/>you are.</h2><Link href="/menu" className="hero-cta"><span>Build your order</span><span>↗</span></Link></div></section>

  </>;
}
