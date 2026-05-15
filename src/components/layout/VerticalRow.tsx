import clsx from "clsx";
import { type ForwardedRef, forwardRef, type ReactNode } from "react";

export default forwardRef(function VerticalRow(
  { className = "", children }: { className?: string; children?: ReactNode },
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div className={clsx("w-full", className)} ref={ref}>
      <div className="flex w-full min-w-min flex-col items-center justify-center gap-1 lg:gap-2 lg:px-2">
        {children}
      </div>
    </div>
  );
});
