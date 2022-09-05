import { ReactNode } from 'react';
import type { Meld, TileCode } from './hand';

export interface Yaku {
	/** Kanji name as in riichi library. */
	id: string;
	name: string;
	type: 'normal' | 'optional' | 'local' | 'extra';
	value: number;
	yakuman: boolean;
	openMinus: boolean;
	closedOnly: boolean;
	basic: boolean;
	per: boolean;
	example?: { tiles: TileCode[]; melds?: Meld[] };
	help?: ReactNode;
}

type Partially<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

function yaku({
	id,
	name,
	type = 'normal',
	value,
	yakuman = false,
	openMinus = false,
	closedOnly = false,
	basic = false,
	per = false,
	example,
	help = null,
}: Partially<Yaku, 'type' | 'yakuman' | 'openMinus' | 'closedOnly' | 'basic' | 'per'>): Yaku {
	return { id, name, type, value, yakuman, openMinus, closedOnly, basic, per, example, help };
}

export const YakuList = {
	// Double Yakuman
	国士無双十三面待ち: yaku({
		id: '国士無双十三面待ち',
		name: 'Thirteen-Wait Thirteen Orphans',
		yakuman: true,
		value: 2,
		closedOnly: true,
		help: <span>With Thirteen Orphans, win with a thirteen-sided wait.</span>,
	}),
	純正九蓮宝燈: yaku({
		id: '純正九蓮宝燈',
		name: 'True Nine Gates',
		yakuman: true,
		value: 2,
		closedOnly: true,
		help: <span>With Nine Gates, win with a nine-sided wait.</span>,
	}),
	四暗刻単騎待ち: yaku({
		id: '四暗刻単騎待ち',
		name: 'Single-Wait Four Concealed Triplets',
		yakuman: true,
		value: 2,
		closedOnly: true,
		help: <span>With Four Concealed Triplets, win with a single-tile wait (making a pair, allowing ron).</span>,
	}),
	大四喜: yaku({
		id: '大四喜',
		name: 'Four Big Winds',
		yakuman: true,
		value: 2,
		help: <span>A set of each wind.</span>,
		example: {
			tiles: ['1z', '1z', '1z', '2z', '2z', '2z', '3z', '3z', '3z', '4z', '4z', '4z'],
		},
	}),
	// Yakuman
	天和: yaku({ id: '天和', name: 'Blessing of Heaven', yakuman: true, value: 1, closedOnly: true }),
	地和: yaku({ id: '地和', name: 'Blessing of Earth', yakuman: true, value: 1, closedOnly: true }),
	人和: yaku({
		id: '人和',
		name: 'Blessing of Man',
		type: 'local',
		yakuman: true,
		value: 1,
		closedOnly: true,
		help: <span>Call ron before your first turn. Calls invalidate.</span>,
	}),
	国士無双: yaku({
		id: '国士無双',
		name: 'Thirteen Orphans',
		yakuman: true,
		value: 1,
		closedOnly: true,
		help: <span>Each terminal and honor, and an extra tile of any of them.</span>,
		example: {
			tiles: ['1m', '9m', '1p', '9p', '1s', '9s', '1z', '2z', '3z', '4z', '5z', '6z', '7z'],
		},
	}),
	九蓮宝燈: yaku({
		id: '九蓮宝燈',
		name: 'Nine Gates',
		yakuman: true,
		value: 1,
		closedOnly: true,
		help: <span>A full flush of 1112345678999 and an extra tile of any of them.</span>,
		example: {
			tiles: ['1p', '1p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '9p', '9p'],
		},
	}),
	四暗刻: yaku({
		id: '四暗刻',
		name: 'Four Concealed Triplets',
		yakuman: true,
		value: 1,
		closedOnly: true,
		help: <span>Four concealed triplets (not called with pon or open kan).</span>,
		example: {
			tiles: ['1m', '1m', '2p', '2p', '2p', '3p', '3p', '3p', '4s', '4s', '4s', '1z', '1z', '1z'],
		},
	}),
	小四喜: yaku({
		id: '小四喜',
		name: 'Four Little Winds',
		yakuman: true,
		value: 1,
		help: <span>Three sets and a pair of each wind.</span>,
		example: {
			tiles: ['1z', '1z', '1z', '2z', '2z', '2z', '3z', '3z', '3z', '4z', '4z'],
		},
	}),
	大三元: yaku({
		id: '大三元',
		name: 'Three Big Dragons',
		yakuman: true,
		value: 1,
		help: <span>A set of each dragon.</span>,
		example: {
			tiles: ['5z', '5z', '5z', '6z', '6z', '6z', '7z', '7z', '7z'],
		},
	}),
	字一色: yaku({
		id: '字一色',
		name: 'All Honors',
		yakuman: true,
		value: 1,
		help: <span>A hand containing only honor tiles.</span>,
		example: {
			tiles: [],
			melds: [
				{ t: 'chiipon', tiles: ['1z', '1z', '1z'] },
				{ t: 'chiipon', tiles: ['7z', '7z', '7z'] },
			],
		},
	}),
	緑一色: yaku({
		id: '緑一色',
		name: 'All Green',
		yakuman: true,
		value: 1,
		help: (
			<span>
				A hand built using only green bamboo tiles (2, 3, 4, 6, 8) and Green Dragon. Green Dragon may be required in
				certain rule variations.
			</span>
		),
		example: {
			tiles: ['2s', '3s', '4s', '6s', '8s', '6z'],
		},
	}),
	清老頭: yaku({
		id: '清老頭',
		name: 'All Terminals',
		yakuman: true,
		value: 1,
		help: <span>A hand containing only terminal tiles (1, 9).</span>,
		example: {
			tiles: [],
			melds: [
				{ t: 'chiipon', tiles: ['1m', '1m', '1m'] },
				{ t: 'chiipon', tiles: ['1p', '1p', '1p'] },
				{ t: 'chiipon', tiles: ['9s', '9s', '9s'] },
			],
		},
	}),
	四槓子: yaku({
		id: '四槓子',
		name: 'Four Quads',
		yakuman: true,
		value: 1,
		help: <span>A hand containing four kans.</span>,
		example: {
			tiles: ['1m', '1m'],
			melds: [
				{
					t: 'kan',
					closed: false,
					tiles: ['3m', '3m', '3m', '3m'],
				},
				{
					t: 'kan',
					closed: false,
					tiles: ['4s', '4s', '4s', '4s'],
				},
				{
					t: 'kan',
					closed: false,
					tiles: ['8s', '8s', '8s', '8s'],
				},
				{
					t: 'kan',
					closed: false,
					tiles: ['1z', '1z', '1z', '1z'],
				},
			],
		},
	}),
	大七星: yaku({
		id: '大七星',
		name: 'Big Seven Stars',
		type: 'local',
		yakuman: true,
		value: 1,
		help: <span>A seven pairs hand containing all seven types of honor tiles.</span>,
		example: { tiles: ['1z', '1z', '2z', '2z', '3z', '3z', '4z', '4z', '5z', '5z', '6z', '6z', '7z', '7z'] },
	}),
	紅孔雀: yaku({
		id: '紅孔雀',
		name: 'Red Peacock',
		type: 'local',
		yakuman: true,
		value: 1,
		help: <span>A hand built using only red bamboo tiles (1, 5, 7, 9) and Red Dragon.</span>,
		example: {
			tiles: ['1s', '5s', '7s', '9s', '7z'],
		},
	}),
	黒一色: yaku({
		id: '黒一色',
		name: 'All Black',
		type: 'local',
		yakuman: true,
		value: 1,
		help: <span>A hand built using only black circles tiles (2, 4, 8) and wind tiles.</span>,
		example: {
			tiles: ['2p', '4p', '8p', '1z', '2z', '3z', '4z'],
		},
	}),
	百万石: yaku({
		id: '百万石',
		name: 'One Million Koku',
		type: 'local',
		yakuman: true,
		value: 1,
		help: <span>A full flush hand of characters, such that the numeric values add up to at least 100.</span>,
		example: {
			tiles: ['1m', '2m', '3m', '6m', '6m', '6m', '7m', '7m'],
			melds: [
				{ t: 'kan', closed: false, tiles: ['8m', '8m', '8m', '8m'] },
				{ t: 'kan', closed: false, tiles: ['9m', '9m', '9m', '9m'] },
			],
		},
	}),
	// Riichi & Special
	立直: yaku({
		id: '立直',
		name: 'Riichi',
		value: 1,
		closedOnly: true,
		basic: true,
		help: (
			<span>
				Declare riichi with a 1000 point bet when in tenpai (one away from winning). Can no longer change hand.
			</span>
		),
	}),
	ダブル立直: yaku({
		id: 'ダブル立直',
		name: 'Double Riichi',
		type: 'optional',
		value: 2,
		closedOnly: true,
		help: <span>Declare riichi on your first turn. Calls invalidate.</span>,
	}),
	一発: yaku({
		id: '一発',
		name: 'Ippatsu',
		type: 'optional',
		value: 1,
		closedOnly: true,
		help: <span>Win before your next discard. Calls invalidate.</span>,
	}),
	門前清自摸和: yaku({
		id: '門前清自摸和',
		name: 'Fully Concealed Hand',
		value: 1,
		closedOnly: true,
		help: <span>Win with tsumo with a closed hand.</span>,
	}),
	嶺上開花: yaku({
		id: '嶺上開花',
		name: 'After a Kan',
		type: 'optional',
		value: 1,
		help: <span>Win on the dead wall draw after calling kan.</span>,
	}),
	搶槓: yaku({
		id: '搶槓',
		name: 'Robbing a Kan',
		type: 'optional',
		value: 1,
		help: <span>Win off a player upgrading a pon into a kan.</span>,
	}),
	海底摸月: yaku({ id: '海底摸月', name: 'Under the Sea', type: 'optional', value: 1 }),
	河底撈魚: yaku({ id: '河底撈魚', name: 'Under the River', type: 'optional', value: 1 }),
	// 1 Han
	場風東: yaku({ id: '場風東', name: 'Prevalent Wind (East)', value: 1, basic: true }),
	場風南: yaku({ id: '場風南', name: 'Prevalent Wind (South)', value: 1, basic: true }),
	場風西: yaku({ id: '場風西', name: 'Prevalent Wind (West)', value: 1, basic: true }),
	場風北: yaku({ id: '場風北', name: 'Prevalent Wind (North)', value: 1, basic: true }),
	自風東: yaku({ id: '自風東', name: 'Seat Wind (East)', value: 1, basic: true }),
	自風南: yaku({ id: '自風南', name: 'Seat Wind (South)', value: 1, basic: true }),
	自風西: yaku({ id: '自風西', name: 'Seat Wind (West)', value: 1, basic: true }),
	自風北: yaku({ id: '自風北', name: 'Seat Wind (North)', value: 1, basic: true }),
	役牌白: yaku({ id: '役牌白', name: 'White Dragon', value: 1, basic: true }),
	役牌発: yaku({ id: '役牌発', name: 'Green Dragon', value: 1, basic: true }),
	役牌中: yaku({ id: '役牌中', name: 'Red Dragon', value: 1, basic: true }),
	平和: yaku({
		id: '平和',
		name: 'Pinfu',
		type: 'optional',
		value: 1,
		closedOnly: true,
		help: (
			<span>
				A hand worth 0 fu, aside from the base fu. That is, it consists of only sequences, a valueless pair (not a
				dragon or round/seat wind), and a two-sided open wait.
			</span>
		),
		example: {
			tiles: [],
			melds: [
				{ t: 'chiipon', tiles: ['1p'] },
				{ t: 'chiipon', tiles: ['2p', '3p'] },
				{ t: 'chiipon', tiles: ['4p'] },
			],
		},
	}),
	断么九: yaku({
		id: '断么九',
		name: 'All Simples',
		type: 'optional',
		value: 1,
		basic: true,
		help: (
			<span>
				A hand containing only tiles 2 through 8. No terminals or honors allowed. This yaku may be closed only in
				certain rule variations.
			</span>
		),
		example: {
			tiles: ['2m', '3m', '4m', '5p', '6p', '7p', '8s', '8s'],
		},
	}),
	一盃口: yaku({
		id: '一盃口',
		name: 'Pure Double Sequence',
		value: 1,
		closedOnly: true,
		help: <span>Two of the exact same sequence (in suit and number).</span>,
		example: {
			tiles: ['1m', '1m', '2m', '2m', '3m', '3m'],
		},
	}),
	十二落抬: yaku({
		id: '十二落抬',
		name: 'All Calls',
		type: 'local',
		value: 1,
		basic: true,
		help: (
			<span>
				A hand with 4 open sets (i.e. not including closed kan) waiting for a single tile to complete. Can win on tsumo
				or ron.
			</span>
		),
		example: {
			tiles: ['1z', '1z'],
			melds: [
				{ t: 'chiipon', tiles: ['1m', '2m', '3m'] },
				{ t: 'chiipon', tiles: ['2p', '3p', '4p'] },
				{ t: 'chiipon', tiles: ['6s', '7s', '8s'] },
				{ t: 'kan', closed: false, tiles: ['9s', '9s', '9s', '9s'] },
			],
		},
	}),
	// 1+ Han
	三色同順: yaku({
		id: '三色同順',
		name: 'Mixed Triple Sequence',
		value: 2,
		openMinus: true,
		help: <span>The same sequence in each suit.</span>,
		example: {
			tiles: ['1m', '2m', '3m', '1p', '2p', '3p', '1s', '2s', '3s'],
		},
	}),
	一気通貫: yaku({
		id: '一気通貫',
		name: 'Pure Straight',
		value: 2,
		openMinus: true,
		help: <span>The sequences 123, 456, 789 in a single suit.</span>,
		example: {
			tiles: ['1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p'],
		},
	}),
	混全帯么九: yaku({
		id: '混全帯么九',
		name: 'Half Outside Hand',
		value: 2,
		openMinus: true,
		help: <span>Every set in the hand contains a terminal (1, 9) or an honor.</span>,
		example: {
			tiles: [],
			melds: [
				{ t: 'chiipon', tiles: ['1p', '2p', '3p'] },
				{ t: 'chiipon', tiles: ['9p', '9p', '9p'] },
				{ t: 'chiipon', tiles: ['7z', '7z', '7z'] },
			],
		},
	}),
	// 2 Han
	七対子: yaku({
		id: '七対子',
		name: 'Seven Pairs',
		value: 2,
		closedOnly: true,
		basic: true,
		help: (
			<span>A hand consisting of seven pairs. An exception to the usual hand composition of four sets and a pair.</span>
		),
		example: {
			tiles: ['1m', '1m', '2m', '2m', '3p', '3p', '5p', '5p', '7s', '7s', '9s', '9s', '1z', '1z'],
		},
	}),
	五門斉: yaku({
		id: '五門斉',
		name: 'All Types',
		type: 'local',
		value: 2,
		help: <span>A hand containing all 5 different suits (characters, circles, bamboo, winds, and dragons).</span>,
		example: {
			tiles: ['2m', '2m', '2m', '7z', '7z'],
			melds: [
				{ t: 'chiipon', tiles: ['2p', '3p', '4p'] },
				{ t: 'chiipon', tiles: ['9s', '9s', '9s'] },
				{ t: 'chiipon', tiles: ['1z', '1z', '1z'] },
			],
		},
	}),
	対々和: yaku({
		id: '対々和',
		name: 'All Triplets',
		value: 2,
		basic: true,
		help: <span>A hand consisting of only triplets.</span>,
		example: {
			tiles: ['1m', '1m', '1m', '3p', '3p', '3p', '5p', '5p', '5p', '9s', '9s', '9s', '1z', '1z'],
		},
	}),
	三色同刻: yaku({
		id: '三色同刻',
		name: 'Triple Triplets',
		value: 2,
		help: <span>A hand containing the same triplet in each suit.</span>,
		example: {
			tiles: [],
			melds: [
				{ t: 'chiipon', tiles: ['5m', '5m', '5m'] },
				{ t: 'chiipon', tiles: ['5p', '5p', '5p'] },
				{ t: 'chiipon', tiles: ['5s', '5s', '5s'] },
			],
		},
	}),
	三暗刻: yaku({
		id: '三暗刻',
		name: 'Three Concealed Triplets',
		value: 2,
		help: <span>Three concealed triplets (not called with pon or open kan). Other sets may be open.</span>,
		example: {
			tiles: ['1m', '1m', '1p', '2p', '3p', '9p', '9p', '9p', '4s', '4s', '4s', '1z', '1z', '1z'],
		},
	}),
	三連刻: yaku({
		id: '三連刻',
		name: 'Three Consecutive Triplets',
		type: 'local',
		value: 2,
		help: <span>A hand containing three triplets in the same suit where their number steps by 1.</span>,
		example: {
			tiles: [],
			melds: [
				{ t: 'chiipon', tiles: ['3p', '3p', '3p'] },
				{ t: 'chiipon', tiles: ['4p', '4p', '4p'] },
				{ t: 'chiipon', tiles: ['5p', '5p', '5p'] },
			],
		},
	}),
	三槓子: yaku({
		id: '三槓子',
		name: 'Three Quads',
		value: 2,
		help: <span>A hand containing three kans.</span>,
		example: {
			tiles: ['1m', '1m', '3m', '3m', '3m'],
			melds: [
				{
					t: 'kan',
					closed: false,
					tiles: ['4s', '4s', '4s', '4s'],
				},
				{
					t: 'kan',
					closed: false,
					tiles: ['8s', '8s', '8s', '8s'],
				},
				{
					t: 'kan',
					closed: false,
					tiles: ['1z', '1z', '1z', '1z'],
				},
			],
		},
	}),
	小三元: yaku({
		id: '小三元',
		name: 'Three Little Dragons',
		value: 2,
		help: <span>Two sets and a pair of each dragon.</span>,
		example: {
			tiles: ['5z', '5z', '5z', '6z', '6z', '6z', '7z', '7z'],
		},
	}),
	混老頭: yaku({
		id: '混老頭',
		name: 'All Terminals and Honors',
		value: 2,
		help: <span>The hand contains only terminals (1, 9) and honors.</span>,
		example: {
			tiles: [],
			melds: [
				{ t: 'chiipon', tiles: ['1p', '1p', '1p'] },
				{ t: 'chiipon', tiles: ['9p', '9p', '9p'] },
				{ t: 'chiipon', tiles: ['7z', '7z', '7z'] },
			],
		},
	}),
	// 2+ Han
	一色三順: yaku({
		id: '一色三順',
		name: 'Pure Triple Sequence',
		type: 'local',
		value: 3,
		openMinus: true,
		help: <span>A hand containing three identical sequences in the same suit.</span>,
		example: {
			tiles: [],
			melds: [
				{ t: 'chiipon', tiles: ['1p', '2p', '3p'] },
				{ t: 'chiipon', tiles: ['1p', '2p', '3p'] },
				{ t: 'chiipon', tiles: ['1p', '2p', '3p'] },
			],
		},
	}),
	純全帯么九: yaku({
		id: '純全帯么九',
		name: 'Fully Outside Hand',
		value: 3,
		openMinus: true,
		help: <span>Every set in the hand contains a terminal (1, 9), but not honors.</span>,
		example: {
			tiles: [],
			melds: [
				{ t: 'chiipon', tiles: ['1p', '2p', '3p'] },
				{ t: 'chiipon', tiles: ['9p', '9p', '9p'] },
			],
		},
	}),
	混一色: yaku({
		id: '混一色',
		name: 'Half Flush',
		value: 3,
		openMinus: true,
		basic: true,
		help: <span>A hand containing only one suit and honors.</span>,
		example: {
			tiles: ['1p', '2p', '3p', '1z', '1z', '1z', '7z', '7z', '7z'],
		},
	}),
	// 3 Han
	二盃口: yaku({
		id: '二盃口',
		name: 'Twice Pure Double Sequence',
		value: 3,
		closedOnly: true,
		help: (
			<span>Two separate two of the exact same sequence (in suit and number). Does not combine with seven pairs.</span>
		),
		example: {
			tiles: ['1m', '1m', '2m', '2m', '3m', '3m', '5p', '5p', '6p', '6p', '7p', '7p'],
		},
	}),
	// 5+ Han
	清一色: yaku({
		id: '清一色',
		name: 'Full Flush',
		value: 6,
		openMinus: true,
		help: <span>A hand containing only one suit, but no honors.</span>,
		example: {
			tiles: ['1p', '2p', '3p'],
		},
	}),
	// Dora
	ドラ: yaku({ id: 'ドラ', name: 'Dora', type: 'extra', value: 1 }),
	裏ドラ: yaku({ id: '裏ドラ', name: 'Uradora', type: 'extra', value: 1 }),
	赤ドラ: yaku({ id: '赤ドラ', name: 'Red Fives', type: 'extra', value: 1 }),
	抜きドラ: yaku({ id: '抜きドラ', name: 'Kita', type: 'extra', value: 1 }),
	// Extra
	他の役満: yaku({ id: '他の役満', name: 'Other Yakuman', type: 'extra', value: 1 }),
	他の役: yaku({ id: '他の役', name: 'Other Yaku', type: 'extra', value: 1 }),
	他のドラ: yaku({ id: '他のドラ', name: 'Other Dora', type: 'extra', value: 1 }),
} as const;

export const YakuSort = Object.fromEntries(Object.keys(YakuList).map((x, i) => [x, i]));

export type YakuReferenceNode =
	| { t: 'yaku'; yaku: keyof typeof YakuList }
	| ({
			t: 'other';
	  } & Omit<Yaku, 'id'>);

export type YakuReferenceItem = YakuReferenceNode & {
	inner: YakuReferenceNode[];
};

function ref(yaku: keyof typeof YakuList): YakuReferenceNode {
	return { t: 'yaku', yaku };
}

function yakuRef(
	yaku: keyof typeof YakuList,
	{
		inner = [],
	}: {
		inner?: YakuReferenceNode[];
	} = {},
): YakuReferenceItem {
	return { t: 'yaku', yaku, inner };
}

function otherRef({
	name,
	type = 'normal',
	value,
	yakuman = false,
	closedOnly = false,
	openMinus = false,
	basic = false,
	per = false,
	help,
	example,
	inner = [],
}: {
	inner?: YakuReferenceNode[];
} & Omit<Partially<Yaku, 'type' | 'yakuman' | 'openMinus' | 'closedOnly' | 'basic' | 'per'>, 'id'>): YakuReferenceItem {
	return { t: 'other', name, type, help, inner, value, yakuman, closedOnly, openMinus, basic, per, example };
}

export function referenceToYaku(node: YakuReferenceNode): Omit<Yaku, 'id'> {
	return node.t === 'yaku' ? YakuList[node.yaku] : node;
}

export const YakuReferenceSort: YakuReferenceItem[] = [
	// Closed hand
	yakuRef('立直', { inner: [ref('ダブル立直'), ref('一発')] }),
	yakuRef('門前清自摸和'),
	yakuRef('平和'),
	yakuRef('一盃口', { inner: [ref('二盃口')] }),
	yakuRef('七対子', { inner: [ref('大七星')] }),
	// Yakuhai
	otherRef({
		name: 'Dragons',
		value: 1,
		per: true,
		help: <span>Any of the three dragons. Gain 1 Han for each set.</span>,
		example: { tiles: ['7z', '7z', '7z'] },
		basic: true,
		inner: [yakuRef('小三元'), yakuRef('大三元')],
	}),
	otherRef({
		name: 'Winds',
		value: 1,
		per: true,
		help: (
			<span>
				The round wind and/or the seat wind. Gain 1 Han for each set. Gain 2 Han if wind is both round and seat wind.
			</span>
		),
		example: { tiles: ['1z', '1z', '1z'] },
		basic: true,
		inner: [yakuRef('小四喜'), yakuRef('大四喜')],
	}),
	// All simples
	yakuRef('断么九'),
	// All calls
	yakuRef('十二落抬'),
	// Sequences
	yakuRef('三色同順'),
	yakuRef('一色三順'),
	yakuRef('一気通貫'),
	// Terminals and honors
	yakuRef('混全帯么九', { inner: [ref('純全帯么九'), ref('混老頭'), ref('清老頭'), ref('字一色')] }),
	// Triplets
	yakuRef('対々和'),
	yakuRef('三色同刻'),
	yakuRef('三連刻'),
	// Concealed triplets
	yakuRef('三暗刻', { inner: [ref('四暗刻'), ref('四暗刻単騎待ち')] }),
	// Quads
	yakuRef('三槓子', { inner: [ref('四槓子')] }),
	// All types
	yakuRef('五門斉'),
	// Flushes
	yakuRef('混一色', {
		inner: [
			ref('清一色'),
			ref('緑一色'),
			ref('紅孔雀'),
			ref('黒一色'),
			ref('百万石'),
			ref('九蓮宝燈'),
			ref('純正九蓮宝燈'),
		],
	}),
	// Thirteen orphans
	yakuRef('国士無双', { inner: [ref('国士無双十三面待ち')] }),
	// Other yaku
	otherRef({
		name: 'Under the Sea, Under the River',
		value: 1,
		help: <span>Win on the final draw or discard from the wall.</span>,
	}),
	yakuRef('嶺上開花'),
	yakuRef('搶槓'),
	otherRef({
		name: 'Blessing of Heaven, Blessing of Earth',
		yakuman: true,
		closedOnly: true,
		value: 1,
		inner: [ref('人和')],
		help: <span>Call tsumo on your first turn. Calls invalidate.</span>,
	}),
	otherRef({
		name: 'Mangan at Draw',
		value: 5,
		help: (
			<span>
				At an exhaustive draw, a Mangan is awarded if your discards are only terminals and honors and none were called
				by other players. This can be scored as a Mangan, 5 Han, etc. depending on rule variations.
			</span>
		),
	}),
	// Dora
	otherRef({
		name: 'Dora',
		value: 1,
		per: true,
		basic: true,
		type: 'extra',
		help: (
			<span>
				A dora indicator is flipped at the start of each hand, pointing to the dora. Another dora indicator is flipped
				per kan. Ura dora indicators underneath are revealed on a riichi win. Red fives are also dora.
			</span>
		),
		example: {
			tiles: [],
			melds: [
				{
					t: 'chiipon',
					tiles: ['9p', '1p'],
				},
				{
					t: 'chiipon',
					tiles: ['1z', '2z', '3z', '4z', '1z'],
				},
				{
					t: 'chiipon',
					tiles: ['5z', '6z', '7z', '5z'],
				},
				{
					t: 'chiipon',
					tiles: ['0m', '0p', '0s'],
				},
			],
		},
	}),
	otherRef({
		name: 'Kita',
		value: 1,
		per: true,
		type: 'extra',
		help: <span>In three-player mahjong, North tiles that were called counts as dora.</span>,
		example: {
			tiles: ['4z'],
		},
	}),
];
