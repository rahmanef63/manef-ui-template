// @\components\layout\sidebar\sticky-sidebar.tsx

import * as React from "react";
import { cn } from "@/lib/utils";

interface StickySidebarProps extends React.HTMLAttributes<HTMLElement> { }

export const StickySidebar = React.forwardRef<HTMLElement, StickySidebarProps>(
  function StickySidebar({ className, children, ...props }, ref) {
    return (
      <aside ref={ref} className={cn("sticky", className)} {...props}>
        {children}
      </aside>
    );
  }
);

