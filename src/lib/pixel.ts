/**
 * Meta Pixel (Facebook Pixel) typed utility
 * Centralises all fbq() calls so events are consistent and type-safe.
 *
 * The Pixel ID is defined at build time via vite.config.ts → define.__META_PIXEL_ID__.
 * Override by setting VITE_META_PIXEL_ID in your environment before building.
 *
 * The base fbq() IIFE loader + noscript fallback remain in index.html for
 * no-JS users. JS init is handled here so the ID lives in one configurable place.
 */

declare const __META_PIXEL_ID__: string;

// Extend the global Window type so TypeScript knows fbq exists
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
  }
}

const PIXEL_ID = __META_PIXEL_ID__;

const fbq = (...args: unknown[]) => {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq(...args);
  }
};

/** Call once at app startup (main.tsx) — initialises the pixel with the configured ID. */
export const pixelInit = () => {
  fbq('init', PIXEL_ID);
};

// ─── Standard Events ──────────────────────────────────────────────────────────

export const pixelPageView = () => {
  fbq('track', 'PageView');
};

export const pixelViewContent = (params: {
  content_ids: string[];
  content_name: string;
  value: number;
  currency?: string;
}) => {
  fbq('track', 'ViewContent', {
    content_ids: params.content_ids,
    content_type: 'product',
    content_name: params.content_name,
    value: params.value,
    currency: params.currency ?? 'EGP',
  });
};

export const pixelAddToCart = (params: {
  content_id: string;
  content_name: string;
  value: number;
  currency?: string;
}) => {
  fbq('track', 'AddToCart', {
    content_ids: [params.content_id],
    content_type: 'product',
    content_name: params.content_name,
    value: params.value,
    currency: params.currency ?? 'EGP',
  });
};

export const pixelInitiateCheckout = (params: {
  content_ids: string[];
  num_items: number;
  value: number;
  currency?: string;
}) => {
  fbq('track', 'InitiateCheckout', {
    content_ids: params.content_ids,
    content_type: 'product',
    num_items: params.num_items,
    value: params.value,
    currency: params.currency ?? 'EGP',
  });
};

export const pixelPurchase = (params: {
  content_ids: string[];
  num_items: number;
  value: number;
  order_id?: string;
  currency?: string;
}) => {
  fbq('track', 'Purchase', {
    content_ids: params.content_ids,
    content_type: 'product',
    num_items: params.num_items,
    value: params.value,
    order_id: params.order_id,
    currency: params.currency ?? 'EGP',
  });
};

export const pixelLead = (params: { content_name: string; content_category?: string }) => {
  fbq('track', 'Lead', {
    content_name: params.content_name,
    content_category: params.content_category ?? 'restock_waitlist',
  });
};
