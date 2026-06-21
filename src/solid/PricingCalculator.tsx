import { createMemo, createSignal, For, Show } from "solid-js";
import { calculatePackagePrice, basePrice as b2bBasePrice, flatrateMultiplier } from "../content/pricing";
import { formatPsychologicalPrice } from "../utils";

interface PricingCalculatorProps {
  variant?: "b2c" | "b2b" | "og";
}

const baseFeatures = ["Volle Flexibilität und Kostenkontrolle"];
const standardFeatures = ["Redaktionelle kommerzielle Nutzungsrechte inklusive"];
const discountFeatures: string[] = [];
const standardFooters = ["Höchste Diskretion & Vertrauen inklusive"];
const discountFooters = ["Voraussetzung: Veröffentlichung der Bilder"];

const b2bFeatures = [
  "Inklusive professioneller Bildbearbeitung",
  "Live-Delivery via IPTC-Portal zubuchbar",
  "Volle Nutzungsrechte für gewerbliche Presse & PR",
  "Verlässliche Next-Day-Ready Lieferung"
];

export default function PricingCalculator(props: PricingCalculatorProps) {
  const isB2B = () => props.variant === "b2b";
  const isOG = () => props.variant === "og";

  // OG-spezifischer Switch: "session" (Kreativ/Shooting) vs "reportage" (Dokumentation/Begleitung)
  const [ogType, setOgType] = createSignal<"session" | "reportage">("session");

  // Standard B2C / OG-Session Signals
  const [duration, setDuration] = createSignal(90);
  const [images, setImages] = createSignal(10);
  
  // B2B & OG-Reportage Stunden-Signal
  const [hours, setHours] = createSignal(4);
  
  const [isDiscounted, setIsDiscounted] = createSignal(false);
  const [isCopied, setIsCopied] = createSignal(false);

  // Diskrete Preisberechnung ohne prozentuale Leaks nach außen
  const finalPrice = createMemo(() => {
    if (isB2B()) {
      const hourlyRate = 120;
      return b2bBasePrice + (hours() * hourlyRate);
    }
    
    if (isOG()) {
      if (ogType() === "reportage") {
        // Diskreter Reportagen-Tarif für OGs (Kalkulation über flatrateMultiplier)
        return calculatePackagePrice(hours() * 60, 0, flatrateMultiplier * (2 / 3));
      }
      // Reiner Session-Tarif für OGs
      return calculatePackagePrice(duration(), images(), 0.5);
    }
    
    // Normaler B2C Modus mit optionalem NextGen-Rabatt
    const multiplier = isDiscounted() ? 0.6667 : 1;
    return calculatePackagePrice(duration(), images(), multiplier);
  });

  const basePriceValue = createMemo(() => {
    if (isB2B()) return finalPrice();
    if (isOG() && ogType() === "reportage") return calculatePackagePrice(hours() * 60, 0, flatrateMultiplier);
    return calculatePackagePrice(duration(), images(), 1);
  });

  const formattedBasePrice = createMemo(() => formatPsychologicalPrice(basePriceValue()));
  const formattedFinalPrice = createMemo(() => formatPsychologicalPrice(finalPrice()));

  const contactLink = createMemo(() => {
    let text = "";
    let prefix = "";
    
    if (isB2B()) {
      prefix = "subject_prefix=BUSINESS&";
      const durationText = hours() >= 8 ? "Ganztages-Reportage (8h+)" : `${hours()} Stunden`;
      text = `Hallo Florian,\n\nich interessiere mich für eine Business-Fotoproduktion / Event-Begleitung:\n\n- Geplanter Umfang: ${durationText}\n- Kalkulierter Richtpreis: ${formattedFinalPrice()}\n\nLass uns gerne unverbindlich über die Details sprechen!\n\nLiebe Grüße,\n`;
    } else if (isOG()) {
      const details = ogType() === "session" 
        ? `- Art: Shooting Session\n- Dauer: ${duration()} Minuten\n- Bilder: ${images()} Stück`
        : `- Art: Reportage & Begleitung\n- Umfang: ${hours()} Stunden`;
      text = `Hallo Florian,\n\nals OG habe ich mir ein individuelles Paket konfiguriert:\n\n${details}\n- Kalkulierter Vorzugspreis: ${formattedFinalPrice()}\n\nLass uns das Projekt anpacken!\n\nLiebe Grüße,\n`;
    } else {
      text = `Hallo Florian,\n\nich habe mir mit deinem Konfigurator ein individuelles Shooting-Paket zusammengestellt:\n\n- Shooting-Zeit: ${duration()} Minuten\n- Bearbeitete Bilder: ${images()} Stück\n- Sonderkonditionen aktiv: ${isDiscounted() ? "Ja" : "Nein"}\n\nKalkulierter Preis: ${formattedFinalPrice()}\n\nLass uns gerne unverbindlich darüber sprechen!\n\nLiebe Grüße,\n`;
    }
    
    return `?${prefix}message=${encodeURIComponent(text)}#kontakt`;
  });

  const handleCopyOffer = async () => {
    let offerText = "";
    if (isB2B()) {
      offerText = `Business-Konfiguration:\n- Dauer: ${hours()} Stunden\nRichtpreis: ${formattedFinalPrice()}`;
    } else if (isOG()) {
      offerText = ogType() === "session"
        ? `OG-Shooting:\n- ${duration()} Min.\n- ${images()} Bilder\nSonderkonditionen aktiv: ${formattedFinalPrice()}`
        : `OG-Begleitung:\n- ${hours()} Std.\nSonderkonditionen aktiv: ${formattedFinalPrice()}`;
    } else {
      offerText = `Individuelles Angebot:\n- ${duration()} Min.\n- ${images()} Bilder\nPreis: ${formattedFinalPrice()}`;
    }
    try {
      await navigator.clipboard.writeText(offerText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div class={`card shadow-xl relative overflow-hidden border border-base-300 h-full transition-transform ${
      "bg-base-100 text-base-content"
    }`}>
      <div class="card-body p-8 flex flex-col h-full">
        <div class="text-center mb-4">
          <h2 class="text-3xl font-black uppercase tracking-wide mb-2 text-primary">
            {isB2B() ? "Budget Kalkulator" : "Dein individuelles Paket"}
          </h2>
          <p class="opacity-80 text-sm font-medium">
            {isB2B() ? "Schnelle Einschätzung für Events & Corporate" : "Stelle dir dein eigenes Projekt exakt nach deinen Bedürfnissen zusammen."}
          </p>
        </div>
        
        {/* DISKRETER SWAP-SWITCH NUR FÜR OGs */}
        <Show when={isOG()}>
          <div class="tabs tabs-boxed justify-center mb-6 bg-base-200 p-1 rounded-xl max-w-md mx-auto w-full">
            <button 
              class={`tab text-xs font-bold uppercase tracking-wider px-6 transition-all ${ogType() === "session" ? "tab-active bg-primary text-white rounded-lg shadow" : ""}`}
              onClick={() => setOgType("session")}
            >
              Shooting Session
            </button>
            <button 
              class={`tab text-xs font-bold uppercase tracking-wider px-6 transition-all ${ogType() === "reportage" ? "tab-active bg-primary text-white rounded-lg shadow" : ""}`}
              onClick={() => setOgType("reportage")}
            >
              Reportage & Begleitung
            </button>
          </div>
        </Show>

        <div class="divider opacity-10 my-0"></div>
        
        <div class="flex flex-col items-center justify-center my-6 min-h-24">
          <Show when={finalPrice() < basePriceValue()}>
            <span class="text-lg line-through text-primary opacity-40 decoration-1 mb-1">
              {formattedBasePrice()}
            </span>
          </Show>
          <span class="text-5xl font-black text-center tracking-tight">
            {formattedFinalPrice()}
          </span>
          <Show when={isB2B()}>
            <p class="text-xs opacity-60 mt-2 uppercase tracking-widest font-bold">Unverbindlicher Richtpreis</p>
          </Show>
        </div>

        <div class="space-y-6 mb-2 w-full max-w-sm mx-auto">
          {/* INTERFACE FÜR STUNDEN (B2B ODER OG-REPORTAGE) */}
          <Show when={isB2B() || (isOG() && ogType() === "reportage")}>
            <div>
              <label class="label pb-2 flex justify-between">
                <span class="label-text font-bold">Geschätzte Dauer:</span>
                <span class="label-text font-bold text-primary">{hours() >= 8 ? "8+ Stunden (Ganztag)" : `${hours()} Stunden`}</span>
              </label>
              <input
                type="range" min="2" max="8" step="1"
                value={hours()}
                onInput={(e) => setHours(parseInt(e.currentTarget.value))}
                class="range range-primary range-sm"
              />
              <div class="w-full flex justify-between text-[10px] px-1 mt-1 opacity-60 font-bold uppercase text-base-content/70">
                <span>2h (Min)</span>
                <span>4h (Halbtag)</span>
                <span>8h+ (Ganztag)</span>
              </div>
            </div>
          </Show>

          {/* INTERFACE FÜR SESSIONS (B2C ODER OG-SESSION) */}
          <Show when={!isB2B() && (!isOG() || ogType() === "session")}>
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

            <Show when={props.variant === "b2c" || !props.variant}>
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
            </Show>
          </Show>
        </div>

        <ul class="space-y-3 mt-6">
          <For each={isB2B() ? b2bFeatures : (isOG() || isDiscounted() ? [...baseFeatures, ...discountFeatures] : [...baseFeatures, ...standardFeatures])}>
            {(feature) => (
              <li class="flex items-start gap-3">
                <span class="size-6 shrink-0 rounded-full flex items-center justify-center text-xs mt-0.5 bg-primary/10 text-primary">
                  <span class="icon-[mdi--check]"></span>
                </span>
                <span class="font-medium text-sm leading-6">{feature}</span>
              </li>
            )}
          </For>
        </ul>

        <div class="mt-6 mb-2 gap-y-2 flex flex-col">
          <Show when={isB2B()}>
            <div class="mt-auto bg-base-300/20 p-4 rounded-xl text-xs opacity-80 text-center leading-relaxed ">
              Jedes Projekt ist einzigartig. Dieser Kalkulator dient als erster Richtwert. Den finalen Preis besprechen wir transparent im Erstgespräch.
            </div>
          </Show>
          <Show when={!isB2B()}>
            <For each={isOG() ? ["OG Sonderkonditionen aktiv"] : (isDiscounted() ? discountFooters : standardFooters)}>
              {(footer) => (
                <div class="border-base-300 border grid grid-cols-8 gap-x-2 items-center text-xs font-bold opacity-70 py-2 rounded-lg justify-center px-3">
                  <span class="icon-[mdi--information-outline] text-lg text-center"></span>
                  <span class="col-span-7">{footer}</span>
                </div>
              )}
            </For>
          </Show>
        </div>

        <div class="card-actions mt-auto pt-4 border-t border-base-300 border-opacity-50 flex-col gap-3">
          <button
            onClick={handleCopyOffer}
            class="btn btn-block btn-outline border-base-300 hover:bg-base-200"
          >
            <span class={isCopied() ? "icon-[mdi--check] text-success" : "icon-[mdi--content-copy]"}></span>
            {isCopied() ? "Konfiguration kopiert!" : "Als Text kopieren"}
          </button>
          <a href={contactLink()} class="btn btn-block shadow-lg border-0 btn-primary text-white">
            {isB2B() ? "Individuelles Angebot anfragen" : "Jetzt kontaktieren"}
          </a>
        </div>
      </div>
    </div>
  );
}