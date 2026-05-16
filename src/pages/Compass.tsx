import clsx from "clsx";
import { useEffect, useState } from "react";
import { HiArrowLeft, HiArrowUp, HiCog } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";

import TileButton from "../components/calculator/TileButton";
import CircleButton from "../components/CircleButton";
import { AdvancedDialog } from "../components/compass/AdvancedDialog";
import { DrawDialog } from "../components/compass/DrawDialog";
import ScoreDisplay from "../components/compass/ScoreDisplay";
import { ScoreUpdateDialog } from "../components/compass/ScoreUpdateDialog";
import { WinnerDialog } from "../components/compass/WinnerDialog";
import BlocksShuffleThree from "../components/loading/react-svg-spinners/BlocksShuffleThree";
import { type Game } from "../data/interfaces";
import useLocalStorage from "../hooks/useLocalStorage";
import { nextWind, translateWind } from "../lib/hand";
import { type CompassState } from "../lib/states";
import { useDb } from "../providers/DbProvider";

export default function Compass() {
  const db = useDb();
  const navigate = useNavigate();
  const location = useLocation();

  const locState: CompassState = (location.state as CompassState | null) ?? {
    t: "load",
    id: "$tools",
  };
  const game = db.useGame(locState.id);

  useEffect(() => {
    if (game == null) {
      return;
    }
    if (!game.ok) {
      void navigate("/", { replace: true });
    }
  }, [game, navigate]);

  return (
    <div className="h-screen w-screen bg-slate-200 text-black dark:bg-gray-900 dark:text-white">
      {game == null ? (
        <div className="flex h-screen w-screen flex-col items-center justify-center">
          <div className="h-24 w-24 fill-black dark:fill-white">
            <BlocksShuffleThree />
          </div>
        </div>
      ) : game.ok ? (
        <CompassWithGame locState={locState} game={game.value} />
      ) : (
        <div className="flex h-screen w-screen flex-col items-center justify-center">
          <div className="font-mono">
            Error: Game {locState.id} does not exist.
          </div>
        </div>
      )}
    </div>
  );
}

function CompassWithGame({
  locState,
  game,
}: {
  locState: CompassState;
  game: Game;
}) {
  const db = useDb();
  const navigate = useNavigate();

  const [useFourWayCompass] = useLocalStorage("useFourWayCompass");

  const { roundWind, round, repeats, scores, riichi, riichiSticks, settings } =
    game;

  const [oldScores, setOldScores] = useState<number[] | undefined>(
    locState.oldScores,
  );
  const [scoreUpdater, setScoreUpdater] = useState<number | null>(null);
  const [winner, setWinner] = useState<number | null>(null);
  const [openDrawDialog, setOpenDrawDialog] = useState(false);
  const [openAdvancedDialog, setOpenAdvancedDialog] = useState(false);

  const toggleRiichiStick = async (ix: number) => {
    if (riichi[ix]) {
      const scores_ = scores.slice();
      scores_[ix] = scores[ix] + 1000;
      const riichi_ = riichi.slice();
      riichi_[ix] = false;
      await db.setGame(locState.id, {
        ...game,
        scores: scores_,
        riichiSticks: riichiSticks - 1,
        riichi: riichi_,
      });
    } else {
      const scores_ = scores.slice();
      scores_[ix] = scores[ix] - 1000;
      const riichi_ = riichi.slice();
      riichi_[ix] = true;
      await db.setGame(locState.id, {
        ...game,
        scores: scores_,
        riichiSticks: riichiSticks + 1,
        riichi: riichi_,
      });
    }
  };

  return useFourWayCompass !== "false" ? (
    <div className="relative h-screen w-screen">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <div className="h-fit w-[min(70vh,70vw)]">
          <ScoreDisplayInCompass
            ix={0}
            oldScores={oldScores}
            game={game}
            onScoreClick={() => setScoreUpdater(0)}
            onTileClick={() => setWinner(0)}
            onRiichiClick={() => void toggleRiichiStick(0)}
          />
        </div>
      </div>
      <div className="absolute top-1/2 right-0 -translate-y-1/2">
        <div className="h-[min(70vh,70vw)] w-fit rotate-180">
          <ScoreDisplayInCompass
            vertical
            ix={1}
            oldScores={oldScores}
            game={game}
            onScoreClick={() => setScoreUpdater(1)}
            onTileClick={() => setWinner(1)}
            onRiichiClick={() => void toggleRiichiStick(1)}
          />
        </div>
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2">
        <div className="h-fit w-[min(70vh,70vw)] rotate-180">
          <ScoreDisplayInCompass
            ix={2}
            oldScores={oldScores}
            game={game}
            onScoreClick={() => setScoreUpdater(2)}
            onTileClick={() => setWinner(2)}
            onRiichiClick={() => void toggleRiichiStick(2)}
          />
        </div>
      </div>
      {settings.sanma == null && (
        <div className="absolute top-1/2 left-0 -translate-y-1/2">
          <div className="h-[min(70vh,70vw)] w-fit">
            <ScoreDisplayInCompass
              vertical
              ix={3}
              oldScores={oldScores}
              game={game}
              onScoreClick={() => setScoreUpdater(3)}
              onTileClick={() => setWinner(3)}
              onRiichiClick={() => void toggleRiichiStick(3)}
            />
          </div>
        </div>
      )}
      {scoreUpdater != null && (
        <ScoreUpdateDialog
          gameId={locState.id}
          game={game}
          scoreUpdater={scoreUpdater}
          onScoreUpdate={(x) => setOldScores(x)}
          onClose={() => setScoreUpdater(null)}
        />
      )}
      {winner != null && (
        <WinnerDialog
          gameId={locState.id}
          game={game}
          winner={winner}
          onClose={() => setWinner(null)}
        />
      )}
      {openDrawDialog && (
        <DrawDialog
          gameId={locState.id}
          game={game}
          onScoreUpdate={(x) => setOldScores(x)}
          onClose={() => setOpenDrawDialog(false)}
        />
      )}
      {openAdvancedDialog && (
        <AdvancedDialog
          gameId={locState.id}
          game={game}
          onClose={() => setOpenAdvancedDialog(false)}
        />
      )}
      <div
        data-1c1
        className={clsx(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-slate-300 shadow dark:bg-sky-900",
          "portrait:h-[min(min(70vw,70vh),calc(100vh-16rem))] portrait:p-1.5 portrait:lg:h-[min(min(70vw,70vh),calc(100vh-24rem))] portrait:lg:px-2 portrait:lg:py-2",
          "landscape:w-[min(min(70vw,70vh),calc(100vw-16rem))] landscape:p-1.5 landscape:lg:w-[min(min(70vw,70vh),calc(100vw-24rem))] landscape:lg:px-2 landscape:lg:py-2",
        )}
      >
        <div
          className={clsx(
            "flex items-center justify-between gap-4",
            "portrait:h-full portrait:flex-col",
            "landscape:w-full landscape:flex-row",
          )}
        >
          <div
            className={clsx(
              "portrait:mx-2 portrait:-my-2 portrait:rotate-90",
              "flex flex-col items-center justify-center",
            )}
          >
            <TileButton
              onClick={() => {
                setOpenDrawDialog(true);
              }}
              tile={`${roundWind}z`}
            />
          </div>
          <span
            className={clsx(
              "flex items-center justify-between gap-y-2 text-xl lg:text-4xl",
              "portrait:flex-col-reverse portrait:[writing-mode:vertical-lr]",
              "landscape:flex-col",
            )}
          >
            <span>
              {translateWind(roundWind)} {round}
            </span>
            <span className="flex flex-row items-center justify-center gap-x-4">
              <span className="flex flex-row items-center justify-center gap-x-2">
                <span
                  className={clsx(
                    "rotate-90 text-slate-900 dark:text-slate-400",
                    "portrait:mr-0.5 portrait:lg:mr-2",
                    "landscape:mt-2 landscape:lg:mt-2",
                  )}
                >
                  ⠿
                </span>
                <span>{repeats}</span>
              </span>
              <span className="flex flex-row items-center justify-center gap-x-2">
                <span
                  className={clsx(
                    "text-red-500 dark:text-red-600",
                    "portrait:mr-0.5 portrait:lg:mr-2",
                  )}
                >
                  ●
                </span>
                <span>{riichiSticks}</span>
              </span>
            </span>
          </span>
          <div
            className={clsx(
              "flex gap-2",
              "portrait:flex-row-reverse",
              "landscape:flex-col",
            )}
          >
            <div className="portrait:hidden">
              <CircleButton
                onClick={() => {
                  void navigate("/", { replace: true });
                }}
              >
                <HiArrowLeft />
              </CircleButton>
            </div>
            <div className="landscape:hidden">
              <CircleButton
                onClick={() => {
                  void navigate("/", { replace: true });
                }}
              >
                <HiArrowUp />
              </CircleButton>
            </div>
            <CircleButton
              onClick={() => {
                setOpenAdvancedDialog(true);
              }}
            >
              <HiCog />
            </CircleButton>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-row justify-center">
      <div className="h-screen w-full overflow-y-auto">
        <div className="flex min-h-screen w-full flex-col items-center justify-center gap-y-2 p-2">
          <div
            data-1c1
            className="h-fit w-[min(70vh,70vw)] rounded-xl bg-slate-300 p-1.5 shadow lg:px-2 lg:py-2 dark:bg-sky-900"
          >
            <div className="flex w-full flex-row items-center justify-between gap-4">
              <div className="flex flex-col items-center justify-center">
                <TileButton
                  onClick={() => {
                    setOpenDrawDialog(true);
                  }}
                  tile={`${roundWind}z`}
                />
              </div>
              <span className="flex flex-col items-center justify-between gap-y-2 text-xl lg:text-4xl">
                <span>
                  {translateWind(roundWind)} {round}
                </span>
                <span className="flex flex-row items-center justify-center gap-x-4">
                  <span className="flex flex-row items-center justify-center gap-x-2">
                    <span className="mt-2 rotate-90 text-slate-900 lg:mt-2 dark:text-slate-400">
                      ⠿
                    </span>
                    <span>{repeats}</span>
                  </span>
                  <span className="flex flex-row items-center justify-center gap-x-2">
                    <span className="text-red-500 dark:text-red-600">●</span>
                    <span>{riichiSticks}</span>
                  </span>
                </span>
              </span>
              <div className="flex flex-col gap-2">
                <CircleButton
                  onClick={() => {
                    void navigate("/", { replace: true });
                  }}
                >
                  <HiArrowLeft />
                </CircleButton>
                <CircleButton
                  onClick={() => {
                    setOpenAdvancedDialog(true);
                  }}
                >
                  <HiCog />
                </CircleButton>
              </div>
            </div>
          </div>
          <div className="h-fit w-[min(70vh,70vw)]">
            <ScoreDisplayInCompass
              ix={0}
              oldScores={oldScores}
              game={game}
              onScoreClick={() => setScoreUpdater(0)}
              onTileClick={() => setWinner(0)}
              onRiichiClick={() => void toggleRiichiStick(0)}
              playerLabel="P1"
            />
          </div>
          <div className="h-fit w-[min(70vh,70vw)]">
            <ScoreDisplayInCompass
              ix={1}
              oldScores={oldScores}
              game={game}
              onScoreClick={() => setScoreUpdater(1)}
              onTileClick={() => setWinner(1)}
              onRiichiClick={() => void toggleRiichiStick(1)}
              playerLabel="P2"
            />
          </div>
          <div className="h-fit w-[min(70vh,70vw)]">
            <ScoreDisplayInCompass
              ix={2}
              oldScores={oldScores}
              game={game}
              onScoreClick={() => setScoreUpdater(2)}
              onTileClick={() => setWinner(2)}
              onRiichiClick={() => void toggleRiichiStick(2)}
              playerLabel="P3"
            />
          </div>
          {settings.sanma == null && (
            <div className="h-fit w-[min(70vh,70vw)]">
              <ScoreDisplayInCompass
                ix={3}
                oldScores={oldScores}
                game={game}
                onScoreClick={() => setScoreUpdater(3)}
                onTileClick={() => setWinner(3)}
                onRiichiClick={() => void toggleRiichiStick(3)}
                playerLabel="P4"
              />
            </div>
          )}
        </div>
      </div>
      {scoreUpdater != null && (
        <ScoreUpdateDialog
          gameId={locState.id}
          game={game}
          scoreUpdater={scoreUpdater}
          onScoreUpdate={(x) => setOldScores(x)}
          onClose={() => setScoreUpdater(null)}
        />
      )}
      {winner != null && (
        <WinnerDialog
          gameId={locState.id}
          game={game}
          winner={winner}
          onClose={() => setWinner(null)}
        />
      )}
      {openDrawDialog && (
        <DrawDialog
          gameId={locState.id}
          game={game}
          onScoreUpdate={(x) => setOldScores(x)}
          onClose={() => setOpenDrawDialog(false)}
        />
      )}
      {openAdvancedDialog && (
        <AdvancedDialog
          gameId={locState.id}
          game={game}
          onClose={() => setOpenAdvancedDialog(false)}
        />
      )}
    </div>
  );
}

function ScoreDisplayInCompass({
  game,
  ix,
  oldScores,
  vertical = false,
  onScoreClick,
  onTileClick,
  onRiichiClick,
  playerLabel,
}: {
  game: Game;
  ix: number;
  oldScores?: number[];
  vertical?: boolean;
  onScoreClick?: () => void;
  onTileClick?: () => void;
  onRiichiClick?: () => void;
  playerLabel?: string;
}) {
  const { bottomWind, scores, riichi, settings } = game;
  return (
    <ScoreDisplay
      vertical={vertical}
      score={scores[ix]}
      oldScore={oldScores?.[ix]}
      riichi={riichi[ix]}
      isSanma={settings.sanma != null}
      seatWind={nextWind(bottomWind, ix, settings.sanma != null)}
      onScoreClick={onScoreClick}
      onTileClick={onTileClick}
      onRiichiClick={onRiichiClick}
      playerLabel={playerLabel}
    />
  );
}
