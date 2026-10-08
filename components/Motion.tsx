"use client";

import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";

export default function Motion({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.classList.add("motion-ready");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -24px 0px" });
    const observe = (root: ParentNode) => root.querySelectorAll("[data-reveal]:not(.is-visible)").forEach((element) => observer.observe(element));
    observe(document);
    const mutations = new MutationObserver(() => observe(document));
    mutations.observe(document.querySelector("main")!, { childList: true, subtree: true });
    const parallaxItems = [...document.querySelectorAll<HTMLElement>("[data-parallax]")];
    let frame = 0;
    const update = () => {
      frame = 0;
      parallaxItems.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const offset = Math.max(-48, Math.min(48, (window.innerHeight / 2 - rect.top - rect.height / 2) * 0.07));
        element.style.setProperty("--parallax-y", `${offset}px`);
      });
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { observer.disconnect(); mutations.disconnect(); window.removeEventListener("scroll", onScroll); if (frame) cancelAnimationFrame(frame); };
  }, [pathname]);
  return <div key={pathname} className="route-shell">{children}</div>;
}
