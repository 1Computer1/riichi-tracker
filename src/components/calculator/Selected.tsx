import MeldButton from './MeldButton';
import TileButton from './TileButton';
import { TileCode, Meld, Hand, isDora } from '../../lib/hand';
import { Placeholder } from '../Tile';

export default function Selected({
	hand,
	onTileClick,
	onMeldClick,
}: {
	hand: Hand;
	onTileClick?: (tile: TileCode, i: number) => void;
	onMeldClick?: (meld: Meld, i: number) => void;
}) {
	return (
		<div className="flex flex-row gap-x-8 justify-center items-center min-w-min">
			{hand.tiles.length || hand.melds.length ? (
				<>
					<div className="flex flex-row gap-x-0.5">
						{hand.tiles.map((t, i) => (
							<TileButton
								key={i}
								tile={t}
								agari={i === hand.agariIndex}
								dora={isDora(t, hand)}
								onClick={onTileClick && ((t) => onTileClick(t, i))}
							/>
						))}
					</div>
					<div className="flex flex-row gap-x-2">
						{hand.melds.map((m, i) => (
							<MeldButton key={i} meld={m} hand={hand} onClick={onMeldClick && ((m) => onMeldClick(m, i))} />
						))}
					</div>
				</>
			) : (
				<div className="flex flex-row gap-x-0.5">
					<Placeholder />
					<Placeholder />
					<Placeholder />
					<Placeholder />
					<Placeholder />
					<Placeholder />
					<Placeholder />
					<Placeholder />
					<Placeholder />
					<Placeholder />
					<Placeholder />
					<Placeholder />
					<Placeholder />
					<Placeholder />
				</div>
			)}
		</div>
	);
}
