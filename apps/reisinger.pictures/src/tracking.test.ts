import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { trackEvent } from "./tracking";

describe("trackEvent", () => {
  const originalTrackEvent = window.trackEvent;

  beforeEach(() => {
    window.trackEvent = undefined;
  });

  afterEach(() => {
    window.trackEvent = originalTrackEvent;
  });

  it("forwards the event name and payload to the tracker", () => {
    const tracker = vi.fn();
    window.trackEvent = tracker;

    trackEvent("custom_event", { key: "value", count: 3 });

    expect(tracker).toHaveBeenCalledWith("custom_event", { key: "value", count: 3 });
  });

  it("forwards only the name when no payload is given", () => {
    const tracker = vi.fn();
    window.trackEvent = tracker;

    trackEvent("custom_event");

    expect(tracker).toHaveBeenCalledWith("custom_event", undefined);
  });

  it("is a no-op when the tracker is not available", () => {
    expect(() => trackEvent("custom_event", { key: "value" })).not.toThrow();
  });
});
