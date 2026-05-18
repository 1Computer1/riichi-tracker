import clsx from "clsx";
import { useTranslation } from "react-i18next";

import { type CalculatedPattern, type CalculatedValue } from "../../lib/hand";
import H from "../text/H";
import { HanFuValue, HanValue, HTrans } from "../text/Localized";
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
  const { t } = useTranslation();
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
          {t("calc.notEnoughTiles")}
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
  const { t } = useTranslation();
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-y-2 lg:gap-y-4">
      {result.agari == null ? (
        <span className="text-center text-2xl lg:text-4xl">
          {t("calc.tilesNotValid")}
        </span>
      ) : (
        <>
          <div>
            {result.yakuman ? (
              <span className="text-4xl">
                <H>{t("common.yakuman.1")}</H>
              </span>
            ) : (
              <span className="text-4xl">
                <HanFuValue
                  han={result.han.toString()}
                  fu={result.fu.toString()}
                />
              </span>
            )}
          </div>
          <ul className="container flex flex-col gap-y-0.5 text-lg lg:w-[50%]">
            {result.yaku.map((y) => (
              <li
                key={y.id}
                className="dark:border-opacity-50 flex flex-row items-center justify-between border-b border-dotted border-black pb-0.5 dark:border-gray-50"
              >
                <span className="text-sm sm:text-lg md:text-xl lg:text-2xl">
                  {y.name(t)}
                </span>
                {y.yakuman ? (
                  <span className="text-sm sm:text-lg md:text-xl lg:text-2xl">
                    <H>{y.value > 3 ? `${y.value}★` : "★".repeat(y.value)}</H>
                  </span>
                ) : (
                  <span className="text-sm sm:text-lg md:text-xl lg:text-2xl">
                    <HanValue han={y.value.toString()} />
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
                {t("calc.transferCalculatedScore")}
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
      return <HTrans i18nKey="calc.pattern.base" values={{ fu: pattern.fu }} />;
    }
    case "chiitoi": {
      return (
        <HTrans i18nKey="calc.pattern.chiitoi" values={{ fu: pattern.fu }} />
      );
    }
    case "pinfuTsumo": {
      return (
        <HTrans i18nKey="calc.pattern.pinfuTsumo" values={{ fu: pattern.fu }} />
      );
    }
    case "closedRon": {
      return (
        <HTrans i18nKey="calc.pattern.closedRon" values={{ fu: pattern.fu }} />
      );
    }
    case "rinshanTsumo": {
      return (
        <HTrans
          i18nKey="calc.pattern.rinshanTsumo"
          values={{ fu: pattern.fu }}
        />
      );
    }
    case "tsumo": {
      return (
        <HTrans i18nKey="calc.pattern.tsumo" values={{ fu: pattern.fu }} />
      );
    }
    case "openPinfu": {
      return (
        <HTrans i18nKey="calc.pattern.openPinfu" values={{ fu: pattern.fu }} />
      );
    }
    case "yakuhaiPair": {
      return pattern.double ? (
        <HTrans
          i18nKey="calc.pattern.yakuhaiPair.single"
          values={{ fu: pattern.fu }}
        />
      ) : (
        <HTrans
          i18nKey="calc.pattern.yakuhaiPair.double"
          values={{ fu: pattern.fu }}
        />
      );
    }
    case "quad": {
      return pattern.open ? (
        pattern.yaochuu ? (
          <HTrans
            i18nKey="calc.pattern.quad.openYaochuu"
            values={{ fu: pattern.fu }}
          />
        ) : (
          <HTrans
            i18nKey="calc.pattern.quad.open"
            values={{ fu: pattern.fu }}
          />
        )
      ) : pattern.yaochuu ? (
        <HTrans
          i18nKey="calc.pattern.quad.closedYaochuu"
          values={{ fu: pattern.fu }}
        />
      ) : (
        <HTrans
          i18nKey="calc.pattern.quad.closed"
          values={{ fu: pattern.fu }}
        />
      );
    }
    case "triplet": {
      return pattern.open ? (
        pattern.yaochuu ? (
          <HTrans
            i18nKey="calc.pattern.triplet.openYaochuu"
            values={{ fu: pattern.fu }}
          />
        ) : (
          <HTrans
            i18nKey="calc.pattern.triplet.open"
            values={{ fu: pattern.fu }}
          />
        )
      ) : pattern.yaochuu ? (
        <HTrans
          i18nKey="calc.pattern.triplet.closedYaochuu"
          values={{ fu: pattern.fu }}
        />
      ) : (
        <HTrans
          i18nKey="calc.pattern.triplet.closed"
          values={{ fu: pattern.fu }}
        />
      );
    }
    case "wait": {
      switch (pattern.w) {
        case "ryanmen":
          return (
            <HTrans
              i18nKey="calc.pattern.wait.ryanmen"
              values={{ fu: pattern.fu }}
            />
          );
        case "shanpon":
          return (
            <HTrans
              i18nKey="calc.pattern.wait.shanpon"
              values={{ fu: pattern.fu }}
            />
          );
        case "kanchan":
          return (
            <HTrans
              i18nKey="calc.pattern.wait.kanchan"
              values={{ fu: pattern.fu }}
            />
          );
        case "penchan":
          return (
            <HTrans
              i18nKey="calc.pattern.wait.penchan"
              values={{ fu: pattern.fu }}
            />
          );
        case "tanki":
          return (
            <HTrans
              i18nKey="calc.pattern.wait.tanki"
              values={{ fu: pattern.fu }}
            />
          );
      }
    }
  }
}
