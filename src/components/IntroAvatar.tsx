import { AnimatePresence, motion } from 'framer-motion';
import { Play, RotateCcw, Square } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { INTRO, asset } from '../data';
import { track } from '../analytics';

// Talking AI-avatar welcome, shown as a round bubble in the hero.
// Browsers block sound until the visitor interacts, so it starts on their first
// click/tap/key press while the hero is on screen (once per visit), or when the
// bubble itself is pressed. Captions mirror the audio; it pauses if scrolled away.

type State = 'idle' | 'playing' | 'ended';
const SESSION_KEY = 'pr-intro-played';

const GRADIENT = 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)';

function alreadyPlayedThisVisit() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

export default function IntroAvatar() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const visible = useRef(true);
  const [state, setState] = useState<State>('idle');
  const [caption, setCaption] = useState('');

  const play = useCallback((trigger: string) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.muted = false;
    v.play()
      .then(() => {
        setState('playing');
        try {
          sessionStorage.setItem(SESSION_KEY, '1');
        } catch {
          // ignore
        }
        track('intro_play', { trigger });
      })
      .catch(() => setState('idle')); // e.g. the browser still refused sound
  }, []);

  const stop = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    setState('ended');
    setCaption('');
  }, []);

  // Start on the visitor's first interaction anywhere (while the hero is visible), once per visit
  useEffect(() => {
    if (!INTRO.video || alreadyPlayedThisVisit()) return;
    const onFirst = (e: Event) => {
      const t = e.target as HTMLElement | null;
      // The bubble handles its own clicks; ignore the cookie banner
      if (t?.closest('[data-intro-avatar], [role="dialog"]')) return;
      if (alreadyPlayedThisVisit()) return cleanup();
      if (!visible.current) return; // wait for an interaction while the hero is on screen
      cleanup();
      play('first_interaction');
    };
    const cleanup = () => {
      window.removeEventListener('click', onFirst, true);
      window.removeEventListener('keydown', onFirst, true);
    };
    window.addEventListener('click', onFirst, true);
    window.addEventListener('keydown', onFirst, true);
    return cleanup;
  }, [play]);

  // Pause when the hero scrolls out of view
  useEffect(() => {
    const el = bubbleRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
      if (!entry.isIntersecting && videoRef.current && !videoRef.current.paused) stop();
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [stop]);

  if (!INTRO.video) return null;

  const onTime = () => {
    const t = videoRef.current?.currentTime ?? 0;
    setCaption(INTRO.captions.find((c) => t >= c.start && t < c.end)?.text ?? '');
  };

  const playing = state === 'playing';

  return (
    <>
      <div
        ref={bubbleRef}
        data-intro-avatar
        className="absolute left-4 top-[22%] z-30 flex flex-col items-center gap-2 sm:left-8 sm:top-[36%] md:left-10 lg:left-14"
      >
        <motion.button
          type="button"
          onClick={() => (playing ? stop() : play('button'))}
          aria-label={playing ? 'Stop video introduction' : "Play Pranav's video introduction (with sound)"}
          animate={{ scale: playing ? 1.28 : 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="group relative block origin-top-left rounded-full p-[3px] shadow-[0_20px_60px_rgba(0,0,0,0.6)] sm:origin-left"
          style={{ background: playing ? GRADIENT : 'rgba(215,226,234,0.45)' }}
        >
          {/* Soft pulse inviting the first play */}
          {state === 'idle' && (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-[3px] rounded-full motion-reduce:hidden"
              style={{ background: GRADIENT }}
              animate={{ scale: [1, 1.18], opacity: [0.55, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
          <span className="relative block h-[84px] w-[84px] overflow-hidden rounded-full bg-[#0C0C0C] sm:h-[120px] sm:w-[120px] md:h-[150px] md:w-[150px] lg:h-[176px] lg:w-[176px]">
            <video
              ref={videoRef}
              src={asset(INTRO.video)}
              poster={asset(INTRO.poster)}
              playsInline
              preload="metadata"
              onTimeUpdate={onTime}
              onEnded={() => {
                setState('ended');
                setCaption('');
                track('intro_complete');
              }}
              className="h-full w-full scale-[1.06] object-cover"
              aria-hidden="true"
            />
            {!playing && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {state === 'ended' ? (
                  <RotateCcw className="h-6 w-6 text-white" />
                ) : (
                  <Play className="ml-0.5 h-6 w-6 fill-white text-white" />
                )}
              </span>
            )}
          </span>
        </motion.button>

        <AnimatePresence mode="wait">
          {!playing && (
            <motion.button
              key={state}
              type="button"
              onClick={() => play('label')}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="flex flex-col items-center gap-0.5 text-[#D7E2EA]"
            >
              <span className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#D7E2EA]/40 bg-[#0C0C0C]/70 px-3 py-1 text-[10px] font-medium uppercase tracking-widest backdrop-blur sm:text-xs">
                {state === 'ended' ? (
                  <>
                    <RotateCcw className="h-3 w-3" /> Replay
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3 fill-current" /> Meet Pranav
                  </>
                )}
              </span>
              <span className="text-[9px] font-light uppercase tracking-[0.2em] text-[#D7E2EA]/50 sm:text-[10px]">
                AI avatar · sound on
              </span>
            </motion.button>
          )}
          {playing && (
            <motion.button
              key="stop"
              type="button"
              onClick={stop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-7 flex translate-x-[14%] items-center gap-1.5 rounded-full border border-[#D7E2EA]/40 bg-[#0C0C0C]/70 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-[#D7E2EA] backdrop-blur sm:mt-5 sm:text-xs md:mt-6 lg:mt-8"
            >
              <Square className="h-2.5 w-2.5 fill-current" /> Stop
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Subtitles, centred above the hero's bottom bar */}
      <div
        aria-live="polite"
        className="pointer-events-none absolute inset-x-4 bottom-[132px] z-30 flex justify-center sm:bottom-[150px] md:bottom-[170px]"
      >
        <AnimatePresence mode="wait">
          {caption && (
            <motion.p
              key={caption}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="max-w-xl rounded-2xl bg-[#0C0C0C]/75 px-4 py-2 text-center font-medium text-white backdrop-blur"
              style={{ fontSize: 'clamp(0.95rem, 1.6vw, 1.35rem)' }}
            >
              {caption}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
