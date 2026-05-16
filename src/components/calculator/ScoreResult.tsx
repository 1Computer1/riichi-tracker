import clsx from "clsx";

import { type CalculatedPattern, type CalculatedValue } from "../../lib/hand";
import H from "../text/H";
import PointsResult from "./PointsResult";

export default function ScoreResult({
  tileCount,
  result,
  transferButton,
  pao,
  onTransferClick,
}: {
  tileCount: number;
  result: CalculatedValue | null;
  transferButton?: boolean;
  pao?: boolean;
  onTransferClick?: () => void;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      {tileCount === 14 && result ? (
        <ScoreResultSheet
          result={result}
          transferButton={transferButton}
          pao={pao}
          onTransferClick={onTransferClick}
        />
      ) : (
        <span className="text-center text-2xl lg:text-4xl">
          Not enough tiles to form a complete hand.
        </span>
      )}
    </div>
  );
}

function ScoreResultSheet({
  result,
  transferButton = false,
  pao = false,
  onTransferClick,
}: {
  result: CalculatedValue;
  transferButton?: boolean;
  pao?: boolean;
  onTransferClick?: () => void;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-y-2 lg:gap-y-4">
      {result.agari == null ? (
        <span className="text-center text-2xl lg:text-4xl">
          Tiles do not form a valid winning hand.
        </span>
      ) : (
        <>
          <div>
            {result.yakuman ? (
              <span className="text-4xl">
                <H>Yakuman</H>
              </span>
            ) : (
              <span className="text-4xl">
                <H>{result.han}</H> Han <H>{result.fu}</H> Fu
              </span>
            )}
          </div>
          <ul className="container flex flex-col gap-y-0.5 text-lg lg:w-[50%]">
            {result.yaku.map((y) => (
              <li
                key={y[0]}
                className="dark:border-opacity-50 flex flex-row items-center justify-between border-b border-dotted border-black pb-0.5 dark:border-gray-50"
              >
                <span className="text-sm sm:text-lg md:text-xl lg:text-2xl">
                  {y[0]}
                </span>
                {y[2] ? (
                  <span className="text-sm sm:text-lg md:text-xl lg:text-2xl">
                    <H>{y[1] > 3 ? `${y[1]}★` : "★".repeat(y[1])}</H>
                  </span>
                ) : (
                  <span className="text-sm sm:text-lg md:text-xl lg:text-2xl">
                    <H>{y[1]}</H> Han
                  </span>
                )}
              </li>
            ))}
          </ul>
          <PointsResult result={result} pao={pao} />
          {transferButton && (
            <div className="container flex flex-col lg:w-[50%]">
              <button
                className={clsx(
                  "rounded-xl border border-gray-800 py-1 shadow disabled:bg-gray-300 lg:p-2 dark:disabled:bg-gray-800 dark:disabled:text-gray-600",
                  "h-24 w-full text-2xl",
                  "bg-amber-500 hover:bg-amber-600 dark:bg-amber-700 dark:hover:bg-amber-800",
                )}
                onClick={onTransferClick}
              >
                Transfer Calculated Score
              </button>
            </div>
          )}
          {result.pattern && (
            <ul className="mt-8 flex list-disc flex-col items-start justify-center gap-y-0.5 lg:mt-16 lg:ml-8 lg:gap-y-1">
              {result.pattern.map((p, i) => (
                <li key={i}>
                  <PatternText pattern={p} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

function PatternText({ pattern }: { pattern: CalculatedPattern }) {
  switch (pattern.t) {
    case "base": {
      return (
        <>
          <H>{pattern.fu}</H> base fu.
        </>
      );
    }
    case "chiitoi": {
      return (
        <>
          <H>{pattern.fu}</H> base fu for Seven Pairs.
        </>
      );
    }
    case "pinfuTsumo": {
      return (
        <>
          <H>+{pattern.fu}</H> fu for Pinfu tsumo.
        </>
      );
    }
    case "closedRon": {
      return (
        <>
          <H>+{pattern.fu}</H> fu for closed ron.
        </>
      );
    }
    case "rinshanTsumo": {
      return (
        <>
          <H>+{pattern.fu}</H> fu for After a Kan tsumo.
        </>
      );
    }
    case "tsumo": {
      return (
        <>
          <H>+{pattern.fu}</H> fu for tsumo.
        </>
      );
    }
    case "openPinfu": {
      return (
        <>
          <H>+{pattern.fu}</H> fu for having an open hand with 20 fu.
        </>
      );
    }
    case "yakuhaiPair": {
      return (
        <>
          <H>+{pattern.fu}</H> fu for a yakuhai pair
          {pattern.double ? " (double)" : ""}.
        </>
      );
    }
    case "quad": {
      return (
        <>
          <H>+{pattern.fu}</H> fu for
          {pattern.open ? " an open" : " a closed"}
          {pattern.yaochuu ? " non-simple" : ""} kan.
        </>
      );
    }
    case "triplet": {
      return (
        <>
          <H>+{pattern.fu}</H> fu for
          {pattern.open ? " an open" : " a closed"}
          {pattern.yaochuu ? " non-simple" : ""} triplet.
        </>
      );
    }
    case "wait": {
      return (
        <>
          <H>+{pattern.fu}</H> fu for winning on{" "}
          {
            {
              ryanmen: "an open",
              shanpon: "a dual pair",
              kanchan: "a closed",
              penchan: "an edge",
              tanki: "a pair",
            }[pattern.w]
          }{" "}
          wait.
        </>
      );
    }
  }
}
