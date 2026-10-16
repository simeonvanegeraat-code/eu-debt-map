"use client";

export default function ExploreDataLink({ children }) {
  function highlightResources(event) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!window.matchMedia("(min-width: 981px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = document.getElementById("explore-data");
    if (!target) return;

    // Restart the single light sweep even when the anchor is already selected.
    target.getAnimations().forEach((animation) => animation.cancel());
    target.animate(
      [
        { "--article-glow-angle": "0deg", opacity: 0, offset: 0 },
        { "--article-glow-angle": "25deg", opacity: 1, offset: 0.08 },
        { "--article-glow-angle": "335deg", opacity: 1, offset: 0.92 },
        { "--article-glow-angle": "360deg", opacity: 0, offset: 1 },
      ],
      { duration: 1800, easing: "linear", pseudoElement: "::after" }
    );
  }

  return <a href="#explore-data" onClick={highlightResources}>{children}</a>;
}
