import clsx from "clsx";
import { produce } from "immer";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { HiQuestionMarkCircle } from "react-icons/hi";
import { type DraftFunction } from "use-immer";

import { type Yaku, YakuList } from "../../lib/yaku";
import Button from "../Button";
import CustomDialog from "../layout/CustomDialog";
import H from "../text/H";
import { HanValue } from "../text/Localized";
import Tiles from "../Tiles";

export default function YakuDialog({
  yakuList,
  inverted,
  local,
  onChange,
  onClose,
}: {
  yakuList: Set<string>;
  /**
   * If inverted, adds disabled yaku to the set.
   * Otherwise, adds enabled yaku to the set.
   */
  inverted: boolean;
  local: boolean;
  onChange?: (xs: Set<string>) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  return (
    <CustomDialog
      title={local ? t("settings.toggleLocalYaku") : t("settings.toggleYaku.$")}
      onClose={onClose}
    >
      <div className="flex flex-col items-center justify-center gap-y-8">
        {local && !inverted && (
          <Button
            onClick={() => {
              if (onChange) {
                const all = Object.values(YakuList)
                  .filter((y) => y.type === "local")
                  .map((y) => y.id);
                if (yakuList.size === all.length) {
                  onChange(new Set());
                } else {
                  onChange(new Set(all));
                }
              }
            }}
          >
            {t("settings.toggleAll")}
          </Button>
        )}
        <div className="flex flex-col gap-2">
          {Object.values(YakuList)
            .filter((y) => (local ? y.type === "local" : y.type === "optional"))
            .map((y) => (
              <YakuToggle
                key={y.id}
                inverted={inverted}
                yakuList={yakuList}
                yaku={y}
                onChange={onChange}
              />
            ))}
        </div>
        <Button
          onClick={() => {
            onClose();
          }}
        >
          {t("common.close")}
        </Button>
      </div>
    </CustomDialog>
  );
}

function YakuToggle({
  inverted,
  yakuList,
  yaku,
  onChange,
}: {
  inverted: boolean;
  yakuList: Set<string>;
  yaku: Yaku;
  onChange?: (xs: Set<string>) => void;
}) {
  const { t } = useTranslation();
  function change(f: DraftFunction<Set<string>>) {
    const updated = produce(f)(yakuList);
    onChange?.(updated);
  }

  const [helpOpened, setHelpOpened] = useState(false);

  return (
    <div
      key={yaku.id}
      className="flex flex-row items-center justify-center gap-2"
    >
      <button
        className={clsx(
          "rounded-xl border border-gray-800 p-1 shadow disabled:bg-gray-300 lg:p-2 dark:disabled:bg-gray-800 dark:disabled:text-gray-600",
          "h-10 w-52 text-base lg:h-14 lg:w-80 lg:text-xl",
          (inverted ? !yakuList.has(yaku.id) : yakuList.has(yaku.id))
            ? "bg-amber-500 hover:bg-amber-600 dark:bg-amber-700 dark:hover:bg-amber-800"
            : "bg-gray-50 hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-600",
        )}
        onClick={(e) => {
          e.preventDefault();
          change((s) => {
            let together;
            switch (yaku.id) {
              case "海底摸月":
              case "河底撈魚":
                together = ["海底摸月", "河底撈魚"];
                break;
              case "嶺上開花":
              case "搶槓":
                together = ["嶺上開花", "搶槓"];
                break;
              default:
                together = [yaku.id];
            }
            for (const x of together) {
              if (s.has(x)) {
                s.delete(x);
              } else {
                s.add(x);
              }
            }
          });
        }}
      >
        {yaku.text}
      </button>
      {yaku.help && (
        <HelpButton
          highlight={helpOpened}
          onClick={() => setHelpOpened(true)}
        />
      )}
      {helpOpened && (
        <CustomDialog title={yaku.text} onClose={() => setHelpOpened(false)}>
          <div className="flex flex-col gap-2">
            <div className="flex w-full flex-row items-center justify-between">
              {yaku.yakuman ? (
                <span className="text-lg lg:text-xl">
                  <H>
                    {yaku.value > 6
                      ? t(`common.yakuman.over`, "{{value}}× Yakuman", {
                          value: yaku.value,
                        })
                      : t(`common.yakuman.${yaku.value}`)}
                  </H>
                </span>
              ) : (
                <span className="text-lg lg:text-xl">
                  <HanValue han={yaku.value.toString()} />
                </span>
              )}
              <div className="flex flex-row items-center justify-end">
                {yaku.closedOnly && (
                  <span className="text-lg lg:text-xl">
                    <H.Red>{t("reference.closedOnly")}</H.Red>
                  </span>
                )}
                {yaku.openMinus && (
                  <span className="text-lg lg:text-xl">
                    <H.Red>{t("reference.minusIfOpen")}</H.Red>
                  </span>
                )}
              </div>
            </div>
            <div className="text-lg lg:text-xl">{yaku.help}</div>
            {yaku.example && (
              <div className="flex w-full flex-row items-center justify-center">
                <Tiles sets={yaku.example} small />
              </div>
            )}
          </div>
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
