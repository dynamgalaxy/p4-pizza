"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/menu";

const filters = [
  ["All deals", ""], ["Bumper", "Bumper Deal"], ["Wow", "Wow Deal"],
  ["Midnight", "Mid Night Deal"], ["Birthday", "Birthday Deal"], ["Triple Pizza", "Tripple Pizza Deals"],
];
const deals = products.filter((product) => product.category.includes("Deal"));

export default function DealsExplorer() {
  const [selected, setSelected] = useState("");
  const track = useRef<HTMLDivElement>(null);
  const visible = selected ? deals.filter((product) => product.category === selected) : deals;
  function choose(category: string) {
    setSelected(category);
    track.current?.scrollTo({ left: 0, behavior: "smooth" });
  }
  function move(direction: number) {
    if (track.current) track.current.scrollBy({ left: direction * track.current.clientWidth * 0.82, behavior: "smooth" });
  }
  return <section className="deals-explorer">
    <div className="container">
      <div className="deals-explorer-heading"><div><span className="kicker">P4 deals</span><h2>Pick your deal.</h2></div><Link href="/menu?category=Deals" className="text-link">View all deals <span>↗</span></Link></div>
      <div className="deals-filter-row"><nav className="deals-filters" aria-label="Deal categories">{filters.map(([label, category]) => <button type="button" key={label} className={selected === category ? "selected" : ""} aria-pressed={selected === category} onClick={() => choose(category)}>{label}</button>)}</nav><div className="slider-controls"><button type="button" aria-label="Previous deals" disabled={visible.length <= 3} onClick={() => move(-1)}>←</button><button type="button" aria-label="Next deals" disabled={visible.length <= 3} onClick={() => move(1)}>→</button></div></div>
      <p className="deals-count" aria-live="polite">{visible.length} {selected ? filters.find(([, category]) => category === selected)?.[0] : "real P4 deals"}</p>
      <div className="deal-explore-track" ref={track}>{visible.map((product) => <div className="deal-explore-slide" key={product.slug}><ProductCard product={product}/></div>)}</div>
    </div>
  </section>;
}
