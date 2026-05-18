import { type ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";

import { possibleHanFuValues } from "../../lib/hand";
import CustomDialog from "../layout/CustomDialog";
import { FuValue, HanValue } from "../text/Localized";

export default function HanFu({
  han,
  fu,
  agari,
  onHanChange,
  onFuChange,
}: {
  han: number;
  fu: number;
  agari: "ron" | "tsumo";
  onHanChange: (n: number) => void;
  onFuChange: (n: number) => void;
}) {
  const { t } = useTranslation();

  const allValues = possibleHanFuValues(agari);
  const [openSelectHan, setOpenSelectHan] = useState(false);
  const [openSelectFu, setOpenSelectFu] = useState(false);

  return (
    <div className="w-full">
      <div className="flex flex-row flex-wrap items-center justify-center gap-x-2">
        <div className="flex flex-col items-center justify-center gap-1 lg:gap-2">
          <p className="text-2xl lg:text-4xl">{t("common.han")}</p>
          <button
            className="w-24 rounded-xl border border-gray-800 bg-slate-300 px-1 py-4 text-center text-2xl font-bold text-amber-700 shadow hover:bg-slate-400 lg:w-32 lg:px-2 lg:py-6 lg:text-4xl dark:bg-sky-900 dark:text-amber-500 hover:dark:bg-sky-800"
            onClick={() => setOpenSelectHan(true)}
          >
            {han === 6
              ? "6-7"
              : han === 8
                ? "8-10"
                : han === 11
                  ? "11-12"
                  : han === 13
                    ? "13+"
                    : han}
          </button>
          {openSelectHan && (
            <CustomDialog
              title={t("calc.selectHan")}
              onClose={() => setOpenSelectHan(false)}
            >
              <div className="flex w-72 flex-row flex-wrap items-center justify-center gap-1 lg:w-96 lg:gap-2">
                {[...allValues.keys()].map((han2) => (
                  <Button
                    key={han2}
                    onClick={() => {
                      onHanChange(han2);
                      const fus = allValues.get(han2)!;
                      if (!fus.includes(fu)) {
                        onFuChange(fus[0]);
                      }
                      setOpenSelectHan(false);
                    }}
                  >
                    <HanValue han={han2.toString()} />
                  </Button>
                ))}
                <Button
                  onClick={() => {
                    onHanChange(5);
                    onFuChange(30);
                    setOpenSelectHan(false);
                  }}
                >
                  <HanValue han="5" />
                </Button>
                <Button
                  onClick={() => {
                    onHanChange(6);
                    onFuChange(30);
                    setOpenSelectHan(false);
                  }}
                >
                  <HanValue han="6-7" />
                </Button>
                <Button
                  onClick={() => {
                    onHanChange(8);
                    onFuChange(30);
                    setOpenSelectHan(false);
                  }}
                >
                  <HanValue han="8-10" />
                </Button>
                <Button
                  onClick={() => {
                    onHanChange(11);
                    onFuChange(30);
                    setOpenSelectHan(false);
                  }}
                >
                  <HanValue han="11-12" />
                </Button>
                <Button
                  onClick={() => {
                    onHanChange(13);
                    onFuChange(30);
                    setOpenSelectHan(false);
                  }}
                >
                  <HanValue han="13+" />
                </Button>
              </div>
            </CustomDialog>
          )}
        </div>
        <div className="flex flex-col items-center justify-center gap-1 lg:gap-2">
          <p className="text-2xl lg:text-4xl">{t("common.fu")}</p>
          <button
            className="w-24 rounded-xl border border-gray-800 bg-slate-300 px-1 py-4 text-center text-2xl font-bold text-amber-700 shadow enabled:hover:bg-slate-400 lg:w-32 lg:px-2 lg:py-6 lg:text-4xl dark:bg-sky-900 dark:text-amber-500 enabled:hover:dark:bg-sky-800"
            disabled={han >= 5}
            onClick={() => setOpenSelectFu(true)}
          >
            {han >= 5
              ? "--"
              : han === 4 && fu === 40
                ? "40+"
                : han === 3 && fu === 70
                  ? "70+"
                  : fu}
          </button>
          {openSelectFu && (
            <CustomDialog
              title={t("calc.selectFu")}
              onClose={() => setOpenSelectFu(false)}
            >
              <div className="flex w-72 flex-row flex-wrap items-center justify-center gap-1 lg:w-96 lg:gap-2">
                {allValues.get(han)!.map((fu2) => (
                  <Button
                    key={fu2}
                    onClick={() => {
                      onFuChange(fu2);
                      setOpenSelectFu(false);
                    }}
                  >
                    <FuValue fu={fu2.toString()} />
                  </Button>
                ))}
                {(han === 3 || han === 4) && (
                  <Button
                    onClick={() => {
                      onFuChange(han === 3 ? 70 : 40);
                      setOpenSelectFu(false);
                    }}
                  >
                    <FuValue fu={han === 3 ? "70+" : "40+"} />
                  </Button>
                )}
              </div>
            </CustomDialog>
          )}
        </div>
      </div>
    </div>
  );
}

function Button({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className="flex w-32 flex-col items-center justify-center rounded-xl border border-gray-800 bg-slate-300 px-2 py-4 shadow hover:bg-slate-400 lg:w-36 lg:px-4 lg:py-4 dark:bg-sky-900 hover:dark:bg-sky-800"
    >
      <span className="text-xl font-semibold lg:text-2xl">{children}</span>
    </button>
  );
}
