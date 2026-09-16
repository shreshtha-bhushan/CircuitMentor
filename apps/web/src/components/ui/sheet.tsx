import * as React from 'react';
import { cn, cva, type VariantProps } from '@/lib/utils';

interface SheetContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SheetContext = React.createContext<SheetContextValue>({
  open: false,
  setOpen: () => {},
});

export function Sheet({
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

  React.useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, setOpen]);

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
}

export const SheetTrigger = ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => {
  const { open, setOpen } = React.useContext(SheetContext);
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: () => setOpen(!open),
    });
  }
  return <button type="button" onClick={() => setOpen(!open)}>{children}</button>;
};

export const SheetClose = ({ children }: { children: React.ReactNode }) => {
  const { setOpen } = React.useContext(SheetContext);
  return <button type="button" onClick={() => setOpen(false)}>{children}</button>;
};

export const SheetPortal = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export const SheetOverlay = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { setOpen } = React.useContext(SheetContext);
    return (
      <div
        ref={ref}
        className={cn(
          'fixed inset-0 z-50 bg-[var(--cm-scrim)] backdrop-blur-[8px] animate-in fade-in-0 duration-200',
          className
        )}
        onClick={() => setOpen(false)}
        {...props}
      />
    );
  }
);
SheetOverlay.displayName = 'SheetOverlay';

const sheetVariants = cva(
  'fixed z-50 gap-4 bg-[var(--cm-glass-thick-fill)] p-6 backdrop-blur-[30px] saturate-[180%] transition ease-[var(--ease-spring)] duration-[var(--d-standard)] text-[var(--text-1)]',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b border-[var(--line-strong)] shadow-[0_12px_40px_rgba(0,0,0,0.55)]',
        bottom: 'inset-x-0 bottom-0 border-t border-[var(--line-strong)] shadow-[var(--cm-shadow-sheet)] rounded-t-[var(--cm-r-xl)]',
        left: 'inset-y-0 left-0 h-full w-3/4 border-r border-[var(--line-strong)] shadow-[12px_0_40px_rgba(0,0,0,0.55)] sm:max-w-sm',
        right: 'inset-y-0 right-0 h-full w-3/4 border-l border-[var(--line-strong)] shadow-[-12px_0_40px_rgba(0,0,0,0.55)] sm:max-w-md',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  }
);

export interface SheetContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sheetVariants> {
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ side = 'right', className, children, ...props }, ref) => {
    const { open, setOpen } = React.useContext(SheetContext);
    if (!open) return null;

    return (
      <div className="fixed inset-0 z-50">
        <SheetOverlay />
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          className={cn(
            sheetVariants({ side }),
            'shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] animate-in duration-200',
            className
          )}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          {children}
          <button
            type="button"
            className="absolute right-4 top-4 rounded-[var(--cm-r-xs)] p-1.5 text-[var(--text-3)] transition-colors hover:text-[var(--text-1)] focus:outline-none focus:ring-2 focus:ring-[var(--cm-blue)] cursor-pointer"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            <span className="sr-only">Close</span>
          </button>
        </div>
      </div>
    );
  }
);
SheetContent.displayName = 'SheetContent';

export const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-2 text-left border-b border-[var(--cm-line)] pb-4',
      className
    )}
    {...props}
  />
);
SheetHeader.displayName = 'SheetHeader';

export const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 border-t border-[var(--cm-line)] pt-4',
      className
    )}
    {...props}
  />
);
SheetFooter.displayName = 'SheetFooter';

export const SheetTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn('text-base font-semibold text-[var(--text-1)]', className)}
    {...props}
  />
));
SheetTitle.displayName = 'SheetTitle';

export const SheetDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-xs text-[var(--text-2)]', className)}
    {...props}
  />
));
SheetDescription.displayName = 'SheetDescription';
