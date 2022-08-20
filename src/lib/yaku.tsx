import { ReactNode } from 'react';
import Tiles from '../components/Tiles';

export interface Yaku {
	/** Kanji name as in riichi library. */
	id: string;
	name: string;
	type: 'normal' | 'optional' | 'local' | 'extra';
	help?: ReactNode;
}

type Partially<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

function yaku({ id, name, type = 'normal', help = null }: Partially<Yaku, 'type'>): Yaku {
	return { id, name, type, help };
}

export const YakuList: Record<string, Yaku> = {
	// Double Yakuman
	国士無双十三面待ち: yaku({ id: '国士無双十三面待ち', name: 'Thirteen-Wait Thirteen Orphans' }),
	純正九蓮宝燈: yaku({ id: '純正九蓮宝燈', name: 'True Nine Gates' }),
	四暗刻単騎待ち: yaku({ id: '四暗刻単騎待ち', name: 'Single-Wait Four Concealed Triplets' }),
	大四喜: yaku({ id: '大四喜', name: 'Four Big Winds' }),
	// Yakuman
	天和: yaku({ id: '天和', name: 'Blessing of Heaven' }),
	地和: yaku({ id: '地和', name: 'Blessing of Earth' }),
	人和: yaku({
		id: '人和',
		name: 'Blessing of Man',
		type: 'local',
		help: (
			<div className="flex flex-col gap-2">
				<span>Yakuman. Call Ron before your first turn. Calls invalidate.</span>
			</div>
		),
	}),
	国士無双: yaku({ id: '国士無双', name: 'Thirteen Orphans' }),
	九蓮宝燈: yaku({ id: '九蓮宝燈', name: 'Nine Gates' }),
	四暗刻: yaku({ id: '四暗刻', name: 'Four Concealed Triplets' }),
	小四喜: yaku({ id: '小四喜', name: 'Four Little Winds' }),
	大三元: yaku({ id: '大三元', name: 'Three Big Dragons' }),
	字一色: yaku({ id: '字一色', name: 'All Honors' }),
	緑一色: yaku({ id: '緑一色', name: 'All Green' }),
	清老頭: yaku({ id: '清老頭', name: 'All Terminals' }),
	四槓子: yaku({ id: '四槓子', name: 'Four Quads' }),
	大七星: yaku({
		id: '大七星',
		name: 'Big Seven Stars',
		type: 'local',
		help: (
			<div className="flex flex-col gap-2">
				<span>Yakuman. A seven pairs hand containing all seven types of honor tiles. Closed only.</span>
				<Tiles tiles={['1z', '1z', '2z', '2z', '3z', '3z', '4z', '4z', '5z', '5z', '6z', '6z', '7z', '7z']} />
			</div>
		),
	}),
	紅孔雀: yaku({
		id: '紅孔雀',
		name: 'Red Peacock',
		type: 'local',
		help: (
			<div className="flex flex-col gap-2">
				<span>Yakuman. A hand built using only red bamboo tiles (1, 5, 7, 9) and Red Dragon.</span>
				<Tiles
					tiles={['5s', '5s', '7s', '7s', '7s', '9s', '9s', '9s', '7z', '7z', '7z']}
					melds={[{ t: 'chiipon', tiles: ['1s', '1s', '1s'] }]}
				/>
			</div>
		),
	}),
	黒一色: yaku({
		id: '黒一色',
		name: 'All Black',
		type: 'local',
		help: (
			<div className="flex flex-col gap-2">
				<span>Yakuman. A hand built using only black circles tiles (2, 4, 8) and wind tiles.</span>
				<Tiles
					tiles={['4p', '4p', '8p', '8p', '8p', '1z', '1z', '1z', '2z', '2z', '2z']}
					melds={[{ t: 'chiipon', tiles: ['2p', '2p', '2p'] }]}
				/>
			</div>
		),
	}),
	百万石: yaku({
		id: '百万石',
		name: 'One Million Koku',
		type: 'local',
		help: (
			<div className="flex flex-col gap-2">
				<span>Yakuman. A full flush hand of characters, such that the numeric values add up to at least 100.</span>
				<Tiles
					tiles={['1m', '2m', '3m', '6m', '6m', '6m', '7m', '7m']}
					melds={[
						{ t: 'kan', closed: true, tiles: ['8m', '8m', '8m', '8m'] },
						{ t: 'kan', closed: false, tiles: ['9m', '9m', '9m', '9m'] },
					]}
				/>
			</div>
		),
	}),
	// Riichi & Special
	立直: yaku({ id: '立直', name: 'Riichi' }),
	ダブル立直: yaku({ id: 'ダブル立直', name: 'Double Riichi', type: 'optional' }),
	一発: yaku({ id: '一発', name: 'Ippatsu', type: 'optional' }),
	門前清自摸和: yaku({ id: '門前清自摸和', name: 'Fully Concealed Hand' }),
	嶺上開花: yaku({ id: '嶺上開花', name: 'After a Kan', type: 'optional' }),
	搶槓: yaku({ id: '搶槓', name: 'Robbing a Kan', type: 'optional' }),
	海底摸月: yaku({ id: '海底摸月', name: 'Under the Sea', type: 'optional' }),
	河底撈魚: yaku({ id: '河底撈魚', name: 'Under the River', type: 'optional' }),
	// 1 Han
	場風東: yaku({ id: '場風東', name: 'Prevalent Wind (East)' }),
	場風南: yaku({ id: '場風南', name: 'Prevalent Wind (South)' }),
	場風西: yaku({ id: '場風西', name: 'Prevalent Wind (West)' }),
	場風北: yaku({ id: '場風北', name: 'Prevalent Wind (North)' }),
	自風東: yaku({ id: '自風東', name: 'Seat Wind (East)' }),
	自風南: yaku({ id: '自風南', name: 'Seat Wind (South)' }),
	自風西: yaku({ id: '自風西', name: 'Seat Wind (West)' }),
	自風北: yaku({ id: '自風北', name: 'Seat Wind (North)' }),
	役牌白: yaku({ id: '役牌白', name: 'White Dragon' }),
	役牌発: yaku({ id: '役牌発', name: 'Green Dragon' }),
	役牌中: yaku({ id: '役牌中', name: 'Red Dragon' }),
	平和: yaku({ id: '平和', name: 'Pinfu', type: 'optional' }),
	断么九: yaku({ id: '断么九', name: 'All Simples', type: 'optional' }),
	一盃口: yaku({ id: '一盃口', name: 'Pure Double Sequence' }),
	十二落抬: yaku({
		id: '十二落抬',
		name: 'All Calls',
		type: 'local',
		help: (
			<div className="flex flex-col gap-2">
				<span>
					1 Han. A hand with 4 melded sets (not including closed kan) waiting for a single tile to complete. Can win on
					tsumo or ron.
				</span>
				<Tiles
					tiles={['5z', '5z']}
					melds={[
						{ t: 'chiipon', tiles: ['1m', '2m', '3m'] },
						{ t: 'chiipon', tiles: ['2p', '3p', '4p'] },
						{ t: 'kan', closed: false, tiles: ['8p', '8p', '8p', '8p'] },
						{ t: 'chiipon', tiles: ['7s', '8s', '9s'] },
					]}
				/>
			</div>
		),
	}),
	// 1+ Han
	三色同順: yaku({ id: '三色同順', name: 'Mixed Triple Sequence' }),
	一気通貫: yaku({ id: '一気通貫', name: 'Pure Straight' }),
	混全帯么九: yaku({ id: '混全帯么九', name: 'Half Outside Hand' }),
	// 2 Han
	七対子: yaku({ id: '七対子', name: 'Seven Pairs' }),
	五門斉: yaku({
		id: '五門斉',
		name: 'All Types',
		type: 'local',
		help: (
			<div className="flex flex-col gap-2">
				<span>2 Han. A hand containing all 5 different suits (characters, circles, bamboo, winds, and dragons).</span>
				<Tiles
					tiles={['2m', '2m', '2m', '5z', '5z']}
					melds={[
						{ t: 'chiipon', tiles: ['2p', '3p', '4p'] },
						{ t: 'chiipon', tiles: ['9s', '9s', '9s'] },
						{ t: 'chiipon', tiles: ['4z', '4z', '4z'] },
					]}
				/>
			</div>
		),
	}),
	対々和: yaku({ id: '対々和', name: 'All Triplets' }),
	三色同刻: yaku({ id: '三色同刻', name: 'Triple Triplets' }),
	三暗刻: yaku({ id: '三暗刻', name: 'Three Concealed Triplets' }),
	三連刻: yaku({
		id: '三連刻',
		name: 'Three Consecutive Triplets',
		type: 'local',
		help: (
			<div className="flex flex-col gap-2">
				<span>2 Han. A hand containing three triplets in the same suit where their number steps by 1.</span>
				<Tiles
					tiles={['3p', '3p', '3p', '5s', '5s']}
					melds={[
						{ t: 'chiipon', tiles: ['4p', '4p', '4p'] },
						{ t: 'chiipon', tiles: ['5p', '5p', '5p'] },
						{ t: 'chiipon', tiles: ['7z', '7z', '7z'] },
					]}
				/>
			</div>
		),
	}),
	三槓子: yaku({ id: '三槓子', name: 'Three Quads' }),
	小三元: yaku({ id: '小三元', name: 'Three Little Dragons' }),
	混老頭: yaku({ id: '混老頭', name: 'All Terminals and Honors' }),
	// 2+ Han
	一色三順: yaku({
		id: '一色三順',
		name: 'Pure Triple Sequence',
		type: 'local',
		help: (
			<div className="flex flex-col gap-2">
				<span>3 Han. Loses 1 Han if open. A hand containing three identical sequences in the same suit.</span>
				<Tiles tiles={['1s', '1s', '1s', '2s', '2s', '2s', '3s', '3s', '3s', '8p', '8p', '8p', '1z', '1z']} />
			</div>
		),
	}),
	純全帯么九: yaku({ id: '純全帯么九', name: 'Fully Outside Hand' }),
	混一色: yaku({ id: '混一色', name: 'Half Flush' }),
	// 3 Han
	二盃口: yaku({ id: '二盃口', name: 'Twice Pure Double Sequence' }),
	// 5+ Han
	清一色: yaku({ id: '清一色', name: 'Full Flush' }),
	// Dora
	ドラ: yaku({ id: 'ドラ', name: 'Dora', type: 'extra' }),
	裏ドラ: yaku({ id: '裏ドラ', name: 'Uradora', type: 'extra' }),
	赤ドラ: yaku({ id: '赤ドラ', name: 'Red Fives', type: 'extra' }),
	抜きドラ: yaku({ id: '抜きドラ', name: 'Kita', type: 'extra' }),
	// Extra
	他の役満: yaku({ id: '他の役満', name: 'Other Yakuman', type: 'extra' }),
	他の役: yaku({ id: '他の役', name: 'Other Yaku', type: 'extra' }),
	他のドラ: yaku({ id: '他のドラ', name: 'Other Dora', type: 'extra' }),
} as const;

export const YakuSort = Object.fromEntries(Object.keys(YakuList).map((x, i) => [x, i]));
