import * as React from 'react';
import { cn } from '@/lib/utils';

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const PopoverContext = React.createContext<PopoverContextValue>({
  open: false,
  setOpen: () => {},
});

export function Popover({
  children,
  open: controlledOpen,
  onOpenChange,
}: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange]
  );

  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, setOpen]);

  return (
    <div ref={containerRef} className="relative inline-flex">
      <PopoverContext.Provider value={{ open, setOpen }}>
        {children}
      </PopoverContext.Provider>
    </div>
  );
}

export interface PopoverTriggerProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
}

export const PopoverTrigger = React.forwardRef<HTMLElement, PopoverTriggerProps>(
  ({ asChild, children, onClick, ...props }, ref) => {
    const { open, setOpen } = React.useContext(PopoverContext);

    const handleClick = (e: React.MouseEvent<any>) => {
      onClick?.(e);
      setOpen(!open);
    };

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        ref,
        onClick: handleClick,
        ...props,
      });
    }
    return (
      <button ref={ref as any} type="button" onClick={handleClick} {...props}>
        {children}
      </button>
    );
  }
);
PopoverTrigger.displayName = 'PopoverTrigger';

export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
}

export const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, align = 'center', sideOffset = 6, children, ...props }, ref) => {
    const { open } = React.useContext(PopoverContext);
    if (!open) return null;

    const alignClasses = {
      start: 'left-0',
      center: 'left-1/2 -translate-x-1/2',
      end: 'right-0',
    }[align];

    return (
      <div
        ref={ref}
        role="dialog"
        className={cn(
          'absolute top-full mt-2 z-50 w-64 rounded-[var(--cm-r-md)] border border-[var(--cm-line)] bg-[var(--cm-glass-thick-fill)] p-3 text-[var(--text-1)] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_8px_24px_rgba(0,0,0,0.48),0_2px_6px_rgba(0,0,0,0.36)] backdrop-blur-[30px] saturate-[180%] outline-none animate-in fade-in-0 zoom-in-95',
          alignClasses,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
PopoverContent.displayName = 'PopoverContent';

export const PopoverAnchor = ({ children }: { children: React.ReactNode }) => <>{children}</>;
