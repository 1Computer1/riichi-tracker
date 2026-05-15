import { type Hand, isDora, type Meld } from "../../lib/hand";
import TileButton from "./TileButton";

export default function MeldButton({
  meld,
  hand,
  sanma,
  onClick,
}: {
  meld: Meld;
  hand: Hand;
  sanma: boolean;
  onClick?: (meld: Meld) => void;
}) {
  return (
    <div className="group flex flex-row items-end justify-center gap-x-0.5">
      {meld.t === "chiipon"
        ? meld.tiles.map((t, i) => (
            <TileButton
              key={i}
              tile={t}
              onClick={onClick && (() => onClick(meld))}
              dora={isDora(t, hand, sanma)}
              rotate={i === 0}
            />
          ))
        : meld.closed
          ? meld.tiles.map((t, i) => (
              <TileButton
                key={i}
                tile={i === 0 || i === 3 ? "00" : t}
                onClick={onClick && (() => onClick(meld))}
                dora={!(i === 0 || i === 3) && isDora(t, hand, sanma)}
              />
            ))
          : meld.tiles.map((t, i) => (
              <TileButton
                key={i}
                tile={t}
                onClick={onClick && (() => onClick(meld))}
                dora={isDora(t, hand, sanma)}
                rotate={i === 0}
              />
            ))}
    </div>
  );
}
