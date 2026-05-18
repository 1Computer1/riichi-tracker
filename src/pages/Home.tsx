import { useState } from "react";
import { useTranslation } from "react-i18next";
import { HiCog } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

import Button from "../components/Button";
import CircleButton from "../components/CircleButton";
import { NewCompassDialog } from "../components/home/NewCompassDialog";
import PreferencesDialog from "../components/home/PreferencesDialog";
import { HTrans } from "../components/text/Localized";
import { DefaultSettings } from "../lib/settings";
import { type CalculatorState, type CompassState } from "../lib/states";
import { useDb } from "../providers/DbProvider";

export default function App() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const db = useDb();
  const toolsGame = db.useGame("$tools");

  const [openNewCompassDialog, setOpenNewCompassDialog] = useState(false);
  const [openPreferencesDialog, setOpenPreferencesDialog] = useState(false);

  return (
    <div className="min-h-screen bg-slate-200 text-black dark:bg-gray-900 dark:text-white">
      <div className="fixed top-0 right-0">
        <a
          href="https://github.com/1Computer1/riichi-tracker"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={`${import.meta.env.BASE_URL}github/github-corner-right.svg`}
          />
        </a>
      </div>
      <div className="fixed top-2 left-2 flex flex-col gap-y-2 lg:top-4 lg:left-4">
        <CircleButton
          onClick={() => {
            setOpenPreferencesDialog(true);
          }}
        >
          <HiCog />
        </CircleButton>
      </div>
      <div className="flex min-h-screen flex-col items-center justify-center gap-y-4 px-2 py-4 lg:gap-y-8">
        <h1 className="text-center text-4xl lg:text-6xl">
          {t("home.riichiTracker")}
        </h1>
        <h2 className="text-center text-xl lg:text-2xl">
          {t("home.keepTrackOfYourGames")}
        </h2>
        <div className="flex flex-row items-start justify-center gap-x-8">
          <div className="flex flex-col items-center justify-center gap-y-2 lg:gap-y-4">
            <div className="flex flex-col items-center justify-center gap-y-2 lg:gap-y-4">
              <Button onClick={() => setOpenNewCompassDialog(true)}>
                {t("home.newGame")}
              </Button>
              <Button
                disabled={toolsGame == null || !toolsGame.ok}
                onClick={() => {
                  const state: CompassState = { t: "load", id: "$tools" };
                  void navigate("/compass", { state, replace: true });
                }}
              >
                {t("common.continue")}
              </Button>
              <Button
                onClick={async () => {
                  const res = await db.getSettings("$global");
                  if (!res.ok) {
                    await db.setSettings("$global", DefaultSettings);
                  }
                  const state: CalculatorState = { t: "load", id: "$global" };
                  void navigate("/calculator", { state, replace: true });
                }}
              >
                {t("home.calculator")}
              </Button>
              <Button
                onClick={() => {
                  void navigate("/reference", { replace: true });
                }}
              >
                {t("home.reference")}
              </Button>
            </div>
          </div>
        </div>
        <ul className="flex list-disc flex-col items-start justify-center gap-y-1 px-6 text-base lg:gap-y-2 lg:text-xl">
          <li>
            <HTrans i18nKey="home.help.createCompass" />
          </li>
          <li>
            <HTrans i18nKey="home.help.addRiichiSticks" />
          </li>
          <li>
            <HTrans i18nKey="home.help.transferScores" />
          </li>
          <li>
            <HTrans i18nKey="home.help.howToInput" />
          </li>
          <li>
            <HTrans i18nKey="home.help.drawsAndRepeats" />
          </li>
          <li>
            <HTrans i18nKey="home.help.manuallyEditScores" />
          </li>
          <li>
            <HTrans i18nKey="home.help.manuallyEditRounds" />
          </li>
          <li>
            <HTrans i18nKey="home.help.placePhone" />
          </li>
          <li>
            <HTrans i18nKey="home.help.useCalculator" />
          </li>
          <li>
            <HTrans i18nKey="home.help.useReference" />
          </li>
        </ul>
      </div>
      {openNewCompassDialog && (
        <NewCompassDialog onClose={() => setOpenNewCompassDialog(false)} />
      )}
      {openPreferencesDialog && (
        <PreferencesDialog onClose={() => setOpenPreferencesDialog(false)} />
      )}
    </div>
  );
}
