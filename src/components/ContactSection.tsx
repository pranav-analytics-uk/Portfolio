import { Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import FadeIn from './FadeIn';
import ContactButton from './ContactButton';
import { PROFILE } from '../data';

const CHANNELS = [
  { icon: Mail, label: 'Email', value: PROFILE.email, href: `mailto:${PROFILE.email}` },
  { icon: Phone, label: 'Phone', value: PROFILE.phone, href: PROFILE.phoneHref },
  { icon: Linkedin, label: 'LinkedIn', value: 'in/thepranavraj021', href: PROFILE.linkedin },
];

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="flex flex-col items-center gap-10 border-t border-[#D7E2EA]/10 px-5 pb-12 pt-24 text-center sm:px-8 md:px-10 md:pt-32"
    >
      <FadeIn
        as="h2"
        y={40}
        className="hero-heading font-black uppercase leading-none tracking-tight"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Let&apos;s talk
      </FadeIn>
      <FadeIn delay={0.1} className="flex flex-col items-center gap-3 text-[#D7E2EA]">
        <p className="font-light uppercase tracking-wide" style={{ fontSize: 'clamp(1rem, 1.8vw, 1.35rem)' }}>
          {PROFILE.availability}
        </p>
        <p className="flex items-center gap-2 text-sm font-light uppercase tracking-widest text-[#D7E2EA]/60">
          <MapPin className="h-4 w-4" /> {PROFILE.location}
        </p>
      </FadeIn>

      <div className="grid w-full max-w-5xl gap-3 sm:grid-cols-3 sm:gap-4">
        {CHANNELS.map(({ icon: Icon, label, value, href }, i) => (
          <FadeIn key={label} delay={0.15 + i * 0.1}>
            <a
              href={href}
              {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="group flex h-full items-center gap-4 rounded-[28px] border-2 border-[#D7E2EA]/30 px-6 py-5 text-left text-[#D7E2EA] sm:flex-col sm:gap-3 sm:rounded-[32px] sm:px-5 sm:py-8 sm:text-center transition-colors duration-200 hover:border-[#D7E2EA] hover:bg-[#D7E2EA]/5"
            >
              <Icon className="h-6 w-6 shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span className="flex min-w-0 flex-col gap-1 sm:items-center sm:gap-3">
                <span className="text-xs font-light uppercase tracking-widest text-[#D7E2EA]/60">{label}</span>
                <span className="break-all font-medium" style={{ fontSize: 'clamp(0.9rem, 1.4vw, 1.1rem)' }}>
                  {value}
                </span>
              </span>
            </a>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.45}>
        <ContactButton href={`mailto:${PROFILE.email}`} label="Email me" />
      </FadeIn>

      <footer className="mt-12 flex w-full max-w-7xl flex-col-reverse items-center justify-between gap-6 sm:mt-16 sm:flex-row sm:flex-wrap sm:gap-4 text-xs uppercase tracking-widest text-[#D7E2EA]/50">
        <span>© 2026 {PROFILE.name}</span>
        <div className="flex items-center gap-6">
          <a href={`mailto:${PROFILE.email}`} className="-my-2 flex items-center gap-2 py-2 transition-opacity hover:opacity-70">
            <Mail className="h-4 w-4" /> Email
          </a>
          <a href={PROFILE.phoneHref} className="-my-2 flex items-center gap-2 py-2 transition-opacity hover:opacity-70">
            <Phone className="h-4 w-4" /> Call
          </a>
          <a
            href={PROFILE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="-my-2 flex items-center gap-2 py-2 transition-opacity hover:opacity-70"
          >
            <Linkedin className="h-4 w-4" /> LinkedIn
          </a>
        </div>
      </footer>
    </section>
  );
}
