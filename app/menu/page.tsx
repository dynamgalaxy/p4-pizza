import { Suspense } from "react";
import MenuContent from "./MenuContent";

export default function MenuPage() {
  return <><section className="page-heading"><div className="container" data-reveal><span className="eyebrow">All your favorites</span><h1>The menu.</h1><p>Pick your craving. Make it yours.</p></div></section><Suspense><MenuContent /></Suspense></>;
}
