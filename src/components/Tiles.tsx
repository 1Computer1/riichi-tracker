import clsx from 'clsx';
import TileButton from './calculator/TileButton';
import { TileCode } from '../lib/hand';

export default function Tiles({
	sets,
	small = false,
	wrap = true,
}: {
	sets: (TileCode | '00')[][];
	small?: boolean;
	wrap?: boolean;
}) {
	return (
		<div className={clsx('flex flex-row gap-1 lg:gap-2 justify-center items-center min-w-min', wrap && 'flex-wrap')}>
			{sets.length > 0 && (
				<div
					className={clsx('flex flex-row gap-1 lg:gap-2 justify-center items-center min-w-min', wrap && 'flex-wrap')}
				>
					{sets.map(
						(tiles, i) =>
							tiles.length > 0 && (
								<div
									key={i}
									className={clsx(
										'flex flex-row justify-center items-center gap-x-0.5 gap-y-1 lg:gap-y-2',
										wrap && 'flex-wrap',
									)}
								>
									{tiles.map((t, j) => (
										<TileButton key={j} tile={t} forced small={small} />
									))}
								</div>
							),
					)}
				</div>
			)}
		</div>
	);
}
