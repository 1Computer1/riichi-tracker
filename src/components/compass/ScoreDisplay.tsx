import clsx from 'clsx';
import { Wind } from '../../lib/hand';
import TileButton from '../calculator/TileButton';

export default function ScoreDisplay({
	score,
	seatWind,
	vertical = false,
	riichi = false,
	onScoreClick,
	onTileClick,
	onRiichiClick,
}: {
	score: number;
	seatWind: Wind;
	vertical?: boolean;
	riichi?: boolean;
	onScoreClick?: () => void;
	onTileClick?: () => void;
	onRiichiClick?: () => void;
}) {
	return (
		<div
			className={clsx(
				vertical ? 'flex h-full w-[7.5rem] lg:w-40 flex-row-reverse' : 'flex flex-col w-full h-[7.5rem] lg:h-40',
				'justify-center items-center gap-1',
			)}
		>
			<button
				onClick={onRiichiClick}
				className={clsx(
					'text-center border border-gray-800 rounded-xl shadow text-sm md:text-lg lg:text-2xl',
					vertical ? '[writing-mode:vertical-lr] py-8 px-1 h-40 lg:h-80' : 'px-8 py-1 w-40 lg:w-80',
					riichi
						? 'bg-amber-500 enabled:hover:bg-amber-600 dark:bg-amber-700 dark:enabled:hover:bg-amber-800'
						: 'bg-gray-50 enabled:hover:bg-gray-200 dark:bg-gray-500 dark:enabled:hover:bg-gray-600',
				)}
			>
				Riichi
			</button>
			<div
				className={clsx(
					vertical ? 'flex flex-col h-full w-fit py-2 px-2 lg:px-4' : 'flex flex-row w-full h-fit px-2 py-2 lg:py-4',
					'justify-center items-center bg-slate-300 dark:bg-sky-900 rounded-xl shadow',
				)}
			>
				<button
					className={clsx(
						'text-4xl lg:text-6xl text-amber-700 dark:text-amber-500 font-bold',
						vertical ? '[writing-mode:vertical-lr] h-48' : 'w-52',
					)}
					onClick={onScoreClick}
				>
					{score}
				</button>
				<div
					className={clsx(
						vertical ? 'rotate-90 mx-2 -my-2 mt-auto' : 'ml-auto',
						'flex flex-col justify-center items-center',
					)}
				>
					<TileButton onClick={onTileClick} red={seatWind === '1'} tile={`${seatWind}z`}></TileButton>
				</div>
			</div>
		</div>
	);
}
