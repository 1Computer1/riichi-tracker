import clsx from "clsx";
import { produce } from "immer";
import { type ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiChip, HiQuestionMarkCircle } from "react-icons/hi";
import type { DraftFunction } from "use-immer";

import type { ScoreSettings } from "../../lib/settings";
import { useDb } from "../../providers/DbProvider";
import Button from "../Button";
import CustomDialog from "../layout/CustomDialog";
import { HTrans } from "../text/Localized";
import YakuDialog from "./YakuDialog";

export default function SettingsDialog({
  settings,
  inCalculator,
  allowCopy = false,
  onSettingsChange,
  onClose,
}: {
  settings: ScoreSettings;
  inCalculator: boolean;
  allowCopy?: boolean;
  onSettingsChange?: (s: ScoreSettings) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const db = useDb();
  const globalSettings = db.useSettings("$global", { enabled: allowCopy });

  const [optionalYakuOpened, setOptionalYakuOpened] = useState(false);
  const [localYakuOpened, setLocalYakuOpened] = useState(false);

  function change(f: DraftFunction<ScoreSettings>) {
    const updated = produce(f)(settings);
    onSettingsChange?.(updated);
  }

  return (
    <CustomDialog title="Settings" onClose={onClose}>
      <div className="flex flex-col items-center justify-center gap-y-8">
        <div className="flex flex-col items-center justify-center gap-y-2">
          <SettingRow
            name={t("settings.gameMode.$")}
            help={
              <span>
                <HTrans i18nKey="settings.gameMode.help" />
              </span>
            }
          >
            <Button
              active={settings.sanma == null}
              onClick={() =>
                change((s) => {
                  s.sanma = null;
                })
              }
            >
              {t("settings.gameMode.fourPlayer")}
            </Button>
            <Button
              active={settings.sanma != null}
              onClick={() =>
                change((s) => {
                  s.sanma = "loss";
                })
              }
            >
              {t("settings.gameMode.threePlayer")}
            </Button>
          </SettingRow>
          {settings.sanma != null && (
            <>
              <SettingRow
                name={t("settings.tsumoPoints.$")}
                help={
                  <span>
                    <HTrans i18nKey="settings.tsumoPoints.help" />
                  </span>
                }
              >
                <Button
                  active={settings.sanma === "loss"}
                  onClick={() =>
                    change((s) => {
                      s.sanma = "loss";
                    })
                  }
                >
                  {t("settings.tsumoPoints.loss")}
                </Button>
                <Button
                  active={settings.sanma === "bisection"}
                  onClick={() =>
                    change((s) => {
                      s.sanma = "bisection";
                    })
                  }
                >
                  {t("settings.tsumoPoints.bisection")}
                </Button>
              </SettingRow>
              <SettingRow
                name={t("settings.northTiles.$")}
                help={
                  <span>
                    <HTrans i18nKey="settings.northTiles.help" />
                  </span>
                }
              >
                <Button
                  active={!settings.northYakuhai}
                  onClick={() =>
                    change((s) => {
                      s.northYakuhai = false;
                    })
                  }
                >
                  {t("settings.northTiles.kita")}
                </Button>
                <Button
                  active={settings.northYakuhai}
                  onClick={() =>
                    change((s) => {
                      s.northYakuhai = true;
                    })
                  }
                >
                  {t("settings.northTiles.yakuhai")}
                </Button>
              </SettingRow>
            </>
          )}
          <SettingRow
            name={t("settings.redFives.$")}
            help={
              <span>
                <HTrans i18nKey="settings.redFives.help" />
              </span>
            }
          >
            <Button
              active={settings.akadora}
              onClick={() =>
                change((s) => {
                  s.akadora = true;
                })
              }
            >
              {t("settings.redFives.enable", {
                fives: settings.sanma ? "2" : "3",
              })}
            </Button>
            <Button
              active={!settings.akadora}
              onClick={() =>
                change((s) => {
                  s.akadora = false;
                })
              }
            >
              {t("settings.redFives.disable")}
            </Button>
          </SettingRow>
          <SettingRow
            name={t("settings.toggleYaku.$")}
            help={
              <span>
                <HTrans i18nKey="settings.toggleYaku.help" />
              </span>
            }
          >
            <Button onClick={() => setOptionalYakuOpened(true)}>
              {t("settings.toggleYaku.optional", {
                length: settings.disabledYaku.length,
              })}
            </Button>
            <Button onClick={() => setLocalYakuOpened(true)}>
              {t("settings.toggleYaku.local", {
                length: settings.enabledLocalYaku.length,
              })}
            </Button>
            {optionalYakuOpened && (
              <YakuDialog
                yakuList={new Set(settings.disabledYaku)}
                onChange={(y) =>
                  change((s) => {
                    s.disabledYaku = [...y];
                  })
                }
                inverted
                local={false}
                onClose={() => setOptionalYakuOpened(false)}
              />
            )}
            {localYakuOpened && (
              <YakuDialog
                yakuList={new Set(settings.enabledLocalYaku)}
                onChange={(y) =>
                  change((s) => {
                    s.enabledLocalYaku = [...y];
                  })
                }
                inverted={false}
                local
                onClose={() => setLocalYakuOpened(false)}
              />
            )}
          </SettingRow>
          <SettingRow
            name={t("settings.otherScoring.$")}
            help={
              <span>
                <HTrans i18nKey="settings.otherScoring.help" />
              </span>
            }
          >
            <Button
              active={settings.otherScoring}
              onClick={() =>
                change((s) => {
                  s.otherScoring = true;
                })
              }
            >
              {t("settings.common.show")}
            </Button>
            <Button
              active={!settings.otherScoring}
              onClick={() =>
                change((s) => {
                  s.otherScoring = false;
                })
              }
            >
              {t("settings.common.hide")}
            </Button>
          </SettingRow>
          {!inCalculator && (
            <SettingRow
              name={t("settings.paoPayment.$")}
              compass
              help={
                <span>
                  <HTrans i18nKey="settings.paoPayment.help" />
                </span>
              }
            >
              <Button
                active={settings.usePao}
                onClick={() =>
                  change((s) => {
                    s.usePao = true;
                  })
                }
              >
                {t("settings.common.show")}
              </Button>
              <Button
                active={!settings.usePao}
                onClick={() =>
                  change((s) => {
                    s.usePao = false;
                  })
                }
              >
                {t("settings.common.hide")}
              </Button>
            </SettingRow>
          )}
          <SettingRow
            name={t("settings.roundedMangan.$")}
            help={
              <span>
                <HTrans i18nKey="settings.roundedMangan.help" />
              </span>
            }
          >
            <Button
              active={settings.kiriageMangan}
              onClick={() =>
                change((s) => {
                  s.kiriageMangan = true;
                })
              }
            >
              {t("settings.roundedMangan.rounded")}
            </Button>
            <Button
              active={!settings.kiriageMangan}
              onClick={() =>
                change((s) => {
                  s.kiriageMangan = false;
                })
              }
            >
              {t("settings.roundedMangan.noRounding")}
            </Button>
          </SettingRow>
          <SettingRow
            name={t("settings.countedYakuman.$")}
            help={
              <span>
                <HTrans i18nKey="settings.countedYakuman.help" />
              </span>
            }
          >
            <Button
              active={settings.kazoeYakuman}
              onClick={() =>
                change((s) => {
                  s.kazoeYakuman = true;
                })
              }
            >
              {t("settings.countedYakuman.yakuman")}
            </Button>
            <Button
              active={!settings.kazoeYakuman}
              onClick={() =>
                change((s) => {
                  s.kazoeYakuman = false;
                })
              }
            >
              {t("settings.countedYakuman.sanbaiman")}
            </Button>
          </SettingRow>
          <SettingRow
            name={t("settings.yakumanStacking.$")}
            help={
              <span>
                <HTrans i18nKey="settings.yakumanStacking.help" />
              </span>
            }
          >
            <Button
              active={settings.multiYakuman}
              onClick={() =>
                change((s) => {
                  s.multiYakuman = true;
                })
              }
            >
              {t("settings.common.allow")}
            </Button>
            <Button
              active={!settings.multiYakuman}
              onClick={() =>
                change((s) => {
                  s.multiYakuman = false;
                })
              }
            >
              {t("settings.common.disallow")}
            </Button>
          </SettingRow>

          {settings.multiYakuman && (
            <SettingRow
              name={t("settings.doubleYakuman.$")}
              help={
                <span>
                  <HTrans i18nKey="settings.doubleYakuman.help" />
                  <ul className="list-inside list-disc">
                    <li className="list-item">{t("yaku.daisuushii.$")}</li>
                    <li className="list-item">
                      {t("yaku.kokushimusoujuusanmenmachi.$")}
                    </li>
                    <li className="list-item">
                      {t("yaku.junseichuurenpoutou.$")}
                    </li>
                    <li className="list-item">
                      {t("yaku.suuankoutankimachi.$")}
                    </li>
                  </ul>
                </span>
              }
            >
              <Button
                active={settings.doubleYakuman}
                onClick={() =>
                  change((s) => {
                    s.doubleYakuman = true;
                  })
                }
              >
                {t("settings.common.allow")}
              </Button>
              <Button
                active={!settings.doubleYakuman}
                onClick={() =>
                  change((s) => {
                    s.doubleYakuman = false;
                  })
                }
              >
                {t("settings.common.disallow")}
              </Button>
            </SettingRow>
          )}
          <SettingRow
            name={t("settings.openAllSimples.$")}
            help={
              <span>
                <HTrans i18nKey="settings.openAllSimples.help" />
              </span>
            }
          >
            <Button
              active={settings.openTanyao}
              onClick={() =>
                change((s) => {
                  s.openTanyao = true;
                })
              }
            >
              {t("settings.common.allow")}
            </Button>
            <Button
              active={!settings.openTanyao}
              onClick={() =>
                change((s) => {
                  s.openTanyao = false;
                })
              }
            >
              {t("settings.common.disallow")}
            </Button>
          </SettingRow>
          <SettingRow
            name={t("settings.allGreensDragon.$")}
            help={
              <span>
                <HTrans i18nKey="settings.allGreensDragon.help" />
              </span>
            }
          >
            <Button
              active={settings.ryuuiisouHatsu}
              onClick={() =>
                change((s) => {
                  s.ryuuiisouHatsu = true;
                })
              }
            >
              {t("settings.allGreensDragon.required")}
            </Button>
            <Button
              active={!settings.ryuuiisouHatsu}
              onClick={() =>
                change((s) => {
                  s.ryuuiisouHatsu = false;
                })
              }
            >
              {t("settings.allGreensDragon.optional")}
            </Button>
          </SettingRow>
          <SettingRow
            name={t("settings.doubleWindFu.$")}
            help={
              <span>
                <HTrans i18nKey="settings.doubleWindFu.help" />
              </span>
            }
          >
            <Button
              active={settings.doubleWindFu}
              onClick={() =>
                change((s) => {
                  s.doubleWindFu = true;
                })
              }
            >
              {t("settings.doubleWindFu.fourFu")}
            </Button>
            <Button
              active={!settings.doubleWindFu}
              onClick={() =>
                change((s) => {
                  s.doubleWindFu = false;
                })
              }
            >
              {t("settings.doubleWindFu.twoFu")}
            </Button>
          </SettingRow>
          <SettingRow
            name={t("settings.afterKanFu.$")}
            help={
              <span>
                <HTrans i18nKey="settings.afterKanFu.help" />
              </span>
            }
          >
            <Button
              active={settings.rinshanFu}
              onClick={() =>
                change((s) => {
                  s.rinshanFu = true;
                })
              }
            >
              {t("settings.afterKanFu.twoFu")}
            </Button>
            <Button
              active={!settings.rinshanFu}
              onClick={() =>
                change((s) => {
                  s.rinshanFu = false;
                })
              }
            >
              {t("settings.afterKanFu.zeroFu")}
            </Button>
          </SettingRow>
          <SettingRow
            name={t("settings.noYakuFu.$")}
            help={
              <span>
                <HTrans i18nKey="settings.noYakuFu.help" />
              </span>
            }
          >
            <Button
              active={settings.noYakuFu}
              onClick={() =>
                change((s) => {
                  s.noYakuFu = true;
                })
              }
            >
              {t("settings.common.allow")}
            </Button>
            <Button
              active={!settings.noYakuFu}
              onClick={() =>
                change((s) => {
                  s.noYakuFu = false;
                })
              }
            >
              {t("settings.common.disallow")}
            </Button>
          </SettingRow>
          <SettingRow
            last
            name={t("settings.noYakuDora.$")}
            help={
              <span>
                <HTrans i18nKey="settings.noYakuDora.help" />
              </span>
            }
          >
            <Button
              active={settings.noYakuDora}
              onClick={() =>
                change((s) => {
                  s.noYakuDora = true;
                })
              }
            >
              {t("settings.common.allow")}
            </Button>
            <Button
              active={!settings.noYakuDora}
              onClick={() =>
                change((s) => {
                  s.noYakuDora = false;
                })
              }
            >
              {t("settings.common.disallow")}
            </Button>
          </SettingRow>
        </div>
        <div className="flex flex-col items-center justify-center gap-y-2">
          {allowCopy && globalSettings?.ok && (
            <Button
              onClick={() => {
                change(() => globalSettings.value);
              }}
            >
              {t("settings.copyFromCalculator")}
            </Button>
          )}
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
