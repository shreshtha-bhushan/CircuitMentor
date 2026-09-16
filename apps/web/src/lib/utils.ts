export type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | { [key: string]: any }
  | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  function process(input: ClassValue) {
    if (!input) return;
    if (typeof input === 'string' || typeof input === 'number') {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      input.forEach(process);
    } else if (typeof input === 'object') {
      for (const key in input) {
        if (input[key]) {
          classes.push(key);
        }
      }
    }
  }

  inputs.forEach(process);
  return classes.join(' ');
}

export type VariantProps<T extends (...args: any) => any> = Parameters<T>[0];

export function cva(
  base: string,
  config?: {
    variants?: Record<string, Record<string, string>>;
    defaultVariants?: Record<string, string>;
  }
) {
  return (props?: Record<string, any>) => {
    const classList = [base];
    if (config?.variants) {
      const mergedProps = { ...config.defaultVariants, ...props };
      for (const [key, variantMap] of Object.entries(config.variants)) {
        const val = mergedProps[key];
        if (val && variantMap[val]) {
          classList.push(variantMap[val]);
        }
      }
    }
    if (props?.className) {
      classList.push(props.className);
    }
    return classList.filter(Boolean).join(' ');
  };
}
