import { type ClassValue, clsx } from "clsx";
import * as React from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Forward ref helper - wraps forwardRef with displayName
 */
export function fr<
  T extends HTMLElement = HTMLElement,
  P extends object = object
>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ForwardRefRenderFunction<T, any>
) {
  const wrapped = React.forwardRef<T, P>(component);
  wrapped.displayName = component.name || "ForwardRef";
  return wrapped;
}

/**
 * Styled element - creates a styled HTML element with default classes
 */
export function se(Tag: keyof React.JSX.IntrinsicElements, ...classNames: ClassValue[]) {
  const Component = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
    ({ className, ...props }, ref) => {
      // @ts-expect-error Dynamic tag element - TypeScript cannot infer this correctly
      return <Tag ref={ref} className={cn(...classNames, className)} {...props} />;
    }
  );

  const tagName = String(Tag);
  Component.displayName = tagName.charAt(0).toUpperCase() + tagName.slice(1);
  return Component;
}

