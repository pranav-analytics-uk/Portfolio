// Google Analytics 4 with consent (UK GDPR / PECR).
// Nothing from Google loads until the visitor accepts; "Reject" means no tracking at all.
import { ANALYTICS_ID } from './data';

type Choice = 'granted' | 'denied';
const STORAGE_KEY = 'pr-cookie-consent';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const analyticsEnabled = Boolean(ANALYTICS_ID);

export function storedChoice(): Choice | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
}

let loaded = false;

function loadGoogleAnalytics() {
  if (loaded || !ANALYTICS_ID) return;
  loaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag.js expects the arguments object itself
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  // Consent Mode v2: analytics allowed (the visitor accepted), ads signals stay off.
  window.gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  window.gtag('js', new Date());
  window.gtag('config', ANALYTICS_ID, { anonymize_ip: true });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`;
  document.head.appendChild(s);
}

export function setChoice(choice: Choice) {
  try {
    localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    // Private mode etc.: the choice just won't be remembered
  }
  if (choice === 'granted') loadGoogleAnalytics();
  else if (loaded) {
    window.gtag?.('consent', 'update', { analytics_storage: 'denied' });
  }
}

export function initAnalytics() {
  if (storedChoice() === 'granted') loadGoogleAnalytics();
}

/** Record a key action (CV download, contact click…). No-op without consent. */
export function track(event: string, params: Record<string, string> = {}) {
  if (loaded) window.gtag?.('event', event, params);
}
