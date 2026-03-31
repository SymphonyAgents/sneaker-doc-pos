'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Twitter-style top progress bar.
 * - 3px bar with a subtle glow/pulse at the leading edge
 * - Dark mode: white bar with white glow
 * - Light mode (default): dark bar with dark glow
 * - Sits at the very top of the viewport, z-[9999]
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const prevPathname = useRef(pathname);
  const tickRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const hideRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function start() {
    clearInterval(tickRef.current);
    clearTimeout(hideRef.current);
    setVisible(true);
    setWidth(10);

    let w = 10;
    tickRef.current = setInterval(() => {
      // Slow down as it approaches the cap — feels more natural
      const remaining = 85 - w;
      w += Math.max(0.5, remaining * 0.08 + Math.random() * 5);
      if (w >= 85) {
        clearInterval(tickRef.current);
        w = 85;
      }
      setWidth(w);
    }, 300);
  }

  function finish() {
    clearInterval(tickRef.current);
    setWidth(100);
    hideRef.current = setTimeout(() => {
      setVisible(false);
      setWidth(0);
    }, 300);
  }

  // Start on internal link click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as Element).closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
      if (anchor.getAttribute('target') === '_blank') return;
      start();
    }

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Finish when pathname changes
  useEffect(() => {
    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname;
      finish();
    }
  }, [pathname]);

  if (!visible) return null;

  const isFinishing = width === 100;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none"
      style={{ opacity: isFinishing ? 0 : 1, transition: 'opacity 300ms ease-out' }}
    >
      {/* Bar */}
      <div
        className="h-[3px] bg-zinc-900 dark:bg-white"
        style={{
          width: `${width}%`,
          transition: isFinishing ? 'width 200ms ease-out' : 'width 300ms ease-out',
        }}
      />
      {/* Glow at the leading edge — Twitter signature effect */}
      <div
        className="absolute top-0 right-0 h-[3px]"
        style={{
          width: `${Math.min(width, 15)}%`,
          right: `${100 - width}%`,
          background: 'linear-gradient(to right, transparent, var(--progress-glow))',
          opacity: isFinishing ? 0 : 0.6,
          transition: 'opacity 200ms',
        }}
      />
      {/* Pulse dot at the tip */}
      <div
        className="absolute top-0 h-[5px] w-[5px] rounded-full shadow-[0_0_8px_2px_var(--progress-glow)]"
        style={{
          left: `${width}%`,
          transform: 'translate(-50%, -1px)',
          backgroundColor: 'var(--progress-glow)',
          opacity: isFinishing ? 0 : 1,
          transition: isFinishing ? 'opacity 200ms' : 'left 300ms ease-out',
        }}
      />
    </div>
  );
}
