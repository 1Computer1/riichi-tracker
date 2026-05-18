import { useTranslation } from "react-i18next";

import { type CalculatedValue, ceil100 } from "../../lib/hand";
import H from "../text/H";
import { HTrans } from "../text/Localized";

export default function PointsResult({
  result,
  pao,
}: {
  result: CalculatedValue & { agari: "ron" | "tsumo" };
  pao: boolean;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center gap-y-2">
      {result.name ? (
        <div className="text-4xl italic">{result.name(t)}</div>
      ) : result.noYaku ? (
        <div className="text-4xl italic">{t("calc.noYaku")}</div>
      ) : null}
      <div className="flex flex-row items-end gap-x-2">
        <span className="text-6xl">
          <H>{result.points.total}</H>
        </span>
        <span className="text-2xl">{t("calc.points")}</span>
      </div>
      <div className="text-center text-2xl">
        {t("calc.pointsToTake")}: <TakeText result={result} pao={pao} />
      </div>
    </div>
  );
}

export function TakeText({
  result,
  pao,
}: {
  result: CalculatedValue & { agari: "ron" | "tsumo" };
  pao: boolean;
}) {
  return result.isOya ? (
    result.agari === "tsumo" ? (
      pao ? (
        <span>
          <FromLiable points={result.points.total.toString()} />
        </span>
      ) : (
        <span>
          <FromAll points={result.points.oya.ko.toString()} />
        </span>
      )
    ) : pao ? (
      <span>
        <FromBoth points={ceil100(result.points.oya.ron / 2).toString()} />
      </span>
    ) : (
      <H>{result.points.oya.ron}</H>
    )
  ) : result.agari === "tsumo" ? (
    pao ? (
      <span>
        <FromLiable points={result.points.total.toString()} />
      </span>
    ) : (
      <>
        <H>{result.points.ko.oya}</H>・<H>{result.points.ko.ko}</H>
      </>
    )
  ) : pao ? (
    <span>
      <FromBoth points={ceil100(result.points.ko.ron / 2).toString()} />
    </span>
  ) : (
    <H>{result.points.ko.ron}</H>
  );
}

function FromLiable({ points }: { points: string }) {
  return <HTrans i18nKey="calc.fromLiable" values={{ points }} />;
}

function FromAll({ points }: { points: string }) {
  return <HTrans i18nKey="calc.fromAll" values={{ points }} />;
}

function FromBoth({ points }: { points: string }) {
  return <HTrans i18nKey="calc.fromBoth" values={{ points }} />;
}
