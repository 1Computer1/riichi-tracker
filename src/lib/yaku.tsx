import { type ReactNode } from "react";

import { HTrans } from "../components/text/Localized";
import type { TileCode } from "./hand";

export interface Yaku {
  /** Kanji name as in riichi library. */
  id: string;
  key: string;
  type: "normal" | "optional" | "local" | "extra";
  value: number;
  yakuman: boolean;
  openMinus: boolean;
  closedOnly: boolean;
  basic: boolean;
  per: boolean;
  example?: TileCode[][];
  text?: ReactNode;
  help?: ReactNode;
}

type Partially<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

function yaku({
  id,
  key,
  type = "normal",
  value,
  yakuman = false,
  openMinus = false,
  closedOnly = false,
  basic = false,
  per = false,
  example,
  text = <HTrans i18nKey={`${key}.$`} />,
  help = <HTrans i18nKey={`${key}.help`} />,
}: Partially<
  Yaku,
  "type" | "yakuman" | "openMinus" | "closedOnly" | "basic" | "per"
>): Yaku {
  return {
    id,
    key,
    type,
    value,
    yakuman,
    openMinus,
    closedOnly,
    basic,
    per,
    example,
    text,
    help,
  };
}

export const YakuList = {
  // Double Yakuman
  国士無双十三面待ち: yaku({
    id: "国士無双十三面待ち",
    key: "yaku.kokushimusoujuusanmenmachi",
    yakuman: true,
    value: 2,
    closedOnly: true,
  }),
  純正九蓮宝燈: yaku({
    id: "純正九蓮宝燈",
    key: "yaku.junseichuurenpoutou",
    yakuman: true,
    value: 2,
    closedOnly: true,
  }),
  四暗刻単騎待ち: yaku({
    id: "四暗刻単騎待ち",
    key: "yaku.suuankoutankimachi",
    yakuman: true,
    value: 2,
    closedOnly: true,
  }),
  大四喜: yaku({
    id: "大四喜",
    key: "yaku.daisuushii",
    yakuman: true,
    value: 2,
  }),
  // Yakuman
  天和: yaku({
    id: "天和",
    key: "yaku.tenhou",
    yakuman: true,
    value: 1,
    closedOnly: true,
  }),
  地和: yaku({
    id: "地和",
    key: "yaku.chiihou",
    yakuman: true,
    value: 1,
    closedOnly: true,
  }),
  人和: yaku({
    id: "人和",
    key: "yaku.renhou",
    type: "local",
    yakuman: true,
    value: 1,
    closedOnly: true,
  }),
  国士無双: yaku({
    id: "国士無双",
    key: "yaku.kokushimusou",
    yakuman: true,
    value: 1,
    closedOnly: true,
    example: [
      [
        "1m",
        "9m",
        "1p",
        "9p",
        "1s",
        "9s",
        "1z",
        "2z",
        "3z",
        "4z",
        "5z",
        "6z",
        "7z",
      ],
    ],
  }),
  九蓮宝燈: yaku({
    id: "九蓮宝燈",
    key: "yaku.chuurenpoutou",
    yakuman: true,
    value: 1,
    closedOnly: true,
    example: [
      [
        "1p",
        "1p",
        "1p",
        "2p",
        "3p",
        "4p",
        "5p",
        "6p",
        "7p",
        "8p",
        "9p",
        "9p",
        "9p",
      ],
    ],
  }),
  四暗刻: yaku({
    id: "四暗刻",
    key: "yaku.suuankou",
    yakuman: true,
    value: 1,
    closedOnly: true,
    example: [
      [
        "1m",
        "1m",
        "2p",
        "2p",
        "2p",
        "3p",
        "3p",
        "3p",
        "4s",
        "4s",
        "4s",
        "1z",
        "1z",
        "1z",
      ],
    ],
  }),
  小四喜: yaku({
    id: "小四喜",
    key: "yaku.shousuushii",
    yakuman: true,
    value: 1,
    example: [
      ["1z", "1z", "1z", "2z", "2z", "2z", "3z", "3z", "3z", "4z", "4z"],
    ],
  }),
  大三元: yaku({
    id: "大三元",
    key: "yaku.daisangen",
    yakuman: true,
    value: 1,
    example: [["5z", "5z", "5z", "6z", "6z", "6z", "7z", "7z", "7z"]],
  }),
  字一色: yaku({
    id: "字一色",
    key: "yaku.tsuuiisou",
    yakuman: true,
    value: 1,
    example: [["1z", "1z", "1z", "7z", "7z", "7z"]],
  }),
  緑一色: yaku({
    id: "緑一色",
    key: "yaku.ryuuiisou",
    yakuman: true,
    value: 1,
    example: [["2s", "3s", "4s", "6s", "8s", "6z"]],
  }),
  清老頭: yaku({
    id: "清老頭",
    key: "yaku.chinroutou",
    yakuman: true,
    value: 1,
    example: [["1m", "1m", "1m", "1p", "1p", "1p", "9s", "9s", "9s"]],
  }),
  四槓子: yaku({
    id: "四槓子",
    key: "yaku.suuankan",
    yakuman: true,
    value: 1,
    example: [
      ["1m", "1m"],
      ["3p", "3p", "3p", "3p"],
      ["4s", "4s", "4s", "4s"],
      ["8s", "8s", "8s", "8s"],
      ["1z", "1z", "1z", "1z"],
    ],
  }),
  大七星: yaku({
    id: "大七星",
    key: "yaku.daichiishin",
    type: "local",
    yakuman: true,
    value: 2,
    closedOnly: true,
    example: [
      [
        "1z",
        "1z",
        "2z",
        "2z",
        "3z",
        "3z",
        "4z",
        "4z",
        "5z",
        "5z",
        "6z",
        "6z",
        "7z",
        "7z",
      ],
    ],
  }),
  大数隣: yaku({
    id: "大数隣",
    key: "yaku.daisuurin",
    type: "local",
    yakuman: true,
    value: 1,
    closedOnly: true,
    example: [
      [
        "2m",
        "2m",
        "3m",
        "3m",
        "4m",
        "4m",
        "5m",
        "5m",
        "6m",
        "6m",
        "7m",
        "7m",
        "8m",
        "8m",
      ],
    ],
  }),
  大車輪: yaku({
    id: "大車輪",
    key: "yaku.daisharin",
    type: "local",
    yakuman: true,
    value: 1,
    closedOnly: true,
    example: [
      [
        "2p",
        "2p",
        "3p",
        "3p",
        "4p",
        "4p",
        "5p",
        "5p",
        "6p",
        "6p",
        "7p",
        "7p",
        "8p",
        "8p",
      ],
    ],
  }),
  大竹林: yaku({
    id: "大竹林",
    key: "yaku.daichikurin",
    type: "local",
    yakuman: true,
    value: 1,
    closedOnly: true,
    example: [
      [
        "2s",
        "2s",
        "3s",
        "3s",
        "4s",
        "4s",
        "5s",
        "5s",
        "6s",
        "6s",
        "7s",
        "7s",
        "8s",
        "8s",
      ],
    ],
  }),
  紅孔雀: yaku({
    id: "紅孔雀",
    key: "yaku.benikujaku",
    type: "local",
    yakuman: true,
    value: 1,
    example: [["1s", "5s", "7s", "9s", "7z"]],
  }),
  黒一色: yaku({
    id: "黒一色",
    key: "yaku.kokuiisou",
    type: "local",
    yakuman: true,
    value: 1,
    example: [["2p", "4p", "8p", "1z", "2z", "3z", "4z"]],
  }),
  百万石: yaku({
    id: "百万石",
    key: "yaku.hyakumangoku",
    type: "local",
    yakuman: true,
    value: 1,
    example: [
      [
        "1m",
        "2m",
        "3m",
        "6m",
        "6m",
        "6m",
        "7m",
        "7m",
        "8m",
        "8m",
        "8m",
        "8m",
        "9m",
        "9m",
        "9m",
        "9m",
      ],
    ],
  }),
  // Riichi & Special
  立直: yaku({
    id: "立直",
    key: "yaku.riichi",
    value: 1,
    closedOnly: true,
    basic: true,
  }),
  ダブル立直: yaku({
    id: "ダブル立直",
    key: "yaku.doubleriichi",
    type: "optional",
    value: 2,
    closedOnly: true,
  }),
  一発: yaku({
    id: "一発",
    key: "yaku.ippatsu",
    type: "optional",
    value: 1,
    closedOnly: true,
  }),
  門前清自摸和: yaku({
    id: "門前清自摸和",
    key: "yaku.menzenchintsumohou",
    value: 1,
    closedOnly: true,
  }),
  嶺上開花: yaku({
    id: "嶺上開花",
    key: "yaku.rinshankaihou",
    type: "optional",
    value: 1,
  }),
  搶槓: yaku({
    id: "搶槓",
    key: "yaku.chankan",
    type: "optional",
    value: 1,
  }),
  海底摸月: yaku({
    id: "海底摸月",
    key: "yaku.haiteiraoyue",
    type: "optional",
    value: 1,
  }),
  河底撈魚: yaku({
    id: "河底撈魚",
    key: "yaku.houteiraoyui",
    type: "optional",
    value: 1,
  }),
  // 1 Han
  場風東: yaku({
    id: "場風東",
    key: "yaku.bakazeEast",
    value: 1,
    basic: true,
  }),
  場風南: yaku({
    id: "場風南",
    key: "yaku.bakazeSouth",
    value: 1,
    basic: true,
  }),
  場風西: yaku({
    id: "場風西",
    key: "yaku.bakazeWest",
    value: 1,
    basic: true,
  }),
  場風北: yaku({
    id: "場風北",
    key: "yaku.bakazeNorth",
    value: 1,
    basic: true,
  }),
  自風東: yaku({
    id: "自風東",
    key: "yaku.jikazeEast",
    value: 1,
    basic: true,
  }),
  自風南: yaku({
    id: "自風南",
    key: "yaku.jikazeSouth",
    value: 1,
    basic: true,
  }),
  自風西: yaku({
    id: "自風西",
    key: "yaku.jikazeWest",
    value: 1,
    basic: true,
  }),
  自風北: yaku({
    id: "自風北",
    key: "yaku.jikazeNorth",
    value: 1,
    basic: true,
  }),
  客風北: yaku({
    id: "客風北",
    key: "yaku.otakazeNorth",
    value: 1,
    basic: true,
  }),
  役牌白: yaku({ id: "役牌白", key: "yaku.haku", value: 1, basic: true }),
  役牌発: yaku({ id: "役牌発", key: "yaku.hatsu", value: 1, basic: true }),
  役牌中: yaku({ id: "役牌中", key: "yaku.chun", value: 1, basic: true }),
  平和: yaku({
    id: "平和",
    key: "yaku.pinfu",
    type: "optional",
    value: 1,
    closedOnly: true,
    example: [["1p", "2p", "3p", "4p"]],
  }),
  断么九: yaku({
    id: "断么九",
    key: "yaku.tanyaochuu",
    type: "optional",
    value: 1,
    basic: true,
    example: [["2m", "3m", "4m", "5p", "6p", "7p", "8s"]],
  }),
  一盃口: yaku({
    id: "一盃口",
    key: "yaku.iipeikou",
    value: 1,
    closedOnly: true,
    example: [["1m", "1m", "2m", "2m", "3m", "3m"]],
  }),
  十二落抬: yaku({
    id: "十二落抬",
    key: "yaku.shiiaruraotai",
    type: "local",
    value: 1,
    basic: true,
    example: [
      ["1z", "1z"],
      ["1m", "2m", "3m"],
      ["2p", "3p", "4p"],
      ["6s", "7s", "8s"],
      ["9s", "9s", "9s", "9s"],
    ],
  }),
  // 1+ Han
  三色同順: yaku({
    id: "三色同順",
    key: "yaku.sanshokudoujun",
    value: 2,
    openMinus: true,
    example: [["1m", "2m", "3m", "1p", "2p", "3p", "1s", "2s", "3s"]],
  }),
  一気通貫: yaku({
    id: "一気通貫",
    key: "yaku.ikkitsuukan",
    value: 2,
    openMinus: true,
    example: [["1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p"]],
  }),
  混全帯么九: yaku({
    id: "混全帯么九",
    key: "yaku.honchantaiyaochuu",
    value: 2,
    openMinus: true,
    example: [["1p", "2p", "3p", "9p", "9p", "9p", "7z", "7z", "7z"]],
  }),
  // 2 Han
  七対子: yaku({
    id: "七対子",
    key: "yaku.chiitoitsu",
    value: 2,
    closedOnly: true,
    basic: true,
    example: [
      [
        "1m",
        "1m",
        "2m",
        "2m",
        "3p",
        "3p",
        "5p",
        "5p",
        "7s",
        "7s",
        "9s",
        "9s",
        "1z",
        "1z",
      ],
    ],
  }),
  五門斉: yaku({
    id: "五門斉",
    key: "yaku.uumensai",
    type: "local",
    value: 2,
    example: [
      [
        "2m",
        "2m",
        "2m",
        "2p",
        "3p",
        "4p",
        "9s",
        "9s",
        "9s",
        "1z",
        "1z",
        "1z",
        "7z",
        "7z",
      ],
    ],
  }),
  対々和: yaku({
    id: "対々和",
    key: "yaku.toitoihou",
    value: 2,
    basic: true,
    example: [
      [
        "1m",
        "1m",
        "2m",
        "2m",
        "2m",
        "3p",
        "3p",
        "3p",
        "5p",
        "5p",
        "5p",
        "9s",
        "9s",
        "9s",
      ],
    ],
  }),
  三色同刻: yaku({
    id: "三色同刻",
    key: "yaku.sanshokudoukou",
    value: 2,
    example: [["5m", "5m", "5m", "5p", "5p", "5p", "5s", "5s", "5s"]],
  }),
  三暗刻: yaku({
    id: "三暗刻",
    key: "yaku.sanankou",
    value: 2,
    example: [
      ["1m", "1m", "9p", "9p", "9p", "4s", "4s", "4s", "1z", "1z", "1z"],
      ["1p", "2p", "3p"],
    ],
  }),
  三連刻: yaku({
    id: "三連刻",
    key: "yaku.sanrenkou",
    type: "local",
    value: 2,
    example: [["3p", "3p", "3p", "4p", "4p", "4p", "5p", "5p", "5p"]],
  }),
  三槓子: yaku({
    id: "三槓子",
    key: "yaku.sankantsu",
    value: 2,
    example: [
      ["1p", "1p", "3p", "4p", "5p"],
      ["4s", "4s", "4s", "4s"],
      ["8s", "8s", "8s", "8s"],
      ["1z", "1z", "1z", "1z"],
    ],
  }),
  小三元: yaku({
    id: "小三元",
    key: "yaku.shousangen",
    value: 2,
    example: [["5z", "5z", "5z", "6z", "6z", "6z", "7z", "7z"]],
  }),
  混老頭: yaku({
    id: "混老頭",
    key: "yaku.honroutou",
    value: 2,
    example: [["1p", "1p", "1p", "9p", "9p", "9p", "7z", "7z", "7z"]],
  }),
  // 2+ Han
  一色三順: yaku({
    id: "一色三順",
    key: "yaku.isshokusanjun",
    type: "local",
    value: 3,
    openMinus: true,
    example: [["1p", "2p", "3p", "1p", "2p", "3p", "1p", "2p", "3p"]],
  }),
  純全帯么九: yaku({
    id: "純全帯么九",
    key: "yaku.junchantaiyaochuu",
    value: 3,
    openMinus: true,
    example: [["1p", "2p", "3p", "9p", "9p", "9p"]],
  }),
  混一色: yaku({
    id: "混一色",
    key: "yaku.honiisou",
    value: 3,
    openMinus: true,
    basic: true,
    example: [["1p", "2p", "3p", "1z", "1z", "1z", "7z", "7z", "7z"]],
  }),
  // 3 Han
  二盃口: yaku({
    id: "二盃口",
    key: "yaku.ryanpeikou",
    value: 3,
    closedOnly: true,
    example: [
      ["1m", "1m", "2m", "2m", "3m", "3m", "5p", "5p", "6p", "6p", "7p", "7p"],
    ],
  }),
  // 5+ Han
  清一色: yaku({
    id: "清一色",
    key: "yaku.chiniisou",
    value: 6,
    openMinus: true,
    example: [["1p", "2p", "3p"]],
  }),
  // Dora
  ドラ: yaku({
    id: "ドラ",
    key: "yaku.dora",
    type: "extra",
    value: 1,
  }),
  裏ドラ: yaku({
    id: "裏ドラ",
    key: "yaku.uradora",
    type: "extra",
    value: 1,
  }),
  赤ドラ: yaku({
    id: "赤ドラ",
    key: "yaku.akadora",
    type: "extra",
    value: 1,
  }),
  抜きドラ: yaku({
    id: "抜きドラ",
    key: "yaku.kita",
    type: "extra",
    value: 1,
  }),
  // Extra
  他の役満: yaku({
    id: "他の役満",
    key: "yaku.otherYakuman",
    type: "extra",
    value: 1,
  }),
  他の役: yaku({
    id: "他の役",
    key: "yaku.otherYaku",
    type: "extra",
    value: 1,
  }),
  他のドラ: yaku({
    id: "他のドラ",
    key: "yaku.otherDora",
    type: "extra",
    value: 1,
  }),
} as const;

export const YakuSort = Object.fromEntries(
  Object.keys(YakuList).map((x, i) => [x, i]),
);

export type YakuReferenceNode =
  | { t: "yaku"; yaku: keyof typeof YakuList }
  | ({
      t: "other";
    } & Omit<Yaku, "id">);

export type YakuReferenceItem = YakuReferenceNode & {
  inner: YakuReferenceNode[];
};

function ref(yaku: keyof typeof YakuList): YakuReferenceNode {
  return { t: "yaku", yaku };
}

function yakuRef(
  yaku: keyof typeof YakuList,
  {
    inner = [],
  }: {
    inner?: YakuReferenceNode[];
  } = {},
): YakuReferenceItem {
  return { t: "yaku", yaku, inner };
}

function otherRef({
  key,
  type = "normal",
  value,
  yakuman = false,
  closedOnly = false,
  openMinus = false,
  basic = false,
  per = false,
  text = <HTrans i18nKey={`${key}.$`} />,
  help = <HTrans i18nKey={`${key}.help`} />,
  example,
  inner = [],
}: {
  inner?: YakuReferenceNode[];
} & Omit<
  Partially<
    Yaku,
    "type" | "yakuman" | "openMinus" | "closedOnly" | "basic" | "per"
  >,
  "id"
>): YakuReferenceItem {
  return {
    t: "other",
    key,
    type,
    text,
    help,
    inner,
    value,
    yakuman,
    closedOnly,
    openMinus,
    basic,
    per,
    example,
  };
}

export function referenceToYaku(node: YakuReferenceNode): Omit<Yaku, "id"> {
  return node.t === "yaku" ? YakuList[node.yaku] : node;
}

export const YakuReferenceSort: YakuReferenceItem[] = [
  // Closed hand
  yakuRef("立直", { inner: [ref("ダブル立直"), ref("一発")] }),
  yakuRef("門前清自摸和"),
  yakuRef("平和"),
  yakuRef("一盃口", { inner: [ref("二盃口")] }),
  yakuRef("七対子", {
    inner: [ref("大数隣"), ref("大車輪"), ref("大竹林"), ref("大七星")],
  }),
  // Yakuhai
  otherRef({
    key: "yaku.other.sangenpai",
    value: 1,
    per: true,
    example: [["7z", "7z", "7z"]],
    basic: true,
    inner: [yakuRef("小三元"), yakuRef("大三元")],
  }),
  otherRef({
    key: "yaku.other.kazehai",
    value: 1,
    per: true,
    example: [["1z", "1z", "1z"]],
    basic: true,
    inner: [yakuRef("小四喜"), yakuRef("大四喜")],
  }),
  // All simples
  yakuRef("断么九"),
  // All calls
  yakuRef("十二落抬"),
  // Sequences
  yakuRef("三色同順"),
  yakuRef("一色三順"),
  yakuRef("一気通貫"),
  // Terminals and honors
  yakuRef("混全帯么九", {
    inner: [ref("純全帯么九"), ref("混老頭"), ref("清老頭"), ref("字一色")],
  }),
  // Triplets
  yakuRef("対々和"),
  yakuRef("三色同刻"),
  yakuRef("三連刻"),
  // Concealed triplets
  yakuRef("三暗刻", { inner: [ref("四暗刻"), ref("四暗刻単騎待ち")] }),
  // Quads
  yakuRef("三槓子", { inner: [ref("四槓子")] }),
  // All types
  yakuRef("五門斉"),
  // Flushes
  yakuRef("混一色", {
    inner: [
      ref("清一色"),
      ref("緑一色"),
      ref("紅孔雀"),
      ref("黒一色"),
      ref("百万石"),
      ref("九蓮宝燈"),
      ref("純正九蓮宝燈"),
    ],
  }),
  // Thirteen orphans
  yakuRef("国士無双", { inner: [ref("国士無双十三面待ち")] }),
  // Other yaku
  yakuRef("海底摸月"),
  yakuRef("河底撈魚"),
  yakuRef("嶺上開花"),
  yakuRef("搶槓"),
  yakuRef("天和"),
  yakuRef("地和"),
  yakuRef("人和"),
  otherRef({
    key: "yaku.other.nagashimangan",
    value: 5,
  }),
  // Dora
  otherRef({
    key: "yaku.other.dora",
    value: 1,
    per: true,
    basic: true,
    type: "extra",
    example: [
      [
        "9p",
        "1p",
        "1z",
        "2z",
        "3z",
        "4z",
        "1z",
        "5z",
        "6z",
        "7z",
        "5z",
        "0m",
        "0p",
        "0s",
      ],
    ],
  }),
  otherRef({
    key: "yaku.other.kita",
    value: 1,
    per: true,
    type: "extra",
    example: [["4z"]],
  }),
];
