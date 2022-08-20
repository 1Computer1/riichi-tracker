import TileButton from './calculator/TileButton';
import { Meld, TileCode } from '../lib/hand';

export default function Tiles({ tiles, melds = [] }: { tiles: TileCode[]; melds?: Meld[] }) {
	return (
		<div className="flex flex-row gap-2 justify-center items-center min-w-min">
			<div className="flex flex-row justify-center items-center gap-x-0.5">
				{tiles.map((t, i) => (
					<TileButton key={i} tile={t} forced />
				))}
			</div>
			{melds.map((m, i) => (
				<MeldButton key={i} meld={m} />
			))}
		</div>
	);
}

function MeldButton({ meld }: { meld: Meld }) {
	return (
		<div className="flex flex-row gap-x-0.5 group">
			{meld.t === 'chiipon'
				? meld.tiles.map((t, i) => <TileButton key={i} tile={t} forced />)
				: meld.closed
				? meld.tiles.map((t, i) => <TileButton key={i} tile={i === 1 || i === 2 ? '00' : t} forced />)
				: meld.tiles.map((t, i) => <TileButton key={i} tile={t} forced />)}
		</div>
	);
}
