import TileButton from './TileButton';
import { Action } from '../../lib/action';
import { Hand, isDora, nextDoraTile, TileCode, Tiles } from '../../lib/hand';

export function SuitRow({
	suit,
	hand,
	allTiles,
	action,
	tileCount,
	onClick,
}: {
	suit: 'm' | 'p' | 's';
	hand: Hand;
	allTiles: TileCode[];
	action: Action | null;
	tileCount: number;
	onClick?: (tile: TileCode) => void;
}) {
	return (
		<div className="flex flex-row gap-x-1 lg:gap-x-2 justify-center items-center min-w-min">
			{Tiles[suit].map((t) => (
				<TileButton
					key={t}
					tile={t}
					onClick={onClick}
					dora={isDora(t, hand)}
					disabled={isDisabled(t, action, tileCount, allTiles)}
				/>
			))}
			<TileButton
				tile={`0${suit}`}
				onClick={onClick}
				dora={isDora(`0${suit}`, hand)}
				disabled={isDisabled(`0${suit}`, action, tileCount, allTiles)}
			/>
		</div>
	);
}

export function HonorRow({
	onClick,
	hand,
	allTiles,
	action,
	tileCount,
}: {
	onClick?: (tile: TileCode) => void;
	hand: Hand;
	allTiles: TileCode[];
	tileCount: number;
	action: Action | null;
}) {
	return (
		<div className="flex flex-row gap-x-1 lg:gap-x-2 justify-center items-center min-w-min">
			{Tiles.z.map((t) => (
				<TileButton
					key={t}
					tile={t}
					dora={isDora(t, hand)}
					disabled={isDisabled(t, action, tileCount, allTiles)}
					onClick={onClick}
				/>
			))}
		</div>
	);
}

function isDisabled(tile: TileCode, action: Action | null, tileCount: number, allTiles: TileCode[]): boolean {
	// Cannot add dora if indicator tiles are taken, but otherwise always.
	if (action?.t === 'dora' || action?.t === 'uradora') {
		const indicator = nextDoraTile(tile, -1);
		const count =
			indicator[0] === '0' || indicator[0] === '5'
				? allTiles.filter((t) => t === `0${indicator[1]}` || t === `5${indicator[1]}`).length
				: allTiles.filter((t) => t === indicator).length;
		return count >= 4;
	}
	// Cannot add over 14 tiles to hand.
	if (tileCount >= 14) {
		return true;
	}
	// Count 5s and red 5s together.
	const count =
		tile[0] === '0' || tile[0] === '5'
			? allTiles.filter((t) => t === `0${tile[1]}` || t === `5${tile[1]}`).length
			: allTiles.filter((t) => t === tile).length;
	// Cannot add more than one red five.
	if (tile[0] === '0' && allTiles.some((t) => t === tile)) {
		return true;
	}
	// Cannot add more than 4 of a tile.
	if (count >= 4) {
		return true;
	}
	if (tile[1] === 'z') {
		if (action) {
			// Cannot chii an honor or pon/kan if there's already 2/1.
			return action.t === 'chii' || (action.t === 'pon' && count >= 2) || count >= 1;
		}
	} else if (action) {
		if (action.t === 'chii') {
			// Can always start to chii.
			if (action.tiles.length === 0) {
				return false;
			}
			// Can only continue to chii adjacent tiles.
			const n = Number(tile[0]) || 5;
			const adj =
				action.tiles.length === 1
					? [(Number(action.tiles[0][0]) || 5) - 1, (Number(action.tiles[0][0]) || 5) + 1]
					: [(Number(action.tiles[0][0]) || 5) - 1, (Number(action.tiles[1][0]) || 5) + 1];
			return !adj.includes(n);
		}
		// Cannot pon/kan if there's already 2/1.
		return (action.t === 'pon' && count >= 2) || count >= 1;
	}
	return false;
}