import TileButton from './calculator/TileButton';
import HorizontalRow from './layout/HorizontalRow';
import { Meld, TileCode } from '../lib/hand';

export default function Tiles({
	tiles,
	melds = [],
	small = false,
}: {
	tiles: TileCode[];
	melds?: Meld[];
	small?: boolean;
}) {
	return (
		<HorizontalRow>
			<div className="flex flex-row gap-2 justify-center items-center min-w-min">
				{tiles.length > 0 && (
					<div className="flex flex-row justify-center items-center gap-x-0.5">
						{tiles.map((t, i) => (
							<TileButton key={i} tile={t} forced small={small} />
						))}
					</div>
				)}
				{melds.map((m, i) => (
					<MeldButton key={i} meld={m} small={small} />
				))}
			</div>
		</HorizontalRow>
	);
}

function MeldButton({ meld, small }: { meld: Meld; small?: boolean }) {
	return (
		<div className="flex flex-row gap-x-0.5 group">
			{meld.t === 'chiipon'
				? meld.tiles.map((t, i) => <TileButton key={i} tile={t} forced small={small} />)
				: meld.closed
				? meld.tiles.map((t, i) => <TileButton key={i} tile={i === 1 || i === 2 ? '00' : t} forced small={small} />)
				: meld.tiles.map((t, i) => <TileButton key={i} tile={t} forced small={small} />)}
		</div>
	);
}
