export type TrackPayload = Record<string, string | number | boolean>;

type TrackEventFn = (name: string, payload?: TrackPayload) => void;

declare global {
  var trackEvent: TrackEventFn | undefined;
}

export function trackEvent(name: string, payload?: TrackPayload): void {
  window.trackEvent?.(name, payload);
}
