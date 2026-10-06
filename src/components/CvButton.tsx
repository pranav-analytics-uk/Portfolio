import { Download } from 'lucide-react';
import { PROFILE, asset } from '../data';

/** Gradient "Download CV" pill (same look as Contact Me). Renders nothing until PROFILE.cv points at a PDF in public/. */
// cv_download is tracked globally in analytics.ts (any link ending in .pdf)
export default function CvButton(_props: { placement: string }) {
  if (!PROFILE.cv) return null;
  return (
    <a
      href={asset(PROFILE.cv)}
      download="Pranav_Raj_Singh_CV.pdf"
      className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-full px-8 py-3 text-xs font-medium uppercase tracking-widest text-white transition-transform duration-200 hover:scale-[1.03] sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base"
      style={{
        background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
        outline: '2px solid #FFFFFF',
        outlineOffset: '-3px',
      }}
    >
      <Download className="h-4 w-4" />
      Download CV
    </a>
  );
}
