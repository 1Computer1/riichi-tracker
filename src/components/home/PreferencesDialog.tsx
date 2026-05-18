import clsx from "clsx";
import { type ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiChip, HiQuestionMarkCircle } from "react-icons/hi";

import useLocalStorage from "../../hooks/useLocalStorage";
import { updateTheme } from "../../lib/util";
import Button from "../Button";
import CustomDialog from "../layout/CustomDialog";
import { HTrans } from "../text/Localized";

export default function PreferencesDialog({
  onClose,
}: {
  onClose: () => void;
}) {
  const { t, i18n } = useTranslation();

  const [theme, setTheme] = useLocalStorage("theme");
  const [language, setLanguage] = useLocalStorage("language");
  const [showTileName, setShowTileName] = useLocalStorage("showTileName");
  const [brightTiles, setBrightTiles] = useLocalStorage("brightTiles");

  return (
    <CustomDialog title={t("home.preferences")} onClose={onClose}>
      <div className="flex flex-col items-center justify-center gap-y-8">
        <div className="flex flex-col items-center justify-center gap-y-2">
          <SettingRow
            name={t("settings.theme.$")}
            help={
              <span>
                <HTrans i18nKey="settings.theme.help" />
              </span>
            }
          >
            <Button
              active={theme === "light"}
              onClick={() => {
                if (theme === "light") setTheme(null);
                else setTheme("light");
                updateTheme();
              }}
            >
              {t("common.light")}
            </Button>
            <Button
              active={theme === "dark"}
              onClick={() => {
                if (theme === "dark") setTheme(null);
                else setTheme("dark");
                updateTheme();
              }}
            >
              {t("common.dark")}
            </Button>
          </SettingRow>
          <SettingRow
            name={t("settings.language.$")}
            help={
              <span>
                <HTrans i18nKey="settings.language.help" />
              </span>
            }
          >
            <Button
              active={language === "en" || language == null}
              onClick={() => {
                setLanguage("en");
                void i18n.changeLanguage("en");
              }}
            >
              English
            </Button>
            <Button
              active={language === "weeb"}
              onClick={() => {
                setLanguage("weeb");
                void i18n.changeLanguage("weeb");
              }}
            >
              English (Japanese)
            </Button>
            {/* <Button
              active={language === "ja"}
              onClick={() => {
                setLanguage("ja");
                void i18n.changeLanguage("ja");
              }}
            >
              日本語
            </Button> */}
          </SettingRow>
          <SettingRow
            name={t("settings.showTileNames.$")}
            help={
              <span>
                <HTrans i18nKey="settings.showTileNames.help" />
              </span>
            }
          >
            <Button
              active={showTileName === "true"}
              onClick={() => setShowTileName("true")}
            >
              {t("settings.common.show")}
            </Button>
            <Button
              active={showTileName !== "true"}
              onClick={() => setShowTileName("false")}
            >
              {t("settings.common.hide")}
            </Button>
          </SettingRow>
          <SettingRow
            name={t("settings.brightTiles.$")}
            help={
              <span>
                <HTrans i18nKey="settings.brightTiles.help" />
              </span>
            }
          >
            <Button
              active={brightTiles === "true"}
              onClick={() => setBrightTiles("true")}
            >
              {t("settings.common.enable")}
            </Button>
            <Button
              active={brightTiles !== "true"}
              onClick={() => setBrightTiles("false")}
            >
              {t("settings.common.disable")}
            </Button>
          </SettingRow>
        </div>
        <div className="flex flex-col items-center justify-center gap-y-2">
          <Button
            onClick={() => {
              onClose();
            }}
          >
            {t("common.close")}
          </Button>
        </div>
      </div>
    </CustomDialog>
  );
}

function SettingRow({
  name,
  help,
  compass = false,
  last = false,
  children,
}: {
  name: string;
  help: ReactNode;
  compass?: boolean;
  last?: boolean;
  children?: ReactNode;
}) {
  const { t } = useTranslation();
  const [helpOpened, setHelpOpened] = useState(false);
  return (
    <div
      className={clsx(
        "flex flex-row flex-wrap items-center justify-center gap-2 lg:flex-nowrap",
        !last && "border-b-2 border-dashed border-gray-800 pb-2",
      )}
    >
      <div className="flex w-60 flex-row items-center justify-between gap-2 lg:w-[20rem]">
        <span className="relative text-xl lg:text-2xl">
          {name}
          {compass && (
            <span
              className="absolute mx-1 h-4 w-4"
              title={t("settings.affectsTheCompass")}
            >
              <HiChip />
            </span>
          )}
        </span>
        <HelpButton
          highlight={helpOpened}
          onClick={() => setHelpOpened(!helpOpened)}
        />
      </div>
      <div className="flex w-56 flex-row flex-wrap items-start justify-center gap-2 md:w-108 lg:w-164">
        {children}
      </div>
      {helpOpened && (
        <CustomDialog title={name} onClose={() => setHelpOpened(false)}>
          <div className="text-lg lg:text-xl">{help}</div>
        </CustomDialog>
      )}
    </div>
  );
}

function HelpButton({
  highlight,
  onClick,
}: {
  highlight?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      className={clsx(
        "rounded-full border border-gray-800 p-1 disabled:bg-gray-300 dark:disabled:bg-gray-800 dark:disabled:text-gray-600",
        highlight
          ? "bg-amber-500 hover:bg-amber-600 dark:bg-amber-700 dark:hover:bg-amber-800"
          : "bg-gray-50 hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-600",
      )}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
    >
      <div className="flex h-6 w-6 flex-col items-center justify-center lg:h-8 lg:w-8">
        <HiQuestionMarkCircle className="text-2xl" />
      </div>
    </button>
  );
}
