import TileButton from './TileButton';
import { Action } from '../../lib/action';
import { Hand, isDora, TileCode, TilesBySuit } from '../../lib/hand';

export function SuitRow({
	suit,
	hand,
	allTiles,
	action,
	tileCount,
	akadora,
	sanma,
	onClick,
}: {
	suit: 'm' | 'p' | 's';
	hand: Hand;
	allTiles: TileCode[];
	action: Action | null;
	tileCount: number;
	akadora: boolean;
	sanma: boolean;
	onClick?: (tile: TileCode) => void;
}) {
	return (
		<div className="flex flex-row flex-wrap gap-1 lg:gap-2 justify-center items-center min-w-min">
			<div className="flex flex-row flex-wrap gap-1 lg:gap-2 justify-center items-center min-w-min">
				{(sanma && suit === 'm' ? [TilesBySuit[suit][0], TilesBySuit[suit][8]] : TilesBySuit[suit].slice(0, 5)).map(
					(t) => (
						<TileButton
							key={t}
							tile={t}
							onClick={onClick}
							dora={isDora(t, hand, sanma)}
							disabled={isDisabled(t, action, hand, tileCount, allTiles)}
						/>
					),
				)}
			</div>
			<div className="flex flex-row flex-wrap gap-1 lg:gap-2 justify-center items-center min-w-min">
				{(sanma && suit === 'm' ? [] : TilesBySuit[suit].slice(5)).map((t) => (
					<TileButton
						key={t}
						tile={t}
						onClick={onClick}
						dora={isDora(t, hand, sanma)}
						disabled={isDisabled(t, action, hand, tileCount, allTiles)}
					/>
				))}
				{akadora && !(sanma && suit === 'm') && (
					<TileButton
						tile={`0${suit}`}
						onClick={onClick}
						dora={isDora(`0${suit}`, hand, sanma)}
						disabled={isDisabled(`0${suit}`, action, hand, tileCount, allTiles)}
					/>
				)}
			</div>
		</div>
	);
}

export function HonorRow({
	onClick,
	hand,
	allTiles,
	action,
	sanma,
	tileCount,
}: {
	onClick?: (tile: TileCode) => void;
	hand: Hand;
	allTiles: TileCode[];
	tileCount: number;
	sanma: boolean;
	action: Action | null;
}) {
	return (
		<div className="flex flex-row flex-wrap gap-1 lg:gap-2 justify-center items-center min-w-min">
			<div className="flex flex-row flex-wrap gap-1 lg:gap-2 justify-center items-center min-w-min">
				{TilesBySuit.z.slice(0, 4).map((t) => (
					<TileButton
						key={t}
						tile={t}
						dora={isDora(t, hand, sanma)}
						disabled={isDisabled(t, action, hand, tileCount, allTiles)}
						onClick={onClick}
					/>
				))}
			</div>
			<div className="flex flex-row flex-wrap gap-1 lg:gap-2 justify-center items-center min-w-min">
				{TilesBySuit.z.slice(4).map((t) => (
					<TileButton
						key={t}
						tile={t}
						dora={isDora(t, hand, sanma)}
						disabled={isDisabled(t, action, hand, tileCount, allTiles)}
						onClick={onClick}
					/>
				))}
			</div>
		</div>
	);
}

function isDisabled(
	tile: TileCode,
	action: Action | null,
	hand: Hand,
	tileCount: number,
	allTiles: TileCode[],
): boolean {
	// Cannot add dora indicator if tiles are taken.
	if (action?.t === 'dora' || action?.t === 'uradora') {
		// Cannot add more than one red five.
		if (tile[0] === '0' && allTiles.some((t) => t === tile)) {
			return true;
		}
		const count = countTiles(tile, hand, allTiles);
		return count >= 4;
	}
	// Cannot add over 14 tiles to hand.
	if (tileCount >= 14) {
		return true;
	}
	// Cannot add more than one red five.
	if (tile[0] === '0' && allTiles.some((t) => t === tile)) {
		return true;
	}
	const count = countTiles(tile, hand, allTiles);
	// Cannot add more than 4 of a tile.
	if (count >= 4) {
		return true;
	}
	if (tile[1] === 'z') {
		if (action) {
			// Cannot chii an honor or pon/kan if there's already 2/1.
			return action.t === 'chii' || (action.t === 'pon' ? count >= 2 : count >= 1);
		}
	} else if (action) {
		if (action.t === 'chii') {
			// Can always start to chii.
			if (action.tiles.length === 0) {
				return false;
			}
			const suit = action.tiles[0][1];
			if (tile[1] !== suit) {
				return true;
			}
			// Can only continue to chii adjacent tiles.
			const n = Number(tile[0]) || 5;
			const adjancents =
				action.tiles.length === 1
					? [(Number(action.tiles[0][0]) || 5) - 1, (Number(action.tiles[0][0]) || 5) + 1]
					: [(Number(action.tiles[0][0]) || 5) - 1, (Number(action.tiles[1][0]) || 5) + 1];
			return !adjancents.includes(n);
		}
		// Cannot pon/kan if there's already 2/1.
		return action.t === 'pon' ? count >= 2 : count >= 1;
	}
	return false;
}

function countTiles(tile: TileCode, hand: Hand, allTiles: TileCode[]): number {
	const inds = countDoraIndicators(tile, hand);
	// Count nukidora as north.
	if (tile === '4z') {
		return allTiles.filter((t) => t === tile).length + hand.nukidora + inds;
	}
	return allTiles.filter((t) => sameTile(t, tile)).length + inds;
}

function countDoraIndicators(tile: TileCode, hand: Hand): number {
	return hand.dora.filter((d) => sameTile(d, tile)).length + hand.uradora.filter((d) => sameTile(d, tile)).length;
}

function sameTile(a: TileCode, b: TileCode) {
	// Count 5s and red 5s together.
	if (a[0] === '0' || (a[0] === '5' && a[1] !== 'z')) {
		return b === `0${a[1]}` || b === `5${a[1]}`;
	}
	return a === b;
}
