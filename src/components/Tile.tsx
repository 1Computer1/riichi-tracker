import clsx from "clsx";
import { useMediaQuery } from "react-responsive";

import { useTheme } from "../hooks/useTheme";
import type { TileCode } from "../lib/hand";
import { shortForTile, svgForTile } from "../lib/tiles";

export default function Tile({
  tile,
  small = false,
  rotate = false,
}: {
  tile: TileCode | "00";
  small?: boolean;
  rotate?: boolean;
}) {
  const theme = useTheme();
  const isLg = useMediaQuery({ query: "(min-width: 1024px)" });

  if (small && !isLg) {
    const [text, color] =
      tile === "00" ? ([" ", "base"] as const) : shortForTile(tile);
    return (
      <div
        className={clsx(
          "flex flex-col items-center justify-center text-lg font-bold select-none lg:text-3xl",
          rotate
            ? "h-6 min-h-6 w-8 lg:h-12 lg:min-h-12 lg:w-16"
            : "h-8 w-6 min-w-6 lg:h-16 lg:w-12 lg:min-w-12",
          color === "red"
            ? "text-red-600 dark:text-red-700"
            : color === "green"
              ? "text-green-700 dark:text-green-800"
              : color === "blue"
                ? "text-blue-800 dark:text-blue-900"
                : "",
        )}
      >
        {text}
      </div>
    );
  }
  const file = (tile === "00" ? svgForTile("5z") : svgForTile(tile))[
    theme === "dark" ? 1 : 0
  ];
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center",
        small
          ? rotate
            ? "h-12 min-h-12 w-16"
            : "h-16 w-12 min-w-12"
          : rotate
            ? "h-12 min-h-12 w-16 lg:h-15 lg:min-h-15 lg:w-20"
            : "h-16 w-12 min-w-12 lg:h-20 lg:w-15 lg:min-w-15",
      )}
    >
      <img
        src={file}
        className={clsx(
          "rounded-xl object-contain p-2",
          small
            ? rotate
              ? "h-14 w-16 rotate-90"
              : "h-16 w-12 lg:h-20"
            : rotate
              ? "h-14 w-16 rotate-90 lg:h-18 lg:w-20"
              : "h-16 w-12 lg:h-20 lg:w-15",
        )}
      ></img>
    </div>
  );
}

export function Placeholder() {
  return (
    <div className="h-16 w-12 min-w-12 rounded-xl border-2 border-dashed border-black p-2 lg:h-20 lg:w-15 lg:min-w-15 dark:border-white"></div>
  );
}
