// Google Analytics 4 + Consent Mode v2 (UK GDPR / PECR), following Pranav's GA4 setup guide.
//
// - gtag.js loads on every visit with consent DEFAULTED TO DENIED, so no cookies are set
//   until the visitor accepts (Google may still receive cookieless pings, which it uses
//   for modelling; that's standard "advanced" Consent Mode).
// - Accept → analytics AND ads signals granted (needed later for Google Ads measurement).
// - Decline → everything stays denied.
// - Key actions are sent with the guide's event names (see trackLinkClicks / trackFullView).
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

const ALL_GRANTED = {
  analytics_storage: 'granted',
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
};
const ALL_DENIED = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
};

function loadGoogleTag() {
  if (!ANALYTICS_ID || window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag.js expects the arguments object itself
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  // Must be set before 'config' so the first page view respects the visitor's choice
  window.gtag('consent', 'default', storedChoice() === 'granted' ? ALL_GRANTED : ALL_DENIED);
  window.gtag('js', new Date());
  window.gtag('config', ANALYTICS_ID);
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
  window.gtag?.('consent', 'update', choice === 'granted' ? ALL_GRANTED : ALL_DENIED);
}

/** Send a GA4 event (no-op when analytics isn't configured). */
export function track(event: string, params: Record<string, string> = {}) {
  window.gtag?.('event', event, params);
}

// Guide: CV, contact and work-link clicks, detected from the link itself
function trackLinkClicks() {
  document.addEventListener(
    'click',
    (e) => {
      const a = (e.target as HTMLElement | null)?.closest('a');
      if (!a) return;
      const h = a.href || '';
      const t = (a.innerText || '').trim().slice(0, 60);
      let ev: string | null = null;
      if (h.endsWith('.pdf')) ev = 'cv_download';
      else if (h.startsWith('mailto:')) ev = 'contact_email';
      else if (h.startsWith('tel:')) ev = 'contact_phone';
      else if (h.includes('linkedin.com')) ev = 'contact_linkedin';
      else if (h.includes('instagram.com')) ev = 'work_click_instagram';
      else if (h.includes('youtube.com') || h.includes('youtu.be')) ev = 'work_click_youtube';
      if (ev) track(ev, { link_text: t, link_url: h });
    },
    true,
  );
}

// Guide: "saw the whole website" = reached the Contact section
function trackFullView() {
  const start = () => {
    const target = document.getElementById('contact');
    if (!target) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          track('viewed_full_site');
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(target);
  };
  // React renders after this runs, so wait for the page to be built
  if (document.readyState === 'complete') setTimeout(start, 0);
  else window.addEventListener('load', start, { once: true });
}

export function initAnalytics() {
  if (!ANALYTICS_ID) return;
  loadGoogleTag();
  trackLinkClicks();
  trackFullView();
}
