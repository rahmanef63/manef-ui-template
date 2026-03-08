import { cn, fr } from "@/lib/utils";
import type { LinkProps } from "next/link";
import NextLink from "next/link";

export const Link = fr<
  HTMLAnchorElement,
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
    LinkProps & {
      children?: React.ReactNode;
    } & React.RefAttributes<HTMLAnchorElement>
>(function Link({ className, children, ...props }, ref) {
  return (
    <NextLink
      ref={ref}
      className={cn(
        "font-medium text-primary underline underline-offset-4 hover:no-underline cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </NextLink>
  );
});
