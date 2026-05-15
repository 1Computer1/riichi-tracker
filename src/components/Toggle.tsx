import clsx from "clsx";
import { type ReactNode } from "react";

export default function Toggle({
  toggled,
  left,
  right,
  forced = false,
  onToggle,
}: {
  toggled: boolean;
  left: ReactNode;
  right: ReactNode;
  forced?: boolean;
  onToggle?: (toggled: boolean) => void;
}) {
  return (
    <div className="flex h-10 w-52 flex-row text-xl lg:h-14 lg:w-80 lg:text-2xl">
      {forced ? (
        <button
          disabled
          className={clsx(
            "flex w-full items-center justify-center rounded-xl border border-gray-800 p-1 shadow lg:p-2",
            "bg-amber-500 dark:bg-amber-700",
          )}
        >
          {toggled ? right : left}
        </button>
      ) : (
        <>
          <button
            className={clsx(
              "flex w-1/2 items-center justify-center rounded-xl rounded-r-none border border-gray-800 p-1 shadow disabled:bg-gray-300 lg:p-2 dark:disabled:bg-gray-800 dark:disabled:text-gray-600",
              !toggled
                ? "bg-amber-500 hover:bg-amber-600 dark:bg-amber-700 dark:hover:bg-amber-800"
                : "bg-gray-50 hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-600",
            )}
            onClick={
              onToggle
                ? (e) => {
                    e.preventDefault();
                    if (toggled) onToggle(false);
                  }
                : undefined
            }
          >
            {left}
          </button>
          <button
            className={clsx(
              "flex w-1/2 items-center justify-center rounded-xl rounded-l-none border border-gray-800 p-1 shadow disabled:bg-gray-300 lg:p-2 dark:disabled:bg-gray-800 dark:disabled:text-gray-600",
              toggled
                ? "bg-amber-500 hover:bg-amber-600 dark:bg-amber-700 dark:hover:bg-amber-800"
                : "bg-gray-50 hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-600",
            )}
            onClick={
              onToggle
                ? (e) => {
                    e.preventDefault();
                    if (!toggled) onToggle(true);
                  }
                : undefined
            }
          >
            {right}
          </button>
        </>
      )}
    </div>
  );
}
