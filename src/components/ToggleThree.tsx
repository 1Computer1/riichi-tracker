import clsx from "clsx";
import { type ReactNode } from "react";

export default function ToggleThree({
  toggled,
  left,
  middle,
  right,
  forced = false,
  onToggle,
}: {
  toggled: 0 | 1 | 2;
  left: ReactNode;
  middle: ReactNode;
  right: ReactNode;
  forced?: boolean;
  onToggle?: (toggled: 0 | 1 | 2) => void;
}) {
  return (
    <div className="flex h-10 w-64 flex-row text-xl lg:h-14 lg:w-80 lg:text-2xl">
      {forced ? (
        <button
          disabled
          className={clsx(
            "flex w-full items-center justify-center rounded-xl border border-gray-800 p-1 shadow lg:p-2",
            "bg-amber-500 dark:bg-amber-700",
          )}
        >
          {[left, middle, right][toggled]}
        </button>
      ) : (
        <>
          <button
            className={clsx(
              "flex w-1/3 items-center justify-center rounded-xl rounded-r-none border border-gray-800 p-1 shadow disabled:bg-gray-300 lg:p-2 dark:disabled:bg-gray-800 dark:disabled:text-gray-600",
              toggled === 0
                ? "bg-amber-500 hover:bg-amber-600 dark:bg-amber-700 dark:hover:bg-amber-800"
                : "bg-gray-50 hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-600",
            )}
            onClick={
              onToggle
                ? (e) => {
                    e.preventDefault();
                    if (toggled !== 0) onToggle(0);
                  }
                : undefined
            }
          >
            {left}
          </button>
          <button
            className={clsx(
              "flex w-1/3 items-center justify-center border border-gray-800 p-1 shadow disabled:bg-gray-300 lg:p-2 dark:disabled:bg-gray-800 dark:disabled:text-gray-600",
              toggled === 1
                ? "bg-amber-500 hover:bg-amber-600 dark:bg-amber-700 dark:hover:bg-amber-800"
                : "bg-gray-50 hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-600",
            )}
            onClick={
              onToggle
                ? (e) => {
                    e.preventDefault();
                    if (toggled !== 1) onToggle(1);
                  }
                : undefined
            }
          >
            {middle}
          </button>
          <button
            className={clsx(
              "flex w-1/3 items-center justify-center rounded-xl rounded-l-none border border-gray-800 p-1 shadow disabled:bg-gray-300 lg:p-2 dark:disabled:bg-gray-800 dark:disabled:text-gray-600",
              toggled === 2
                ? "bg-amber-500 hover:bg-amber-600 dark:bg-amber-700 dark:hover:bg-amber-800"
                : "bg-gray-50 hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-600",
            )}
            onClick={
              onToggle
                ? (e) => {
                    e.preventDefault();
                    if (toggled !== 2) onToggle(2);
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
