import clsx from "clsx";
import { type ReactNode } from "react";
import { HiMinus, HiPlus } from "react-icons/hi";

export default function Counter({
  onIncrement,
  onDecrement,
  canIncrement = true,
  canDecrement = true,
  children,
}: {
  onIncrement?: () => void;
  onDecrement?: () => void;
  canIncrement?: boolean;
  canDecrement?: boolean;
  children?: ReactNode;
}) {
  return (
    <div
      className={clsx(
        "flex h-10 w-52 flex-row items-stretch justify-center text-xl lg:h-14 lg:w-80 lg:text-2xl",
      )}
    >
      <button
        onClick={onDecrement}
        disabled={!canDecrement}
        className="flex w-[15%] items-center justify-center rounded-xl rounded-r-none border border-r-0 border-gray-800 bg-gray-50 shadow hover:bg-gray-200 disabled:bg-gray-300 dark:bg-gray-500 dark:hover:bg-gray-600 dark:disabled:bg-gray-800 dark:disabled:text-gray-600"
      >
        <div className="h-4 w-4 lg:h-6 lg:w-6">
          <HiMinus />
        </div>
      </button>
      <div className="flex w-[70%] items-center justify-center border border-gray-800 bg-gray-50 p-1 lg:p-2 dark:bg-gray-500">
        {children}
      </div>
      <button
        onClick={onIncrement}
        disabled={!canIncrement}
        className="flex w-[15%] items-center justify-center rounded-xl rounded-l-none border border-l-0 border-gray-800 bg-gray-50 shadow hover:bg-gray-200 disabled:bg-gray-300 dark:bg-gray-500 dark:hover:bg-gray-600 dark:disabled:bg-gray-800 dark:disabled:text-gray-600"
      >
        <div className="h-4 w-4 lg:h-6 lg:w-6">
          <HiPlus />
        </div>
      </button>
    </div>
  );
}
