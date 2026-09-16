import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface TooltipContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRect: DOMRect | null;
  setTriggerRect: (rect: DOMRect | null) => void;
  delayDuration: number;
}

const TooltipContext = React.createContext<TooltipContextValue>({
  open: false,
  setOpen: () => {},
  triggerRect: null,
  setTriggerRect: () => {},
  delayDuration: 140,
});

export function TooltipProvider({
  children,
  delayDuration = 140,
}: {
  children: React.ReactNode;
  delayDuration?: number;
  skipDelayDuration?: number;
}) {
  return (
    <TooltipContext.Provider
      value={{
        open: false,
        setOpen: () => {},
        triggerRect: null,
        setTriggerRect: () => {},
        delayDuration,
      }}
    >
      {children}
    </TooltipContext.Provider>
  );
}

export function Tooltip({
  children,
  open: controlledOpen,
  onOpenChange,
  delayDuration: customDelay,
}: {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  delayDuration?: number;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const [triggerRect, setTriggerRect] = React.useState<DOMRect | null>(null);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const parentCtx = React.useContext(TooltipContext);
  const delayDuration = customDelay ?? parentCtx.delayDuration ?? 140;

  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange]
  );

  return (
    <TooltipContext.Provider
      value={{
        open,
        setOpen,
        triggerRect,
        setTriggerRect,
        delayDuration,
      }}
    >
      {children}
    </TooltipContext.Provider>
  );
}

export const TooltipTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & { asChild?: boolean }
>(({ children, asChild, ...props }, forwardedRef) => {
  const { setOpen, setTriggerRect, delayDuration } = React.useContext(TooltipContext);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const internalRef = React.useRef<HTMLElement | null>(null);

  const handlePointerEnter = (e: React.PointerEvent) => {
    const target = e.currentTarget as HTMLElement;
    setTriggerRect(target.getBoundingClientRect());
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setTriggerRect(target.getBoundingClientRect());
      setOpen(true);
    }, delayDuration);
  };

  const handlePointerLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(false);
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<any>;
    return React.cloneElement(child, {
      ref: (node: HTMLElement) => {
        internalRef.current = node;
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      onPointerEnter: (e: React.PointerEvent) => {
        child.props.onPointerEnter?.(e);
        handlePointerEnter(e);
      },
      onPointerLeave: (e: React.PointerEvent) => {
        child.props.onPointerLeave?.(e);
        handlePointerLeave();
      },
      onFocus: (e: React.FocusEvent) => {
        child.props.onFocus?.(e);
        setTriggerRect((e.currentTarget as HTMLElement).getBoundingClientRect());
        setOpen(true);
      },
      onBlur: (e: React.FocusEvent) => {
        child.props.onBlur?.(e);
        handlePointerLeave();
      },
    });
  }

  return (
    <button
      type="button"
      ref={forwardedRef as any}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocus={(e) => {
        setTriggerRect(e.currentTarget.getBoundingClientRect());
        setOpen(true);
      }}
      onBlur={handlePointerLeave}
      {...props}
    >
      {children}
    </button>
  );
});
TooltipTrigger.displayName = 'TooltipTrigger';

export interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'bottom' | 'left' | 'right';
  sideOffset?: number;
  collisionPadding?: number;
  avoidCollisions?: boolean;
}

export const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  (
    {
      className,
      side = 'top',
      sideOffset = 6,
      avoidCollisions = true,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const { open, triggerRect } = React.useContext(TooltipContext);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    if (!open || !triggerRect || !mounted) return null;

    // Auto-collision check: If top edge doesn't have enough clearance (e.g. Toolbar is at top: 16px), flip to bottom!
    let effectiveSide = side;
    if (avoidCollisions && side === 'top' && triggerRect.top < 60) {
      effectiveSide = 'bottom';
    } else if (avoidCollisions && side === 'bottom' && window.innerHeight - triggerRect.bottom < 60) {
      effectiveSide = 'top';
    }

    let top = 0;
    let left = 0;

    if (effectiveSide === 'top') {
      top = triggerRect.top - sideOffset;
      left = triggerRect.left + triggerRect.width / 2;
    } else if (effectiveSide === 'bottom') {
      top = triggerRect.bottom + sideOffset;
      left = triggerRect.left + triggerRect.width / 2;
    } else if (effectiveSide === 'left') {
      top = triggerRect.top + triggerRect.height / 2;
      left = triggerRect.left - sideOffset;
    } else {
      top = triggerRect.top + triggerRect.height / 2;
      left = triggerRect.right + sideOffset;
    }

    const contentStyle: React.CSSProperties = {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      transform:
        effectiveSide === 'top'
          ? 'translate(-50%, -100%)'
          : effectiveSide === 'bottom'
          ? 'translate(-50%, 0)'
          : effectiveSide === 'left'
          ? 'translate(-100%, -50%)'
          : 'translate(0, -50%)',
      zIndex: 999999,
      pointerEvents: 'none',
      ...style,
    };

    return createPortal(
      <div
        ref={ref}
        role="tooltip"
        className={cn('cm-tooltip-content', className)}
        style={contentStyle}
        {...props}
      >
        {children}
      </div>,
      document.body
    );
  }
);
TooltipContent.displayName = 'TooltipContent';

export function TooltipArrow({ className }: { className?: string }) {
  return <div className={cn('cm-tooltip-arrow', className)} />;
}
