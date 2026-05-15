import clsx from "clsx";

import { type TileCode } from "../lib/hand";
import TileButton from "./calculator/TileButton";

export default function Tiles({
  sets,
  small = false,
  wrap = true,
}: {
  sets: (TileCode | "00")[][];
  small?: boolean;
  wrap?: boolean;
}) {
  return (
    <div
      className={clsx(
        "flex min-w-min flex-row items-center justify-center gap-1 lg:gap-2",
        wrap && "flex-wrap",
      )}
    >
      {sets.length > 0 && (
        <div
          className={clsx(
            "flex min-w-min flex-row items-center justify-center gap-1 lg:gap-2",
            wrap && "flex-wrap",
          )}
        >
          {sets.map(
            (tiles, i) =>
              tiles.length > 0 && (
                <div
                  key={i}
                  className={clsx(
                    "flex flex-row items-end justify-center gap-x-0.5 gap-y-1 lg:gap-y-2",
                    wrap && "flex-wrap",
                  )}
                >
                  {tiles.map((t, j) => (
                    <TileButton
                      key={j}
                      tile={t}
                      forced
                      small={small}
                      rotate={i >= 1 && j === 0 && t !== "00"}
                    />
                  ))}
                </div>
              ),
          )}
        </div>
      )}
    </div>
  );
}
