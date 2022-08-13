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
				'rounded-xl shadow',
				agari
					? 'shadow-inner shadow-red-600 dark:shadow-pink-700'
					: 'shadow-inner shadow-gray-400 dark:shadow-gray-800',
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
			onClick={onClick && (() => onClick(tile))}
			disabled={disabled}
			className={clsx(
				'disabled:opacity-50 rounded-xl shadow',
				agari
					? 'shadow-inner shadow-red-600 dark:shadow-pink-700'
					: 'shadow-inner shadow-gray-400 dark:shadow-gray-800',
				red
					? 'bg-rose-500 hover:bg-rose-600 group-hover:bg-rose-600 dark:bg-red-700 dark:hover:bg-red-800 dark:group-hover:bg-red-800'
					: dora
					? 'bg-amber-100 hover:bg-amber-200 group-hover:bg-amber-200 dark:bg-emerald-800 dark:hover:bg-emerald-900 dark:group-hover:bg-emerald-900'
					: tile === '00'
					? 'bg-amber-400 hover:bg-amber-500 group-hover:bg-amber-500 dark:bg-gray-600 dark:hover:bg-gray-700 dark:group-hover:bg-gray-700'
					: 'bg-gray-50 hover:bg-gray-200 group-hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-600 dark:group-hover:bg-gray-600',
			)}
		>
			<Tile tile={tile} />
		</button>
	);
}
