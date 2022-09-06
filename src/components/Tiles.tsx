import TileButton from './calculator/TileButton';
import HorizontalRow from './layout/HorizontalRow';
import { TileCode } from '../lib/hand';

export default function Tiles({ sets, small = false }: { sets: (TileCode | '00')[][]; small?: boolean }) {
	return (
		<HorizontalRow>
			<div className="flex flex-row gap-2 justify-center items-center min-w-min">
				{sets.length > 0 && (
					<div className="flex flex-row gap-x-2 justify-center items-center">
						{sets.map(
							(tiles, i) =>
								tiles.length > 0 && (
									<div key={i} className="flex flex-row justify-center items-center gap-x-0.5">
										{tiles.map((t, j) => (
											<TileButton key={j} tile={t} forced small={small} />
										))}
									</div>
								),
						)}
					</div>
				)}
			</div>
		</HorizontalRow>
	);
}
