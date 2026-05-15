import { type ReactNode, useState } from "react";

import { possibleHanFuValues } from "../../lib/hand";
import CustomDialog from "../layout/CustomDialog";
import H from "../text/H";

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
  const allValues = possibleHanFuValues(agari);
  const [openSelectHan, setOpenSelectHan] = useState(false);
  const [openSelectFu, setOpenSelectFu] = useState(false);

  return (
    <div className="w-full">
      <div className="flex flex-row flex-wrap items-center justify-center gap-x-2">
        <div className="flex flex-col items-center justify-center gap-1 lg:gap-2">
          <p className="text-2xl lg:text-4xl">Han</p>
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
              title="Select Han"
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
                    <H>{han2}</H> Han
                  </Button>
                ))}
                <Button
                  onClick={() => {
                    onHanChange(5);
                    onFuChange(30);
                    setOpenSelectHan(false);
                  }}
                >
                  <H>5</H> Han
                </Button>
                <Button
                  onClick={() => {
                    onHanChange(6);
                    onFuChange(30);
                    setOpenSelectHan(false);
                  }}
                >
                  <H>6-7</H> Han
                </Button>
                <Button
                  onClick={() => {
                    onHanChange(8);
                    onFuChange(30);
                    setOpenSelectHan(false);
                  }}
                >
                  <span className="text-xl font-semibold lg:text-2xl">
                    <H>8-10</H> Han
                  </span>
                </Button>
                <Button
                  onClick={() => {
                    onHanChange(11);
                    onFuChange(30);
                    setOpenSelectHan(false);
                  }}
                >
                  <H>11-12</H> Han
                </Button>
                <Button
                  onClick={() => {
                    onHanChange(13);
                    onFuChange(30);
                    setOpenSelectHan(false);
                  }}
                >
                  <H>13+</H> Han
                </Button>
              </div>
            </CustomDialog>
          )}
        </div>
        <div className="flex flex-col items-center justify-center gap-1 lg:gap-2">
          <p className="text-2xl lg:text-4xl">Fu</p>
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
              title="Select Fu"
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
                    <H>{fu2}</H> Fu
                  </Button>
                ))}
                {(han === 3 || han === 4) && (
                  <Button
                    onClick={() => {
                      onFuChange(han === 3 ? 70 : 40);
                      setOpenSelectFu(false);
                    }}
                  >
                    <H>{han === 3 ? "70+" : "40+"}</H> Fu
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
