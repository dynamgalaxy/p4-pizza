"use client";

import { useEffect, useRef, useState } from "react";
import { PICKUP_BRANCH_ADDRESS, PICKUP_BRANCH_NAME } from "@/lib/config";
import { useCart, type OrderType } from "@/lib/cart";

type Stage = "hidden" | "splash" | "fade" | "choice";
export default function EntryExperience() {
  const { ready, orderType, orderPickerOpen, closeOrderPicker, setOrderType } = useCart();
  const [stage, setStage] = useState<Stage>("hidden");
  const [draft, setDraft] = useState<OrderType | null>(null);
  const initialized = useRef(false);
  const deliveryRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!ready || initialized.current) return;
    initialized.current = true;
    let seen = false;
    try { seen = sessionStorage.getItem("p4-entry-seen") === "1"; } catch { /* Continue with the welcome flow if storage is blocked. */ }
    if (seen) { if (!orderType) setStage("choice"); return; }
    setStage("splash");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const leave = window.setTimeout(() => setStage("fade"), reduced ? 80 : 720);
    const finish = window.setTimeout(() => {
      try { sessionStorage.setItem("p4-entry-seen", "1"); } catch { /* The flow still works without session storage. */ }
      setStage(orderType ? "hidden" : "choice");
    }, reduced ? 100 : 960);
    return () => { window.clearTimeout(leave); window.clearTimeout(finish); };
  }, [ready, orderType]);
  useEffect(() => {
    if (orderPickerOpen) { setDraft(orderType); setStage("choice"); }
  }, [orderPickerOpen, orderType]);
  useEffect(() => {
    if (stage !== "choice" && stage !== "splash" && stage !== "fade") return;
    const previous = document.activeElement as HTMLElement;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (stage === "choice") deliveryRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && orderType) { setStage("hidden"); closeOrderPicker(); return; }
      if (event.key !== "Tab" || stage !== "choice") return;
      const nodes = [...(document.querySelector(".order-choice")?.querySelectorAll<HTMLElement>("button:not(:disabled)") || [])];
      if (!nodes.length) return;
      if (event.shiftKey && document.activeElement === nodes[0]) { event.preventDefault(); nodes[nodes.length - 1].focus(); }
      if (!event.shiftKey && document.activeElement === nodes[nodes.length - 1]) { event.preventDefault(); nodes[0].focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = oldOverflow; window.removeEventListener("keydown", onKey); if (stage === "choice") previous?.focus(); };
  }, [stage, orderType, closeOrderPicker]);
  if (stage === "hidden") return null;
  if (stage === "splash" || stage === "fade") return <div className={`entry-splash ${stage === "fade" ? "leaving" : ""}`} aria-hidden="true"><img src="/images/logo.png" alt=""/></div>;
  return <div className="order-choice-overlay"><section className="order-choice" role="dialog" aria-modal="true" aria-labelledby="order-choice-title">
    {orderType && <button className="order-choice-close" type="button" onClick={() => { setStage("hidden"); closeOrderPicker(); }} aria-label="Close order type selection">×</button>}
    <img className="order-choice-logo" src="/images/logo.png" alt="P4 Pizza & Fast Food"/><span className="kicker">Fresh from P4</span><h2 id="order-choice-title">How would you like it?</h2>
    <div className="order-choice-options"><button ref={deliveryRef} type="button" className={draft === "delivery" ? "selected" : ""} aria-pressed={draft === "delivery"} onClick={() => setDraft("delivery")}><span aria-hidden="true">↗</span><strong>Delivery</strong><small>Bring the order to you</small></button><button type="button" className={draft === "pickup" ? "selected" : ""} aria-pressed={draft === "pickup"} onClick={() => setDraft("pickup")}><span aria-hidden="true">⌖</span><strong>Pickup</strong><small>Collect from P4</small></button></div>
    {draft === "pickup" && <p className="pickup-branch"><strong>{PICKUP_BRANCH_NAME}</strong><br/>{PICKUP_BRANCH_ADDRESS}</p>}
    <button type="button" className="button button-red order-choice-continue" disabled={!draft} onClick={() => { if (draft) { setOrderType(draft); setStage("hidden"); } }}>Continue with {draft || "your choice"} ↗</button>
  </section></div>;
}
