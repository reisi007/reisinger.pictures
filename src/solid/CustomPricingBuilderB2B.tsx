import { createMemo, createSignal, For, Show } from "solid-js";
import { calculatePackagePrice, flatrateMultiplier } from "../content/pricing";
import { formatPsychologicalPrice } from "../utils";

const b2bFeatures = [
  "Live-Delivery via IPTC-Portal inklusive",
  "Nutzungsrechte für gewerbliche Presse & PR",
  "Priorisierte Bearbeitung (Next-Day-Ready)",
  "Professionelles Licht-Equipment vor Ort"
];

export default function CustomPricingBuilderB2B() {
  const [hours, setHours] = createSignal(4);
  const [isFullDayFlat, setIsFullDayFlat] = createSignal(false);

  const price = createMemo(() => {
    const durationMinutes = (isFullDayFlat() ? 8 : hours()) * 60;
    return calculatePackagePrice(durationMinutes, 0, flatrateMultiplier + 0.3);
  });

  const contactLink = createMemo(() => {
    const text = "Hallo Florian,\n\nich interessiere mich für eine Business-Begleitung:\n- Umfang: " + (isFullDayFlat() ? 'Ganztages-Flatrate' : hours() + ' Stunden') + "\n- Kalkulierter Richtpreis: " + formatPsychologicalPrice(price()) + "\n\nBitte um ein unverbindliches Angebot!\n\nLiebe Grüße,\n";
    return "?subject_prefix=BUSINESS&message=" + encodeURIComponent(text) + "#kontakt";
  });

  return (
    <div class="card shadow-xl bg-neutral text-neutral-content border border-base-300 h-full transition-transform hover:-translate-y-1 md:col-span-2 block">
      <div class="card-body p-8">
        <div class="text-center mb-6">
          <h2 class="text-3xl font-black uppercase tracking-wide mb-2 text-primary">B2B Content Kalkulator</h2>
          <p class="opacity-80 text-sm font-medium text-white">Event-Begleitung & Corporate Reportagen</p>
        </div>
        
        <div class="flex flex-col items-center justify-center my-6 min-h-20">
          <span class="text-5xl font-black text-center tracking-tight text-white">
            {formatPsychologicalPrice(price())}
          </span>
          <p class="text-xs opacity-60 mt-2 uppercase tracking-widest font-bold">Unverbindlicher Richtpreis exkl. MwSt.</p>
        </div>

        <div class="space-y-8 mb-8 w-full max-w-sm mx-auto">
          <div class="form-control">
            <label class="cursor-pointer label border border-white/20 rounded-xl px-4 py-4 bg-white/5 hover:bg-white/10 transition-colors">
              <span class="label-text font-bold text-white">Ganztages-Flatrate (8h+)</span>
              <input type="checkbox" checked={isFullDayFlat()} onChange={(e) => setIsFullDayFlat(e.currentTarget.checked)} class="toggle toggle-primary" />
            </label>
          </div>

          <Show when={!isFullDayFlat()}>
            <div>
              <label class="label pb-1"><span class="label-text font-bold text-white">Dauer: {hours()} Stunden</span></label>
              <input type="range" min="1" max="6" step="1" value={hours()} onInput={(e) => setHours(parseInt(e.currentTarget.value))} class="range range-primary range-sm" />
              <div class="w-full flex justify-between text-[10px] px-1 mt-1 opacity-50 font-bold uppercase">
                <span>1h</span><span>6h</span>
              </div>
            </div>
          </Show>
        </div>

        <ul class="space-y-3 mb-8">
          <For each={b2bFeatures}>{(f) => (
            <li class="flex items-start gap-3">
              <span class="size-6 shrink-0 rounded-full flex items-center justify-center text-xs mt-0.5 bg-primary/20 text-primary">
                <span class="mdi--check"></span>
              </span>
              <span class="font-medium text-sm leading-6 text-white/90">{f}</span>
            </li>
          )}</For>
        </ul>

        <div class="card-actions mt-auto">
          <a href={contactLink()} class="btn btn-primary btn-block shadow-lg border-0">Individuelles Angebot anfragen</a>
        </div>
      </div>
    </div>
  );
}