import Riichi from 'riichi';

export type Suit = 'm' | 'p' | 's';

/**
 * Tile numbers, where 0 is akadora.
 */
export type SuitNumber = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0';

export type Honor = 'z';

export type HonorNumber = '1' | '2' | '3' | '4' | '5' | '6' | '7';

export type TileCode = `${SuitNumber}${Suit}` | `${HonorNumber}${Honor}`;

export type Meld = { t: 'chiipon'; tiles: TileCode[] } | { t: 'kan'; closed: boolean; tiles: TileCode[] };

export const Tiles = {
	m: ['1m', '2m', '3m', '4m', '5m', '6m', '7m', '8m', '9m'],
	p: ['1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p'],
	s: ['1s', '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s'],
	z: ['1z', '2z', '3z', '4z', '5z', '6z', '7z'],
} as const;

/**
 * Mutably sorts tiles.
 */
export function sortTiles(tiles: TileCode[]): TileCode[] {
	const suitOrder = { m: 0, p: 1, s: 2, z: 3 };
	return tiles.sort((x, y) => {
		const sx = x[1] as Suit | Honor;
		const sy = y[1] as Suit | Honor;
		// Consider akadora 5 as 4.9 so they sort first.
		return suitOrder[sx] - suitOrder[sy] || (Number(x[0]) || 4.9) - (Number(y[0]) || 4.9);
	});
}

/**
 * Mutably sorts melds.
 */
export function sortMelds(melds: Meld[]): Meld[] {
	const suitOrder = { m: 0, p: 1, s: 2, z: 3 };
	return melds.sort((x, y) => {
		const sx = x.tiles[0][1] as Suit | Honor;
		const sy = y.tiles[0][1] as Suit | Honor;
		// Consider akadora 5 as 4.9 so they sort first.
		return suitOrder[sx] - suitOrder[sy] || (Number(x.tiles[0][0]) || 4.9) - (Number(y.tiles[0][0]) || 4.9);
	});
}

/**
 * Wind numbers, in order of East, South, West, North.
 */
export type Wind = '1' | '2' | '3' | '4';

export function nextWind(w: Wind, k = 1): Wind {
	const next = ((Number(w[0]) + k - 1) % 4) + 1;
	return next.toString() as Wind;
}

export function nextDoraTile(t: TileCode, k = 1): TileCode {
	const num = Number(t[0]) || 5;
	const suit = t[1];
	if (suit === 'z') {
		if (num <= 4) {
			const d = k < 0 ? 4 + k : k;
			return `${((num + d - 1) % 4) + 1}z` as TileCode;
		}
		const d = k < 0 ? 3 + k : k;
		return `${((num + d - 5) % 3) + 5}z` as TileCode;
	}
	const d = k < 0 ? 9 + k : k;
	return `${((num + d - 1) % 9) + 1}${suit}` as TileCode;
}

export function translateWind(w: Wind): string {
	return { 1: 'East', 2: 'South', 3: 'West', 4: 'North' }[w];
}

export interface Hand {
	/**
	 * The tiles in hand (including agari).
	 */
	tiles: TileCode[];

	/**
	 * The melds opened.
	 */
	melds: Meld[];

	/**
	 * Agari tile index within the tiles in hand.
	 */
	agariIndex: number;

	agari: 'ron' | 'tsumo';

	dora: TileCode[];

	uradora: TileCode[];

	nukidora: number;

	riichi: { double: boolean; ippatsu: boolean } | null;

	blessing: boolean;

	lastTile: boolean;

	kan: boolean;

	roundWind: Wind;

	seatWind: Wind;
}

export const YakuNames: Record<string, string> = {
	// Double Yakuman
	国士無双十三面待ち: 'Thirteen-Wait Thirteen Orphans',
	純正九蓮宝燈: 'True Nine Gates',
	四暗刻単騎待ち: 'Single-Wait Four Concealed Triplets',
	大四喜: 'Four Big Winds',
	// Yakuman
	天和: 'Blessing of Heaven',
	地和: 'Blessing of Earth',
	人和: 'Blessing of Man',
	国士無双: 'Thirteen Orphans',
	九蓮宝燈: 'Nine Gates',
	四暗刻: 'Four Concealed Triplets',
	小四喜: 'Four Little Winds',
	大三元: 'Three Big Dragons',
	字一色: 'All Honors',
	緑一色: 'All Greens',
	清老頭: 'All Terminals',
	四槓子: 'Four Quads',
	大七星: 'Big Seven Stars',
	// Riichi & Special
	ダブル立直: 'Double Riichi',
	立直: 'Riichi',
	一発: 'Ippatsu',
	門前清自摸和: 'Fully Concealed Hand',
	嶺上開花: 'After a Kan',
	搶槓: 'Robbing a Kan',
	海底摸月: 'Under the Sea',
	河底撈魚: 'Under the River',
	// 1 Han
	場風東: 'Prevalent Wind (East)',
	場風南: 'Prevalent Wind (South)',
	場風西: 'Prevalent Wind (West)',
	場風北: 'Prevalent Wind (North)',
	自風東: 'Seat Wind (East)',
	自風南: 'Seat Wind (South)',
	自風西: 'Seat Wind (West)',
	自風北: 'Seat Wind (North)',
	役牌白: 'White Dragon',
	役牌発: 'Green Dragon',
	役牌中: 'Red Dragon',
	平和: 'Pinfu',
	断么九: 'All Simples',
	一盃口: 'Pure Double Sequence',
	// 1+ Han
	三色同順: 'Mixed Triple Sequence',
	一気通貫: 'Pure Straight',
	混全帯么九: 'Half Outside Hand',
	// 2 Han
	七対子: 'Seven Pairs',
	対々和: 'All Triplets',
	三色同刻: 'Triple Triplets',
	三暗刻: 'Three Concealed Triplets',
	三槓子: 'Three Quads',
	小三元: 'Three Little Dragons',
	混老頭: 'All Terminals and Honors',
	// 2+ Han
	純全帯么九: 'Fully Outside Hand',
	混一色: 'Half Flush',
	// 3 Han
	二盃口: 'Twice Pure Double Sequence',
	// 5+ Han
	清一色: 'Full Flush',
	// Dora
	ドラ: 'Dora',
	裏ドラ: 'Uradora',
	抜きドラ: 'Nukidora',
	赤ドラ: 'Red Fives',
} as const;

export const YakuSort = Object.fromEntries(Object.keys(YakuNames).map((x, i) => [x, i]));

export function translateYaku(yaku: string): string {
	return YakuNames[yaku];
}

export function translateScore(name: string): string {
	const n = parseInt(name, 10);
	if (n && name.endsWith('役満')) {
		return `${['Double', 'Triple', 'Quadruple', 'Quintuple', 'Sextuple'][n - 2]} Yakuman`;
	}
	return {
		満貫: 'Mangan',
		跳満: 'Haneman',
		倍満: 'Baiman',
		三倍満: 'Sanbaiman',
		数え役満: 'Counted Yakuman',
		役満: 'Yakuman',
		無役: 'No Yaku',
	}[name]!;
}

export interface CalculatedValue {
	agari: 'tsumo' | 'ron' | null;
	isOya: boolean;
	yakuman: number;
	yaku: [string, number | 'y' | 'yy'][];
	han: number;
	fu: number;
	points: {
		total: number;
		oya: number[];
		ko: number[];
	};
	name: string | null;
}

export interface ScoreSettings {
	noYakuBase: number;
	openTanyao: boolean;
	doubleYakuman: boolean;
}

export const DefaultSettings: ScoreSettings = {
	noYakuBase: 0,
	openTanyao: true,
	doubleYakuman: true,
};

export function convertHand(hand: Hand): string {
	let s = '';

	const suits = partitionSuits(hand.tiles.filter((t, i) => i !== hand.agariIndex));
	for (const [suit, tiles] of suits) {
		s += tiles;
		s += suit;
	}

	if (hand.agari === 'ron') {
		s += '+';
		s += hand.tiles[hand.agariIndex];
	} else {
		s += hand.tiles[hand.agariIndex];
	}

	for (const meld of hand.melds) {
		s += '+';
		if (meld.t === 'chiipon' || !meld.closed) {
			for (const tile of meld.tiles) {
				s += tile[0];
			}
			s += meld.tiles[0][1];
		} else {
			// Riichi library uses two tiles as closed kan.
			s += meld.tiles[0][0];
			s += meld.tiles[0][0];
			s += meld.tiles[0][1];
		}
	}

	if (hand.dora.length) {
		s += '+d';
		const doraSuits = partitionSuits(hand.dora);
		for (const [suit, tiles] of doraSuits) {
			s += tiles;
			s += suit;
		}
	}

	if (hand.uradora.length) {
		s += '+u';
		const doraSuits = partitionSuits(hand.uradora);
		for (const [suit, tiles] of doraSuits) {
			s += tiles;
			s += suit;
		}
	}

	if (hand.nukidora) {
		s += '+n';
		s += hand.nukidora;
	}

	s += '+';

	if (hand.riichi) {
		if (hand.riichi.double) {
			s += 'w';
		} else {
			s += 'r';
		}
		if (hand.riichi.ippatsu) {
			s += 'i';
		}
	}

	if (hand.blessing) {
		s += 't';
	}

	if (hand.lastTile) {
		s += 'h';
	}

	if (hand.kan) {
		s += 'k';
	}

	s += hand.roundWind;
	s += hand.seatWind;

	return s;
}

export function isDora(t: TileCode, hand: Hand) {
	return (
		hand.dora.includes(t) ||
		(t[0] === '0' && hand.dora.includes(`5${t[1]}` as TileCode)) ||
		hand.uradora.includes(t) ||
		(t[0] === '0' && hand.uradora.includes(`5${t[1]}` as TileCode))
	);
}

export function partitionSuits(tiles: TileCode[]): [Suit | Honor, string][] {
	const suits: Record<Suit | Honor, string[]> = { m: [], p: [], s: [], z: [] };
	for (const tile of tiles) {
		suits[tile[1] as Suit | Honor].push(tile[0]);
	}
	const res: [Suit | Honor, string][] = [];
	for (const [suit, tiles] of Object.entries(suits)) {
		if (tiles.length) {
			res.push([suit as Suit | Honor, tiles.join('')]);
		}
	}
	return res;
}

export function convertValue(hand: Hand, res: Riichi.Result): CalculatedValue {
	return {
		agari: res.isAgari ? hand.agari : null,
		isOya: hand.seatWind === '1',
		yakuman: res.yakuman,
		yaku: Object.entries(res.yaku)
			.sort((x, y) => YakuSort[x[0]]! - YakuSort[y[0]]!)
			.map(([name, vs]) => {
				const trans = translateYaku(name);
				const value = vs === 'ダブル役満' ? 'yy' : vs === '役満' ? 'y' : Number(/\d+/.exec(vs)?.[0]);
				return [trans, value];
			}),
		han: res.han,
		fu: res.fu,
		points: {
			total: res.ten,
			oya: res.oya,
			ko: res.ko,
		},
		name: res.name ? translateScore(res.name) : null,
	};
}

export function calculate(hand: Hand, settings: ScoreSettings): CalculatedValue {
	const conv = convertHand(hand);
	const riichi = new Riichi(conv);
	if (!settings.doubleYakuman) {
		riichi.disableWyakuman();
	}
	if (!settings.openTanyao) {
		riichi.disableKuitan();
	}
	const res = riichi.calc();
	if (res.han === 0 && res.yakuman === 0 && res.isAgari) {
		const oya =
			hand.agari === 'ron'
				? [settings.noYakuBase * 6]
				: [settings.noYakuBase * 2, settings.noYakuBase * 2, settings.noYakuBase * 2];
		const ko =
			hand.agari === 'ron'
				? [settings.noYakuBase * 4]
				: [settings.noYakuBase * 2, settings.noYakuBase, settings.noYakuBase];
		return {
			agari: hand.agari,
			isOya: hand.seatWind === '1',
			yakuman: 0,
			yaku: [],
			han: 0,
			fu: 0,
			points: {
				total: hand.seatWind === '1' ? oya.reduce((a, b) => a + b, 0) : ko.reduce((a, b) => a + b, 0),
				oya,
				ko,
			},
			name: 'No Yaku',
		};
	}
	if (res.error) {
		throw new Error('Invalid hand');
	}
	return convertValue(hand, res);
}
