import clsx from 'clsx';
import { Wind } from '../../lib/hand';
import TileButton from '../calculator/TileButton';

export default function ScoreDisplay({
	score,
	seatWind,
	vertical = false,
	onScoreClick,
	onTileClick,
}: {
	score: number;
	seatWind: Wind;
	vertical?: boolean;
	onScoreClick?: () => void;
	onTileClick?: () => void;
}) {
	return (
		<div
			className={clsx(
				vertical ? 'flex flex-col h-full w-fit py-4 px-2 lg:px-4' : 'flex flex-row w-full h-fit px-4 py-2 lg:py-4',
				'justify-between items-center gap-x-2 bg-slate-300 dark:bg-sky-900 rounded-xl shadow',
			)}
		>
			<button
				className={clsx(
					'text-4xl lg:text-6xl text-amber-700 dark:text-amber-500 font-bold',
					vertical ? '[writing-mode:vertical-lr] h-48' : 'w-48',
				)}
				onClick={onScoreClick}
			>
				{score}
			</button>
			<div className={clsx(vertical && 'rotate-90 mx-2 -my-2', 'flex flex-col justify-center items-center')}>
				<TileButton onClick={onTileClick} red={seatWind === '1'} tile={`${seatWind}z`}></TileButton>
			</div>
		</div>
	);
}
