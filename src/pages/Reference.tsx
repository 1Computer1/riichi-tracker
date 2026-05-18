import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import clsx from "clsx";
import { Fragment, type ReactNode, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { HiArrowLeft, HiArrowRight, HiArrowUp } from "react-icons/hi";
import { useNavigate, useSearchParams } from "react-router-dom";

import Button from "../components/Button";
import TileButton from "../components/calculator/TileButton";
import CircleButton from "../components/CircleButton";
import JumpButton from "../components/JumpButton";
import VerticalRow from "../components/layout/VerticalRow";
import H from "../components/text/H";
import {
  FuValue,
  HanFuValue,
  HanValue,
  HTrans,
} from "../components/text/Localized";
import Tiles from "../components/Tiles";
import Toggle from "../components/Toggle";
import { calculateHanFu, type TileCode, TilesBySuit } from "../lib/hand";
import { DefaultSettings, type ScoreSettings } from "../lib/settings";
import {
  referenceToYaku,
  type Yaku,
  type YakuReferenceNode,
  YakuReferenceSort,
} from "../lib/yaku";

export default function Reference() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const tabs = ["tiles", "yaku", "scoring"];
  const [params, setSearchParams] = useSearchParams();
  const [tabsEl, setTabsEl] = useState<Element | null>(null);

  return (
    <div className="min-h-screen bg-slate-200 text-black dark:bg-gray-900 dark:text-white">
      <div className="flex flex-row justify-center">
        <div className="h-screen w-full overflow-y-auto">
          <div className="fixed top-2 left-2 z-10 flex flex-col gap-y-2 lg:top-4 lg:left-4">
            <CircleButton
              onClick={() => {
                void navigate("/", { replace: true });
              }}
            >
              <HiArrowLeft />
            </CircleButton>
          </div>
          <div className="invisible fixed right-2 bottom-2 z-10 flex flex-col gap-y-2 sm:visible lg:right-8 lg:bottom-4">
            <JumpButton element={tabsEl}>
              <HiArrowUp />
            </JumpButton>
          </div>
          <div
            ref={setTabsEl}
            className="flex w-full flex-col items-center justify-center gap-y-2"
          >
            <div className="flex w-full flex-col items-center justify-center gap-y-2 px-2 py-2">
              <h1 className="text-2xl lg:text-4xl">
                {t("reference.reference")}
              </h1>
            </div>
            <TabGroup
              defaultIndex={
                params.has("tab") ? tabs.indexOf(params.get("tab")!) : 0
              }
              onChange={(i) => {
                setSearchParams({ tab: tabs[i] }, { replace: true });
              }}
              as={Fragment}
            >
              <TabList className="mb-2 flex flex-row flex-wrap items-center justify-center gap-2">
                <StyledTab>{t("reference.tiles")}</StyledTab>
                <StyledTab>{t("reference.yakuList")}</StyledTab>
                <StyledTab>{t("reference.scoringTable")}</StyledTab>
              </TabList>
              <TabPanels className="flex min-h-screen w-full flex-col justify-center bg-slate-300 px-2 py-4 lg:py-8 dark:bg-sky-900">
                <TabPanel>
                  <TileReference />
                </TabPanel>
                <TabPanel>
                  <YakuReference />
                </TabPanel>
                <TabPanel>
                  <ScoreReference />
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </div>
        </div>
      </div>
    </div>
  );
}

function StyledTab({ children }: { children: ReactNode }) {
  return (
    <Tab
      className={({ selected }) =>
        clsx(
          "rounded-xl border border-gray-800 p-1 shadow lg:p-2",
          "h-10 w-52 text-xl lg:h-14 lg:w-80 lg:text-2xl",
          selected
            ? "bg-amber-500 hover:bg-amber-600 dark:bg-amber-700 dark:hover:bg-amber-800"
            : "bg-gray-50 hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-600",
        )
      }
    >
      {children}
    </Tab>
  );
}

function TileReference() {
  const { t } = useTranslation();
  return (
    <VerticalRow>
      <h2 className="text-xl lg:text-3xl">{t("reference.characters")}</h2>
      <LabeledTiles suited tiles={TilesBySuit.m.map((t) => [t, t[0]])} />
      <h2 className="text-xl lg:text-3xl">{t("reference.circles")}</h2>
      <LabeledTiles suited tiles={TilesBySuit.p.map((t) => [t, t[0]])} />
      <h2 className="text-xl lg:text-3xl">{t("reference.bamboo")}</h2>
      <LabeledTiles suited tiles={TilesBySuit.s.map((t) => [t, t[0]])} />
      <h2 className="text-xl lg:text-3xl">{t("reference.winds")}</h2>
      <LabeledTiles
        tiles={[
          ["1z", t("common.east")],
          ["2z", t("common.south")],
          ["3z", t("common.west")],
          ["4z", t("common.north")],
        ]}
      />
      <h2 className="text-xl lg:text-3xl">{t("reference.dragons")}</h2>
      <LabeledTiles
        tiles={[
          ["5z", t("common.white")],
          ["6z", t("common.green")],
          ["7z", t("common.red")],
        ]}
      />
    </VerticalRow>
  );
}

function LabeledTiles({
  suited = false,
  tiles,
}: {
  suited?: boolean;
  tiles: [TileCode, string][];
}) {
  return suited ? (
    <div className="flex flex-row flex-wrap items-center justify-center gap-x-1 lg:gap-x-2">
      <div className="flex flex-row flex-wrap items-center justify-center gap-x-1 lg:gap-x-2">
        {tiles.slice(0, 5).map((t, i) => (
          <div key={i} className="flex flex-col items-center justify-center">
            <span className="text-base lg:text-lg">{t[1]}</span>
            <TileButton tile={t[0]} forced />
          </div>
        ))}
      </div>
      <div className="flex flex-row flex-wrap items-center justify-center gap-x-1 lg:gap-x-2">
        {tiles.slice(5).map((t, i) => (
          <div key={i} className="flex flex-col items-center justify-center">
            <span className="text-base lg:text-lg">{t[1]}</span>
            <TileButton tile={t[0]} forced />
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="flex flex-row flex-wrap items-center justify-center gap-x-1 lg:gap-x-2">
      {tiles.map((t, i) => (
        <div key={i} className="flex flex-col items-center justify-center">
          <span className="text-base lg:text-lg">{t[1]}</span>
          <TileButton tile={t[0]} forced />
        </div>
      ))}
    </div>
  );
}

function YakuReference() {
  const { t } = useTranslation();
  const [showLocal, setShowLocal] = useState(false);
  const [onlyBasic, setOnlyBasic] = useState(false);
  const [hideYakuman, setHideYakuman] = useState(false);

  const yakuFilter = (y: YakuReferenceNode) => {
    const yaku = referenceToYaku(y);
    return (
      (onlyBasic ? yaku.basic : true) &&
      (showLocal ? true : yaku.type !== "local") &&
      (hideYakuman ? !yaku.yakuman : true)
    );
  };

  return (
    <div className="flex flex-col gap-y-4 lg:gap-y-8">
      <div className="flex flex-row flex-wrap items-center justify-center gap-2">
        <Button active={showLocal} onClick={() => setShowLocal(!showLocal)}>
          {t("reference.showLocal")}
        </Button>
        <Button active={onlyBasic} onClick={() => setOnlyBasic(!onlyBasic)}>
          {t("reference.onlyEasy")}
        </Button>
        <Button
          active={hideYakuman}
          onClick={() => setHideYakuman(!hideYakuman)}
        >
          {t("reference.hideYakuman")}
        </Button>
      </div>
      <div className="flex flex-col gap-y-1 lg:gap-y-2">
        {YakuReferenceSort.filter(yakuFilter).map((y, i) => {
          const inners = y.inner.filter(yakuFilter);
          return (
            <div key={y.t === "yaku" ? y.yaku : i} className="w-full">
              <YakuItem yaku={referenceToYaku(y)} />
              {inners.length > 0 && (
                <div className="mt-1 flex w-full flex-col items-center justify-center gap-1 lg:mt-2 lg:gap-2">
                  {inners.map((z, j) => (
                    <div
                      key={z.t === "yaku" ? z.yaku : j}
                      className="relative flex w-full flex-row items-center justify-around pl-6 lg:pl-10"
                    >
                      <div className="absolute left-0 flex w-4 flex-col items-center justify-center lg:w-8">
                        <HiArrowRight />
                      </div>
                      <YakuItem yaku={referenceToYaku(z)} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function YakuItem({ yaku }: { yaku: Omit<Yaku, "id"> }) {
  const { t } = useTranslation();
  return (
    <div className="w-full rounded bg-slate-200 p-2 shadow lg:p-4 dark:bg-gray-900">
      <div className="flex w-full flex-row items-center justify-between">
        {yaku.yakuman ? (
          <span className="text-base lg:text-xl">
            <H>
              {yaku.value > 6
                ? t(`common.yakuman.over`, "{{value}}× Yakuman", {
                    value: yaku.value,
                  })
                : t(`common.yakuman.${yaku.value}`)}
            </H>
          </span>
        ) : (
          <span className="text-base lg:text-xl">
            <HanValue han={`${yaku.value}${yaku.per ? "×" : ""}`} />
          </span>
        )}
        <div className="flex flex-row items-center justify-end">
          {yaku.closedOnly && (
            <span className="text-base lg:text-xl">
              <H.Red>{t("reference.closedOnly")}</H.Red>
            </span>
          )}
          {yaku.openMinus && (
            <span className="text-base lg:text-xl">
              <H.Red>{t("reference.minusIfOpen")}</H.Red>
            </span>
          )}
          {yaku.type === "extra" && (
            <span className="text-base lg:text-xl">
              <H.Red>{t("reference.notYaku")}</H.Red>
            </span>
          )}
        </div>
      </div>
      <div className="flex w-full flex-col items-start justify-center gap-2">
        <h2 className="flex flex-row gap-x-2 text-lg font-medium lg:text-2xl">
          {yaku.text}{" "}
          {(yaku.basic || yaku.type === "local") && (
            <H>
              <span className="flex flex-row items-center justify-center gap-x-2 text-sm lg:text-base">
                {yaku.basic && (
                  <span className="rounded bg-slate-300 p-0.5 shadow lg:p-1 dark:bg-sky-900">
                    {t("reference.easy")}
                  </span>
                )}
                {yaku.type === "local" && (
                  <span className="rounded bg-slate-300 p-0.5 shadow lg:p-1 dark:bg-sky-900">
                    {t("reference.local")}
                  </span>
                )}
              </span>
            </H>
          )}
        </h2>
        {yaku.help && <div className="text-base lg:text-lg">{yaku.help}</div>}
        {yaku.example && (
          <div className="flex w-full flex-row items-center justify-center">
            <Tiles sets={yaku.example} small />
          </div>
        )}
      </div>
    </div>
  );
}

function ScoreReference() {
  const { t } = useTranslation();
  const [sanma, setSanma] = useState<"loss" | "bisection" | null>(null);
  const settings = { ...DefaultSettings, sanma };

  const mangan = calculateHanFu(5, 30, settings);
  const haneman = calculateHanFu(6, 30, settings);
  const baiman = calculateHanFu(8, 30, settings);
  const sanbaiman = calculateHanFu(11, 30, settings);
  const yakuman = calculateHanFu(13, 30, settings);

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="flex flex-row flex-wrap items-center justify-center gap-4 lg:gap-6">
        <div className="flex h-40 w-40 flex-col items-center justify-center gap-2 rounded bg-slate-200 p-0.5 shadow lg:h-48 lg:w-48 lg:gap-4 dark:bg-gray-900">
          <span className="text-lg font-semibold">
            <H>{t("reference.legend")}</H>
          </span>
          <div className="flex w-full flex-row items-center justify-center text-xs italic lg:text-sm">
            <span className="flex w-1/2 flex-row items-center justify-center">
              {t("reference.dealer")}
            </span>
            <span className="flex w-1/2 flex-row items-center justify-center">
              {t("reference.nonDealer")}
            </span>
          </div>
          <div className="relative flex w-full flex-col items-center justify-center gap-2 text-sm lg:text-base">
            <div className="flex w-full flex-row items-center justify-center">
              <span className="flex w-1/2 flex-row items-center justify-center text-center">
                {t("common.tsumo")}
                <br />
                {t("reference.winloss")}
              </span>
              <span className="flex w-1/2 flex-row items-center justify-center text-center">
                {t("common.tsumo")}
                <br />
                {t("reference.winloss")}
              </span>
            </div>
            <div className="absolute h-full w-0 border border-gray-800"></div>
            <div className="flex w-full flex-row items-center justify-center">
              <span className="flex w-1/2 flex-row items-center justify-center">
                {t("common.ron")}
              </span>
              <span className="flex w-1/2 flex-row items-center justify-center">
                {t("common.ron")}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex flex-row flex-wrap items-center justify-center gap-2 lg:flex-nowrap">
            <div className="flex w-30 flex-row items-center justify-between gap-2 lg:w-36">
              <span className="text-xl lg:text-2xl">
                {t("reference.gameMode.$")}
              </span>
            </div>
            <div className="flex w-52 flex-row flex-wrap items-start justify-center gap-2 md:w-82">
              <Toggle
                left={t("reference.gameMode.fourPlayer")}
                right={t("reference.gameMode.threePlayer")}
                toggled={sanma != null}
                onToggle={() => setSanma(sanma ? null : "loss")}
              />
            </div>
          </div>
          {sanma != null && (
            <div className="flex flex-row flex-wrap items-center justify-center gap-2 lg:flex-nowrap">
              <div className="flex w-30 flex-row items-center justify-between gap-2 lg:w-36">
                <span className="text-xl lg:text-2xl">
                  {t("reference.tsumoPoints.$")}
                </span>
              </div>
              <div className="flex w-52 flex-row flex-wrap items-start justify-center gap-2 md:w-82">
                <Toggle
                  left={t("reference.tsumoPoints.loss")}
                  right={t("reference.tsumoPoints.bisection")}
                  toggled={sanma === "bisection"}
                  onToggle={() =>
                    setSanma(sanma === "loss" ? "bisection" : "loss")
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <ul className="flex flex-col items-center justify-center gap-2">
        <li>
          <HanSection
            han={1}
            fus={[20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110]}
            settings={settings}
          />
        </li>
        <li>
          <HanSection
            han={2}
            fus={[20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110]}
            settings={settings}
          />
        </li>
        <li>
          <HanSection
            han={3}
            fus={[20, 25, 30, 40, 50, 60]}
            settings={settings}
          />
        </li>
        <li>
          <HanSection han={4} fus={[20, 25, 30]} settings={settings} />
        </li>
        <li>
          <ScoreSection
            title={
              <span>
                <HanFuValue han="3" fu="70+" />・
                <HanFuValue han="4" fu="40+" />・
                <HanValue han="5" />
              </span>
            }
          >
            <ScoreCard title={<H>{t("common.mangan")}</H>} points={mangan} />
          </ScoreSection>
        </li>
        <li>
          <ScoreSection
            title={
              <span>
                <HanValue han="6-7" />
              </span>
            }
          >
            <ScoreCard title={<H>{t("common.haneman")}</H>} points={haneman} />
          </ScoreSection>
        </li>
        <li>
          <ScoreSection
            title={
              <span>
                <HanValue han="8-10" />
              </span>
            }
          >
            <ScoreCard title={<H>{t("common.baiman")}</H>} points={baiman} />
          </ScoreSection>
        </li>
        <li>
          <ScoreSection
            title={
              <span>
                <HanValue han="11-12" />
              </span>
            }
          >
            <ScoreCard
              title={<H>{t("common.sanbaiman")}</H>}
              points={sanbaiman}
            />
          </ScoreSection>
        </li>
        <li>
          <ScoreSection
            title={
              <span>
                <HanValue han="13+" />
              </span>
            }
          >
            <ScoreCard
              title={<H>{t("common.yakuman.1")}</H>}
              points={yakuman}
            />
          </ScoreSection>
        </li>
      </ul>
      <ul className="flex list-disc flex-col items-start justify-center gap-y-1 px-6 text-base lg:gap-y-2 lg:text-xl">
        <li>
          <HTrans i18nKey="reference.canBeRounded" />
        </li>
        <li>
          <HTrans i18nKey="reference.scoringTableSanma" />
        </li>
        <li>
          <HTrans i18nKey="reference.formula.theGeneralFormula" />
          <ol className="mt-1 ml-4 flex list-decimal flex-col items-start justify-center gap-y-1 lg:ml-8 lg:gap-y-2">
            <li>
              <HTrans i18nKey="reference.formula.ifYakumanSkip" />
            </li>
            <li>
              <HTrans i18nKey="reference.formula.countHanValue" />
            </li>
            <li>
              <HTrans i18nKey="reference.formula.ifManganSkip" />
              <ul className="mt-1 ml-4 flex list-disc flex-col items-start justify-center gap-y-1 lg:ml-8 lg:gap-y-2">
                <li>
                  <HTrans i18nKey="reference.formula.manganBasicPoints" />
                </li>
                <li>
                  <HTrans i18nKey="reference.formula.hanemanBasicPoints" />
                </li>
                <li>
                  <HTrans i18nKey="reference.formula.baimanBasicPoints" />
                </li>
                <li>
                  <HTrans i18nKey="reference.formula.sanbaimanBasicPoints" />
                </li>
                <li>
                  <HTrans i18nKey="reference.formula.yakumanBasicPoints" />
                </li>
              </ul>
            </li>
            <li>
              <HTrans i18nKey="reference.formula.countFuValue" />
              <ul className="mt-1 ml-4 flex list-disc flex-col items-start justify-center gap-y-1 lg:ml-8 lg:gap-y-2">
                <li>
                  <HTrans i18nKey="reference.formula.fu.base" />
                  <ul className="mt-1 ml-4 flex list-disc flex-col items-start justify-center gap-y-1 lg:ml-8 lg:gap-y-2">
                    <li>
                      <HTrans i18nKey="reference.formula.fu.tsumo" />
                    </li>
                    <li>
                      <HTrans i18nKey="reference.formula.fu.closedRon" />
                    </li>
                    <li>
                      <HTrans i18nKey="reference.formula.fu.singleWait" />
                    </li>
                    <li>
                      <HTrans i18nKey="reference.formula.fu.yakuhaiPair" />
                    </li>
                  </ul>
                </li>
                <li>
                  <HTrans i18nKey="reference.formula.fu.perTriplet" />
                  <ul className="mt-1 ml-4 flex list-disc flex-col items-start justify-center gap-y-1 lg:ml-8 lg:gap-y-2">
                    <li>
                      <HTrans i18nKey="reference.formula.fu.ifOpen" />
                    </li>
                    <li>
                      <HTrans i18nKey="reference.formula.fu.ifNonSimple" />
                    </li>
                  </ul>
                </li>
                <li>
                  <HTrans i18nKey="reference.formula.fu.perKan" />
                  <ul className="mt-1 ml-4 flex list-disc flex-col items-start justify-center gap-y-1 lg:ml-8 lg:gap-y-2">
                    <li>
                      <HTrans i18nKey="reference.formula.fu.ifOpen" />
                    </li>
                    <li>
                      <HTrans i18nKey="reference.formula.fu.ifNonSimple" />
                    </li>
                  </ul>
                </li>
                <li>
                  <HTrans i18nKey="reference.formula.fu.openPinfu" />
                </li>
                <li>
                  <HTrans i18nKey="reference.formula.fu.sevenPairs" />
                </li>
              </ul>
            </li>
            <li>
              <Trans
                t={t}
                i18nKey="reference.formula.calculateBasicPoints"
                components={{
                  Sup: <sup></sup>,
                  Mono: <span className="font-mono"></span>,
                }}
              />
            </li>
            <li>
              <HTrans i18nKey="reference.formula.ifKiriageMangan" />
            </li>
            <li>
              <HTrans i18nKey="reference.formula.ifBasicPointsAboveMangan" />
            </li>
            <li>
              <HTrans i18nKey="reference.formula.transferOnWin" />
              <ul className="mt-1 ml-4 flex list-disc flex-col items-start justify-center gap-y-1 lg:ml-8 lg:gap-y-2">
                <li>
                  <HTrans i18nKey="reference.formula.nonDealerTsumo" />
                </li>
                <li>
                  <HTrans i18nKey="reference.formula.nonDealerRon" />
                </li>
                <li>
                  <HTrans i18nKey="reference.formula.dealerTsumo" />
                </li>
                <li>
                  <HTrans i18nKey="reference.formula.dealerRon" />
                </li>
              </ul>
            </li>
          </ol>
        </li>
        <li>
          <HTrans i18nKey="reference.formula.commonFuValues" />
          <ul className="mt-1 ml-4 flex list-disc flex-col items-start justify-center gap-y-1 lg:ml-8 lg:gap-y-2">
            <li>
              <HTrans i18nKey="reference.formula.common30" />
            </li>
            <li>
              <HTrans i18nKey="reference.formula.common40" />
            </li>
            <li>
              <HTrans i18nKey="reference.formula.common20" />
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
}

function HanSection({
  han,
  fus,
  settings,
}: {
  han: number;
  fus: number[];
  settings: ScoreSettings;
}) {
  return (
    <ScoreSection
      title={
        <span>
          <HanValue han={han.toString()} />
        </span>
      }
    >
      <ul className="flex flex-row flex-wrap items-center justify-center gap-1">
        {fus.map((fu) => (
          <li key={fu}>
            <FuSection han={han} fu={fu} settings={settings} />
          </li>
        ))}
      </ul>
    </ScoreSection>
  );
}

function FuSection({
  han,
  fu,
  settings,
}: {
  han: number;
  fu: number;
  settings: ScoreSettings;
}) {
  const res = calculateHanFu(han, fu, settings);
  const noTsumo =
    (han === 1 && fu === 20) ||
    (han === 1 && fu === 25) ||
    (han === 2 && fu === 25);
  const noRon =
    (han === 1 && fu === 20) ||
    (han === 1 && fu === 25) ||
    (han === 2 && fu === 20) ||
    (han === 3 && fu === 20) ||
    (han === 4 && fu === 20);
  return (
    <ScoreCard
      title={
        <span>
          <FuValue fu={fu.toString()} />
        </span>
      }
      noTsumo={noTsumo}
      noRon={noRon}
      points={res}
    />
  );
}

function ScoreSection({
  title,
  children,
}: {
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <span className="text-xl font-bold lg:text-2xl">{title}</span>
      {children}
    </div>
  );
}

function ScoreCard({
  title,
  noTsumo = false,
  noRon = false,
  points,
}: {
  title: ReactNode;
  noTsumo?: boolean;
  noRon?: boolean;
  points: {
    tsumoAsFromOya: number;
    tsumoAsKo: number;
    ronAsOya: number;
    ronAsKo: number;
  };
}) {
  const { t } = useTranslation();
  return (
    <div className="flex h-28 w-28 flex-col items-center justify-center gap-1 rounded bg-slate-200 p-0.5 shadow lg:h-32 lg:w-32 lg:gap-3 dark:bg-gray-900">
      <span className="text-lg font-semibold xl:text-xl">{title}</span>
      <div className="relative flex w-full flex-col items-center justify-center gap-0.5 text-sm lg:gap-1 lg:text-lg">
        <div className="flex w-full flex-row items-center justify-center">
          <span
            className="flex w-1/2 flex-row items-center justify-center"
            title={t("reference.dealerTsumo")}
          >
            {noTsumo ? "--" : points.tsumoAsFromOya}
          </span>
          <span
            className="flex w-1/2 flex-row items-center justify-center"
            title={t("reference.nonDealerTsumo")}
          >
            {noTsumo ? "--" : points.tsumoAsKo}
          </span>
        </div>
        <div className="absolute h-full w-0 border border-gray-800"></div>
        <div className="flex w-full flex-row items-center justify-center">
          <span
            className="flex w-1/2 flex-row items-center justify-center"
            title={t("reference.dealerRon")}
          >
            {noRon ? "--" : points.ronAsOya}
          </span>
          <span
            className="flex w-1/2 flex-row items-center justify-center"
            title={t("reference.nonDealerRon")}
          >
            {noRon ? "--" : points.ronAsKo}
          </span>
        </div>
      </div>
    </div>
  );
}
