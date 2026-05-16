import { type ForwardedRef, forwardRef } from "react";

import { type Hand, isDora, type Meld, type TileCode } from "../../lib/hand";
import { Placeholder } from "../Tile";
import MeldButton from "./MeldButton";
import TileButton from "./TileButton";

export default forwardRef(function Selected(
  {
    hand,
    sanma,
    onTileClick,
    onMeldClick,
  }: {
    hand: Hand;
    sanma: boolean;
    onTileClick?: (tile: TileCode, i: number) => void;
    onMeldClick?: (meld: Meld, i: number) => void;
  },
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      ref={ref}
      className="flex min-w-min flex-row items-center justify-center gap-x-2 gap-y-0.5"
    >
      {hand.tiles.length || hand.melds.length ? (
        <>
          {hand.tiles.length > 0 && (
            <div className="flex flex-row items-center justify-center gap-0.5">
              {hand.tiles.map((t, i) => (
                <TileButton
                  key={i}
                  tile={t}
                  agari={i === hand.agariIndex}
                  dora={isDora(t, hand, sanma)}
                  onClick={onTileClick && ((t) => onTileClick(t, i))}
                />
              ))}
            </div>
          )}
          {hand.melds.map((m, i) => (
            <MeldButton
              key={i}
              meld={m}
              hand={hand}
              sanma={sanma}
              onClick={onMeldClick && ((m) => onMeldClick(m, i))}
            />
          ))}
        </>
      ) : (
        <div className="flex flex-row gap-x-0.5">
          {Array.from({ length: 5 }, (_, i) => (
            <Placeholder key={i} />
          ))}
        </div>
      )}
    </div>
  );
});
