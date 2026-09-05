'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  src: string;
  /** Read out to screen readers, e.g. "Listen to surname". */
  label: string;
  variant?: 'pill' | 'icon';
  text?: string;
};

function PlayIcon() {
  return (
    <svg width="11" height="12" viewBox="0 0 11 12" aria-hidden="true" focusable="false">
      <path d="M1 1.2a.6.6 0 0 1 .92-.5l7.5 4.8a.6.6 0 0 1 0 1l-7.5 4.8a.6.6 0 0 1-.92-.5Z" fill="currentColor" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" focusable="false">
      <rect x="0" y="0" width="10" height="10" rx="1.6" fill="currentColor" />
    </svg>
  );
}

export function AudioButton({ src, label, variant = 'pill', text = 'Listen' }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  // A new source means the old element is stale.
  useEffect(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    setPlaying(false);
    setFailed(false);
  }, [src]);

  if (failed) return null;

  const toggle = () => {
    let audio = audioRef.current;

    if (audio && !audio.paused) {
      audio.pause();
      audio.currentTime = 0;
      setPlaying(false);
      return;
    }

    if (!audio) {
      audio = new Audio(src);
      audio.addEventListener('ended', () => setPlaying(false));
      audio.addEventListener('error', () => {
        setPlaying(false);
        setFailed(true);
      });
      audioRef.current = audio;
    }

    audio.currentTime = 0;
    void audio.play().then(
      () => setPlaying(true),
      // A rejected play() is the browser declining the gesture, not a missing
      // file. Only the media error event hides the button.
      () => setPlaying(false),
    );
  };

  return (
    <button
      type="button"
      className={variant === 'icon' ? 'audio-icon' : 'audio-pill'}
      onClick={toggle}
      aria-label={label}
    >
      {playing ? <StopIcon /> : <PlayIcon />}
      {variant === 'pill' && <span>{playing ? 'Stop' : text}</span>}
    </button>
  );
}
