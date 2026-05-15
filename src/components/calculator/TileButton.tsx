import clsx from "clsx";
import { useMediaQuery } from "react-responsive";

import useLocalStorage from "../../hooks/useLocalStorage";
import { type TileCode } from "../../lib/hand";
import Tile from "../Tile";

export default function TileButton<T extends TileCode | "00" = TileCode>({
  tile,
  agari = false,
  dora = false,
  red = false,
  disabled = false,
  forced = false,
  small = false,
  rotate = false,
  onClick,
}: {
  tile: T;
  agari?: boolean;
  dora?: boolean;
  red?: boolean;
  disabled?: boolean;
  forced?: boolean;
  small?: boolean;
  rotate?: boolean;
  onClick?: (tile: T) => void;
}) {
  const isLg = useMediaQuery({ query: "(min-width: 1024px)" });
  const [brightTiles] = useLocalStorage("brightTiles");

  return forced ? (
    <div
      data-theme="light"
      className={clsx(
        small && !isLg ? "rounded-md" : "rounded-xl",
        "shadow shadow-gray-400 dark:shadow-gray-800",
        agari ? "animate-pulse" : "",
        red
          ? "bg-rose-500 dark:bg-red-700"
          : dora
            ? "bg-amber-100 dark:bg-emerald-800"
            : tile === "00"
              ? "bg-amber-400 dark:bg-gray-600"
              : "bg-gray-50 dark:bg-gray-500",
      )}
    >
      <Tile tile={tile} small={small} rotate={rotate} />
    </div>
  ) : (
    <button
      onClick={
        onClick &&
        ((e) => {
          e.preventDefault();
          onClick(tile);
        })
      }
      disabled={disabled}
      data-theme={brightTiles === "true" ? "light" : null}
      className={clsx(
        small && !isLg ? "rounded-md" : "rounded-xl",
        "shadow shadow-gray-400 disabled:opacity-50 dark:shadow-gray-800",
        agari ? "animate-pulse" : "",
        red
          ? "bg-rose-500 enabled:group-hover:bg-rose-600 enabled:hover:bg-rose-600 dark:bg-red-700 dark:enabled:group-hover:bg-red-800 dark:enabled:hover:bg-red-800"
          : dora
            ? "bg-amber-100 enabled:group-hover:bg-amber-200 enabled:hover:bg-amber-200 dark:bg-emerald-800 dark:enabled:group-hover:bg-emerald-900 dark:enabled:hover:bg-emerald-900"
            : tile === "00"
              ? "bg-amber-400 enabled:group-hover:bg-amber-500 enabled:hover:bg-amber-500 dark:bg-gray-600 dark:enabled:group-hover:bg-gray-700 dark:enabled:hover:bg-gray-700"
              : "bg-gray-100 enabled:group-hover:bg-gray-200 enabled:hover:bg-gray-200 dark:bg-gray-500 dark:enabled:group-hover:bg-gray-600 dark:enabled:hover:bg-gray-600",
      )}
    >
      <Tile tile={tile} small={small} rotate={rotate} />
    </button>
  );
}
