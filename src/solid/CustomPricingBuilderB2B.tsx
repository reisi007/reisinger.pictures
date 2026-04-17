import { createMemo, createSignal, For } from "solid-js";

import { basePrice } from "../content/pricing";
import { formatPsychologicalPrice } from "../utils";

const b2bFeatures = [
  "Inklusive professioneller Bildbearbeitung",
  "Live-Delivery via IPTC-Portal zubuchbar",
  "Volle Nutzungsrechte für gewerbliche Presse & PR",
  "Verlässliche Next-Day-Ready Lieferung"
];

export default function CustomPricingBuilderB2B() {
  // Wir setzen 4 Stunden (Halbtag) als Standard, da das im B2B ein gängiger Einstieg ist.
  const [hours, setHours] = createSignal(4);

  // Einfache B2B-Logik: 120€ pro Stunde
  const hourlyRate = 120;
  const price = createMemo(() => basePrice + (hours() * hourlyRate));

  const contactLink = createMemo(() => {
    const durationText = hours() >= 8 ? 'Ganztages-Reportage (8h+)' : `${hours()} Stunden`;
    const text = `Hallo Florian,\n\nich interessiere mich für eine Business-Fotoproduktion / Event-Begleitung:\n\n- Geplanter Umfang: ${durationText}\n- Kalkulierter Richtpreis: ${formatPsychologicalPrice(price())}\n\nLass uns gerne unverbindlich über die Details sprechen!\n\nLiebe Grüße,\n`;
    
    return `?subject_prefix=BUSINESS&message=${encodeURIComponent(text)}#kontakt`;
  });

  return (
    <div class="card shadow-xl bg-neutral text-neutral-content border border-base-300 h-full transition-transform hover:-translate-y-1 md:col-span-2 block">
      <div class="card-body p-8">
        <div class="text-center mb-6">
          <h2 class="text-3xl font-black uppercase tracking-wide mb-2 text-primary">Budget Kalkulator</h2>
          <p class="opacity-80 text-sm font-medium">Schnelle Einschätzung für Events & Corporate</p>
        </div>
        
        <div class="flex flex-col items-center justify-center my-6 min-h-20">
          <span class="text-5xl font-black text-center tracking-tight">
            {formatPsychologicalPrice(price())}
          </span>
          <p class="text-xs opacity-60 mt-2 uppercase tracking-widest font-bold">Unverbindlicher Richtpreis</p>
        </div>

        <div class="space-y-8 mb-8 w-full max-w-sm mx-auto">
          <div>
            <label class="label pb-2 flex justify-between">
              <span class="label-text font-bold">Geschätzte Dauer:</span>
              <span class="label-text font-bold text-primary">{hours() >= 8 ? '8+ Stunden (Ganztag)' : `${hours()} Stunden`}</span>
            </label>
            <input 
              type="range" 
              min="2" 
              max="8" 
              step="1" 
              value={hours()} 
              onInput={(e) => setHours(parseInt(e.currentTarget.value))} 
              class="range range-primary range-sm" 
            />
            <div class="w-full flex justify-between text-[10px] px-1 mt-1 opacity-50 font-bold uppercase">
              <span>2h (Minimum)</span>
              <span>4h (Halbtag)</span>
              <span>8h+ (Ganztag)</span>
            </div>
          </div>
        </div>

        <ul class="space-y-3 mb-8">
          <For each={b2bFeatures}>{(f) => (
            <li class="flex items-start gap-3">
              <span class="size-6 shrink-0 rounded-full flex items-center justify-center text-xs mt-0.5 bg-primary/20 text-primary">
                <span class="icon-[mdi--check]"></span>
              </span>
              <span class="font-medium text-sm leading-6">{f}</span>
            </li>
          )}</For>
        </ul>

        <div class="mt-auto bg-base-300/20 p-4 rounded-xl text-xs opacity-80 mb-6 text-center leading-relaxed">
          Jedes Projekt ist einzigartig. Dieser Kalkulator dient als erster Richtwert. Den finalen Preis (inkl. Spesen oder speziellen Setups) besprechen wir transparent im Erstgespräch.
        </div>

        <div class="card-actions">
          <a href={contactLink()} class="btn btn-primary btn-block shadow-lg border-0">Individuelles Angebot anfragen</a>
        </div>
      </div>
    </div>
  );
}
