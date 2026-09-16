import * as React from 'react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface CommandContextValue {
  search: string;
  setSearch: (s: string) => void;
  activeValue: string | null;
  setActiveValue: (val: string | null) => void;
  visibleItems: string[];
  registerItem: (val: string) => () => void;
  itemCallbacks: Map<string, () => void>;
  registerCallback: (val: string, cb: () => void) => () => void;
  matchesSearch: (val?: string) => boolean;
}

const CommandContext = React.createContext<CommandContextValue>({
  search: '',
  setSearch: () => {},
  activeValue: null,
  setActiveValue: () => {},
  visibleItems: [],
  registerItem: () => () => {},
  itemCallbacks: new Map(),
  registerCallback: () => () => {},
  matchesSearch: () => true,
});

export interface CommandProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (val: string) => void;
}

export const Command = React.forwardRef<HTMLDivElement, CommandProps>(
  ({ className, children, ...props }, ref) => {
    const [search, setSearch] = React.useState('');
    const [activeValue, setActiveValue] = React.useState<string | null>(null);
    const [visibleItems, setVisibleItems] = React.useState<string[]>([]);
    const itemCallbacksRef = React.useRef(new Map<string, () => void>());

    const matchesSearch = React.useCallback(
      (val?: string) => {
        if (!search.trim()) return true;
        if (!val) return false;
        const terms = search.trim().toLowerCase().split(/\s+/);
        const lowerVal = val.toLowerCase();
        return terms.every((t) => lowerVal.includes(t));
      },
      [search]
    );

    const registerItem = React.useCallback((val: string) => {
      setVisibleItems((prev) => {
        if (prev.includes(val)) return prev;
        return [...prev, val];
      });
      return () => {
        setVisibleItems((prev) => prev.filter((item) => item !== val));
      };
    }, []);

    const registerCallback = React.useCallback((val: string, cb: () => void) => {
      itemCallbacksRef.current.set(val, cb);
      return () => {
        itemCallbacksRef.current.delete(val);
      };
    }, []);

    // Set active item to first visible item if current active item is not visible
    React.useEffect(() => {
      if (visibleItems.length > 0) {
        if (!activeValue || !visibleItems.includes(activeValue)) {
          setActiveValue(visibleItems[0]!);
        }
      } else {
        setActiveValue(null);
      }
    }, [visibleItems, activeValue]);

    // Keyboard navigation: ArrowDown, ArrowUp, Enter
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (visibleItems.length === 0) return;
        const curIdx = activeValue ? visibleItems.indexOf(activeValue) : -1;
        const nextIdx = (curIdx + 1) % visibleItems.length;
        const nextVal = visibleItems[nextIdx]!;
        setActiveValue(nextVal);
        // Scroll into view
        const elem = document.querySelector(`[cmdk-item][data-value="${CSS.escape(nextVal)}"]`);
        elem?.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (visibleItems.length === 0) return;
        const curIdx = activeValue ? visibleItems.indexOf(activeValue) : -1;
        const prevIdx = curIdx <= 0 ? visibleItems.length - 1 : curIdx - 1;
        const prevVal = visibleItems[prevIdx]!;
        setActiveValue(prevVal);
        // Scroll into view
        const elem = document.querySelector(`[cmdk-item][data-value="${CSS.escape(prevVal)}"]`);
        elem?.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        if (activeValue && itemCallbacksRef.current.has(activeValue)) {
          e.preventDefault();
          const cb = itemCallbacksRef.current.get(activeValue);
          cb?.();
        }
      }
    };

    return (
      <CommandContext.Provider
        value={{
          search,
          setSearch,
          activeValue,
          setActiveValue,
          visibleItems,
          registerItem,
          itemCallbacks: itemCallbacksRef.current,
          registerCallback,
          matchesSearch,
        }}
      >
        <div
          ref={ref}
          className={cn('cm-command-palette-root', className)}
          onKeyDown={handleKeyDown}
          {...props}
        >
          {children}
        </div>
      </CommandContext.Provider>
    );
  }
);
Command.displayName = 'Command';

export interface CommandDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export const CommandDialog = ({ children, open, onOpenChange }: CommandDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="cm-command-dialog" hideCloseButton={true}>
        <Command>{children}</Command>
      </DialogContent>
    </Dialog>
  );
};

export interface CommandInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onValueChange?: (val: string) => void;
}

export const CommandInput = React.forwardRef<HTMLInputElement, CommandInputProps>(
  ({ className, value, onValueChange, placeholder, ...props }, ref) => {
    const { search, setSearch } = React.useContext(CommandContext);
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
      // Auto-focus input when mounted
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setSearch(val);
      onValueChange?.(val);
    };

    return (
      <div className="cm-command-input-wrapper">
        <svg
          className="cm-command-icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={(node) => {
            inputRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) (ref as any).current = node;
          }}
          type="text"
          className={cn('cm-command-input', className)}
          value={value !== undefined ? value : search}
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          {...props}
        />
      </div>
    );
  }
);
CommandInput.displayName = 'CommandInput';

export const CommandList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('cm-command-list', className)} role="listbox" {...props}>
      {children}
    </div>
  )
);
CommandList.displayName = 'CommandList';

export const CommandEmpty = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { visibleItems, search } = React.useContext(CommandContext);
    if (visibleItems.length > 0 || !search.trim()) return null;
    return (
      <div ref={ref} className={cn('cm-command-empty', className)} role="status" {...props}>
        {children}
      </div>
    );
  }
);
CommandEmpty.displayName = 'CommandEmpty';

export interface CommandGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  heading?: React.ReactNode;
}

export const CommandGroup = React.forwardRef<HTMLDivElement, CommandGroupProps>(
  ({ className, heading, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('cm-command-group', className)} role="group" {...props}>
        {heading && <div className="cm-command-group-heading">{heading}</div>}
        {children}
      </div>
    );
  }
);
CommandGroup.displayName = 'CommandGroup';

export const CommandSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('cm-command-separator', className)} {...props} />
  )
);
CommandSeparator.displayName = 'CommandSeparator';

export interface CommandItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onSelect?: (value: string) => void;
  disabled?: boolean;
}

export const CommandItem = React.forwardRef<HTMLDivElement, CommandItemProps>(
  ({ className, value, onSelect, disabled, children, ...props }, ref) => {
    const { activeValue, setActiveValue, registerItem, registerCallback, matchesSearch } =
      React.useContext(CommandContext);

    const valKey = value || '';
    const isVisible = matchesSearch(valKey);

    React.useEffect(() => {
      if (!isVisible || disabled) return;
      return registerItem(valKey);
    }, [isVisible, disabled, registerItem, valKey]);

    React.useEffect(() => {
      if (!isVisible || disabled || !onSelect) return;
      return registerCallback(valKey, () => onSelect(valKey));
    }, [isVisible, disabled, onSelect, registerCallback, valKey]);

    if (!isVisible) return null;

    const isSelected = activeValue === valKey;

    return (
      <div
        ref={ref}
        role="option"
        aria-selected={isSelected}
        cmdk-item=""
        data-value={valKey}
        data-selected={isSelected ? 'true' : undefined}
        className={cn('cm-command-item', className)}
        onClick={() => {
          if (disabled) return;
          setActiveValue(valKey);
          onSelect?.(valKey);
        }}
        onMouseEnter={() => {
          if (!disabled) setActiveValue(valKey);
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CommandItem.displayName = 'CommandItem';

export const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return <kbd className={cn('cm-shortcut-kbd', className)} {...props} />;
};
CommandShortcut.displayName = 'CommandShortcut';
