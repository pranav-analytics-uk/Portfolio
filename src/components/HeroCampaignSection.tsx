import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef } from 'react';
import { ArrowUpRight, Instagram } from 'lucide-react';
import FadeIn from './FadeIn';
import { MagnifyGroup, MagnifyItem } from './Magnify';
import { track } from '../analytics';
import { HERO_CASE, HERO_POSTS, TECNO_INSTAGRAM, heroScreenshot, heroScreenshotSmall } from '../data';

const RADIUS = 'rounded-[40px] sm:rounded-[50px] md:rounded-[60px]';
const CHANNELS = ['Instagram', 'Facebook', 'LinkedIn', 'CAMON · POVA · SPARK'];

function PostCard({
  post,
  index,
  total,
  progress,
}: {
  post: (typeof HERO_POSTS)[number];
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);

  return (
    <div className="sticky top-20 flex h-[62vh] items-start justify-center sm:top-24 sm:h-[85vh] md:top-32">
      <motion.article
        className={`relative w-full max-w-6xl origin-top border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-6 md:p-8 ${RADIUS}`}
        style={{ scale, top: `${index * 28}px` }}
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-2 sm:mb-6 sm:px-4">
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
            <span className="hero-heading font-black leading-none" style={{ fontSize: 'clamp(2.5rem, 7vw, 100px)' }}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-light uppercase tracking-widest text-[#D7E2EA]/60 sm:text-sm">
                {post.subject} · {post.device}
              </span>
              <h3 className="font-medium uppercase text-[#D7E2EA]" style={{ fontSize: 'clamp(1rem, 2vw, 1.8rem)' }}>
                {post.title}
              </h3>
            </div>
          </div>
          <div className="flex gap-6 text-right text-[#D7E2EA]">
            <div>
              <p className="font-black leading-none" style={{ fontSize: 'clamp(1.25rem, 2.4vw, 2rem)' }}>
                {post.likes}
              </p>
              <p className="text-[11px] uppercase tracking-widest text-[#D7E2EA]/60 sm:text-xs">likes</p>
            </div>
            <div>
              <p className="font-black leading-none" style={{ fontSize: 'clamp(1.25rem, 2.4vw, 2rem)' }}>
                {post.date.replace(' 2025', '')}
              </p>
              <p className="text-[11px] uppercase tracking-widest text-[#D7E2EA]/60 sm:text-xs">2025</p>
            </div>
          </div>
        </div>

        <a
          href={post.url || TECNO_INSTAGRAM}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={post.url ? `Open "${post.title}" on Instagram` : 'Open @tecnomobileindia on Instagram'}
          className="group relative block"
          onClick={() => track('view_campaign_post', { post: post.title })}
        >
          <img
            src={heroScreenshot(post.file)}
            srcSet={`${heroScreenshotSmall(post.file)} 1100w, ${heroScreenshot(post.file)} 2150w`}
            sizes="(min-width: 1200px) 1100px, 92vw"
            alt={`"${post.title}": TECNO Mobile India Instagram post, ${post.date}`}
            loading="lazy"
            className="mx-auto block max-h-[58vh] w-full rounded-[24px] object-contain transition-opacity duration-300 group-hover:opacity-90 sm:rounded-[32px] md:rounded-[40px]"
          />
          <span className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-full bg-[#0C0C0C]/85 px-3 py-1.5 text-[11px] font-medium uppercase tracking-widest text-[#D7E2EA] shadow-lg backdrop-blur transition-transform duration-200 group-hover:scale-105 sm:bottom-5 sm:right-5 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
            <Instagram className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="sm:hidden">View</span>
            <span className="hidden sm:inline">{post.url ? 'View post' : 'View on Instagram'}</span>
            <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </span>
        </a>
      </motion.article>
    </div>
  );
}

export default function HeroCampaignSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

  return (
    <section
      id="hero-campaign"
      className="relative z-10 -mt-10 rounded-t-[40px] bg-[#0C0C0C] px-5 pb-20 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-32"
    >
      <FadeIn className="mb-6 text-center text-xs font-medium uppercase tracking-[0.3em] text-[#D7E2EA]/70 sm:text-sm">
        IMC Work · TECNO Mobile India · #TECNOHeroes
      </FadeIn>
      <FadeIn
        as="h2"
        y={40}
        className="hero-heading text-center font-black uppercase leading-none tracking-tight"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Hero Campaign
      </FadeIn>

      <MagnifyGroup max={1.07} range={640} className="mx-auto mt-10 grid max-w-6xl gap-4 sm:mt-14 md:grid-cols-3 md:gap-6">
        {HERO_CASE.map((c, i) => (
          <MagnifyItem key={c.label} className="h-full">
          <FadeIn
            delay={0.1 + i * 0.1}
            className="h-full rounded-[28px] border-2 border-[#D7E2EA]/20 bg-[#0C0C0C] p-6 text-left md:rounded-[36px] md:p-8"
          >
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-[#D7E2EA]/60 sm:text-sm">
              {String(i + 1).padStart(2, '0')} · {c.label}
            </p>
            <p className="font-light leading-relaxed text-[#D7E2EA]" style={{ fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)' }}>
              {c.text}
            </p>
          </FadeIn>
          </MagnifyItem>
        ))}
      </MagnifyGroup>
      <FadeIn delay={0.4} className="mt-8 flex flex-wrap justify-center gap-2">
        {CHANNELS.map((c) => (
          <span
            key={c}
            className="rounded-full border border-[#D7E2EA]/40 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-[#D7E2EA] sm:text-sm"
          >
            {c}
          </span>
        ))}
      </FadeIn>

      <div ref={containerRef} className="mt-16 sm:mt-20">
        {HERO_POSTS.map((p, i) => (
          <PostCard key={p.file} post={p} index={i} total={HERO_POSTS.length} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}
