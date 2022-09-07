import { ForwardedRef, forwardRef } from 'react';
import MeldButton from './MeldButton';
import TileButton from './TileButton';
import { TileCode, Meld, Hand, isDora } from '../../lib/hand';
import { Placeholder } from '../Tile';

// eslint-disable-next-line prefer-arrow-callback
export default forwardRef(function Selected(
	{
		hand,
		sanma,
		onTileClick,
		onMeldClick,
	}: {
		hand: Hand;
		sanma: boolean;
		onTileClick?: (tile: TileCode, i: number) => void;
		onMeldClick?: (meld: Meld, i: number) => void;
	},
	ref: ForwardedRef<HTMLDivElement>,
) {
	return (
		<div ref={ref} className="flex flex-row flex-wrap gap-x-2 gap-y-0.5 justify-center items-center min-w-min">
			{hand.tiles.length || hand.melds.length ? (
				<>
					{hand.tiles.length > 0 && (
						<div className="flex flex-row flex-wrap justify-center items-center gap-0.5">
							{hand.tiles.map((t, i) => (
								<TileButton
									key={i}
									tile={t}
									agari={i === hand.agariIndex}
									dora={isDora(t, hand, sanma)}
									onClick={onTileClick && ((t) => onTileClick(t, i))}
								/>
							))}
						</div>
					)}
					{hand.melds.map((m, i) => (
						<MeldButton key={i} meld={m} hand={hand} onClick={onMeldClick && ((m) => onMeldClick(m, i))} />
					))}
				</>
			) : (
				<div className="flex flex-row gap-x-0.5">
					{Array.from({ length: 5 }, (_, i) => (
						<Placeholder key={i} />
					))}
				</div>
			)}
		</div>
	);
});
