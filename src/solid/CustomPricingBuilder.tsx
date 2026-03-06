import { createMemo, createSignal, For,Show } from "solid-js";

import { calculatePackagePrice } from "../content/pricing";
import { formatPsychologicalPrice } from "../utils";

// Konfiguration der Texte
const baseFeatures = [
  "Volle Flexibilität und Kostenkontrolle"
];

const standardFeatures = [
  "Redaktionelle kommerzielle Nutzungsrechte inklusive"
];

const discountFeatures: string[] = [
];

const standardFooters = [
  "Höchste Diskretion & Vertrauen inklusive"
];

const discountFooters = [
  "Voraussetzung: Veröffentlichung der Bilder",
  "Gilt nur für Beauty, Pärchen & Akt Shootings"
];

export default function CustomPricingBuilder() {
  const [duration, setDuration] = createSignal(90);
  const [images, setImages] = createSignal(10);
  const [isDiscounted, setIsDiscounted] = createSignal(false);
  const [isCopied, setIsCopied] = createSignal(false);

  const basePrice = createMemo(() => calculatePackagePrice(duration(), images()));
  const finalPrice = createMemo(() => calculatePackagePrice(duration(), images(), isDiscounted() ? 0.5 : 1));

  const formattedBasePrice = createMemo(() => formatPsychologicalPrice(basePrice()));
  const formattedFinalPrice = createMemo(() => formatPsychologicalPrice(finalPrice()));

  // Function to copy the current configuration to clipboard
  const handleCopyOffer = async () => {
    const offerText = `Dein Individuelles Angebot für:\n- ${duration()} Minuten\n- ${images()} bearbeitete Bilder\n- N*xt Generation Rabatt (18-25 Jahre): ${isDiscounted() ? 'Ja' : 'Nein'}\n\nPreis: ${formattedFinalPrice()}`;

    try {
      await navigator.clipboard.writeText(offerText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div class="card shadow-xl relative overflow-hidden bg-base-100 text-base-content border border-base-300 h-full transition-transform hover:-translate-y-1 md:col-span-2 block">
      <div class="card-body p-8 flex flex-col h-full">
        <div class="text-center mb-6">
          <h2 class="text-3xl font-black uppercase tracking-wide mb-2 text-primary">
            Dein individuelles Paket
          </h2>
          <p class="opacity-80 text-sm font-medium">
            Stelle dir dein eigenes Shooting exakt nach deinen Bedürfnissen zusammen.
          </p>
        </div>

        <div class="divider opacity-20 my-0"></div>

        <div class="flex flex-col items-center justify-center my-6 min-h-24">
          <Show when={isDiscounted()}>
            <span class="text-lg line-through text-primary opacity-40 decoration-1 mb-1">
              {formattedBasePrice()}
            </span>
          </Show>
          <span class="text-5xl font-black text-center tracking-tight text-base-content">
            {formattedFinalPrice()}
          </span>
        </div>

        <div class="space-y-6 mb-2 w-full max-w-sm mx-auto">
          <div>
            <label class="label pb-1">
              <span class="label-text font-bold">Shooting-Zeit: {duration()} Minuten</span>
            </label>
            <input
              type="range" min="60" max="480" step="30"
              value={duration()}
              onInput={(e) => setDuration(parseInt(e.currentTarget.value))}
              class="range range-primary range-sm"
            />
            <div class="w-full flex justify-between text-xs px-1 mt-1 opacity-50 font-medium">
              <span>1 Std</span>
              <span>8 Std</span>
            </div>
          </div>

          <div>
            <label class="label pb-1">
              <span class="label-text font-bold">Bearbeitete Bilder: {images()} Stück</span>
            </label>
            <input
              type="range" min="3" max="120" step="1"
              value={images()}
              onInput={(e) => setImages(parseInt(e.currentTarget.value))}
              class="range range-primary range-sm"
            />
            <div class="w-full flex justify-between text-xs px-1 mt-1 opacity-50 font-medium">
              <span>3</span>
              <span>120</span>
            </div>
          </div>

          <div class="form-control w-full mt-4">
            <label class="cursor-pointer label border border-base-300 rounded-xl px-4 py-3 bg-base-100/50 hover:bg-base-200 transition-colors flex justify-between gap-4">
              <span class="label-text font-medium opacity-80">Ich bin zwischen 18 und 25 Jahre alt</span>
              <input
                type="checkbox"
                checked={isDiscounted()}
                onChange={(e) => setIsDiscounted(e.currentTarget.checked)}
                class="toggle toggle-primary toggle-sm"
              />
            </label>
          </div>
        </div>

        <ul class="space-y-3 mt-6">
          <For each={baseFeatures}>{(feature) => (
            <li class="flex items-start gap-3">
              <span class="size-6 shrink-0 rounded-full flex items-center justify-center text-xs mt-0.5 bg-primary/10 text-primary">
                <span class="mdi--check"></span>
              </span>
              <span class="font-medium text-sm leading-6">{feature}</span>
            </li>
          )}</For>

          <Show
            when={isDiscounted()}
            fallback={
              <For each={standardFeatures}>{(feature) => (
                <li class="flex items-start gap-3">
                  <span class="size-6 shrink-0 rounded-full flex items-center justify-center text-xs mt-0.5 bg-primary/10 text-primary">
                    <span class="mdi--check"></span>
                  </span>
                  <span class="font-medium text-sm leading-6">{feature}</span>
                </li>
              )}</For>
            }
          >
            <For each={discountFeatures}>{(feature) => (
              <li class="flex items-start gap-3">
                <span class="size-6 shrink-0 rounded-full flex items-center justify-center text-xs mt-0.5 bg-primary/10 text-primary">
                  <span class="mdi--check"></span>
                </span>
                <span class="font-medium text-sm leading-6">{feature}</span>
              </li>
            )}</For>
          </Show>
        </ul>

        <div class="mt-6 mb-2 gap-y-2 flex flex-col">
          <Show
            when={isDiscounted()}
            fallback={
              <For each={standardFooters}>{(footer) => (
                <div class="border-base-300 border grid grid-cols-8 gap-x-2 items-center text-xs font-bold opacity-70 py-2 rounded-lg justify-center px-3">
                  <span class="mdi--information-outline text-lg text-center"></span>
                  <span class="col-span-7">{footer}</span>
                </div>
              )}</For>
            }
          >
            <For each={discountFooters}>{(footer) => (
              <div class="border-base-300 border grid grid-cols-8 gap-x-2 items-center text-xs font-bold opacity-70 py-2 rounded-lg justify-center px-3">
                <span class="mdi--information-outline text-lg text-center"></span>
                <span class="col-span-7">{footer}</span>
              </div>
            )}</For>
          </Show>
        </div>

        <div class="card-actions mt-auto pt-4 border-t border-base-300 border-opacity-50 flex-col gap-3">
          <button
            onClick={handleCopyOffer}
            class="btn btn-block btn-outline border-base-300 hover:bg-base-200 hover:text-base-content hover:border-base-300"
          >
            <span class={isCopied() ? "mdi--check text-success" : "mdi--content-copy"}></span>
            {isCopied() ? "Angebot kopiert!" : "Angebot als Text kopieren"}
          </button>

          <a href="#kontakt" class="btn btn-block shadow-lg border-0 btn-primary">
            Jetzt kontaktieren
          </a>
        </div>
      </div>
    </div>
  );
}