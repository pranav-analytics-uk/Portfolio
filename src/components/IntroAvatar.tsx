import { AnimatePresence, motion } from 'framer-motion';
import { Play, RotateCcw, Square, Volume2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { INTRO, asset } from '../data';
import { track } from '../analytics';

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
      if ((e.target as HTMLElement | null)?.closest('[role="dialog"]')) return; // cookie banner
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
      <div
        ref={wrapRef}
        className="absolute left-1/2 top-[44%] z-10 -translate-x-1/2 -translate-y-1/2 sm:top-[14%] sm:translate-y-0"
      >
          <button
            type="button"
            onClick={() => start('avatar_click', true)}
            aria-label="Play Pranav's video introduction again, with sound"
            className="block cursor-pointer"
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
              className="block aspect-square w-[86vw] max-w-[430px] select-none object-cover sm:h-[62vh] sm:w-auto sm:max-w-none md:h-[66vh] lg:h-[70vh]"
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
      </div>

      {/* Subtitles (and the sound hint when the browser blocked audio) */}
      <div
        aria-live="polite"
        className="pointer-events-none absolute inset-x-4 bottom-[140px] z-30 flex flex-col items-center gap-2 md:bottom-[150px] xl:bottom-[38px]"
      >
        <AnimatePresence mode="wait">
          {caption && (
            <motion.p
              key={caption}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="max-w-full rounded-2xl md:max-w-[60vw] xl:max-w-[34vw] bg-[#0C0C0C]/75 px-4 py-2 text-center font-medium text-white backdrop-blur"
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
