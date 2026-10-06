import { AnimatePresence, motion } from 'framer-motion';
import { Play, RotateCcw, Square, Volume2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { INTRO, asset } from '../data';
import { track } from '../analytics';
import Magnet from './Magnet';

// The hero centrepiece: Pranav's talking AI avatar.
// It starts speaking as soon as the visitor shows up (first mouse move, scroll, touch,
// click or key). Browsers only allow sound after a click/tap/key press, so when sound
// is blocked it plays muted with captions and restarts with sound on the first click.

type State = 'waiting' | 'playing' | 'ended';
const SESSION_KEY = 'pr-intro-played';

// No touchstart: on phones the tap itself (click) should start it, which also allows sound
const PRESENCE_EVENTS = ['pointermove', 'wheel', 'scroll', 'keydown', 'click'] as const;
const ACTIVATION_EVENTS = ['click', 'keydown', 'touchend'] as const;

// Soft circular fade so the square video melts into the page background
const MASK = 'radial-gradient(closest-side, #000 80%, transparent 100%)';

// Tablet/desktop placement: top = just below the name; size = the previous large size
// (62/66/70vh by breakpoint), trimmed only if it would run past the bottom of the screen.
function useDesktopBox() {
  const [box, setBox] = useState<{ top: number; size: number; wide: boolean } | null>(null);
  useEffect(() => {
    const measure = () => {
      const w = window.innerWidth;
      const h1 = document.querySelector<HTMLElement>('section h1');
      if (w < 640 || !h1) return setBox(null);
      // offsetTop/Height ignore the name's slide-in animation, so this is its resting position
      const top = h1.offsetTop + h1.offsetHeight + 4;
      const vh = window.innerHeight;
      const wanted = (w >= 1024 ? 0.7 : w >= 768 ? 0.66 : 0.62) * vh;
      setBox({ top, size: Math.round(Math.min(wanted, vh - top - 4)), wide: w >= 1024 });
    };
    measure();
    const ro = new ResizeObserver(measure);
    const h1 = document.querySelector('section h1');
    if (h1) ro.observe(h1);
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);
  return box;
}

function playedWithSoundThisVisit() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

export default function IntroAvatar() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const visible = useRef(true);
  const [state, setState] = useState<State>('waiting');
  const [muted, setMuted] = useState(false);
  const [caption, setCaption] = useState('');
  const desktopBox = useDesktopBox();
  const side = Boolean(desktopBox?.wide);

  const markSound = () => {
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // ignore
    }
  };

  /** Play from the start, with sound if the browser allows it, otherwise muted. */
  const start = useCallback((trigger: string, wantSound: boolean) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.muted = !wantSound;
    v.play()
      .then(() => {
        setState('playing');
        setMuted(v.muted);
        if (!v.muted) markSound();
        track('intro_play', { trigger, sound: v.muted ? 'off' : 'on' });
      })
      .catch(() => {
        if (!wantSound) return;
        // Sound blocked (no click/tap yet): play silently with captions instead
        v.muted = true;
        v.play()
          .then(() => {
            setState('playing');
            setMuted(true);
            track('intro_play', { trigger, sound: 'blocked' });
          })
          .catch(() => setState('waiting'));
      });
  }, []);

  const stop = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    setState('ended');
    setCaption('');
  }, []);

  // 1) First sign of the visitor → start speaking
  useEffect(() => {
    if (!INTRO.video || playedWithSoundThisVisit()) return;
    let fired = false;
    const onPresence = () => {
      if (fired || !visible.current) return;
      fired = true;
      PRESENCE_EVENTS.forEach((ev) => window.removeEventListener(ev, onPresence, true));
      start('arrival', true);
    };
    PRESENCE_EVENTS.forEach((ev) => window.addEventListener(ev, onPresence, { capture: true, passive: true }));
    return () => PRESENCE_EVENTS.forEach((ev) => window.removeEventListener(ev, onPresence, true));
  }, [start]);

  // 2) If it had to play silently, the first click/tap/key restarts it with sound
  useEffect(() => {
    if (!muted || playedWithSoundThisVisit()) return;
    const onActivate = (e: Event) => {
      // Cookie banner, or the avatar itself (its own button restarts it with sound)
      if ((e.target as HTMLElement | null)?.closest('[role="dialog"], [data-intro-avatar]')) return;
      ACTIVATION_EVENTS.forEach((ev) => window.removeEventListener(ev, onActivate, true));
      if (visible.current) start('unmute', true);
    };
    ACTIVATION_EVENTS.forEach((ev) => window.addEventListener(ev, onActivate, true));
    return () => ACTIVATION_EVENTS.forEach((ev) => window.removeEventListener(ev, onActivate, true));
  }, [muted, start]);

  // Pause when the hero scrolls out of view
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
        if (!entry.isIntersecting && videoRef.current && !videoRef.current.paused) stop();
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [stop]);

  if (!INTRO.video) return null;

  const onTime = () => {
    const v = videoRef.current;
    // Pausing fires a last timeupdate; ignore it so a caption can't stick after stopping
    if (!v || v.paused) return;
    setCaption(INTRO.captions.find((c) => v.currentTime >= c.start && v.currentTime < c.end)?.text ?? '');
  };

  return (
    <>
      {/* Phones: centred as before. Tablet/desktop: the previous large size, starting just below
          the name and extending down (never up over the name) */}
      <div
        ref={wrapRef}
        data-intro-avatar
        className="absolute left-1/2 top-[44%] z-10 -translate-x-1/2 -translate-y-1/2 sm:translate-y-0"
        style={desktopBox ? { top: desktopBox.top } : undefined}
      >
        {/* Entrance: rises and fades in */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
        {/* Follows the cursor (magnetic) */}
        <Magnet padding={220} strength={6} maxShift={24} activeTransition="transform 0.4s ease-out" inactiveTransition="transform 0.8s ease-in-out">
        {/* Gentle idle float; settles while speaking */}
        <motion.div
          animate={state === 'playing' ? { y: 0 } : { y: [0, -10, 0] }}
          transition={state === 'playing' ? { duration: 0.6 } : { duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative aspect-square w-[86vw] max-w-[430px] sm:max-w-none"
          style={desktopBox ? { width: desktopBox.size } : undefined}
        >
          {/* Soft purple glow behind the face that breathes while he speaks */}
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-[14%] -z-10 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(182,0,168,0.55), rgba(118,33,176,0.25) 55%, transparent 75%)' }}
            animate={state === 'playing' ? { opacity: [0.35, 0.7, 0.35], scale: [0.95, 1.05, 0.95] } : { opacity: 0.18, scale: 1 }}
            transition={state === 'playing' ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.8 }}
          />
          <button
            type="button"
            onClick={() => start('avatar_click', true)}
            aria-label="Play Pranav's video introduction again, with sound"
            className="block h-full w-full cursor-pointer"
          >
            <video
              ref={videoRef}
              src={asset(INTRO.video)}
              poster={asset(INTRO.poster)}
              playsInline
              preload="auto"
              onTimeUpdate={onTime}
              onEnded={() => {
                setState('ended');
                setCaption('');
                track('intro_complete', { sound: muted ? 'off' : 'on' });
              }}
              aria-hidden="true"
              className="block h-full w-full select-none object-cover"
              style={{ WebkitMaskImage: MASK, maskImage: MASK }}
            />
          </button>
        {/* The original "Meet Pranav" label: play / stop / replay */}
        <button
          type="button"
          onClick={() => (state === 'playing' && !muted ? stop() : start('label', true))}
          className="absolute bottom-[16%] right-[2%] flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#D7E2EA]/40 bg-[#0C0C0C]/70 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-[#D7E2EA] backdrop-blur transition-colors hover:bg-[#D7E2EA]/10 sm:text-xs"
        >
          {state === 'playing' && !muted ? (
            <>
              <Square className="h-2.5 w-2.5 fill-current" /> Stop
            </>
          ) : state === 'ended' ? (
            <>
              <RotateCcw className="h-3 w-3" /> Replay
            </>
          ) : (
            <>
              <Play className="h-3 w-3 fill-current" /> Meet Pranav
            </>
          )}
        </button>
        </motion.div>
        </Magnet>
        </motion.div>
      </div>

      {/* Subtitles (and the sound hint when the browser blocked audio) */}
      <div
        aria-live="polite"
        className={`pointer-events-none absolute z-30 flex flex-col gap-2 ${
          side ? 'items-start' : 'inset-x-4 bottom-[140px] items-center sm:bottom-[88px] md:bottom-[150px]'
        }`}
        style={
          side && desktopBox
            ? {
                // Large screens: a speech bubble beside the face, clear of the chin
                left: `calc(50% + ${desktopBox.size * 0.36}px)`,
                right: 24,
                top: desktopBox.top + desktopBox.size * 0.4,
              }
            : undefined
        }
      >
        <AnimatePresence mode="wait">
          {caption && (
            <motion.p
              key={caption}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className={`rounded-2xl ${side ? "max-w-[22rem] rounded-bl-md text-left" : "max-w-full text-center md:max-w-[60vw]"} bg-[#0C0C0C]/75 px-4 py-2 font-medium text-white backdrop-blur`}
              style={{ fontSize: 'clamp(0.95rem, 1.6vw, 1.35rem)' }}
            >
              {caption}
            </motion.p>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {state === 'playing' && muted && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 rounded-full border border-[#D7E2EA]/30 bg-[#0C0C0C]/70 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-[#D7E2EA] backdrop-blur sm:text-xs"
            >
              <Volume2 className="h-3.5 w-3.5" /> Click anywhere for sound
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
