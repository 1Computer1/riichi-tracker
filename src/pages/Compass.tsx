import { Dialog } from '@headlessui/react';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BlocksShuffleThree } from 'react-svg-spinners';
import BackButton from '../components/BackButton';
import Button from '../components/Button';
import CircleButton from '../components/CircleButton';
import Toggle from '../components/Toggle';
import TileButton from '../components/calculator/TileButton';
import ScoreDisplay from '../components/compass/ScoreDisplay';
import Left from '../components/icons/Left';
import Minus from '../components/icons/Minus';
import Plus from '../components/icons/Plus';
import Rotate from '../components/icons/Rotate';
import Up from '../components/icons/Up';
import { Game } from '../data/interfaces';
import { nextWind, translateWind } from '../lib/hand';
import { useDb } from '../providers/DbProvider';

export default function Compass() {
	const db = useDb();
	const game = db.useGame('$tools');

	useEffect(() => {
		(async () => {
			if (game != null && !game.ok) {
				await db.setGame('$tools', {
					roundWind: '1',
					round: 1,
					bottomWind: '1',
					scores: [25000, 25000, 25000, 25000],
				});
			}
		})();
	});

	return game?.ok ? <CompassWithGame game={game.value} /> : <BlocksShuffleThree />;
}

function CompassWithGame({ game }: { game: Game }) {
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

	const { roundWind, round, bottomWind, scores } = game;
	const [scoreUpdater, setScoreUpdater] = useState<number | null>(null);
	const [scoreUpdateSign, setScoreUpdateSign] = useState(true);
	const [scoreUpdateDelta, setScoreUpdateDelta] = useState(0);

	const scoreDeltaInputRef = useRef<HTMLInputElement | null>(null);

	return (
		<div className="h-screen w-screen bg-slate-200 dark:bg-gray-900 text-black dark:text-white">
			<div className="fixed bottom-1 left-1/2 -translate-x-1/2">
				<div className="h-fit w-[min(70vh,70vw)]">
					<ScoreDisplay
						score={scores[0]}
						seatWind={bottomWind}
						onScoreClick={() => setScoreUpdater(0)}
						onTileClick={() => navigate('/calculator', { state: { roundWind, seatWind: bottomWind } })}
					/>
				</div>
			</div>
			<div className="fixed right-1 top-1/2 -translate-y-1/2">
				<div className="rotate-180 h-[min(70vh,70vw)] w-fit">
					<ScoreDisplay
						vertical
						score={scores[1]}
						seatWind={nextWind(bottomWind, 1)}
						onScoreClick={() => setScoreUpdater(1)}
						onTileClick={() => navigate('/calculator', { state: { roundWind, seatWind: nextWind(bottomWind, 1) } })}
					/>
				</div>
			</div>
			<div className="fixed top-1 left-1/2 -translate-x-1/2">
				<div className="rotate-180 h-fit w-[min(70vh,70vw)]">
					<ScoreDisplay
						score={scores[2]}
						seatWind={nextWind(bottomWind, 2)}
						onScoreClick={() => setScoreUpdater(2)}
						onTileClick={() => navigate('/calculator', { state: { roundWind, seatWind: nextWind(bottomWind, 2) } })}
					/>
				</div>
			</div>
			<div className="fixed left-1 top-1/2 -translate-y-1/2">
				<div className="h-[min(70vh,70vw)] w-fit">
					<ScoreDisplay
						vertical
						seatWind={nextWind(bottomWind, 3)}
						score={scores[3]}
						onScoreClick={() => setScoreUpdater(3)}
						onTileClick={() => navigate('/calculator', { state: { roundWind, seatWind: nextWind(bottomWind, 3) } })}
					/>
				</div>
			</div>
			{scoreUpdater != null && (
				<Dialog
					open
					initialFocus={scoreDeltaInputRef}
					onClose={() => {
						setScoreUpdater(null);
					}}
				>
					<div className="fixed inset-0 bg-black/90" aria-hidden="true" />
					<div className="fixed inset-0 flex flex-col justify-center items-center p-4">
						<Dialog.Panel className="flex flex-col justify-center items-center gap-y-2 bg-slate-200 dark:bg-gray-900 text-black dark:text-white rounded-xl shadow p-4">
							<TileButton
								forced
								red={nextWind(bottomWind, scoreUpdater) === '1'}
								tile={`${nextWind(bottomWind, scoreUpdater)}z`}
							/>
							<div className="flex flex-col justify-center items-center gap-y-2">
								<Toggle
									left={
										<div className="w-3 h-3 lg:w-6 lg:h-6">
											<Minus />
										</div>
									}
									right={
										<div className="w-3 h-3 lg:w-6 lg:h-6">
											<Plus />
										</div>
									}
									toggled={scoreUpdateSign}
									onToggle={() => setScoreUpdateSign(!scoreUpdateSign)}
								/>
								<form
									onSubmit={(e) => {
										e.preventDefault();
										(async () => {
											const scores_ = scores.slice();
											scores_[scoreUpdater] = scores[scoreUpdater] + (scoreUpdateSign ? 1 : -1) * scoreUpdateDelta;
											await db.setGame('$tools', { ...game, scores: scores_ });
											setScoreUpdater(null);
										})();
									}}
								>
									<input
										ref={scoreDeltaInputRef}
										type="tel"
										className="bg-slate-300 dark:bg-sky-900 text-amber-700 dark:text-amber-500 font-bold text-center text-2xl lg:text-4xl rounded-xl w-36 lg:w-80"
										value={scoreUpdateDelta}
										onChange={(e) => {
											setScoreUpdateDelta(Number(e.target.value));
										}}
									/>
								</form>
								<Button
									onClick={() => {
										(async () => {
											const scores_ = scores.slice();
											scores_[scoreUpdater] = scores[scoreUpdater] + (scoreUpdateSign ? 1 : -1) * scoreUpdateDelta;
											await db.setGame('$tools', { ...game, scores: scores_ });
											setScoreUpdater(null);
										})();
									}}
								>
									Submit
								</Button>
							</div>
						</Dialog.Panel>
					</div>
				</Dialog>
			)}
			<div
				className={clsx(
					'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-300 dark:bg-sky-900 rounded-xl shadow',
					windowSize.width < windowSize.height
						? '[writing-mode:vertical-lr] py-4 px-2 lg:px-4 h-[min(70vh,70vw)]'
						: 'px-4 py-2 lg:py-4 w-[min(70vh,70vw)]',
				)}
			>
				<div className="flex flex-row justify-between items-center gap-x-4">
					<div className={clsx(windowSize.width < windowSize.height ? 'rotate-90 mx-2 -my-2' : '')}>
						<TileButton
							onClick={() => {
								(async () => {
									if (round === 4) {
										await db.setGame('$tools', {
											...game,
											bottomWind: nextWind(bottomWind, 3),
											roundWind: nextWind(roundWind),
											round: 1,
										});
									} else {
										await db.setGame('$tools', {
											...game,
											bottomWind: nextWind(bottomWind, 3),
											round: game.round + 1,
										});
									}
								})();
							}}
							tile={`${roundWind}z`}
						/>
					</div>
					<span className="text-xl lg:text-4xl">
						{translateWind(roundWind)} {round}
					</span>
					<div className={clsx('flex flex-col gap-y-6', windowSize.width < windowSize.height ? 'px-2' : 'py-2')}>
						<BackButton>{windowSize.width < windowSize.height ? <Up /> : <Left />}</BackButton>
						<CircleButton
							onClick={() => {
								(async () => {
									await db.setGame('$tools', {
										...game,
										bottomWind: nextWind(bottomWind, 3),
									});
								})();
							}}
						>
							<Rotate />
						</CircleButton>
					</div>
				</div>
			</div>
		</div>
	);
}
