import { useEffect, useRef, useState } from 'react';
import { FILMS, HERO_POSTS, heroPhoto } from '../data';

const ROW_1 = HERO_POSTS.map((p) => ({ src: heroPhoto(p.file), alt: p.title, w: 'w-[236px]' }));
const ROW_2 = FILMS.map((f) => ({
  src: `https://i.ytimg.com/vi/${f.id}/maxresdefault.jpg`,
  fallback: `https://i.ytimg.com/vi/${f.id}/hqdefault.jpg`,
  alt: f.title,
  w: 'w-[420px]',
}));

type Tile = { src: string; alt: string; w: string; fallback?: string };

function Row({ images, transform }: { images: Tile[]; transform: string }) {
  const tripled = [...images, ...images, ...images];
  return (
    <div className="flex w-max gap-3" style={{ transform, willChange: 'transform' }}>
      {tripled.map((t, i) => (
        <img
          key={i}
          src={t.src}
          alt={t.alt}
          loading="lazy"
          onError={(e) => {
            if (t.fallback && e.currentTarget.src !== t.fallback) e.currentTarget.src = t.fallback;
          }}
          className={`h-[270px] shrink-0 rounded-2xl object-cover ${t.w}`}
        />
      ))}
    </div>
  );
}

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const sectionTop = el.getBoundingClientRect().top + window.scrollY;
      setOffset((window.scrollY - sectionTop + window.innerHeight) * 0.3);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} className="overflow-hidden bg-[#0C0C0C] pb-10 pt-24 sm:pt-32 md:pt-40">
      {/* Rows start shifted back by one image set so neither edge ever shows a gap */}
      <div className="flex flex-col gap-3">
        <Row images={ROW_1} transform={`translateX(calc(${offset - 200}px - 33.333%))`} />
        <Row images={ROW_2} transform={`translateX(calc(${-(offset - 200)}px - 33.333%))`} />
      </div>
    </section>
  );
}
