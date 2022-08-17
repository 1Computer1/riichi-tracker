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

export function nextWind(w: Wind, k = 1, sanma: boolean): Wind {
	const cap = sanma ? 3 : 4;
	const d = k < 0 ? cap + k : k;
	const next = ((Number(w[0]) + d - 1) % cap) + 1;
	return next.toString() as Wind;
}

export function nextDoraTile(t: TileCode, k = 1, sanma: boolean): TileCode {
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
	if (sanma && suit === 'm') {
		if (num === 1) return '9m';
		return '1m';
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

	extraYakuman: number;
	extraYakuHan: number;
	extraDoraHan: number;

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
	緑一色: 'All Green',
	清老頭: 'All Terminals',
	四槓子: 'Four Quads',
	大七星: 'Big Seven Stars',
	紅孔雀: 'Red Peacock',
	黒一色: 'All Black',
	百万石: 'One Million Koku',
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
	十二落抬: 'Twelve Tiles Falling Down',
	// 1+ Han
	三色同順: 'Mixed Triple Sequence',
	一気通貫: 'Pure Straight',
	混全帯么九: 'Half Outside Hand',
	// 2 Han
	七対子: 'Seven Pairs',
	五門斉: 'All Types',
	対々和: 'All Triplets',
	三色同刻: 'Triple Triplets',
	三暗刻: 'Three Concealed Triplets',
	三連刻: 'Three Consecutive Triplets',
	三槓子: 'Three Quads',
	小三元: 'Three Little Dragons',
	混老頭: 'All Terminals and Honors',
	// 2+ Han
	一色三順: 'Pure Triple Sequence',
	純全帯么九: 'Fully Outside Hand',
	混一色: 'Half Flush',
	// 3 Han
	二盃口: 'Twice Pure Double Sequence',
	// 5+ Han
	清一色: 'Full Flush',
	// Dora
	ドラ: 'Dora',
	裏ドラ: 'Uradora',
	赤ドラ: 'Red Fives',
	抜きドラ: 'Kita',
	// Extra
	他の役満: 'Other Yakuman',
	他の役: 'Other Yaku',
	他のドラ: 'Other Dora',
} as const;

export const YakuSort = Object.fromEntries(Object.keys(YakuNames).map((x, i) => [x, i]));

export function translateYaku(yaku: string): string {
	return YakuNames[yaku];
}

export function translateScore(name: string): string {
	const n = parseInt(name, 10);
	if (n && name.endsWith('役満')) {
		return `${['Double', 'Triple', 'Quadruple', 'Quintuple', 'Sextuple'][n - 2] ?? `${n}x`} Yakuman`;
	}
	return {
		満貫: 'Mangan',
		跳満: 'Haneman',
		倍満: 'Baiman',
		三倍満: 'Sanbaiman',
		数え役満: 'Counted Yakuman',
		役満: 'Yakuman',
	}[name]!;
}

export type CalculatedPoints =
	| {
			agari: 'tsumo';
			points: {
				total: number;
				oya: { ko: number };
				ko: { oya: number; ko: number };
			};
	  }
	| {
			agari: 'ron';
			points: {
				total: number;
				oya: { ron: number };
				ko: { ron: number };
			};
	  }
	| {
			agari: null;
	  };

export function calculateHanFu(
	han: number,
	fu: number,
	settings: ScoreSettings,
): { tsumoAsFromOya: number; tsumoAsKo: number; ronAsOya: number; ronAsKo: number } {
	let base = fu * Math.pow(2, han + 2);
	if (settings.kiriageMangan ? base >= 1920 : base > 2000) {
		if (settings.kazoeYakuman && han >= 13) {
			base = 8000;
		} else if (han >= 11) {
			base = 6000;
		} else if (han >= 8) {
			base = 4000;
		} else if (han >= 6) {
			base = 3000;
		} else {
			base = 2000;
		}
	}
	return calculateScoreTable(base, settings);
}

export function calculateScoreTable(
	base: number,
	settings: ScoreSettings,
): {
	tsumoAsFromOya: number;
	tsumoAsKo: number;
	ronAsOya: number;
	ronAsKo: number;
} {
	return {
		tsumoAsFromOya: ceil100(base * 2) + (settings.sanma === 'bisection' ? ceil100(ceil100(base * 2) / 2) : 0),
		tsumoAsKo: ceil100(base) + (settings.sanma === 'bisection' ? ceil100(ceil100(base) / 2) : 0),
		ronAsOya: ceil100(base * 6),
		ronAsKo: ceil100(base * 4),
	};
}

export function ceil100(num: number): number {
	return Math.ceil(num / 100) * 100;
}

export function makeScore(
	isOya: boolean,
	agari: 'tsumo' | 'ron',
	sanma: boolean,
	{
		tsumoAsFromOya,
		tsumoAsKo,
		ronAsOya,
		ronAsKo,
	}: { tsumoAsFromOya: number; tsumoAsKo: number; ronAsOya: number; ronAsKo: number },
): Exclude<CalculatedPoints, { agari: null }> {
	return agari === 'ron'
		? {
				agari: 'ron',
				points: {
					total: isOya ? ronAsOya : ronAsKo,
					oya: { ron: ronAsOya },
					ko: { ron: ronAsKo },
				},
		  }
		: {
				agari: 'tsumo',
				points: {
					total: isOya ? tsumoAsFromOya * (sanma ? 2 : 3) : tsumoAsFromOya + tsumoAsKo * (sanma ? 1 : 2),
					oya: { ko: tsumoAsFromOya },
					ko: { oya: tsumoAsFromOya, ko: tsumoAsKo },
				},
		  };
}

export type CalculatedValue = CalculatedPoints & {
	isOya: boolean;
	yakuman: number;
	yaku: [string, number, boolean][];
	noYaku: boolean;
	han: number;
	fu: number;
	name: string | null;
};

export interface ScoreSettings {
	noYakuFu: boolean;
	noYakuDora: boolean;
	openTanyao: boolean;
	ryuuiisouHatsu: boolean;
	multiYakuman: boolean;
	doubleYakuman: boolean;
	kiriageMangan: boolean;
	kazoeYakuman: boolean;
	doubleWindFu: boolean;
	rinshanFu: boolean;
	sanma: 'loss' | 'bisection' | null;
	akadora: boolean;
}

export const DefaultSettings: ScoreSettings = {
	noYakuFu: false,
	noYakuDora: false,
	openTanyao: true,
	ryuuiisouHatsu: false,
	multiYakuman: true,
	doubleYakuman: true,
	kiriageMangan: false,
	kazoeYakuman: true,
	doubleWindFu: true,
	rinshanFu: true,
	sanma: null,
	akadora: true,
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
	if (hand.extraYakuHan) {
		s += '+xy';
		s += hand.extraYakuHan;
	}
	if (hand.extraDoraHan) {
		s += '+xd';
		s += hand.extraDoraHan;
	}
	if (hand.extraYakuman) {
		s += '+xm';
		s += hand.extraYakuman;
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
	// eslint-disable-next-line no-negated-condition
	const points: CalculatedPoints = !res.isAgari
		? {
				agari: null,
		  }
		: hand.agari === 'ron'
		? {
				agari: 'ron',
				points: {
					total: res.ten,
					oya: { ron: res.oya[0] },
					ko: { ron: res.ko[0] },
				},
		  }
		: {
				agari: 'tsumo',
				points: {
					total: res.ten,
					oya: { ko: res.oya[0] },
					ko: { oya: res.ko[0], ko: res.ko[1] },
				},
		  };
	return {
		...points,
		isOya: hand.seatWind === '1',
		yakuman: res.yakuman,
		yaku: Object.entries(res.yaku)
			.sort((x, y) => YakuSort[x[0]]! - YakuSort[y[0]]!)
			.map(([name, vs]) => {
				const trans = translateYaku(name);
				const value = vs.endsWith('役満') ? parseInt(vs, 10) || 1 : Number(/\d+/.exec(vs)?.[0]);
				return [trans, value, vs.endsWith('役満')];
			}),
		noYaku: res.noYaku,
		han: res.han,
		fu: res.fu,
		name: res.name ? translateScore(res.name) : null,
	};
}

export function calculate(hand: Hand, settings: ScoreSettings): CalculatedValue {
	const conv = convertHand(hand);
	const riichi = new Riichi(conv, {
		multiYakuman: settings.multiYakuman,
		wyakuman: settings.doubleYakuman,
		kuitan: settings.openTanyao,
		ryuuiisouHatsu: settings.ryuuiisouHatsu,
		noYakuFu: settings.noYakuFu,
		noYakuDora: settings.noYakuDora,
		kiriageMangan: settings.kiriageMangan,
		kazoeYakuman: settings.kazoeYakuman,
		doubleWindFu: settings.doubleWindFu,
		rinshanFu: settings.rinshanFu,
		sanma: settings.sanma != null,
		sanmaBisection: settings.sanma === 'bisection',
		aka: settings.akadora,
	});
	const res = riichi.calc();
	if (res.error) {
		throw new Error('Invalid hand');
	}
	return convertValue(hand, res);
}
