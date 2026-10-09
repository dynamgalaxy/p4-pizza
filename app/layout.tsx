import type { Metadata } from "next";
import Link from "next/link";
import { CartProvider } from "@/lib/cart";
import Header from "@/components/Header";
import Motion from "@/components/Motion";
import "./globals.css";

export const metadata: Metadata = {
  title: "P4 Pizza & Fast Food | Rawalpindi",
  description: "Explore pizzas, burgers, crispy chicken and original P4 deals. Order direct on WhatsApp.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth"><body><CartProvider>
    <Header />
    <main><Motion>{children}</Motion></main>
    <footer className="footer"><div className="container footer-main"><div><Link href="/" className="footer-brand">P4<span>.</span></Link><p>Good food. Better moments.</p></div><nav aria-label="Footer navigation"><Link href="/menu">Menu</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/cart">Cart</Link></nav><div className="footer-contact"><span>Rawalpindi, Pakistan</span><a href="tel:03352055552">0335 2055552</a></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} P4 Pizza & Fast Food</span><span>Made for the crave.</span><span>Powered by Dynam Galaxy</span></div></footer>
  </CartProvider></body></html>;
}
