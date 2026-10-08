import Link from "next/link";
import { photos } from "@/lib/menu";

export default function AboutPage() { return <><section className="page-heading"><div className="container" data-reveal><span className="eyebrow">P4 / Rawalpindi</span><h1>About us.</h1></div></section><section className="info-section"><div className="container info-grid"><div data-reveal><span className="eyebrow">The good stuff</span><h2>Made for<br/>the moment.</h2><p>Pizza, burgers, rolls and more. Whatever the occasion, there’s something on the P4 menu for it.</p><Link href="/menu" className="button button-red">Explore the menu ↗</Link></div><div className="info-image" style={{backgroundImage:`url('${photos.pizza}')`}} role="img" aria-label="Pizza on a table" data-reveal/></div></section></>; }
