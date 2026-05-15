import { type TileCode } from "../../lib/hand";
import { Placeholder } from "../Tile";
import TileButton from "./TileButton";

export default function SelectedDora({
  dora,
  onTileClick,
}: {
  dora: TileCode[];
  onTileClick?: (tile: TileCode, i: number) => void;
}) {
  return (
    <div className="flex min-w-min flex-row items-center justify-center gap-x-2">
      <div className="flex flex-row gap-x-0.5">
        {dora.length ? (
          dora.map((t, i) => (
            <TileButton
              key={i}
              tile={t}
              onClick={onTileClick && ((t) => onTileClick(t, i))}
            />
          ))
        ) : (
          <Placeholder />
        )}
      </div>
    </div>
  );
}
