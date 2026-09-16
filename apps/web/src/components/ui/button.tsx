import * as React from 'react';
import { cn, cva, type VariantProps } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-[var(--cm-r-sm)] text-[13px] font-medium transition-all duration-[var(--d-press)] ease-[var(--ease-spring)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--cm-blue)] focus-visible:ring-opacity-50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--cm-blue)] text-[#FFFFFF] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-[var(--blue-hover)]',
        destructive:
          'bg-[var(--cm-error)] text-[#FFFFFF] hover:bg-opacity-90',
        outline:
          'border border-[var(--cm-line)] bg-[var(--cm-raised)] text-[var(--cm-text)] hover:bg-[var(--cm-hover)] hover:border-[var(--cm-line-strong)]',
        secondary:
          'bg-[var(--cm-raised)] text-[var(--cm-text)] hover:bg-[var(--cm-hover)]',
        ghost:
          'hover:bg-[var(--cm-hover)] text-[var(--cm-text-secondary)] hover:text-[var(--cm-text)] shadow-none',
        link: 'text-[var(--cm-blue)] underline-offset-4 hover:underline shadow-none',
        glass:
          'bg-[var(--glass-fill)] backdrop-blur-[20px] saturate-[160%] border border-[var(--glass-stroke)] text-[var(--cm-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_8px_32px_rgba(0,0,0,0.5)] hover:bg-[var(--cm-hover)]',
      },
      size: {
        default: 'h-[var(--cm-control-h)] px-3.5 py-1.5',
        sm: 'h-7 rounded-[var(--cm-r-xs)] px-2.5 text-xs',
        lg: 'h-10 rounded-[var(--cm-r-md)] px-5 text-sm',
        icon: 'h-8 w-8 rounded-[var(--cm-r-sm)]',
        pill: 'h-8 rounded-[var(--cm-r-pill)] px-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
