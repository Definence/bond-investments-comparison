'use client';

import React, {
  useState,
  useRef,
  cloneElement,
  isValidElement,
  type ReactElement,
} from 'react';
import { useDropdownOutsideDismiss } from './useDropdownOutsideDismiss';

type DropdownProps = {
  trigger: ReactElement;
  children: React.ReactNode | ((close: () => void) => React.ReactNode);
  align?: 'left' | 'right';
};

export const Dropdown: React.FC<DropdownProps> = ({ trigger, children, align = 'left' }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const close = () => setOpen(false);

  useDropdownOutsideDismiss(open, containerRef, () => setOpen(false));

  const triggerProps = isValidElement(trigger)
    ? cloneElement(
        trigger as ReactElement<{
          ref?: React.Ref<HTMLElement>;
          onClick?: React.MouseEventHandler;
          'aria-expanded'?: boolean;
          'aria-haspopup'?: 'true' | 'menu';
        }>,
        {
          ref: (trigger as ReactElement & { ref?: React.Ref<HTMLElement> }).ref,
          onClick: (e: React.MouseEvent) => {
            (trigger.props as { onClick?: React.MouseEventHandler }).onClick?.(e);
            setOpen((o) => !o);
          },
          'aria-expanded': open,
          'aria-haspopup': 'menu' as const,
        }
      )
    : trigger;

  const content =
    typeof children === 'function' ? children(close) : children;

  return (
    <div ref={containerRef} className="relative shrink-0">
      {triggerProps}
      {open && (
        <div
          role="menu"
          className={`absolute top-full mt-1 z-10 min-w-56 rounded-lg border border-gray-200 bg-white py-1 shadow-lg ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {content}
        </div>
      )}
    </div>
  );
};
