import { useState } from 'react';
import { ArrowRight, Instagram, Play } from 'lucide-react';
import FadeIn from './FadeIn';
import { track } from '../analytics';
import { FILMS, REELS } from '../data';

function YouTubeEmbed({ id, title }: { id: string; title: string }) {
  // Show a thumbnail until clicked, so eight players don't load up front.
  const [playing, setPlaying] = useState(false);
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[24px] border-2 border-[#D7E2EA]/30 bg-black sm:rounded-[32px]">
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => {
            setPlaying(true);
            track('play_film', { film: title });
          }} className="group absolute inset-0" aria-label={`Play ${title}`}>
          <img
            src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/10">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-[#0C0C0C] shadow-lg sm:h-16 sm:w-16">
              <Play className="ml-1 h-6 w-6 fill-current" />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

// Phones: a horizontal swipe row that bleeds to the screen edges. sm and up: a normal grid.
const SWIPE_ROW =
  '-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:mx-0 sm:grid sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden';
const SWIPE_ITEM = 'flex shrink-0 snap-center flex-col gap-3 sm:w-auto';

function SwipeHint() {
  return (
    <p className="-mt-4 mb-6 flex items-center gap-2 text-xs font-light uppercase tracking-widest text-[#D7E2EA]/50 sm:hidden">
      Swipe <ArrowRight className="h-3.5 w-3.5" />
    </p>
  );
}

function Subheading({ children, note }: { children: React.ReactNode; note: string }) {
  return (
    <FadeIn className="mb-8 flex flex-wrap items-end justify-between gap-2 border-b border-[#D7E2EA]/20 pb-4 sm:mb-10">
      <h3 className="font-black uppercase text-[#D7E2EA]" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 3rem)' }}>
        {children}
      </h3>
      <span className="text-xs font-light uppercase tracking-widest text-[#D7E2EA]/60 sm:text-sm">{note}</span>
    </FadeIn>
  );
}

export default function PublishedWorkSection() {
  return (
    <section id="work" className="bg-[#0C0C0C] px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-32">
      <FadeIn
        as="h2"
        y={40}
        className="hero-heading mb-12 text-center font-black uppercase leading-none tracking-tight sm:mb-20 md:mb-28"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Published Work
      </FadeIn>

      <div className="mx-auto max-w-7xl">
        <Subheading note="TECNO Mobile India · YouTube">Campaign Films</Subheading>
        <SwipeHint />
        <div className={SWIPE_ROW + ' sm:grid-cols-2 lg:grid-cols-3'}>
          {FILMS.map((f, i) => (
            <FadeIn key={f.id} delay={(i % 3) * 0.1} className={SWIPE_ITEM + ' w-[85%]'}>
              <YouTubeEmbed id={f.id} title={f.title} />
              <div className="px-2">
                <p className="text-xs font-light uppercase tracking-widest text-[#D7E2EA]/60">{f.series}</p>
                <p className="font-medium uppercase text-[#D7E2EA]">{f.title}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <div className="mt-20 sm:mt-28">
          <Subheading note="TECNO Mobile India & Totapari · Instagram">Reels</Subheading>
          <SwipeHint />
          <div className={SWIPE_ROW + ' sm:grid-cols-2 lg:grid-cols-4'}>
            {REELS.map((r, i) => (
              <FadeIn key={r.url} delay={(i % 4) * 0.08} className={SWIPE_ITEM + ' w-[80%]'}>
                <div className="overflow-hidden rounded-[24px] border-2 border-[#D7E2EA]/30 bg-white">
                  <iframe
                    src={`${r.url}embed/`}
                    title={`${r.brand}: ${r.title}`}
                    loading="lazy"
                    className="block h-[560px] w-full"
                    allowFullScreen
                  />
                </div>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-2 text-[#D7E2EA] transition-opacity hover:opacity-70"
                >
                  <Instagram className="h-4 w-4 shrink-0" />
                  <span className="text-sm">
                    <span className="font-light uppercase tracking-widest text-[#D7E2EA]/60">{r.brand}</span>
                    <br />
                    <span className="font-medium uppercase">{r.title}</span>
                  </span>
                </a>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
