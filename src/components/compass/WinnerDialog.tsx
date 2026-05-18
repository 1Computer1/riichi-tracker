import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { type Game } from "../../data/interfaces";
import { nextWind } from "../../lib/hand";
import { type CalculatorState } from "../../lib/states";
import Button from "../Button";
import TileButton from "../calculator/TileButton";
import CustomDialog from "../layout/CustomDialog";
import HorizontalRow from "../layout/HorizontalRow";
import Toggle from "../Toggle";
import ToggleOnOff from "../ToggleOnOff";

export function WinnerDialog({
  winner,
  gameId,
  game,
  onClose,
}: {
  winner: number;
  gameId: string;
  game: Game;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { bottomWind, roundWind, settings } = game;
  const isSanma = settings.sanma != null;
  const seatWind = nextWind(bottomWind, winner, isSanma);

  const [agari, setAgari] = useState<
    { t: "tsumo" } | { t: "ron"; dealIn: number }
  >({ t: "tsumo" });
  const [handleRotation, setHandleRotation] = useState(seatWind !== "1");
  const [dealerRepeat, setDealerRepeat] = useState(seatWind === "1");
  const [scoreRiichiSticks, setScoreRiichiSticks] = useState(true);
  const [scoreRepeatSticks, setScoreRepeatSticks] = useState(true);
  const [isPao, setIsPao] = useState(false);
  const [paoPlayer, setPaoPlayer] = useState<number | null>(null);

  const submitWinner = () => {
    const state: CalculatorState = {
      t: "transfer",
      id: gameId,
      roundWind,
      seatWind,
      winner,
      handleRotation,
      dealerRepeat,
      scoreRiichiSticks,
      scoreRepeatSticks,
      pao: isPao ? paoPlayer : null,
      ...(agari.t === "tsumo"
        ? { agari: "tsumo" }
        : { agari: "ron", dealtInPlayer: agari.dealIn }),
    };
    void navigate("/calculator", { state, replace: true });
  };

  return (
    <CustomDialog onClose={onClose} title={t("compass.transferPoints")}>
      <div className="flex flex-col items-center justify-center gap-y-8">
        <form
          className="flex flex-col items-center justify-center gap-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            submitWinner();
          }}
        >
          <p className="text-xl lg:text-2xl">
            {t("compass.pointDistribution")}
          </p>
          <Toggle
            toggled={agari.t === "ron"}
            onToggle={(b) => {
              setAgari(
                b
                  ? {
                      t: "ron",
                      dealIn: (isSanma ? [0, 1, 2] : [0, 1, 2, 3]).filter(
                        (i) => i !== winner,
                      )[0],
                    }
                  : { t: "tsumo" },
              );
            }}
            left={t("common.tsumo")}
            right={t("common.ron")}
          />
          {agari.t === "ron" && (
            <>
              <p className="text-xl lg:text-2xl">
                {t("compass.dealtinPlayer")}
              </p>
              <HorizontalRow>
                {(isSanma ? [0, 1, 2] : [0, 1, 2, 3])
                  .filter((i) => i !== winner)
                  .map((i) => (
                    <TileButton
                      key={i}
                      tile={`${nextWind(bottomWind, i, isSanma)}z`}
                      dora={i === agari.dealIn}
                      onClick={() => {
                        setAgari({ t: "ron", dealIn: i });
                        if (paoPlayer === i) {
                          setPaoPlayer(
                            (isSanma ? [0, 1, 2] : [0, 1, 2, 3]).filter(
                              (j) => j !== winner && j !== i,
                            )[0],
                          );
                        }
                      }}
                    />
                  ))}
              </HorizontalRow>
            </>
          )}
          <ToggleOnOff
            toggled={scoreRiichiSticks}
            onToggle={(b) => setScoreRiichiSticks(b)}
          >
            {t("compass.scoreRiichiSticks")}
          </ToggleOnOff>
          <ToggleOnOff
            toggled={scoreRepeatSticks}
            onToggle={(b) => setScoreRepeatSticks(b)}
          >
            {t("compass.scoreRepeatSticks")}
          </ToggleOnOff>
          {settings.usePao && (
            <>
              <ToggleOnOff
                toggled={isPao}
                onToggle={(b) => {
                  setIsPao(b);
                  if (b) {
                    setPaoPlayer(
                      (isSanma ? [0, 1, 2] : [0, 1, 2, 3]).filter(
                        (i) =>
                          i !== winner &&
                          (agari.t === "ron" ? i !== agari.dealIn : true),
                      )[0],
                    );
                  } else {
                    setPaoPlayer(null);
                  }
                }}
              >
                {t("compass.pao")}
              </ToggleOnOff>
              {isPao && (
                <>
                  <p className="text-xl lg:text-2xl">
                    {t("compass.responsiblePlayer")}
                  </p>
                  <HorizontalRow>
                    {(isSanma ? [0, 1, 2] : [0, 1, 2, 3])
                      .filter(
                        (i) =>
                          i !== winner &&
                          (agari.t === "ron" ? i !== agari.dealIn : true),
                      )
                      .map((i) => (
                        <TileButton
                          key={i}
                          tile={`${nextWind(bottomWind, i, isSanma)}z`}
                          dora={i === paoPlayer}
                          onClick={() => setPaoPlayer(i)}
                        />
                      ))}
                  </HorizontalRow>
                </>
              )}
            </>
          )}
          <p className="text-xl lg:text-2xl">{t("compass.seatRotation")}</p>
          {seatWind === "1" && (
            <ToggleOnOff
              toggled={dealerRepeat}
              incompatible={handleRotation}
              onToggle={(b) => {
                setDealerRepeat(b);
                if (b) {
                  setHandleRotation(false);
                }
              }}
            >
              {t("compass.dealerRepeat")}
            </ToggleOnOff>
          )}
          <ToggleOnOff
            toggled={handleRotation}
            incompatible={seatWind === "1" && dealerRepeat}
            onToggle={(b) => {
              setHandleRotation(b);
              if (b) {
                if (seatWind === "1") {
                  setDealerRepeat(false);
                }
              }
            }}
          >
            {t("compass.rotateSeats")}
          </ToggleOnOff>
        </form>
        <Button
          onClick={() => {
            void submitWinner();
          }}
        >
          {t("compass.calculateHand")}
        </Button>
      </div>
    </CustomDialog>
  );
}
