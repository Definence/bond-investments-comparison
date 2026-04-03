'use client';

import { useEffect, useRef, type RefObject } from 'react';

/** Closes an open dropdown when the user presses outside its container (`pointerdown`, not only mouse click). */
export function useDropdownOutsideDismiss<T extends HTMLElement = HTMLElement>(
  open: boolean,
  containerRef: RefObject<T | null>,
  onClose: () => void
) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onCloseRef.current();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open, containerRef]);
}
