import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiHashtag, HiMinus, HiPlus } from "react-icons/hi";

import { type Game } from "../../data/interfaces";
import { nextWind } from "../../lib/hand";
import { useDb } from "../../providers/DbProvider";
import Button from "../Button";
import TileButton from "../calculator/TileButton";
import CustomDialog from "../layout/CustomDialog";
import ToggleThree from "../ToggleThree";

export function ScoreUpdateDialog({
  scoreUpdater,
  gameId,
  game,
  onScoreUpdate,
  onClose,
}: {
  scoreUpdater: number;
  gameId: string;
  game: Game;
  onScoreUpdate: (oldScores: number[]) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const db = useDb();

  const { bottomWind, scores, settings } = game;
  const isSanma = settings.sanma != null;

  const [scoreUpdateMode, setScoreUpdateMode] = useState<0 | 1 | 2>(0);
  const [scoreUpdateDelta, setScoreUpdateDelta] = useState(0);
  const scoreDeltaInputRef = useRef<HTMLInputElement | null>(null);

  const submitScoreUpdate = async () => {
    const scores_ = scores.slice();
    switch (scoreUpdateMode) {
      case 0:
        scores_[scoreUpdater] -= scoreUpdateDelta;
        break;
      case 1:
        scores_[scoreUpdater] = scoreUpdateDelta;
        break;
      case 2:
        scores_[scoreUpdater] += scoreUpdateDelta;
        break;
    }
    await db.setGame(gameId, { ...game, scores: scores_ });
    onScoreUpdate(game.scores);
    onClose();
  };

  return (
    <CustomDialog
      initialFocus={scoreDeltaInputRef}
      onClose={onClose}
      title={t("compass.editScore")}
    >
      <div className="flex flex-col items-center justify-center gap-y-2">
        <TileButton
          forced
          red={nextWind(bottomWind, scoreUpdater, isSanma) === "1"}
          tile={`${nextWind(bottomWind, scoreUpdater, isSanma)}z`}
        />
        <div className="flex flex-col items-center justify-center gap-y-2">
          <ToggleThree
            left={
              <div className="h-4 w-4 lg:h-6 lg:w-6">
                <HiMinus />
              </div>
            }
            middle={
              <div className="h-4 w-4 lg:h-6 lg:w-6">
                <HiHashtag />
              </div>
            }
            right={
              <div className="h-4 w-4 lg:h-6 lg:w-6">
                <HiPlus />
              </div>
            }
            toggled={scoreUpdateMode}
            onToggle={(x) => setScoreUpdateMode(x)}
          />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void submitScoreUpdate();
            }}
          >
            <input
              ref={scoreDeltaInputRef}
              type="text"
              inputMode="numeric"
              className="h-10 w-52 rounded-xl bg-slate-300 p-1 text-center text-2xl font-bold text-amber-700 lg:h-14 lg:w-80 lg:text-4xl dark:bg-sky-900 dark:text-amber-500"
              value={scoreUpdateDelta}
              onChange={(e) => {
                const n = Number(e.target.value.match(/^\d+/)?.[0] ?? 0);
                if (!isNaN(n)) {
                  setScoreUpdateDelta(n);
                }
              }}
            />
          </form>
          <Button
            onClick={() => {
              void submitScoreUpdate();
            }}
          >
            {t("common.submit")}
          </Button>
        </div>
      </div>
    </CustomDialog>
  );
}
