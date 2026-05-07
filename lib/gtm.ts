type GtmPayload = Record<string, string | number | boolean | undefined | null>;

export function pushEvent(event: string, payload?: GtmPayload): void {
  if (typeof window === "undefined") return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ((window as any).dataLayer = (window as any).dataLayer || []).push({ event, ...payload });
}
