import { useEffect, useState } from 'react';
import { analyticsEnabled, setChoice, storedChoice } from '../analytics';

/** Small bottom banner asking for analytics consent. Hidden when analytics is off or already answered. */
export default function ConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (analyticsEnabled && storedChoice() === null) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener('open-cookie-settings', reopen);
    return () => window.removeEventListener('open-cookie-settings', reopen);
  }, []);

  if (!open) return null;

  const choose = (c: 'granted' | 'denied') => {
    setChoice(c);
    setOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-2xl flex-col gap-4 rounded-[24px] border border-[#D7E2EA]/25 bg-[#141414]/95 p-5 text-[#D7E2EA] shadow-2xl backdrop-blur sm:bottom-5 sm:flex-row sm:items-center sm:p-6"
    >
      <p className="flex-1 text-sm font-light leading-relaxed">
        This site uses cookies (Google Analytics and Google Ads) to see how visitors use it and to measure ads. No cookies are set unless you accept.
      </p>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={() => choose('denied')}
          className="flex-1 rounded-full border-2 border-[#D7E2EA]/60 px-5 py-2.5 text-xs font-medium uppercase tracking-widest transition-colors hover:bg-[#D7E2EA]/10 sm:flex-none"
        >
          Decline
        </button>
        <button
          type="button"
          onClick={() => choose('granted')}
          className="flex-1 rounded-full bg-[#D7E2EA] px-5 py-2.5 text-xs font-medium uppercase tracking-widest text-[#0C0C0C] transition-opacity hover:opacity-90 sm:flex-none"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
