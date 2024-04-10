import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { Wind } from '../../lib/hand';
import TileButton from '../calculator/TileButton';
import H from '../text/H';

export default function ScoreDisplay({
	score,
	oldScore = score,
	seatWind,
	isSanma,
	vertical = false,
	riichi = false,
	onScoreClick,
	onTileClick,
	onRiichiClick,
}: {
	score: number;
	oldScore?: number;
	seatWind: Wind;
	isSanma: boolean;
	vertical?: boolean;
	riichi?: boolean;
	onScoreClick?: () => void;
	onTileClick?: () => void;
	onRiichiClick?: () => void;
}) {
	const [animDone, setAnimDone] = useState(false);
	useEffect(() => {
		if (oldScore !== score) {
			setAnimDone(false);
		}
	}, [score, oldScore]);
	const dices = isSanma
		? [
				[1, 4, 7, 10],
				[2, 5, 8, 11],
				[3, 6, 9, 12],
		  ][Number(seatWind) - 1]
		: [
				[1, 5, 9],
				[2, 6, 10],
				[3, 7, 11],
				[4, 8, 12],
		  ][Number(seatWind) - 1];
	return (
		<div
			className={clsx(
				vertical
					? 'flex h-full w-[7.75rem] lg:w-[11.25rem] flex-row-reverse'
					: 'flex flex-col w-full h-[7.75rem] lg:h-[11.25rem]',
				'justify-center items-center gap-1',
			)}
		>
			<button
				onClick={onRiichiClick}
				className={clsx(
					'text-center border border-gray-800 rounded-xl shadow text-sm md:text-lg lg:text-2xl',
					vertical ? 'py-8 px-1.5 h-40 lg:h-80 w-9 lg:w-14' : 'px-8 py-1.5 w-40 lg:w-80 h-9 lg:h-14',
					riichi
						? 'bg-amber-500 enabled:hover:bg-amber-600 dark:bg-amber-700 dark:enabled:hover:bg-amber-800'
						: 'bg-gray-50 enabled:hover:bg-gray-200 dark:bg-gray-500 dark:enabled:hover:bg-gray-600',
				)}
			>
				<span className={clsx(vertical ? '[writing-mode:vertical-rl]' : '')}>Riichi</span>
			</button>
			<div
				className={clsx(
					vertical
						? 'flex flex-col h-full w-fit p-1.5 lg:py-2 lg:px-4'
						: 'flex flex-row w-full h-fit p-1.5 lg:px-2 lg:py-4',
					'justify-between items-center bg-slate-300 dark:bg-sky-900 rounded-xl shadow',
				)}
			>
				<span
					className={clsx(
						isSanma
							? vertical
								? '[writing-mode:vertical-rl] h-5 w-16 lg:w-20'
								: 'w-5 h-16 lg:h-20'
							: vertical
							? '[writing-mode:vertical-rl] h-5 w-12 lg:w-20'
							: 'w-5 h-12 lg:h-20',
						isSanma ? 'lg:text-sm' : 'lg:text-lg',
						'text-xs text-center text-slate-900 dark:text-slate-400 font-semibold',
					)}
				>
					{dices.map((x, i, a) => (
						<>
							{x}
							{i !== a.length && <br />}
						</>
					))}
				</span>
				<button
					className={clsx('text-4xl lg:text-6xl font-bold', vertical ? 'h-52 w-12 lg:w-20' : 'w-52 h-12 lg:h-20')}
					onClick={onScoreClick}
				>
					<span className={clsx(vertical ? '[writing-mode:vertical-rl]' : '')}>
						{animDone || oldScore === score ? (
							<H>{score}</H>
						) : oldScore > score ? (
							<H.Red>
								<AnimatedIncrement
									start={oldScore / 100}
									end={score / 100}
									map={(x) => x * 100}
									duration={1000}
									onDone={() => setAnimDone(true)}
								/>
							</H.Red>
						) : (
							<H>
								<AnimatedIncrement
									start={oldScore / 100}
									end={score / 100}
									map={(x) => x * 100}
									duration={1000}
									onDone={() => setAnimDone(true)}
								/>
							</H>
						)}
					</span>
				</button>
				<div className={clsx(vertical ? 'rotate-90 mx-2 -my-2' : '', 'flex flex-col justify-center items-center')}>
					<TileButton onClick={onTileClick} red={seatWind === '1'} tile={`${seatWind}z`}></TileButton>
				</div>
			</div>
		</div>
	);
}

function AnimatedIncrement({
	start,
	end,
	map = (x) => x,
	duration,
	onDone,
}: {
	start: number;
	end: number;
	map?: (n: number) => number;
	duration: number;
	onDone?: () => void;
}) {
	const [value, setValue] = useState(start);
	const startTimestamp = useRef<number | null>(null);
	const step = (timestamp: number) => {
		if (!startTimestamp.current) startTimestamp.current = timestamp;
		const progress = Math.min((timestamp - startTimestamp.current) / duration, 1);
		setValue(map(Math.floor(progress * (end - start) + start)));
		if (progress < 1) {
			window.requestAnimationFrame(step);
		} else {
			onDone?.();
		}
	};
	window.requestAnimationFrame(step);
	return <span>{value}</span>;
}
