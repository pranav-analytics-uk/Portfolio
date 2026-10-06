import FadeIn from './FadeIn';
import AnimatedText from './AnimatedText';
import { PROFILE, STATS, heroPhoto } from '../data';

// Four frames from the Heroes series stand in for the template's 3D corner objects.
const DECOR = [
  { n: 3, className: 'top-[3%] left-[1%] sm:left-[2%] md:left-[4%] w-[70px] sm:w-[100px] md:w-[120px] lg:w-[170px] -rotate-6', delay: 0.1, x: -80 },
  { n: 1, className: 'bottom-[3%] left-[3%] sm:left-[6%] md:left-[10%] w-[64px] sm:w-[90px] md:w-[110px] lg:w-[150px] rotate-6', delay: 0.25, x: -80 },
  { n: 4, className: 'top-[3%] right-[1%] sm:right-[2%] md:right-[4%] w-[70px] sm:w-[100px] md:w-[120px] lg:w-[170px] rotate-6', delay: 0.15, x: 80 },
  { n: 5, className: 'bottom-[3%] right-[3%] sm:right-[6%] md:right-[10%] w-[74px] sm:w-[104px] md:w-[124px] lg:w-[180px] -rotate-3', delay: 0.3, x: 80 },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative flex min-h-screen flex-col items-center justify-center px-5 pb-24 pt-24 sm:px-8 sm:pb-52 sm:pt-28 md:px-10 lg:pb-60"
    >
      {DECOR.map((d) => (
        <FadeIn
          key={d.n}
          delay={d.delay}
          x={d.x}
          y={0}
          duration={0.9}
          className={`pointer-events-none absolute hidden opacity-70 sm:block ${d.className}`}
        >
          <img src={heroPhoto(d.n)} alt="" className="h-auto w-full rounded-2xl border border-[#D7E2EA]/30 md:rounded-3xl" />
        </FadeIn>
      ))}

      <div className="relative z-10 flex flex-col items-center gap-16 sm:gap-20 md:gap-24">
        <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
          <FadeIn
            as="h2"
            delay={0}
            y={40}
            className="hero-heading text-center font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            About me
          </FadeIn>
          <AnimatedText
            text={PROFILE.about}
            className="max-w-[600px] text-center font-medium leading-relaxed text-[#D7E2EA]"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
          />
        </div>

        <div className="grid w-full max-w-4xl grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {STATS.map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.1} className="flex flex-col items-center text-center">
              <span className="hero-heading font-black leading-none" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
                {s.value}
              </span>
              <span className="mt-2 max-w-[180px] text-xs font-light uppercase tracking-wider text-[#D7E2EA]/70 sm:text-sm">
                {s.label}
              </span>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  );
}
