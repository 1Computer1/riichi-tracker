import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CircleButton from '../components/CircleButton';
import TileButton from '../components/calculator/TileButton';
import { AdvancedDialog } from '../components/compass/AdvancedDialog';
import { DrawDialog } from '../components/compass/DrawDialog';
import ScoreDisplay from '../components/compass/ScoreDisplay';
import { ScoreUpdateDialog } from '../components/compass/ScoreUpdateDialog';
import { WinnerDialog } from '../components/compass/WinnerDialog';
import Cog from '../components/icons/heroicons/Cog';
import Left from '../components/icons/heroicons/Left';
import Up from '../components/icons/heroicons/Up';
import BlocksShuffleThree from '../components/loading/react-svg-spinners/BlocksShuffleThree';
import { Game } from '../data/interfaces';
import { nextWind, translateWind } from '../lib/hand';
import { CompassState } from '../lib/states';
import { useDb } from '../providers/DbProvider';

export default function Compass() {
	const db = useDb();
	const location = useLocation();
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const locState: CompassState = (location.state ?? { t: 'load', id: '$tools' }) as any;
	const game = db.useGame(locState.id);

	return (
		<div className="h-screen w-screen bg-slate-200 dark:bg-gray-900 text-black dark:text-white">
			{game == null ? (
				<div className="w-screen h-screen flex flex-col justify-center items-center">
					<div className="fill-black dark:fill-white w-24 h-24">
						<BlocksShuffleThree />
					</div>
				</div>
			) : game.ok ? (
				<CompassWithGame locState={locState} game={game.value} />
			) : (
				<div className="w-screen h-screen flex flex-col justify-center items-center">
					<div className="font-mono">Error: Game {locState.id} does not exist.</div>
				</div>
			)}
		</div>
	);
}

function CompassWithGame({ locState, game }: { locState: CompassState; game: Game }) {
	const db = useDb();
	const navigate = useNavigate();

	const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
	useEffect(() => {
		const onResize = () => {
			setWindowSize({ width: window.innerWidth, height: window.innerHeight });
		};
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	});
	const isPortrait = windowSize.width < windowSize.height;

	const { roundWind, round, repeats, scores, riichi, riichiSticks, settings } = game;

	const [scoreUpdater, setScoreUpdater] = useState<number | null>(null);
	const [winner, setWinner] = useState<number | null>(null);
	const [openDrawDialog, setOpenDrawDialog] = useState(false);
	const [openAdvancedDialog, setOpenAdvancedDialog] = useState(false);

	const toggleRiichiStick = async (ix: number) => {
		if (riichi[ix]) {
			const scores_ = scores.slice();
			scores_[ix] = scores[ix] + 1000;
			const riichi_ = riichi.slice();
			riichi_[ix] = false;
			await db.setGame(locState.id, { ...game, scores: scores_, riichiSticks: riichiSticks - 1, riichi: riichi_ });
		} else {
			const scores_ = scores.slice();
			scores_[ix] = scores[ix] - 1000;
			const riichi_ = riichi.slice();
			riichi_[ix] = true;
			await db.setGame(locState.id, { ...game, scores: scores_, riichiSticks: riichiSticks + 1, riichi: riichi_ });
		}
	};

	return (
		<div className="relative h-screen w-screen">
			<div className="absolute bottom-0 left-1/2 -translate-x-1/2">
				<div className="h-fit w-[min(70vh,70vw)]">
					<ScoreDisplayInCompass
						ix={0}
						oldScores={locState.oldScores}
						game={game}
						onScoreClick={() => setScoreUpdater(0)}
						onTileClick={() => setWinner(0)}
						onRiichiClick={() => void toggleRiichiStick(0)}
					/>
				</div>
			</div>
			<div className="absolute right-0 top-1/2 -translate-y-1/2">
				<div className="rotate-180 h-[min(70vh,70vw)] w-fit">
					<ScoreDisplayInCompass
						vertical
						ix={1}
						oldScores={locState.oldScores}
						game={game}
						onScoreClick={() => setScoreUpdater(1)}
						onTileClick={() => setWinner(1)}
						onRiichiClick={() => void toggleRiichiStick(1)}
					/>
				</div>
			</div>
			<div className="absolute top-0 left-1/2 -translate-x-1/2">
				<div className="rotate-180 h-fit w-[min(70vh,70vw)]">
					<ScoreDisplayInCompass
						ix={2}
						oldScores={locState.oldScores}
						game={game}
						onScoreClick={() => setScoreUpdater(2)}
						onTileClick={() => setWinner(2)}
						onRiichiClick={() => void toggleRiichiStick(2)}
					/>
				</div>
			</div>
			{settings.sanma == null && (
				<div className="absolute left-0 top-1/2 -translate-y-1/2">
					<div className="h-[min(70vh,70vw)] w-fit">
						<ScoreDisplayInCompass
							vertical
							ix={3}
							oldScores={locState.oldScores}
							game={game}
							onScoreClick={() => setScoreUpdater(3)}
							onTileClick={() => setWinner(3)}
							onRiichiClick={() => void toggleRiichiStick(3)}
						/>
					</div>
				</div>
			)}
			{scoreUpdater != null && (
				<ScoreUpdateDialog
					gameId={locState.id}
					game={game}
					scoreUpdater={scoreUpdater}
					onClose={() => setScoreUpdater(null)}
				/>
			)}
			{winner != null && (
				<WinnerDialog gameId={locState.id} game={game} winner={winner} onClose={() => setWinner(null)} />
			)}
			{openDrawDialog && <DrawDialog gameId={locState.id} game={game} onClose={() => setOpenDrawDialog(false)} />}
			{openAdvancedDialog && (
				<AdvancedDialog gameId={locState.id} game={game} onClose={() => setOpenAdvancedDialog(false)} />
			)}
			<div
				data-1c1
				className={clsx(
					'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-300 dark:bg-sky-900 rounded-xl shadow',
					isPortrait
						? '[writing-mode:vertical-lr] h-[min(70vh,70vw)] p-1.5 lg:px-2 lg:py-4'
						: 'w-[min(70vh,70vw)] p-1.5 lg:py-2 lg:px-4',
				)}
			>
				<div className="flex flex-row justify-between items-center gap-x-4">
					<div className={clsx(isPortrait ? 'rotate-90 mx-2 -my-2' : 'flex flex-col justify-center items-center')}>
						<TileButton
							onClick={() => {
								setOpenDrawDialog(true);
							}}
							tile={`${roundWind}z`}
						/>
					</div>
					<div
						className={clsx(
							isPortrait ? 'flex flex-col-reverse' : 'flex flex-col',
							'gap-y-2 justify-between items-center text-xl lg:text-4xl',
						)}
					>
						<span>
							{translateWind(roundWind)} {round}
						</span>
						<div className="flex flex-row gap-x-4 justify-center items-center">
							<span className="flex flex-row gap-x-2 justify-center items-center">
								<span
									className={clsx(
										'text-slate-900 dark:text-slate-400 rotate-90',
										isPortrait ? 'mr-0.5 lg:mr-2' : 'mt-2 lg:mt-2',
									)}
								>
									⠿
								</span>{' '}
								{repeats}
							</span>
							<span className="flex flex-row gap-x-2 justify-center items-center">
								<span className={clsx('text-red-500 dark:text-red-600', isPortrait ? 'mr-0.5 lg:mr-2' : '')}>●</span>{' '}
								{riichiSticks}
							</span>
						</div>
					</div>
					<div className={clsx(isPortrait ? 'flex flex-col-reverse' : 'flex flex-col', 'gap-y-2')}>
						<CircleButton
							onClick={() => {
								navigate('/', { replace: true });
							}}
						>
							{isPortrait ? <Up /> : <Left />}
						</CircleButton>
						<CircleButton
							onClick={() => {
								setOpenAdvancedDialog(true);
							}}
						>
							<Cog />
						</CircleButton>
					</div>
				</div>
			</div>
		</div>
	);
}

function ScoreDisplayInCompass({
	game,
	ix,
	oldScores,
	vertical = false,
	onScoreClick,
	onTileClick,
	onRiichiClick,
}: {
	game: Game;
	ix: number;
	oldScores?: number[];
	vertical?: boolean;
	onScoreClick?: () => void;
	onTileClick?: () => void;
	onRiichiClick?: () => void;
}) {
	const { bottomWind, scores, riichi, settings } = game;
	return (
		<ScoreDisplay
			vertical={vertical}
			score={scores[ix]}
			oldScore={oldScores?.[ix]}
			riichi={riichi[ix]}
			isSanma={settings.sanma != null}
			seatWind={nextWind(bottomWind, ix, settings.sanma != null)}
			onScoreClick={onScoreClick}
			onTileClick={onTileClick}
			onRiichiClick={onRiichiClick}
		/>
	);
}
