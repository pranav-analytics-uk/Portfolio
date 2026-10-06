import FadeIn from './FadeIn';
import { CERTIFICATIONS, EDUCATION, EXPERIENCE } from '../data';

const BORDER = '1px solid rgba(12, 12, 12, 0.15)';

export default function ExperienceSection() {
  return (
    <section
      id="experience"
      className="rounded-t-[40px] bg-white px-5 pb-32 pt-20 sm:rounded-t-[50px] sm:px-8 sm:pb-36 sm:pt-24 md:rounded-t-[60px] md:px-10 md:pb-44 md:pt-32"
    >
      <FadeIn
        as="h2"
        y={40}
        className="mb-16 text-center font-black uppercase leading-none tracking-tight text-[#0C0C0C] sm:mb-20 md:mb-28"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Experience
      </FadeIn>

      <div className="mx-auto max-w-5xl">
        {EXPERIENCE.map((job, i) => (
          <FadeIn
            key={job.company}
            delay={i * 0.1}
            className="flex flex-col items-start gap-3 py-8 sm:flex-row sm:gap-10 sm:py-10 md:gap-14 md:py-12"
            style={{ borderTop: BORDER, borderBottom: i === EXPERIENCE.length - 1 ? BORDER : undefined }}
          >
            <span
              className="shrink-0 font-black leading-none text-[#0C0C0C]"
              style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="flex flex-col gap-2 text-[#0C0C0C] sm:pt-1 md:pt-3">
              <span className="text-xs font-medium uppercase tracking-widest opacity-50 sm:text-sm">
                {job.company} · {job.period} · {job.place}
              </span>
              <h3 className="font-medium uppercase leading-tight" style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>
                {job.role}
              </h3>
              <p
                className="max-w-2xl font-light leading-relaxed"
                style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)', opacity: 0.6 }}
              >
                {job.description}
              </p>
            </div>
          </FadeIn>
        ))}

        <div className="mt-16 grid gap-12 text-[#0C0C0C] sm:mt-20 md:mt-24 md:grid-cols-2">
          <FadeIn>
            <h3 className="mb-6 font-black uppercase" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
              Education
            </h3>
            <ul className="flex flex-col gap-5">
              {EDUCATION.map((e) => (
                <li key={e.school}>
                  <p className="font-medium uppercase" style={{ fontSize: 'clamp(0.95rem, 1.6vw, 1.25rem)' }}>
                    {e.school}
                  </p>
                  <p className="font-light opacity-60">
                    {e.degree} · {e.period}
                  </p>
                </li>
              ))}
            </ul>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h3 className="mb-6 font-black uppercase" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
              Certifications
            </h3>
            <ul className="flex flex-col gap-3">
              {CERTIFICATIONS.map((c) => (
                <li key={c} className="font-light opacity-70" style={{ fontSize: 'clamp(0.9rem, 1.4vw, 1.1rem)' }}>
                  {c}
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
