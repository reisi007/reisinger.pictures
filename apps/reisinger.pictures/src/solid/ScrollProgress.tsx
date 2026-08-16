import { onCleanup, onMount } from "solid-js";

const START_THRESHOLD = 0.1;

export default function ScrollProgress() {
  let fillRef: HTMLDivElement | undefined;

  const compute = () => {
    if (!fillRef) return;
    const doc = document.documentElement;
    const maxScroll = Math.max(0, doc.scrollHeight - window.innerHeight);
    const scrolled = window.scrollY || doc.scrollTop || 0;
    const raw = maxScroll > 0 ? scrolled / maxScroll : 0;
    const progress = Math.min(1, Math.max(0, (raw - START_THRESHOLD) / (1 - START_THRESHOLD)));
    fillRef.style.width = `${progress * 100}%`;
  };

  onMount(() => {
    let ticking = false;
    const request = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        compute();
        ticking = false;
      });
    };

    compute();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    document.addEventListener("astro:page-load", request);

    onCleanup(() => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      document.removeEventListener("astro:page-load", request);
    });
  });

  return (
    <div class="scroll-progress-track" aria-hidden="true">
      <div ref={(el) => (fillRef = el)} class="scroll-progress-fill"></div>
    </div>
  );
}
