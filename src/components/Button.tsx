import clsx from "clsx";
import { type ReactNode } from "react";

export default function Button({
  active = false,
  disabled = false,
  small = false,
  onClick,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  small?: boolean;
  onClick?: () => void;
  children?: ReactNode;
}) {
  return (
    <button
      className={clsx(
        "rounded-xl border border-gray-800 p-1 shadow disabled:bg-gray-300 lg:p-2 dark:disabled:bg-gray-800 dark:disabled:text-gray-600",
        small ? "w-32 lg:w-80" : "w-52 lg:w-80",
        "h-10 text-xl lg:h-14 lg:text-2xl",
        active
          ? "bg-amber-500 hover:bg-amber-600 dark:bg-amber-700 dark:hover:bg-amber-800"
          : "bg-gray-50 hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-600",
      )}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
