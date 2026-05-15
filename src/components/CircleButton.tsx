import clsx from "clsx";
import { type ReactNode } from "react";

export default function CircleButton({
  onClick,
  highlight = false,
  children,
}: {
  highlight?: boolean;
  onClick?: () => void;
  children?: ReactNode;
}) {
  return (
    <button
      className={clsx(
        "rounded-full border border-gray-800 p-1 disabled:bg-gray-300 dark:disabled:bg-gray-800 dark:disabled:text-gray-600",
        highlight
          ? "bg-amber-500 hover:bg-amber-600 dark:bg-amber-700 dark:hover:bg-amber-800"
          : "bg-gray-50 hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-600",
      )}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
    >
      <div className="flex h-6 w-6 flex-col items-center justify-center text-xl lg:h-12 lg:w-12 lg:text-3xl">
        {children}
      </div>
    </button>
  );
}
