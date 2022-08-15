import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useImmer } from 'use-immer';
import Button from '../components/Button';
import CircleButton from '../components/CircleButton';
import Counter from '../components/Counter';
import Toggle from '../components/Toggle';
import ToggleOnOff from '../components/ToggleOnOff';
import ToggleThree from '../components/ToggleThree';
import TileButton from '../components/calculator/TileButton';
import ScoreDisplay from '../components/compass/ScoreDisplay';
import Cog from '../components/icons/Cog';
import Hashtag from '../components/icons/Hashtag';
import Left from '../components/icons/Left';
import Minus from '../components/icons/Minus';
import Plus from '../components/icons/Plus';
import Up from '../components/icons/Up';
import CustomDialog from '../components/layout/CustomDialog';
import HorizontalRow from '../components/layout/HorizontalRow';
import BlocksShuffleThree from '../components/loading/BlocksShuffleThree';
import { Game } from '../data/interfaces';
import { nextWind, TileCode, translateWind } from '../lib/hand';
import { CalculatorState, CompassState } from '../lib/states';
import { useDb } from '../providers/DbProvider';

export default function Compass() {
	const db = useDb();
	const location = useLocation();
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const locState: CompassState | null = (location.state ?? null) as any;
	const gameId = locState?.t === 'load' ? locState.id : '$tools';
	const game = db.useGame(gameId);

	return (
		<div className="h-screen w-screen bg-slate-200 dark:bg-gray-900 text-black dark:text-white">
			{game == null ? (
				<div className="w-full h-full flex flex-col justify-center items-center">
					<div className="fill-black dark:fill-white w-24 h-24">
						<BlocksShuffleThree />
					</div>
				</div>
			) : game.ok ? (
				<CompassWithGame gameId={gameId} game={game.value} />
			) : (
				<div className="w-full h-full flex flex-col justify-center items-center">
					<div className="text-red-600 dark:text-red-700 font-mono">Error: Game {gameId} does not exist.</div>
				</div>
			)}
		</div>
	);
}

function CompassWithGame({ gameId, game }: { gameId: string; game: Game }) {
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

	const { bottomWind, roundWind, round, repeats, scores, riichiSticks, riichi } = game;

	const [scoreUpdater, setScoreUpdater] = useState<number | null>(null);
	const [scoreUpdateMode, setScoreUpdateMode] = useState<0 | 1 | 2>(0);
	const [scoreUpdateDelta, setScoreUpdateDelta] = useState(0);
	const scoreDeltaInputRef = useRef<HTMLInputElement | null>(null);

	function ScoreUpdateDialog() {
		if (scoreUpdater == null) {
			return null;
		}

		async function submitScoreUpdate() {
			if (scoreUpdater == null) {
				return;
			}
			const scores_ = scores.slice();
			switch (scoreUpdateMode) {
				case 0:
					scores_[scoreUpdater] -= scoreUpdateDelta;
					break;
				case 1:
					scores_[scoreUpdater] = scoreUpdateDelta;
					break;
				case 2:
					scores_[scoreUpdater] += scoreUpdateDelta;
					break;
			}
			await db.setGame(gameId, { ...game, scores: scores_ });
			setScoreUpdater(null);
			setScoreUpdateMode(0);
			setScoreUpdateDelta(0);
		}

		return (
			<CustomDialog
				initialFocus={scoreDeltaInputRef}
				onClose={() => {
					setScoreUpdater(null);
					setScoreUpdateMode(0);
					setScoreUpdateDelta(0);
				}}
			>
				<div className="flex flex-col gap-y-2 items-center justify-center">
					<TileButton
						forced
						red={nextWind(bottomWind, scoreUpdater) === '1'}
						tile={`${nextWind(bottomWind, scoreUpdater)}z`}
					/>
					<div className="flex flex-col justify-center items-center gap-y-2">
						<ToggleThree
							left={
								<div className="w-3 h-3 lg:w-6 lg:h-6">
									<Minus />
								</div>
							}
							middle={
								<div className="w-3 h-3 lg:w-6 lg:h-6">
									<Hashtag />
								</div>
							}
							right={
								<div className="w-3 h-3 lg:w-6 lg:h-6">
									<Plus />
								</div>
							}
							toggled={scoreUpdateMode}
							onToggle={(x) => setScoreUpdateMode(x)}
						/>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								void submitScoreUpdate();
							}}
						>
							<input
								ref={scoreDeltaInputRef}
								type="tel"
								className="bg-slate-300 dark:bg-sky-900 text-amber-700 dark:text-amber-500 font-bold text-center text-2xl lg:text-4xl rounded-xl w-36 lg:w-80"
								value={scoreUpdateDelta}
								onChange={(e) => {
									const n = Number(e.target.value.match(/^\d+/)?.[0] ?? 0);
									if (!isNaN(n)) {
										setScoreUpdateDelta(n);
									}
								}}
							/>
						</form>
						<Button
							onClick={() => {
								void submitScoreUpdate();
							}}
						>
							Submit
						</Button>
					</div>
				</div>
			</CustomDialog>
		);
	}

	const [winner, setWinner] = useState<number | null>(null);
	const [winnerAgari, setWinnerAgari] = useState<'tsumo' | 'ron'>('tsumo');
	const [dealtInPlayer, setDealtInPlayer] = useState<number | null>(null);
	const [handleRotation, setHandleRotation] = useState(true);
	const [dealerRepeat, setDealerRepeat] = useState(true);
	const [scoreRiichiSticks, setScoreRiichiSticks] = useState(true);
	const [scoreRepeatSticks, setScoreRepeatSticks] = useState(true);

	function WinnerDialog() {
		if (winner == null) {
			return null;
		}

		function submitWinner() {
			if (winner == null || (winnerAgari === 'ron' && dealtInPlayer == null)) {
				return null;
			}
			const state: CalculatorState = {
				t: 'transfer',
				id: gameId,
				roundWind,
				seatWind: nextWind(bottomWind, winner),
				winner,
				handleRotation,
				dealerRepeat,
				scoreRiichiSticks,
				scoreRepeatSticks,
				...(winnerAgari === 'tsumo' ? { agari: 'tsumo' } : { agari: 'ron', dealtInPlayer: dealtInPlayer! }),
			};
			navigate('/calculator', { state, replace: true });
		}

		return (
			<CustomDialog
				onClose={() => {
					setWinner(null);
					setWinnerAgari('tsumo');
					setDealtInPlayer(null);
				}}
			>
				<div className="flex flex-col justify-center items-center gap-y-2 w-44 lg:w-80">
					<form
						className="flex flex-col justify-center items-center gap-y-2"
						onSubmit={(e) => {
							e.preventDefault();
							submitWinner();
						}}
					>
						<p className="text-xl lg:text-2xl">Transfer Points</p>
						<Toggle
							toggled={winnerAgari === 'ron'}
							onToggle={(b) => {
								setWinnerAgari(b ? 'ron' : 'tsumo');
								setDealtInPlayer(b ? [0, 1, 2, 3].filter((i) => i !== winner)[0] : null);
							}}
							left="Tsumo"
							right="Ron"
						/>
						{winnerAgari === 'ron' && (
							<>
								<p className="text-xl lg:text-2xl">Dealt-In Player</p>
								<HorizontalRow>
									{[0, 1, 2, 3]
										.filter((i) => i !== winner)
										.map((i) => (
											<TileButton
												key={i}
												tile={`${nextWind(bottomWind, i)}z` as TileCode}
												dora={i === dealtInPlayer}
												onClick={() => setDealtInPlayer(i)}
											/>
										))}
								</HorizontalRow>
							</>
						)}
						<ToggleOnOff toggled={scoreRiichiSticks} onToggle={(b) => setScoreRiichiSticks(b)}>
							Score Riichi Sticks
						</ToggleOnOff>
						{nextWind(bottomWind, winner) === '1' ? (
							<ToggleOnOff
								toggled={dealerRepeat}
								incompatible={handleRotation}
								onToggle={(b) => {
									setDealerRepeat(b);
									if (b) {
										setHandleRotation(false);
									}
								}}
							>
								Dealer Repeat
							</ToggleOnOff>
						) : (
							<ToggleOnOff toggled={scoreRepeatSticks} onToggle={(b) => setScoreRepeatSticks(b)}>
								Score Repeat Sticks
							</ToggleOnOff>
						)}
						<ToggleOnOff
							toggled={handleRotation}
							incompatible={nextWind(bottomWind, winner) === '1' && dealerRepeat}
							onToggle={(b) => {
								setHandleRotation(b);
								if (b) {
									if (nextWind(bottomWind, winner) === '1') {
										setDealerRepeat(false);
									}
								}
							}}
						>
							Seat Rotation
						</ToggleOnOff>
						<Button
							onClick={() => {
								void submitWinner();
							}}
						>
							Calculate Hand
						</Button>
					</form>
				</div>
			</CustomDialog>
		);
	}

	const [makingDraw, setMakingDraw] = useState(false);
	const [drawType, setDrawType] = useState<'exhaustive' | 'abortive'>('exhaustive');
	const [drawRepeat, setDrawRepeat] = useState(false);
	const [tenpaiPlayers, updateTenpaiPlayers] = useImmer(new Set<number>());

	function DrawDialog() {
		if (!makingDraw) {
			return null;
		}

		async function submitDraw() {
			if (drawType === 'abortive') {
				await db.setGame(gameId, {
					...game,
					repeats: game.repeats + 1,
					riichi: [false, false, false, false],
				});
			} else {
				const scores_ = game.scores.slice();
				const win = [0, 3000, 1500, 1000, 0][tenpaiPlayers.size];
				const lose = [0, 1000, 1500, 3000, 0][tenpaiPlayers.size];
				for (const i of [0, 1, 2, 3]) {
					if (tenpaiPlayers.has(i)) {
						scores_[i] += win;
					} else {
						scores_[i] -= lose;
					}
				}
				const repeat = drawRepeat && [0, 1, 2, 3].some((i) => tenpaiPlayers.has(i) && nextWind(bottomWind, i) === '1');
				await db.setGame(gameId, {
					...game,
					bottomWind: repeat ? bottomWind : nextWind(bottomWind, -1),
					roundWind: repeat ? roundWind : round === 4 ? nextWind(roundWind) : roundWind,
					round: repeat ? round : round === 4 ? 1 : round + 1,
					repeats: repeats + 1,
					scores: scores_,
					riichi: [false, false, false, false],
				});
			}
			setMakingDraw(false);
			updateTenpaiPlayers(new Set());
			setDrawRepeat(false);
		}

		return (
			<CustomDialog
				onClose={() => {
					setMakingDraw(false);
					updateTenpaiPlayers(new Set());
					setDrawRepeat(false);
				}}
			>
				<div className="flex flex-col justify-center items-center gap-y-2 w-[232px] lg:w-80">
					<form
						className="flex flex-col justify-center items-center gap-y-2"
						onSubmit={(e) => {
							e.preventDefault();
							void submitDraw();
						}}
					>
						<p className="text-xl lg:text-2xl">Draw</p>
						<Toggle
							left="Exhaustive"
							right="Abortive"
							toggled={drawType === 'abortive'}
							onToggle={(b) => setDrawType(b ? 'abortive' : 'exhaustive')}
						/>
						{drawType === 'exhaustive' && (
							<>
								<p className="text-xl lg:text-2xl">Players in Tenpai</p>
								<HorizontalRow>
									{[0, 1, 2, 3].map((i) => (
										<TileButton
											key={i}
											tile={`${nextWind(bottomWind, i)}z` as TileCode}
											dora={tenpaiPlayers.has(i)}
											onClick={() => {
												if (nextWind(bottomWind, i) === '1') {
													setDrawRepeat(!tenpaiPlayers.has(i));
												}
												updateTenpaiPlayers((s) => {
													if (s.has(i)) {
														s.delete(i);
													} else {
														s.add(i);
													}
												});
											}}
										/>
									))}
								</HorizontalRow>
								<ToggleOnOff toggled={drawRepeat} onToggle={(b) => setDrawRepeat(b)}>
									Repeat Round
								</ToggleOnOff>
							</>
						)}
					</form>
					<Button
						onClick={() => {
							void submitDraw();
						}}
					>
						Submit
					</Button>
				</div>
			</CustomDialog>
		);
	}

	const [openAdvancedDialog, setOpenAdvancedDialog] = useState(false);

	function AdvancedDialog() {
		if (!openAdvancedDialog) {
			return null;
		}
		return (
			<CustomDialog
				onClose={() => {
					setOpenAdvancedDialog(false);
				}}
			>
				<div className="flex flex-col justify-center items-center gap-y-2 w-[232px] lg:w-80">
					<div className="flex flex-col justify-center items-center gap-y-2">
						<p className="text-xl lg:text-2xl">Other Actions</p>
						<Button
							onClick={() => {
								(async () => {
									await db.setGame(gameId, {
										...game,
										bottomWind: nextWind(bottomWind, -1),
									});
								})();
							}}
						>
							Rotate Seats
						</Button>
						<Counter
							onDecrement={() => {
								(async () => {
									await db.setGame(gameId, {
										...game,
										roundWind: round === 1 ? nextWind(roundWind, -1) : roundWind,
										round: round === 1 ? 4 : round - 1,
									});
								})();
							}}
							onIncrement={() => {
								(async () => {
									await db.setGame(gameId, {
										...game,
										roundWind: round === 4 ? nextWind(roundWind) : roundWind,
										round: round === 4 ? 1 : round + 1,
									});
								})();
							}}
						>
							{translateWind(roundWind)} {round}
						</Counter>
						<Counter
							canDecrement={repeats > 0}
							onDecrement={() => {
								(async () => {
									await db.setGame(gameId, {
										...game,
										repeats: repeats - 1,
									});
								})();
							}}
							onIncrement={() => {
								(async () => {
									await db.setGame(gameId, {
										...game,
										repeats: repeats + 1,
									});
								})();
							}}
						>
							Repeats ({repeats})
						</Counter>
						<Counter
							canDecrement={riichiSticks > riichi.filter((r) => r).length}
							onDecrement={() => {
								(async () => {
									await db.setGame(gameId, {
										...game,
										riichiSticks: riichiSticks - 1,
									});
								})();
							}}
							onIncrement={() => {
								(async () => {
									await db.setGame(gameId, {
										...game,
										riichiSticks: riichiSticks + 1,
									});
								})();
							}}
						>
							Riichi ({riichiSticks})
						</Counter>
					</div>
				</div>
			</CustomDialog>
		);
	}

	function ScoreDisplayInCompass({ ix, vertical = false }: { ix: number; vertical?: boolean }) {
		return (
			<ScoreDisplay
				vertical={vertical}
				score={scores[ix]}
				riichi={riichi[ix]}
				seatWind={nextWind(bottomWind, ix)}
				onScoreClick={() => setScoreUpdater(ix)}
				onTileClick={() => {
					setWinner(ix);
					if (nextWind(bottomWind, ix) === '1') {
						setHandleRotation(false);
						setDealerRepeat(true);
					} else {
						setHandleRotation(true);
						setDealerRepeat(false);
					}
				}}
				onRiichiClick={() => {
					(async () => {
						if (riichi[ix]) {
							const scores_ = scores.slice();
							scores_[ix] = scores[ix] + 1000;
							const riichi_ = riichi.slice();
							riichi_[ix] = false;
							await db.setGame(gameId, { ...game, scores: scores_, riichiSticks: riichiSticks - 1, riichi: riichi_ });
						} else {
							const scores_ = scores.slice();
							scores_[ix] = scores[ix] - 1000;
							const riichi_ = riichi.slice();
							riichi_[ix] = true;
							await db.setGame(gameId, { ...game, scores: scores_, riichiSticks: riichiSticks + 1, riichi: riichi_ });
						}
					})();
				}}
			/>
		);
	}

	return (
		<div className="h-screen w-screen">
			<div className="fixed bottom-1 left-1/2 -translate-x-1/2">
				<div className="h-fit w-[min(70vh,70vw)]">
					<ScoreDisplayInCompass ix={0} />
				</div>
			</div>
			<div className="fixed right-1 top-1/2 mr-2 lg:mr-4 -translate-y-1/2">
				<div className="rotate-180 h-[min(70vh,70vw)] w-fit">
					<ScoreDisplayInCompass vertical ix={1} />
				</div>
			</div>
			<div className="fixed top-1 left-1/2 -translate-x-1/2">
				<div className="rotate-180 h-fit w-[min(70vh,70vw)]">
					<ScoreDisplayInCompass ix={2} />
				</div>
			</div>
			<div className="fixed left-1 top-1/2 ml-2 lg:ml-4 -translate-y-1/2">
				<div className="h-[min(70vh,70vw)] w-fit ">
					<ScoreDisplayInCompass vertical ix={3} />
				</div>
			</div>
			<ScoreUpdateDialog />
			<WinnerDialog />
			<DrawDialog />
			<AdvancedDialog />
			<div
				className={clsx(
					'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-300 dark:bg-sky-900 rounded-xl shadow',
					isPortrait ? '[writing-mode:vertical-lr] p-2 h-[min(70vh,70vw)]' : 'p-2 w-[min(70vh,70vw)]',
				)}
			>
				<div className="flex flex-row justify-between items-center gap-x-4">
					<div className={clsx(isPortrait ? 'rotate-90 mx-2 -my-2' : 'flex flex-col justify-center items-center')}>
						<TileButton
							onClick={() => {
								setMakingDraw(true);
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
