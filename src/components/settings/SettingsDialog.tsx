import clsx from "clsx";
import { produce } from "immer";
import { type ReactNode, useState } from "react";
import { HiChip, HiQuestionMarkCircle } from "react-icons/hi";
import type { DraftFunction } from "use-immer";

import type { ScoreSettings } from "../../lib/settings";
import { useDb } from "../../providers/DbProvider";
import Button from "../Button";
import CustomDialog from "../layout/CustomDialog";
import H from "../text/H";
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
            name="Game Mode"
            help={
              <span>
                The number of players in the game. <br />
                <H.B>Three-player</H.B> mahjong uses the sanma rules, which
                includes no chii, no 2 to 8 of characters, and kita.
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
              Four-Player
            </Button>
            <Button
              active={settings.sanma != null}
              onClick={() =>
                change((s) => {
                  s.sanma = "loss";
                })
              }
            >
              Three-Player
            </Button>
          </SettingRow>
          {settings.sanma != null && (
            <>
              <SettingRow
                name="Tsumo Points"
                help={
                  <span>
                    The distribution of points when a player wins with tsumo.
                    <br />
                    If <H.B>Loss</H.B> is enabled, the base points are the same
                    as in four player. In effect, the winning player loses the
                    points from the missing north player.
                    <br />
                    If <H.B>Bisection</H.B> is enabled, the base points will
                    include the points from the north player that should have
                    been paid. In effect, the other two players will pay more.
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
                  Loss
                </Button>
                <Button
                  active={settings.sanma === "bisection"}
                  onClick={() =>
                    change((s) => {
                      s.sanma = "bisection";
                    })
                  }
                >
                  Bisection
                </Button>
              </SettingRow>
              <SettingRow
                name="North Tiles"
                help={
                  <span>
                    North tiles can either be called with <H.B>kita</H.B> or
                    used as <H.B>yakuhai</H.B> regardless of wind in
                    three-player mahjong. With <H.B>kita</H.B>, a counter will
                    be added to count north tiles.
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
                  Kita
                </Button>
                <Button
                  active={settings.northYakuhai}
                  onClick={() =>
                    change((s) => {
                      s.northYakuhai = true;
                    })
                  }
                >
                  Yakuhai
                </Button>
              </SettingRow>
            </>
          )}
          <SettingRow
            name="Red Fives"
            help={
              <span>
                The number of red fives available in the calculator when
                building a hand.
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
              {settings.sanma ? "2" : "3"} Red Fives
            </Button>
            <Button
              active={!settings.akadora}
              onClick={() =>
                change((s) => {
                  s.akadora = false;
                })
              }
            >
              0 Red Fives
            </Button>
          </SettingRow>
          <SettingRow
            name="Toggle Yaku"
            help={
              <span>
                Toggle the yaku available in the calculator. <br />
                <H.B>Optional yaku</H.B> are some of the usual yaku, enabled by
                default. They may be disabled if needed. <br />
                <H.B>Local yaku</H.B> are generally less common and are disabled
                by default. <br />
              </span>
            }
          >
            <Button onClick={() => setOptionalYakuOpened(true)}>
              Optional Yaku (-{settings.disabledYaku.length})
            </Button>
            <Button onClick={() => setLocalYakuOpened(true)}>
              Local Yaku (+{settings.enabledLocalYaku.length})
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
            name="Other Scoring"
            help={
              <span>
                Whether to show counters to add in extra yaku han, dora, and
                yakuman. <br />
                These can be used for purposes such as extra red fives, other
                dora, and unsupported local yaku.
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
              Show
            </Button>
            <Button
              active={!settings.otherScoring}
              onClick={() =>
                change((s) => {
                  s.otherScoring = false;
                })
              }
            >
              Hide
            </Button>
          </SettingRow>
          {!inCalculator && (
            <SettingRow
              name="Pao Payment"
              compass
              help={
                <span>
                  Whether to show the ability to distribute points using pao.{" "}
                  <br />
                  This is used when a player aids in the creation of a{" "}
                  <H>yakuman</H>. <br />
                  With tsumo, the responsible player will pay full amount.{" "}
                  <br />
                  With ron, the responsible player and the player who dealt in
                  will each pay half.
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
                Show
              </Button>
              <Button
                active={!settings.usePao}
                onClick={() =>
                  change((s) => {
                    s.usePao = false;
                  })
                }
              >
                Hide
              </Button>
            </SettingRow>
          )}
          <SettingRow
            name="Rounded Mangan"
            help={
              <span>
                Whether to round up hands worth <H>4</H> han <H>30</H> fu or{" "}
                <H>3</H> han <H>60</H> fu to a <H>mangan</H>. <br />
                Otherwise, they are worth the usual 2000/3900 and 7700
                (non-dealer) or 3900 and 11600 (dealer).
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
              Rounded
            </Button>
            <Button
              active={!settings.kiriageMangan}
              onClick={() =>
                change((s) => {
                  s.kiriageMangan = false;
                })
              }
            >
              No Rounding
            </Button>
          </SettingRow>
          <SettingRow
            name="Counted Yakuman"
            help={
              <span>
                Whether to count a hand worth at least <H>13</H> han as{" "}
                <H.B>yakuman</H.B> or as <H.B>sanbaiman</H.B>.
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
              Yakuman
            </Button>
            <Button
              active={!settings.kazoeYakuman}
              onClick={() =>
                change((s) => {
                  s.kazoeYakuman = false;
                })
              }
            >
              Sanbaiman
            </Button>
          </SettingRow>
          <SettingRow
            name="Yakuman Stacking"
            help={
              <span>
                Whether to allow stacking multiple <H>yakuman</H> together or
                cap the max at a single <H>yakuman</H>. <br />
                <H>Double yakuman</H> are also disabled if this is disabled.
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
              Allow
            </Button>
            <Button
              active={!settings.multiYakuman}
              onClick={() =>
                change((s) => {
                  s.multiYakuman = false;
                })
              }
            >
              Disallow
            </Button>
          </SettingRow>
          {settings.multiYakuman && (
            <SettingRow
              name="Double Yakuman"
              help={
                <span>
                  Whether to count certain special yaku as being worth a{" "}
                  <H>double yakuman</H>. <br />
                  These include: <br />
                  <ul className="list-inside list-disc">
                    <li className="list-item">Big Four Winds</li>
                    <li className="list-item">
                      Thirteen-Wait Thirteen Orphans
                    </li>
                    <li className="list-item">True Nine Gates</li>
                    <li className="list-item">
                      Single-Wait Four Concealed Triplets
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
                Allow
              </Button>
              <Button
                active={!settings.doubleYakuman}
                onClick={() =>
                  change((s) => {
                    s.doubleYakuman = false;
                  })
                }
              >
                Disallow
              </Button>
            </SettingRow>
          )}
          <SettingRow
            name="Open All Simples"
            help={
              <span>
                Whether to allow the all simples yaku to be counted if the hand
                has open sets.
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
              Allow
            </Button>
            <Button
              active={!settings.openTanyao}
              onClick={() =>
                change((s) => {
                  s.openTanyao = false;
                })
              }
            >
              Disallow
            </Button>
          </SettingRow>
          <SettingRow
            name="All Green's Dragon"
            help={
              <span>
                Whether to require the green dragon to count the all green yaku.
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
              Required
            </Button>
            <Button
              active={!settings.ryuuiisouHatsu}
              onClick={() =>
                change((s) => {
                  s.ryuuiisouHatsu = false;
                })
              }
            >
              Optional
            </Button>
          </SettingRow>
          <SettingRow
            name="Double Wind Fu"
            help={
              <span>
                Whether to count a wind pair that is both the round wind and the
                seat wind as{" "}
                <H.B>
                  <H>4</H> fu
                </H.B>{" "}
                or{" "}
                <H.B>
                  <H>2</H> fu
                </H.B>
                .
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
              4 Fu
            </Button>
            <Button
              active={!settings.doubleWindFu}
              onClick={() =>
                change((s) => {
                  s.doubleWindFu = false;
                })
              }
            >
              2 Fu
            </Button>
          </SettingRow>
          <SettingRow
            name="After a Kan Fu"
            help={
              <span>
                Whether to count the{" "}
                <H.B>
                  <H>2</H> fu
                </H.B>{" "}
                granted by tsumo if the hand won with after a kan.
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
              2 Fu
            </Button>
            <Button
              active={!settings.rinshanFu}
              onClick={() =>
                change((s) => {
                  s.rinshanFu = false;
                })
              }
            >
              0 Fu
            </Button>
          </SettingRow>
          <SettingRow
            name="No Yaku Fu"
            help={
              <span>
                Whether to calculate fu even when with no yaku. Hands will have{" "}
                <H>0</H> han.
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
              Allow
            </Button>
            <Button
              active={!settings.noYakuFu}
              onClick={() =>
                change((s) => {
                  s.noYakuFu = false;
                })
              }
            >
              Disallow
            </Button>
          </SettingRow>
          <SettingRow
            last
            name="No Yaku Dora"
            help={
              <span>Whether to calculate dora even when with no yaku.</span>
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
              Allow
            </Button>
            <Button
              active={!settings.noYakuDora}
              onClick={() =>
                change((s) => {
                  s.noYakuDora = false;
                })
              }
            >
              Disallow
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
              Copy From Calculator
            </Button>
          )}
          <Button
            onClick={() => {
              onClose();
            }}
          >
            Close
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
            <span className="absolute mx-1 h-4 w-4" title="Affects the compass">
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
