import { Transition } from '@headlessui/react';
import clsx from 'clsx';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { useImmer } from 'use-immer';
import Button from '../components/Button';
import CircleButton from '../components/CircleButton';
import Counter from '../components/Counter';
import JumpButton from '../components/JumpButton';
import Tiles from '../components/Tiles';
import Toggle from '../components/Toggle';
import ToggleOnOff from '../components/ToggleOnOff';
import HanFu from '../components/calculator/HanFu';
import PointsResult from '../components/calculator/PointsResult';
import ScoreResult from '../components/calculator/ScoreResult';
import Selected from '../components/calculator/Selected';
import SelectedDora from '../components/calculator/SelectedDora';
import { SuitRow, HonorRow } from '../components/calculator/TileRow';
import WindSelect from '../components/calculator/WindSelect';
import Calc from '../components/icons/heroicons/Calc';
import Cap from '../components/icons/heroicons/Cap';
import Cog from '../components/icons/heroicons/Cog';
import Left from '../components/icons/heroicons/Left';
import HorizontalRow from '../components/layout/HorizontalRow';
import VerticalRow from '../components/layout/VerticalRow';
import BlocksShuffleThree from '../components/loading/react-svg-spinners/BlocksShuffleThree';
import SettingsDialog from '../components/settings/SettingsDialog';
import H from '../components/text/H';
import { Game } from '../data/interfaces';
import useLocalStorage from '../hooks/useLocalStorage';
import { Action, defaultAction } from '../lib/action';
import {
	calculate,
	CalculatedPoints,
	calculateHanFu,
	ceil100,
	Hand,
	makeScore,
	nextWind,
	sortMelds,
	sortTiles,
	TileCode,
} from '../lib/hand';
import { ScoreSettings } from '../lib/settings';
import { CalculatorState, CompassState } from '../lib/states';
import { replicate } from '../lib/util';
import { useDb } from '../providers/DbProvider';

export default function Calculator() {
	const location = useLocation();
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const locState: CalculatorState = (location.state ?? { t: 'load', id: '$global' }) as any;

	const db = useDb();
	const globalSettings = db.useSettings('$global', { enabled: locState.t === 'load' });

	// The id is only used if we're transferring, in which case it will exist.
	const game = db.useGame(locState.id, { enabled: locState.t === 'transfer' });

	return (
		<div className="min-h-screen bg-slate-200 dark:bg-gray-900 text-black dark:text-white">
			{locState.t === 'transfer' ? (
				game == null ? (
					<div className="w-screen h-screen flex flex-col justify-center items-center">
						<div className="fill-black dark:fill-white w-24 h-24">
							<BlocksShuffleThree />
						</div>
					</div>
				) : game.ok ? (
					<CalculatorWithGame locState={locState} globalSettings={null} game={game.value} />
				) : (
					<div className="w-screen h-screen flex flex-col justify-center items-center">
						<div className="font-mono">
							<H.Red>Error: Game {locState.id} does not exist.</H.Red>
						</div>
					</div>
				)
			) : globalSettings == null ? (
				<div className="w-screen h-screen flex flex-col justify-center items-center">
					<div className="fill-black dark:fill-white w-24 h-24">
						<BlocksShuffleThree />
					</div>
				</div>
			) : globalSettings.ok ? (
				<CalculatorWithGame locState={locState} globalSettings={globalSettings.value} game={null} />
			) : (
				<div className="w-screen h-screen flex flex-col justify-center items-center">
					<div className="font-mono">
						<H.Red>Error: Settings {locState.id} does not exist.</H.Red>
					</div>
				</div>
			)}
		</div>
	);
}

function CalculatorWithGame({
	locState,
	globalSettings,
	game,
}: {
	locState: CalculatorState;
	globalSettings: ScoreSettings | null;
	game: Game | null;
}) {
	const navigate = useNavigate();
	const db = useDb();

	// One of these has to be available.
	const settings = (game ? game.settings : globalSettings)!;
	const [openedSettings, setOpenedSettings] = useState(false);
	const isSanma = settings.sanma != null;

	const initialHand: Hand = {
		tiles: [],
		melds: [],
		agariIndex: -1,
		agari: locState.t === 'transfer' ? locState.agari : 'tsumo',
		dora: [],
		uradora: [],
		nukidora: 0,
		extraYakuHan: 0,
		extraDoraHan: 0,
		extraYakuman: 0,
		riichi:
			game && locState.t === 'transfer' && game.riichi[locState.winner] ? { double: false, ippatsu: false } : null,
		blessing: false,
		lastTile: false,
		kan: false,
		roundWind: locState.t === 'transfer' ? locState.roundWind : '1',
		seatWind: locState.t === 'transfer' ? locState.seatWind : '1',
	};
	const [hand, updateHand] = useImmer<Hand>(initialHand);

	const [action, updateAction] = useImmer<Action | null>(null);

	const updateTiles = (t: TileCode) => {
		if (!action) {
			updateHand((h) => {
				// Add red 5 if its the fourth 5.
				if (
					settings.akadora &&
					t[0] === '5' &&
					t[1] !== 'z' &&
					allTiles.concat(hand.dora, hand.uradora).filter((t2) => t2 === t).length === 3
				) {
					h.tiles.push(`0${t[1]}` as TileCode);
					sortTiles(h.tiles);
					const i = h.tiles.findIndex((t2) => t2 === `0${t[1]}`);
					h.agariIndex = i;
				} else {
					h.tiles.push(t);
					sortTiles(h.tiles);
					const i = h.tiles.findIndex((t2) => t2 === t);
					h.agariIndex = i;
				}
			});
			return;
		}

		const ponTiles = (): TileCode[] => {
			// Clicked pon on the red 5.
			if (t[0] === '0') {
				const tx = `5${t[1]}` as TileCode;
				return [t, tx, tx];
			}
			// Clicked pon on the 5 and already has a normal 5, so must have red 5.
			if (
				settings.akadora &&
				t[0] === '5' &&
				t[1] !== 'z' &&
				allTiles.concat(hand.dora, hand.uradora).filter((t2) => t2 === t).length === 3
			) {
				const tx = `0${t[1]}` as TileCode;
				return [tx, t, t];
			}
			return [t, t, t];
		};

		const kanTiles = (): TileCode[] => {
			// Clicked kan on the red 5.
			if (t[0] === '0') {
				const tx = `5${t[1]}` as TileCode;
				return [t, tx, tx, tx];
			}
			// Clicked kan on the 5, so must have red 5.
			if (settings.akadora && t[0] === '5' && t[1] !== 'z') {
				const tx = `0${t[1]}` as TileCode;
				return [tx, t, t, t];
			}
			return [t, t, t, t];
		};

		switch (action.t) {
			case 'dora': {
				updateHand((h) => {
					// Add red 5 if its the fourth 5.
					if (
						settings.akadora &&
						t[0] === '5' &&
						t[1] !== 'z' &&
						allTiles.concat(hand.dora, hand.uradora).filter((t2) => t2 === t).length === 3
					) {
						h.dora.push(`0${t[1]}` as TileCode);
					} else {
						h.dora.push(t);
					}
					updateAction(null);
				});
				break;
			}
			case 'uradora': {
				updateHand((h) => {
					// Add red 5 if its the fourth 5.
					if (
						settings.akadora &&
						t[0] === '5' &&
						t[1] !== 'z' &&
						allTiles.concat(hand.dora, hand.uradora).filter((t2) => t2 === t).length === 3
					) {
						h.uradora.push(`0${t[1]}` as TileCode);
					} else {
						h.uradora.push(t);
					}
					updateAction(null);
				});
				break;
			}
			case 'chii': {
				if (action.tiles.length === 0) {
					updateAction({ t: 'chii', tiles: [t] });
				}
				if (action.tiles.length === 1) {
					updateAction({ t: 'chii', tiles: sortTiles([action.tiles[0], t]) });
				}
				if (action.tiles.length === 2) {
					updateHand((h) => {
						h.melds.push({ t: 'chiipon', tiles: sortTiles([...action.tiles, t]) });
						sortMelds(h.melds);
						if (h.riichi) {
							h.riichi = null;
						}
					});
					updateAction(null);
				}
				break;
			}
			case 'pon': {
				updateHand((h) => {
					h.melds.push({ t: 'chiipon', tiles: ponTiles() });
					sortMelds(h.melds);
					if (h.riichi) {
						h.riichi = null;
					}
				});
				updateAction(null);
				break;
			}
			case 'kan': {
				updateHand((h) => {
					h.melds.push({ t: 'kan', closed: false, tiles: kanTiles() });
					sortMelds(h.melds);
					if (h.riichi) {
						h.riichi = null;
					}
				});
				updateAction(null);
				break;
			}
			case 'closedKan': {
				updateHand((h) => {
					h.melds.push({ t: 'kan', closed: true, tiles: kanTiles() });
					sortMelds(h.melds);
					if (h.riichi?.double && h.riichi.ippatsu) {
						h.riichi.ippatsu = false;
					}
				});
				updateAction(null);
				break;
			}
		}
	};

	const tileCount = hand.tiles.length + hand.melds.length * 3;

	const allTiles = hand.tiles
		.concat(hand.melds.flatMap((m) => m.tiles))
		.concat(action?.t === 'chii' ? action.tiles : []);

	const [handBuilderEl, setHandBuilderEl] = useState<Element | null>(null);
	const [selectedTilesEl, setSelectedTilesEl] = useState<Element | null>(null);
	const [scoreResultEl, setScoreResultEl] = useState<Element | null>(null);
	const [pointsCalculatorEl, setPointsCalculatorEl] = useState<Element | null>(null);
	const [fuReferenceEl, setFuReferenceEl] = useState<Element | null>(null);
	const scoreResult = tileCount === 14 ? calculate(hand, settings) : null;

	const selectedTilesObserver = useMemo(
		() =>
			new IntersectionObserver(
				(entries) => {
					for (const entry of entries) {
						if (entry.isIntersecting) {
							toast.dismiss('tiles');
						} else {
							toast.custom(
								(tst) => (
									<Transition
										appear
										show={tst.visible && (hand.tiles.length > 0 || hand.melds.length > 0)}
										enter="transition ease-in-out duration-300 transform"
										enterFrom="-translate-y-[200%]"
										enterTo="translate-y-0"
										leave="transition ease-in-out duration-300 transform"
										leaveFrom="translate-y-0"
										leaveTo="-translate-y-[200%]"
									>
										<button
											className="bg-slate-200 dark:bg-gray-900 text-black dark:text-white -my-3.5 lg:my-0 scale-50 lg:scale-100 p-2 rounded-xl shadow flex flex-row justify-center items-center"
											onClick={(e) => {
												e.preventDefault();
												handBuilderEl?.scrollIntoView({ block: 'start', behavior: 'smooth' });
											}}
										>
											<Tiles
												small
												wrap={false}
												sets={[
													hand.tiles,
													...hand.melds.map((m) =>
														m.t === 'kan' && m.closed
															? ([m.tiles[0], '00', '00', m.tiles[3]] as ('00' | TileCode)[])
															: m.tiles,
													),
												]}
											/>
										</button>
									</Transition>
								),
								{ duration: Infinity, id: 'tiles' },
							);
						}
					}
				},
				{
					root: null,
					rootMargin: '0px',
					threshold: 1.0,
				},
			),
		[handBuilderEl, hand.tiles, hand.melds],
	);
	useEffect(() => {
		if (selectedTilesEl) {
			selectedTilesObserver.observe(selectedTilesEl);
			return () => selectedTilesObserver.unobserve(selectedTilesEl);
		}
	}, [selectedTilesObserver, selectedTilesEl]);

	const makeHanFuScore = (h: number, f: number) =>
		makeScore(hand.seatWind === '1', hand.agari, isSanma, calculateHanFu(h, f, settings));

	const [han, setHan] = useState(1);
	const [fu, setFu] = useState(30);
	const hanFuScores = makeHanFuScore(han, fu);

	const [prefersQuickInit] = useLocalStorage('prefersQuick');
	const [prefersQuick_, setPrefersQuick] = useState(prefersQuickInit);
	const prefersQuick = locState.t === 'transfer' && prefersQuick_;

	const transferScores = async (calcPoints: Exclude<CalculatedPoints, { agari: null }>) => {
		if (game == null || locState.t !== 'transfer' || locState.agari !== calcPoints.agari) {
			return;
		}

		const { bottomWind, roundWind, round, repeats, scores, riichi, riichiSticks } = game;
		const honba = isSanma ? 200 : 300;
		const playerIxes = isSanma ? [0, 1, 2] : [0, 1, 2, 3];
		const roundCap = isSanma ? 3 : 4;
		const isOya = locState.seatWind === '1';

		const scores_ = scores.slice(0);
		scores_[locState.winner] += calcPoints.points.total;
		if (locState.scoreRepeatSticks && riichiSticks) {
			scores_[locState.winner] += 1000 * riichiSticks;
		}
		if (locState.scoreRepeatSticks && !isOya) {
			scores_[locState.winner] += repeats * honba;
		}

		// This is technically exhaustive, TS just can't recognize the two values are the same.
		if (locState.agari === 'ron' && calcPoints.agari === 'ron') {
			if (locState.pao == null) {
				const deltas = isOya ? calcPoints.points.oya : calcPoints.points.ko;
				scores_[locState.dealtInPlayer] -= deltas.ron;
				if (locState.scoreRepeatSticks && !isOya) {
					scores_[locState.dealtInPlayer] -= repeats * honba;
				}
			} else {
				const delta = ceil100(calcPoints.points.total / 2);
				scores_[locState.dealtInPlayer] -= delta;
				scores_[locState.pao] -= delta;
				if (locState.scoreRepeatSticks && !isOya) {
					scores_[locState.dealtInPlayer] -= repeats * honba;
				}
			}
		} else if (locState.agari === 'tsumo' && calcPoints.agari === 'tsumo') {
			if (locState.pao == null) {
				for (const loser of playerIxes.filter((i) => i !== locState.winner)) {
					const delta = isOya
						? calcPoints.points.oya.ko
						: nextWind(bottomWind, loser, isSanma) === '1'
						? calcPoints.points.ko.oya
						: calcPoints.points.ko.ko;
					scores_[loser] -= delta;
					if (locState.scoreRepeatSticks && !isOya) {
						scores_[loser] -= repeats * 100;
					}
				}
			} else {
				const delta = calcPoints.points.total;
				scores_[locState.pao] -= delta;
				if (locState.scoreRepeatSticks && !isOya) {
					scores_[locState.pao] -= repeats * honba;
				}
			}
		}

		const shouldRotate = locState.handleRotation;
		const shouldRepeat = locState.seatWind === '1' && locState.dealerRepeat;
		await db.setGame(locState.id, {
			...game,
			...(shouldRotate || shouldRepeat
				? {
						bottomWind: shouldRepeat ? bottomWind : nextWind(bottomWind, -1, isSanma),
						roundWind: shouldRepeat ? roundWind : round === roundCap ? nextWind(roundWind, 1, isSanma) : roundWind,
						round: shouldRepeat ? round : round === roundCap ? 1 : round + 1,
						repeats: shouldRepeat ? repeats + 1 : 0,
				  }
				: {}),
			scores: scores_,
			riichiSticks: locState.scoreRiichiSticks ? 0 : riichiSticks,
			riichi: locState.scoreRiichiSticks ? replicate(false, isSanma ? 3 : 4) : riichi,
		});

		const state: CompassState = {
			t: 'load',
			id: locState.id,
			oldScores: scores,
		};
		navigate('/compass', { state, replace: true });
	};

	return (
		<div className="flex flex-row justify-center">
			<Toaster position="top-center" />
			<div className="w-full h-screen overflow-y-auto">
				<div className="fixed z-10 top-2 left-2 lg:top-4 lg:left-4 flex flex-col gap-y-2">
					<CircleButton
						onClick={() => {
							if (locState.t === 'transfer') {
								const state: CompassState = { t: 'load', id: locState.id };
								navigate('/compass', { state, replace: true });
							} else {
								navigate('/', { replace: true });
							}
						}}
					>
						<Left />
					</CircleButton>
				</div>
				{game == null && (
					<div className="fixed z-10 top-2 right-2 lg:top-4 lg:right-8 flex flex-col gap-y-2">
						<CircleButton
							onClick={() => {
								setOpenedSettings(true);
							}}
						>
							<Cog />
						</CircleButton>
					</div>
				)}
				{locState.t === 'transfer' && (
					<div className="fixed z-10 top-2 right-2 lg:top-4 lg:right-8 flex flex-col gap-y-2">
						<CircleButton
							onClick={() => {
								if (prefersQuick) {
									setPrefersQuick(null);
								} else {
									setPrefersQuick('true');
								}
							}}
						>
							{prefersQuick ? <Cap /> : <Calc />}
						</CircleButton>
					</div>
				)}
				{prefersQuick ? (
					<div className="invisible sm:visible fixed z-10 bottom-2 right-2 lg:bottom-4 lg:right-8 flex flex-col gap-y-2">
						<JumpButton element={pointsCalculatorEl}>点</JumpButton>
						<JumpButton element={fuReferenceEl}>符</JumpButton>
					</div>
				) : (
					<div className="invisible sm:visible fixed z-10 bottom-2 right-2 lg:bottom-4 lg:right-8 flex flex-col gap-y-2">
						<JumpButton element={handBuilderEl}>牌</JumpButton>
						<JumpButton element={scoreResultEl} highlight={scoreResult?.agari != null}>
							役
						</JumpButton>
					</div>
				)}
				{openedSettings && (
					<SettingsDialog
						inCalculator
						settings={settings}
						onSettingsChange={(s) => {
							(async () => {
								await db.setSettings('$global', s);
								updateHand(initialHand);
							})();
						}}
						onClose={() => {
							setOpenedSettings(false);
						}}
					/>
				)}
				<div className="flex flex-col justify-center items-center w-full gap-y-2">
					{prefersQuick ? (
						<>
							<div
								ref={setPointsCalculatorEl}
								className="w-full min-h-screen flex flex-col justify-center px-4 py-4 lg:py-8"
							>
								<div className="flex flex-col justify-center items-center gap-y-4 lg:gap-y-8">
									<h1 className="text-3xl lg:text-4xl">Points Calculator</h1>
									<div className="flex flex-row flex-wrap gap-x-8 justify-center items-center min-w-min">
										<div className="flex flex-col flex-wrap justify-center items-center gap-x-8 gap-y-1">
											<span className="text-xl">Round</span>
											<WindSelect
												forced
												value={hand.roundWind}
												redEast
												sanma={isSanma}
												onChange={(w) => {
													updateAction(null);
													updateHand((h) => {
														h.roundWind = w;
													});
												}}
											/>
										</div>
										<div className="flex flex-col justify-center items-center gap-y-1">
											<span className="text-xl">Seat</span>
											<WindSelect
												forced
												value={hand.seatWind}
												redEast
												sanma={isSanma}
												onChange={(w) => {
													updateAction(null);
													updateHand((h) => {
														h.seatWind = w;
													});
												}}
											/>
										</div>
									</div>
									<div className="flex flex-col flex-wrap justify-center items-center gap-x-8 gap-y-1">
										<span className="text-xl lg:text-2xl">
											Won by{' '}
											<H>
												<H.B>{hand.agari === 'ron' ? 'Ron' : 'Tsumo'}</H.B>
											</H>
										</span>
									</div>
									<HanFu han={han} fu={fu} agari={hand.agari} onHanChange={setHan} onFuChange={setFu} />
									<PointsResult
										result={{
											...hanFuScores,
											noYaku: false,
											isOya: hand.seatWind === '1',
											yakuman: 0,
											yaku: [],
											han,
											fu,
											name: null,
										}}
										pao={locState.pao != null}
									/>
									<div className="flex flex-col container lg:w-[50%] gap-y-2 lg:gap-y-4">
										<button
											className={clsx(
												'border border-gray-800 rounded-xl shadow py-1 lg:p-2 disabled:bg-gray-300 dark:disabled:bg-gray-800 dark:disabled:text-gray-600',
												'h-24 text-2xl',
												'bg-amber-500 hover:bg-amber-600 dark:bg-amber-700 dark:hover:bg-amber-800',
											)}
											onClick={() => {
												void transferScores(hanFuScores);
											}}
										>
											Transfer Points
										</button>
									</div>
								</div>
							</div>
							<div
								ref={setFuReferenceEl}
								className="w-full min-h-screen flex flex-col justify-center items-center p-2 bg-slate-300 dark:bg-sky-900 gap-y-2"
							>
								<h1 className="text-3xl lg:text-4xl">Fu Reference</h1>
								<span className="text-lg lg:text-xl">Round up to the nearest 10.</span>
								<ul className="flex flex-col justify-center items-start gap-y-1 lg:gap-y-2 list-disc text-xl lg:text-2xl ml-4 lg:ml-8">
									<li>
										<H>20</H> base fu
										<ul className="flex flex-col justify-center items-start gap-y-1 lg:gap-y-2 list-disc ml-4 lg:ml-8 mt-1">
											{settings.rinshanFu ? (
												<li>
													<H>+2</H> for winning with tsumo
												</li>
											) : (
												<li>
													<H>+2</H> for winning with tsumo without after a kan
												</li>
											)}
											<li>
												<H>+10</H> for winning with closed ron
											</li>
											<li>
												<H>+2</H> for having a single wait
											</li>
											{settings.doubleWindFu ? (
												<li>
													<H>+2</H> per yakuhai pair and additional <H>+2</H> if double wind
												</li>
											) : (
												<li>
													<H>+2</H> per yakuhai pair
												</li>
											)}
										</ul>
									</li>
									<li>
										<H>+2</H> fu per triplet
										<ul className="flex flex-col justify-center items-start gap-y-1 lg:gap-y-2 list-disc ml-4 lg:ml-8 mt-1">
											<li>
												<H>x2</H> if concealed
											</li>
											<li>
												<H>x2</H> if terminals or honors
											</li>
											<li>
												<H>x4</H> if kan
											</li>
										</ul>
									</li>
									<li>
										Seven pairs is always <H>25</H> fu and not rounded.
									</li>
									<li>
										Pinfu tsumo is always <H>20</H> fu.
									</li>
									<li>
										Open hands are always worth at least <H>30</H> fu.
									</li>
								</ul>
							</div>
						</>
					) : (
						<>
							<div
								ref={setHandBuilderEl}
								className="flex flex-col justify-center items-center w-full min-h-screen gap-y-2 px-2 py-2"
							>
								<div className="flex flex-row gap-x-2 items-end">
									<h1 className="text-3xl lg:text-4xl">Score Calculator</h1>
									{(tileCount > 0 || hand.dora.length > 0 || hand.uradora.length > 0) && (
										<button
											onClick={() => {
												updateAction(null);
												updateHand(initialHand);
											}}
											className="text-red-600 hover:text-red-700 dark:text-red-700 dark:hover:text-red-800"
										>
											Clear
										</button>
									)}
								</div>
								<HorizontalRow>
									<Selected
										ref={setSelectedTilesEl}
										hand={hand}
										sanma={isSanma}
										onTileClick={(t, i) => {
											updateAction(null);
											updateHand((h) => {
												h.tiles.splice(i, 1);
												if (h.agariIndex >= i) {
													h.agariIndex -= 1;
												}
											});
										}}
										onMeldClick={(m, i) => {
											updateAction(null);
											updateHand((h) => {
												h.melds.splice(i, 1);
												if (
													m.t === 'kan' &&
													h.agari === 'tsumo' &&
													!h.melds.some((m) => m.t === 'kan') &&
													!h.nukidora
												) {
													h.kan = false;
												}
											});
										}}
									/>
								</HorizontalRow>
								<HorizontalRow>
									{/* Can't call on a tile when in riichi or for blessing, except closed kans. */}
									{!isSanma && (
										<ActionButton
											t="chii"
											disabled={hand.riichi != null || hand.blessing || tileCount + 3 > 14}
											currentAction={action}
											onActionChange={updateAction}
											small
										>
											Chii
										</ActionButton>
									)}
									<ActionButton
										t="pon"
										disabled={hand.riichi != null || hand.blessing || tileCount + 3 > 14}
										currentAction={action}
										onActionChange={updateAction}
										small
									>
										Pon
									</ActionButton>
									<ActionButton
										t="kan"
										disabled={hand.riichi != null || hand.blessing || tileCount + 3 > 14}
										currentAction={action}
										onActionChange={updateAction}
										small
									>
										Kan
									</ActionButton>
									<ActionButton
										t="closedKan"
										disabled={hand.blessing || tileCount + 3 > 14}
										currentAction={action}
										onActionChange={updateAction}
										small
									>
										Closed Kan
									</ActionButton>
								</HorizontalRow>
								<VerticalRow>
									<SuitRow
										suit="m"
										akadora={settings.akadora}
										hand={hand}
										allTiles={allTiles}
										tileCount={tileCount}
										action={action}
										sanma={isSanma}
										onClick={updateTiles}
									/>
									<SuitRow
										suit="p"
										akadora={settings.akadora}
										hand={hand}
										allTiles={allTiles}
										tileCount={tileCount}
										action={action}
										sanma={isSanma}
										onClick={updateTiles}
									/>
									<SuitRow
										suit="s"
										akadora={settings.akadora}
										hand={hand}
										allTiles={allTiles}
										tileCount={tileCount}
										action={action}
										sanma={isSanma}
										onClick={updateTiles}
									/>
									<HonorRow
										hand={hand}
										allTiles={allTiles}
										tileCount={tileCount}
										action={action}
										sanma={isSanma}
										onClick={updateTiles}
									/>
								</VerticalRow>
								<div className="w-full mb-1">
									<div className="flex flex-row flex-wrap gap-x-8 justify-center items-center min-w-min">
										<div className="flex flex-row flex-wrap gap-x-8 justify-center items-center min-w-min">
											<div className="flex flex-col flex-wrap justify-center items-center gap-x-8 gap-y-1">
												<span className="text-xl">Round</span>
												<WindSelect
													forced={locState.t === 'transfer'}
													value={hand.roundWind}
													redEast
													sanma={isSanma}
													onChange={(w) => {
														updateAction(null);
														updateHand((h) => {
															h.roundWind = w;
														});
													}}
												/>
											</div>
											<div className="flex flex-col justify-center items-center gap-y-1">
												<span className="text-xl">Seat</span>
												<WindSelect
													forced={locState.t === 'transfer'}
													value={hand.seatWind}
													redEast
													sanma={isSanma}
													onChange={(w) => {
														updateAction(null);
														updateHand((h) => {
															h.seatWind = w;
														});
													}}
												/>
											</div>
										</div>
										<div className="flex flex-row flex-wrap justify-center items-center gap-x-8 gap-y-1">
											<div className="flex flex-col justify-center items-center gap-y-1">
												<span className="text-xl">
													Dora <span className="text-xs">Indicators</span>
												</span>
												<SelectedDora
													dora={hand.dora}
													onTileClick={(t, i) => {
														updateAction(null);
														updateHand((h) => {
															h.dora.splice(i, 1);
															sortTiles(h.dora);
														});
													}}
												/>
											</div>
											<div className="flex flex-col justify-center items-center gap-y-1">
												<span className="text-xl">
													Uradora <span className="text-xs">Indicators</span>
												</span>
												<SelectedDora
													dora={hand.uradora}
													onTileClick={(t, i) => {
														updateAction(null);
														updateHand((h) => {
															h.uradora.splice(i, 1);
															sortTiles(h.uradora);
														});
													}}
												/>
											</div>
										</div>
									</div>
								</div>
								<VerticalRow>
									<HorizontalRow>
										<Toggle
											forced={locState.t === 'transfer'}
											toggled={hand.agari === 'ron'}
											onToggle={(b) => {
												updateAction(null);
												updateHand((h) => {
													h.agari = b ? 'ron' : 'tsumo';
													// Robbing a Kan -> Drawing a Kan only if there is kan meld.
													if (h.agari === 'tsumo' && !hand.melds.some((m) => m.t === 'kan')) {
														h.kan = false;
													}
												});
											}}
											left="Tsumo"
											right="Ron"
										/>
										<ActionButton
											t="dora"
											disabled={hand.dora.length >= 5}
											currentAction={action}
											onActionChange={updateAction}
										>
											Add Dora Indicator
										</ActionButton>
										<ActionButton
											t="uradora"
											disabled={hand.riichi == null || hand.uradora.length >= 5}
											currentAction={action}
											onActionChange={updateAction}
										>
											Add Uradora Indicator
										</ActionButton>
										{isSanma && !settings.northYakuhai && (
											<Counter
												canDecrement={hand.nukidora > 0}
												onDecrement={() => {
													updateAction(null);
													updateHand((h) => {
														h.nukidora--;
													});
												}}
												canIncrement={hand.nukidora + allTiles.filter((t) => t === '4z').length < 4}
												onIncrement={() => {
													updateAction(null);
													updateHand((h) => {
														h.nukidora++;
													});
												}}
											>
												Kita ({hand.nukidora})
											</Counter>
										)}
									</HorizontalRow>
									<HorizontalRow>
										<ToggleOnOff
											toggled={hand.riichi != null}
											// No riichi if there are melds, except closed kans.
											disabled={hand.melds.filter((m) => m.t !== 'kan' || !m.closed).length > 0}
											// Can swap between riichi and blessings.
											incompatible={hand.blessing}
											onToggle={(b) => {
												updateAction(null);
												updateHand((h) => {
													h.riichi = b ? { double: false, ippatsu: false } : null;
													// No blessings in riichi, no uradora out of riichi.
													if (b) {
														h.blessing = false;
													} else {
														h.uradora = [];
													}
												});
											}}
										>
											Riichi
										</ToggleOnOff>
										{!settings.disabledYaku.includes('ダブル立直') && (
											<ToggleOnOff
												toggled={hand.riichi?.double ?? false}
												disabled={hand.melds.filter((m) => m.t !== 'kan' || !m.closed).length > 0}
												incompatible={
													hand.riichi == null ||
													(hand.riichi.ippatsu && hand.melds.filter((m) => m.t === 'kan' && m.closed).length > 0) ||
													(hand.riichi.ippatsu && hand.lastTile)
												}
												onToggle={(b) => {
													updateAction(null);
													updateHand((h) => {
														if (b && h.riichi == null) {
															h.riichi = { double: true, ippatsu: false };
														}
														h.riichi!.double = b;
														if (b) {
															// Cannot be ippatsu if closed kan and double riichi.
															if (h.riichi?.ippatsu && hand.melds.filter((m) => m.t === 'kan' && m.closed).length > 0) {
																h.riichi.ippatsu = false;
															}
															if (h.riichi?.ippatsu && h.lastTile) {
																h.lastTile = false;
															}
														}
													});
												}}
											>
												Double Riichi
											</ToggleOnOff>
										)}
										{!settings.disabledYaku.includes('一発') && (
											<ToggleOnOff
												toggled={hand.riichi?.ippatsu ?? false}
												disabled={hand.melds.filter((m) => m.t !== 'kan' || !m.closed).length > 0}
												incompatible={
													hand.riichi == null ||
													(hand.riichi.double && hand.melds.filter((m) => m.t === 'kan' && m.closed).length > 0) ||
													(hand.agari === 'tsumo' && hand.kan) ||
													(hand.agari === 'ron' && hand.lastTile) ||
													(hand.lastTile && hand.riichi.double)
												}
												onToggle={(b) => {
													updateAction(null);
													updateHand((h) => {
														if (b && h.riichi == null) {
															h.riichi = { double: false, ippatsu: true };
														}
														h.riichi!.ippatsu = b;
														if (b) {
															// If ippatsu, cannot be after a kan or under the river.
															if (h.agari === 'tsumo') {
																h.kan = false;
															}
															if (h.agari === 'ron') {
																h.lastTile = false;
															}
															// Cannot be double riichi if closed kan and ippatsu.
															if (h.riichi?.double && hand.melds.filter((m) => m.t === 'kan' && m.closed).length > 0) {
																h.riichi.double = false;
															}
															// Cannot be last tile if double riichi and ippatsu.
															if (h.lastTile && h.riichi?.double) {
																h.lastTile = false;
															}
														}
													});
												}}
											>
												Ippatsu
											</ToggleOnOff>
										)}
									</HorizontalRow>
									<HorizontalRow>
										{(!settings.disabledYaku.includes('嶺上開花') || !settings.disabledYaku.includes('搶槓')) && (
											<ToggleOnOff
												toggled={hand.kan}
												// No after a kan if no kan melds.
												// No robbing a kan if all 4 kans in hand.
												disabled={
													(hand.agari === 'tsumo' && !hand.melds.some((m) => m.t === 'kan') && !hand.nukidora) ||
													(hand.agari === 'ron' && hand.melds.filter((m) => m.t === 'kan').length === 4) ||
													(hand.agari === 'ron' &&
														hand.tiles.filter((t) => hand.tiles[hand.agariIndex] === t).length > 1)
												}
												incompatible={
													hand.blessing || (hand.agari === 'tsumo' && hand.riichi?.ippatsu) || hand.lastTile
												}
												onToggle={(b) => {
													updateAction(null);
													updateHand((h) => {
														h.kan = b;
														// A kan call means no blessing, not last tile, and not tsumo ippatsu.
														if (b) {
															h.blessing = false;
															h.lastTile = false;
															if (h.agari === 'tsumo' && h.riichi) {
																h.riichi.ippatsu = false;
															}
														}
													});
												}}
											>
												{hand.agari === 'ron' ? 'Robbing a Kan' : 'After a Kan'}
											</ToggleOnOff>
										)}
										{(!settings.disabledYaku.includes('海底摸月') || !settings.disabledYaku.includes('河底撈魚')) && (
											<ToggleOnOff
												toggled={hand.lastTile}
												incompatible={
													hand.blessing ||
													(hand.agari === 'ron' && hand.riichi?.ippatsu) ||
													hand.kan ||
													(hand.riichi?.double && hand.riichi.ippatsu)
												}
												onToggle={(b) => {
													updateAction(null);
													updateHand((h) => {
														// Last tile means no blessing, not from a kan call, not ron ippatsu.
														h.lastTile = b;
														if (b) {
															h.blessing = false;
															h.kan = false;
															if (h.agari === 'ron' && h.riichi) {
																h.riichi.ippatsu = false;
															}
															if (h.riichi?.double && h.riichi.ippatsu) {
																h.riichi.ippatsu = false;
															}
														}
													});
												}}
											>
												{hand.agari === 'tsumo' ? 'Under the Sea' : 'Under the River'}
											</ToggleOnOff>
										)}
										{(!settings.disabledYaku.includes('天和') || !settings.disabledYaku.includes('地和')) && (
											<ToggleOnOff
												toggled={hand.blessing}
												disabled={
													(hand.agari === 'ron' &&
														(settings.enabledLocalYaku.includes('人和') ? hand.seatWind === '1' : true)) ||
													hand.melds.length > 0 ||
													hand.nukidora > 0
												}
												incompatible={hand.riichi != null || hand.kan || hand.lastTile}
												onToggle={(b) => {
													updateAction(null);
													updateHand((h) => {
														h.blessing = b;
														// Blessing means no call can be made, first title.
														if (b) {
															h.riichi = null;
															h.uradora = [];
															h.lastTile = false;
															h.kan = false;
														}
													});
												}}
											>
												{hand.seatWind === '1'
													? 'Blessing of Heaven'
													: settings.enabledLocalYaku.includes('人和') && hand.agari === 'ron'
													? 'Blessing of Man'
													: 'Blessing of Earth'}
											</ToggleOnOff>
										)}
									</HorizontalRow>
									{settings.otherScoring && (
										<HorizontalRow>
											<Counter
												canDecrement={hand.extraYakuHan > 0}
												onDecrement={() => {
													updateAction(null);
													updateHand((h) => {
														h.extraYakuHan--;
													});
												}}
												onIncrement={() => {
													updateAction(null);
													updateHand((h) => {
														h.extraYakuHan++;
													});
												}}
											>
												Yaku ({hand.extraYakuHan})
											</Counter>
											<Counter
												canDecrement={hand.extraDoraHan > 0}
												onDecrement={() => {
													updateAction(null);
													updateHand((h) => {
														h.extraDoraHan--;
													});
												}}
												onIncrement={() => {
													updateAction(null);
													updateHand((h) => {
														h.extraDoraHan++;
													});
												}}
											>
												Dora ({hand.extraDoraHan})
											</Counter>
											<Counter
												canDecrement={hand.extraYakuman > 0}
												onDecrement={() => {
													updateAction(null);
													updateHand((h) => {
														h.extraYakuman--;
													});
												}}
												onIncrement={() => {
													updateAction(null);
													updateHand((h) => {
														h.extraYakuman++;
													});
												}}
											>
												Yakuman ({hand.extraYakuman})
											</Counter>
										</HorizontalRow>
									)}
								</VerticalRow>
							</div>
							<div
								ref={setScoreResultEl}
								className="w-full min-h-screen flex flex-col justify-center px-4 py-4 lg:py-8 bg-slate-300 dark:bg-sky-900"
							>
								<ScoreResult
									tileCount={tileCount}
									result={scoreResult}
									transferButton={locState.t === 'transfer'}
									onTransferClick={() => {
										if (scoreResult?.agari != null) {
											void transferScores(scoreResult);
										}
									}}
								/>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}

function ActionButton({
	t,
	currentAction,
	onActionChange,
	disabled,
	small,
	children,
}: {
	t: Action['t'];
	currentAction: Action | null;
	onActionChange: (a: Action | null) => void;
	disabled?: boolean;
	small?: boolean;
	children?: ReactNode;
}) {
	return (
		<Button
			onClick={() => onActionChange(currentAction?.t === t ? null : defaultAction(t))}
			active={currentAction?.t === t}
			disabled={disabled}
			small={small}
		>
			{children}
		</Button>
	);
}
