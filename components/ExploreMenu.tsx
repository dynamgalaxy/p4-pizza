"use client";

import { useRef } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/menu";

export default function ExploreMenu() {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef({ start: 0, scroll: 0, moved: false });
  function move(direction: number) {
    const element = track.current;
    if (element) element.scrollBy({ left: direction * element.clientWidth * 0.82, behavior: "smooth" });
  }
  return <section className="explore-slider" aria-label="Explore the full menu">
    <div className="container">
      <div className="section-topline"><span className="kicker">Explore menu</span><div className="slider-actions"><Link href="/menu" className="text-link">View all <span>↗</span></Link><div className="slider-controls"><button type="button" aria-label="Previous products" onClick={() => move(-1)}>←</button><button type="button" aria-label="Next products" onClick={() => move(1)}>→</button></div></div></div>
      <div className="explore-track" ref={track} onPointerDown={(event) => { if (event.pointerType !== "mouse" || (event.target as HTMLElement).closest("a,button")) return; drag.current = { start: event.clientX, scroll: track.current?.scrollLeft || 0, moved: false }; }} onPointerMove={(event) => { if (event.pointerType !== "mouse" || !event.buttons || !track.current) return; const delta = event.clientX - drag.current.start; if (Math.abs(delta) > 5) drag.current.moved = true; if (drag.current.moved) track.current.scrollLeft = drag.current.scroll - delta; }} onPointerUp={() => { if (drag.current.moved) window.setTimeout(() => { drag.current.moved = false; }, 0); }} onPointerCancel={() => { drag.current.moved = false; }} onClickCapture={(event) => { if (drag.current.moved) { event.preventDefault(); event.stopPropagation(); drag.current.moved = false; } }}>
        {products.map((product) => <div className="explore-slide" key={product.slug}><ProductCard product={product}/></div>)}
      </div>
    </div>
  </section>;
}
