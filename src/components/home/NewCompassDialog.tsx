import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import useLocalStorage from "../../hooks/useLocalStorage";
import { type Wind } from "../../lib/hand";
import { DefaultSettings } from "../../lib/settings";
import { type CompassState } from "../../lib/states";
import { replicate } from "../../lib/util";
import { useDb } from "../../providers/DbProvider";
import Button from "../Button";
import WindSelect from "../calculator/WindSelect";
import CustomDialog from "../layout/CustomDialog";
import SettingsDialog from "../settings/SettingsDialog";
import ToggleOnOff from "../ToggleOnOff";

export function NewCompassDialog({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const db = useDb();

  const [openedSettings, setOpenedSettings] = useState(false);
  const [newCompassInitialScore, setNewCompassInitialScore] = useState(25000);
  const [newCompassBottomWind, setNewCompassBottomWind] = useState<Wind>("1");
  const [newCompassSettings, setNewCompassSettings] = useState(DefaultSettings);
  const initialScoreInputRef = useRef<HTMLInputElement | null>(null);

  const [useFourWayCompass, setUseFourWayCompass] =
    useLocalStorage("useFourWayCompass");
  const [prefersQuick, setPrefersQuick] = useLocalStorage("prefersQuick");

  const submitNewCompass = async () => {
    await db.setGame("$tools", {
      bottomWind: newCompassBottomWind,
      roundWind: "1",
      round: 1,
      repeats: 0,
      scores: replicate(
        newCompassInitialScore,
        newCompassSettings.sanma ? 3 : 4,
      ),
      riichiSticks: 0,
      riichi: replicate(false, newCompassSettings.sanma ? 3 : 4),
      settings: newCompassSettings,
    });
    const state: CompassState = { t: "load", id: "$tools" };
    void navigate("/compass", { state, replace: true });
  };

  return (
    <CustomDialog
      initialFocus={initialScoreInputRef}
      onClose={onClose}
      title="New Game"
    >
      <div className="flex flex-col items-center justify-center gap-y-8">
        <form
          className="flex flex-col items-center justify-center gap-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            void submitNewCompass();
          }}
        >
          <p className="text-xl lg:text-2xl">Initial Score</p>
          <input
            ref={initialScoreInputRef}
            key="scoreInput"
            type="text"
            inputMode="numeric"
            className="h-10 w-52 rounded-xl bg-slate-300 p-1 text-center text-2xl font-bold text-amber-700 lg:h-14 lg:w-80 lg:text-4xl dark:bg-sky-900 dark:text-amber-500"
            value={newCompassInitialScore}
            onChange={(e) => {
              const n = Number(e.target.value.match(/^\d+/)?.[0] ?? 0);
              if (!isNaN(n)) {
                setNewCompassInitialScore(n);
              }
            }}
          />
          <p className="text-xl lg:text-2xl">Your Seat Wind</p>
          <div>
            <WindSelect
              value={newCompassBottomWind}
              redEast
              sanma={newCompassSettings.sanma != null}
              onChange={(w) => setNewCompassBottomWind(w)}
            />
          </div>
          <ToggleOnOff
            toggled={useFourWayCompass !== "false"}
            onToggle={() =>
              setUseFourWayCompass(
                useFourWayCompass === "false" ? "true" : "false",
              )
            }
          >
            Four-Way Compass
          </ToggleOnOff>
          <ToggleOnOff
            toggled={prefersQuick === "true"}
            onToggle={() =>
              setPrefersQuick(prefersQuick === "true" ? "false" : "true")
            }
          >
            Prefer Han &amp; Fu Input
          </ToggleOnOff>
          <ToggleOnOff
            toggled={openedSettings}
            onToggle={() => setOpenedSettings(true)}
          >
            Settings
          </ToggleOnOff>
          {openedSettings && (
            <SettingsDialog
              allowCopy
              inCalculator={false}
              settings={newCompassSettings}
              onSettingsChange={(s) => {
                setNewCompassSettings(s);
                if (s.sanma == null) {
                  setNewCompassInitialScore(25000);
                } else {
                  setNewCompassInitialScore(35000);
                }
              }}
              onClose={() => {
                setOpenedSettings(false);
              }}
            />
          )}
        </form>
        <Button
          onClick={() => {
            void submitNewCompass();
          }}
        >
          Create Compass
        </Button>
      </div>
    </CustomDialog>
  );
}
