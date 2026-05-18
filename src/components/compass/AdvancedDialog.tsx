import { useTranslation } from "react-i18next";

import { type Game } from "../../data/interfaces";
import { getWindNameTranslated, nextWind } from "../../lib/hand";
import { useDb } from "../../providers/DbProvider";
import Button from "../Button";
import Counter from "../Counter";
import CustomDialog from "../layout/CustomDialog";

export function AdvancedDialog({
  gameId,
  game,
  onClose,
}: {
  gameId: string;
  game: Game;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const db = useDb();

  const {
    bottomWind,
    roundWind,
    round,
    repeats,
    riichiSticks,
    riichi,
    settings,
  } = game;

  const isSanma = settings.sanma != null;
  const roundCap = isSanma ? 3 : 4;

  return (
    <CustomDialog title={t("compass.otherActions")} onClose={onClose}>
      <div className="flex flex-col items-center justify-center gap-y-2">
        <div className="flex flex-col items-center justify-center gap-y-2">
          <Button
            onClick={async () => {
              await db.setGame(gameId, {
                ...game,
                bottomWind: nextWind(bottomWind, -1, isSanma),
              });
            }}
          >
            {t("compass.rotateSeats")}
          </Button>
          <Counter
            onDecrement={async () => {
              await db.setGame(gameId, {
                ...game,
                roundWind:
                  round === 1 ? nextWind(roundWind, -1, isSanma) : roundWind,
                round: round === 1 ? roundCap : round - 1,
              });
            }}
            onIncrement={async () => {
              await db.setGame(gameId, {
                ...game,
                roundWind:
                  round === roundCap
                    ? nextWind(roundWind, 1, isSanma)
                    : roundWind,
                round: round === roundCap ? 1 : round + 1,
              });
            }}
          >
            {getWindNameTranslated(roundWind)(t)} {round}
          </Counter>
          <Counter
            canDecrement={repeats > 0}
            onDecrement={async () => {
              await db.setGame(gameId, {
                ...game,
                repeats: repeats - 1,
              });
            }}
            onIncrement={async () => {
              await db.setGame(gameId, {
                ...game,
                repeats: repeats + 1,
              });
            }}
          >
            {t("compass.repeats", { repeats })}
          </Counter>
          <Counter
            canDecrement={riichiSticks > riichi.filter((r) => r).length}
            onDecrement={async () => {
              await db.setGame(gameId, {
                ...game,
                riichiSticks: riichiSticks - 1,
              });
            }}
            onIncrement={async () => {
              await db.setGame(gameId, {
                ...game,
                riichiSticks: riichiSticks + 1,
              });
            }}
          >
            {t("compass.riichiSticks", {
              riichiSticks,
            })}
          </Counter>
        </div>
      </div>
    </CustomDialog>
  );
}
