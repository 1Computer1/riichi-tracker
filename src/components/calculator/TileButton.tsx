import clsx from 'clsx';
import { TileCode } from '../../lib/hand';
import Tile from '../Tile';

export default function TileButton<T extends TileCode | '00' = TileCode>({
	tile,
	agari = false,
	dora = false,
	red = false,
	disabled = false,
	forced = false,
	onClick,
}: {
	tile: T;
	agari?: boolean;
	dora?: boolean;
	red?: boolean;
	disabled?: boolean;
	forced?: boolean;
	onClick?: (tile: T) => void;
}) {
	return forced ? (
		<div
			className={clsx(
				'rounded-xl shadow shadow-gray-400 dark:shadow-gray-800',
				agari ? 'animate-pulse' : '',
				red
					? 'bg-rose-500 dark:bg-red-700'
					: dora
					? 'bg-amber-100 dark:bg-emerald-800'
					: tile === '00'
					? 'bg-amber-400 dark:bg-gray-600'
					: 'bg-gray-50 dark:bg-gray-500',
			)}
		>
			<Tile tile={tile} />
		</div>
	) : (
		<button
			onClick={
				onClick &&
				((e) => {
					e.preventDefault();
					onClick(tile);
				})
			}
			disabled={disabled}
			className={clsx(
				'disabled:opacity-50 rounded-xl shadow shadow-gray-400 dark:shadow-gray-800',
				agari ? 'animate-pulse' : '',
				red
					? 'bg-rose-500 enabled:hover:bg-rose-600 enabled:group-hover:bg-rose-600 dark:bg-red-700 dark:enabled:hover:bg-red-800 dark:enabled:group-hover:bg-red-800'
					: dora
					? 'bg-amber-100 enabled:hover:bg-amber-200 enabled:group-hover:bg-amber-200 dark:bg-emerald-800 dark:enabled:hover:bg-emerald-900 dark:enabled:group-hover:bg-emerald-900'
					: tile === '00'
					? 'bg-amber-400 enabled:hover:bg-amber-500 enabled:group-hover:bg-amber-500 dark:bg-gray-600 dark:enabled:hover:bg-gray-700 dark:enabled:group-hover:bg-gray-700'
					: 'bg-gray-50 enabled:hover:bg-gray-200 enabled:group-hover:bg-gray-200 dark:bg-gray-500 dark:enabled:hover:bg-gray-600 dark:enabled:group-hover:bg-gray-600',
			)}
		>
			<Tile tile={tile} />
		</button>
	);
}
