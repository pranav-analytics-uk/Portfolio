import { Download } from 'lucide-react';
import { PROFILE, asset } from '../data';
import { track } from '../analytics';

/** Ghost "Download CV" pill. Renders nothing until PROFILE.cv points at a PDF in public/. */
export default function CvButton({ placement }: { placement: string }) {
  if (!PROFILE.cv) return null;
  return (
    <a
      href={asset(PROFILE.cv)}
      download
      onClick={() => track('cv_download', { placement })}
      className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border-2 border-[#D7E2EA] px-6 py-2.5 text-xs font-medium uppercase tracking-widest text-[#D7E2EA] transition-colors duration-200 hover:bg-[#D7E2EA]/10 sm:px-8 sm:py-3 sm:text-sm md:px-10 md:py-3.5 md:text-base"
    >
      <Download className="h-4 w-4" />
      Download CV
    </a>
  );
}
