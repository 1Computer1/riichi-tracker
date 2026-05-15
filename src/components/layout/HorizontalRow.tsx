import clsx from "clsx";
import { type ForwardedRef, forwardRef, type ReactNode } from "react";

export default forwardRef(function HorizontalRow(
  { className = "", children }: { className?: string; children?: ReactNode },
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div className={clsx("w-full", className)} ref={ref}>
      <div className="flex min-w-min flex-row flex-wrap items-center justify-center gap-1 lg:gap-2 lg:px-2">
        {children}
      </div>
    </div>
  );
});
