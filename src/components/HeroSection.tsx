import FadeIn from './FadeIn';
import Magnet from './Magnet';
import IntroAvatar from './IntroAvatar';
import ContactButton from './ContactButton';
import { PROFILE, asset } from '../data';

// Fades all four edges so the photo's studio backdrop melts into the page.
const PORTRAIT_MASK = [
  'linear-gradient(to bottom, transparent 0%, #000 14%, #000 70%, transparent 100%)',
  'linear-gradient(to right, transparent 0%, #000 16%, #000 84%, transparent 100%)',
].join(', ');

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Work', href: '#hero-campaign' },
  { label: 'Contact', href: '#contact' },
];

export default function HeroSection() {
  return (
    <section className="relative flex h-screen flex-col" style={{ overflowX: 'clip' }}>
      <FadeIn as="nav" delay={0} y={-20} className="flex justify-between px-6 pt-6 md:px-10 md:pt-8">
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="-my-2 py-2 text-sm font-medium uppercase tracking-wider text-[#D7E2EA] transition-opacity duration-200 hover:opacity-70 md:text-lg lg:text-[1.4rem]"
          >
            {link.label}
          </a>
        ))}
      </FadeIn>

      <div className="overflow-hidden">
        <FadeIn
          as="h1"
          delay={0.15}
          y={40}
          className="hero-heading mt-6 w-full whitespace-nowrap text-center text-[13.5vw] font-black uppercase leading-none tracking-tight sm:mt-4 sm:text-[12.5vw] md:-mt-3 md:text-[13vw] lg:text-[14vw]"
        >
          Hi, i&apos;m {PROFILE.firstName}
        </FadeIn>
      </div>

      <div className="relative z-20 mt-auto flex items-end justify-between gap-4 px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
        <FadeIn delay={0.35} y={20}>
          <p
            className="max-w-[200px] font-light uppercase leading-snug tracking-wide text-[#D7E2EA] sm:max-w-[220px] md:max-w-[280px]"
            style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
          >
            {PROFILE.tagline}
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>

      <IntroAvatar />

      {/* Portrait: dark studio shot, edges faded into the page background */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-[46%] sm:bottom-0 sm:top-auto sm:translate-y-0">
        <FadeIn delay={0.6} y={30}>
          <Magnet
            padding={150}
            strength={3}
            activeTransition="transform 0.3s ease-out"
            inactiveTransition="transform 0.6s ease-in-out"
          >
            <img
              src={asset('me/pranav.webp')}
              srcSet={`${asset('me/pranav.webp')} 1067w, ${asset('me/pranav-full.webp')} 2156w`}
              sizes="(min-width: 640px) 60vh, 45vh"
              alt="Portrait of Pranav Raj Singh"
              draggable={false}
              className="block h-[66vh] w-auto max-w-[100vw] select-none object-contain sm:h-[74vh] md:h-[80vh] lg:h-[84vh]"
              style={{ WebkitMaskImage: PORTRAIT_MASK, WebkitMaskComposite: 'source-in', maskImage: PORTRAIT_MASK, maskComposite: 'intersect' }}
            />
          </Magnet>
        </FadeIn>
      </div>
    </section>
  );
}
