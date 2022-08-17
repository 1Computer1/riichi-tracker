import clsx from 'clsx';
import { ReactNode, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useImmer } from 'use-immer';
import Button from '../components/Button';
import CircleButton from '../components/CircleButton';
import Counter from '../components/Counter';
import JumpButton from '../components/JumpButton';
import Toggle from '../components/Toggle';
import ToggleOnOff from '../components/ToggleOnOff';
import HanFu from '../components/calculator/HanFu';
import ScoreResult from '../components/calculator/ScoreResult';
import Selected from '../components/calculator/Selected';
import SelectedDora from '../components/calculator/SelectedDora';
import { SuitRow, HonorRow } from '../components/calculator/TileRow';
import WindSelect from '../components/calculator/WindSelect';
import Left from '../components/icons/heroicons/Left';
import HorizontalRow from '../components/layout/HorizontalRow';
import VerticalRow from '../components/layout/VerticalRow';
import BlocksShuffleThree from '../components/loading/react-svg-spinners/BlocksShuffleThree';
import { Game } from '../data/interfaces';
import { Action, defaultAction } from '../lib/action';
import {
	calculate,
	CalculatedPoints,
	calculateHanFu,
	DefaultSettings,
	Hand,
	makeScore,
	nextWind,
	sortMelds,
	sortTiles,
	TileCode,
} from '../lib/hand';
import { CalculatorState, CompassState } from '../lib/states';
import { replicate } from '../lib/util';
import { useDb } from '../providers/DbProvider';

export default function Calculator() {
	const location = useLocation();
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const locState: CalculatorState | null = (location.state ?? null) as any;

	const db = useDb();
	const game = db.useGame(locState?.id ?? '$tools', { enabled: locState?.id != null });

	return (
		<div className="min-h-screen bg-slate-200 dark:bg-gray-900 text-black dark:text-white">
			{locState?.id ? (
				game == null ? (
					<div className="w-screen h-screen flex flex-col justify-center items-center">
						<div className="fill-black dark:fill-white w-24 h-24">
							<BlocksShuffleThree />
						</div>
					</div>
				) : game.ok ? (
					<CalculatorWithGame locState={locState} game={game.value} />
				) : (
					<div className="w-screen h-screen flex flex-col justify-center items-center">
						<div className="text-red-600 dark:text-red-700 font-mono">Error: Game {locState.id} does not exist.</div>
					</div>
				)
			) : (
				<CalculatorWithGame locState={locState} game={null} />
			)}
		</div>
	);
}

function CalculatorWithGame({ locState, game }: { locState: CalculatorState | null; game: Game | null }) {
	const navigate = useNavigate();
	const db = useDb();

	const settings = game?.settings ?? DefaultSettings;
	const isSanma = settings.sanma != null;

	const initialHand: Hand = {
		tiles: [],
		melds: [],
		agariIndex: -1,
		agari: locState?.agari ?? 'tsumo',
		dora: [],
		uradora: [],
		nukidora: 0,
		riichi: null,
		blessing: false,
		lastTile: false,
		kan: false,
		roundWind: locState?.roundWind ?? '1',
		seatWind: locState?.seatWind ?? '1',
	};
	const [hand, updateHand] = useImmer<Hand>(initialHand);

	const [action, updateAction] = useImmer<Action | null>(null);

	const updateTiles = (t: TileCode) => {
		if (!action) {
			updateHand((h) => {
				// Add red 5 if its the fourth 5.
				if (settings.akadora && t[0] === '5' && hand.tiles.filter((t2) => t2 === t).length === 3) {
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
			if (settings.akadora && t[0] === '5' && hand.tiles.some((t2) => t2 === t)) {
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
			if (settings.akadora && t[0] === '5') {
				const tx = `0${t[1]}` as TileCode;
				return [tx, t, t, t];
			}
			return [t, t, t, t];
		};

		switch (action.t) {
			case 'dora': {
				updateHand((h) => {
					h.dora.push(t);
					updateAction(null);
				});
				break;
			}
			case 'uradora': {
				updateHand((h) => {
					h.uradora.push(t);
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
	const [scoreResultEl, setScoreResultEl] = useState<Element | null>(null);
	const [pointsCalculatorEl, setPointsCalculatorEl] = useState<Element | null>(null);
	const scoreResult = tileCount === 14 ? calculate(hand, settings) : null;

	const [han, setHan] = useState(1);
	const [fu, setFu] = useState(30);
	const hanFuScores = makeScore(hand.seatWind === '1', hand.agari, isSanma, calculateHanFu(han, fu, settings.sanma));

	const transferScores = async (calcPoints: Exclude<CalculatedPoints, { agari: null }>) => {
		if (game == null || locState?.t !== 'transfer' || locState.agari !== calcPoints.agari) {
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
			const deltas = isOya ? calcPoints.points.oya : calcPoints.points.ko;
			scores_[locState.dealtInPlayer] -= deltas.ron;
			if (locState.scoreRepeatSticks && !isOya) {
				scores_[locState.dealtInPlayer] -= repeats * honba;
			}
		} else if (locState.agari === 'tsumo' && calcPoints.agari === 'tsumo') {
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
		};
		navigate('/compass', { state, replace: true });
	};

	return (
		<div className="flex flex-row justify-center">
			<div className="w-full h-screen overflow-y-auto">
				<div className="fixed top-2 left-2 lg:top-4 lg:left-4">
					<CircleButton
						onClick={() => {
							if (locState?.id) {
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
				<div className="invisible sm:visible fixed bottom-2 right-2 lg:bottom-4 lg:right-8 flex flex-col gap-y-2">
					<JumpButton element={handBuilderEl}>牌</JumpButton>
					<JumpButton element={scoreResultEl} highlight={scoreResult?.agari != null}>
						役
					</JumpButton>
					<JumpButton element={pointsCalculatorEl}>点</JumpButton>
				</div>
				<div className="flex flex-col justify-center items-center w-full gap-y-2 lg:gap-y-4">
					<div
						ref={setHandBuilderEl}
						className="flex flex-col justify-center items-center w-full min-h-screen gap-y-2 lg:gap-y-4 px-2 py-2"
					>
						<div className="flex flex-row gap-x-2 items-end">
							<h1 className="text-2xl lg:text-4xl">Score Calculator</h1>
							{tileCount > 0 && (
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
								hand={hand}
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
								>
									Chii
								</ActionButton>
							)}
							<ActionButton
								t="pon"
								disabled={hand.riichi != null || hand.blessing || tileCount + 3 > 14}
								currentAction={action}
								onActionChange={updateAction}
							>
								Pon
							</ActionButton>
							<ActionButton
								t="kan"
								disabled={hand.riichi != null || hand.blessing || tileCount + 3 > 14}
								currentAction={action}
								onActionChange={updateAction}
							>
								Kan
							</ActionButton>
							<ActionButton
								t="closedKan"
								disabled={hand.blessing || tileCount + 3 > 14}
								currentAction={action}
								onActionChange={updateAction}
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
							<HonorRow hand={hand} allTiles={allTiles} tileCount={tileCount} action={action} onClick={updateTiles} />
						</VerticalRow>
						<div className="w-full overflow-x-auto mb-1">
							<div className="flex flex-row gap-x-8 justify-center items-center min-w-min">
								<div className="flex flex-col justify-center items-center gap-y-1">
									<span className="text-xl">Round</span>
									<WindSelect
										forced={locState?.roundWind != null}
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
										forced={locState?.seatWind != null}
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
								<div className="flex flex-col justify-center items-center gap-y-1">
									<span className="text-xl">Dora</span>
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
									<span className="text-xl">Uradora</span>
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
						<HorizontalRow>
							<Toggle
								forced={locState?.agari != null}
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
						</HorizontalRow>
						<HorizontalRow>
							<ToggleOnOff
								toggled={hand.kan}
								// No after a kan if no kan melds.
								// No robbing a kan if all 4 kans in hand.
								disabled={
									(hand.agari === 'tsumo' && !hand.melds.some((m) => m.t === 'kan')) ||
									(hand.agari === 'ron' && hand.melds.filter((m) => m.t === 'kan').length === 4) ||
									(hand.agari === 'ron' && hand.tiles.filter((t) => hand.tiles[hand.agariIndex] === t).length > 1)
								}
								incompatible={hand.blessing || (hand.agari === 'tsumo' && hand.riichi?.ippatsu) || hand.lastTile}
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
							<ToggleOnOff
								toggled={hand.blessing}
								disabled={hand.agari === 'ron' || hand.melds.length > 0 || hand.nukidora > 0}
								incompatible={hand.riichi != null || hand.kan || hand.lastTile}
								onToggle={(b) => {
									updateAction(null);
									updateHand((h) => {
										h.blessing = b;
										// Blessing means no call can be made, first title.
										if (b) {
											h.riichi = null;
											h.lastTile = false;
											h.kan = false;
										}
									});
								}}
							>
								{hand.seatWind === '1' ? 'Blessing of Heaven' : 'Blessing of Earth'}
							</ToggleOnOff>
						</HorizontalRow>
						<HorizontalRow>
							<ActionButton
								t="dora"
								disabled={hand.dora.length >= 5}
								currentAction={action}
								onActionChange={updateAction}
							>
								Add Dora
							</ActionButton>
							<ActionButton
								t="uradora"
								disabled={hand.riichi == null || hand.uradora.length >= 5}
								currentAction={action}
								onActionChange={updateAction}
							>
								Add Uradora
							</ActionButton>
							{isSanma && (
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
					</div>
					<div
						ref={setScoreResultEl}
						className="w-full min-h-screen flex flex-col justify-center px-4 py-4 lg:py-8 bg-slate-300 dark:bg-sky-900"
					>
						<ScoreResult
							tileCount={tileCount}
							result={scoreResult}
							transferButton={locState?.t === 'transfer'}
							onTransferClick={() => {
								if (scoreResult?.agari != null) {
									void transferScores(scoreResult);
								}
							}}
						/>
					</div>
					<div
						ref={setPointsCalculatorEl}
						className="w-full min-h-screen flex flex-col justify-center px-4 py-4 lg:py-8"
					>
						<div className="w-full flex flex-col justify-center items-center gap-y-2 lg:gap-y-4">
							<h1 className="text-2xl lg:text-4xl">Points Calculator</h1>
							<div className="flex flex-col gap-y-2 lg:gap-y-4 justify-center items-center">
								<HanFu han={han} fu={fu} onHanChange={setHan} onFuChange={setFu} />
								<div className="flex flex-row items-end gap-x-2">
									<span className="text-6xl text-amber-700 dark:text-amber-500">{hanFuScores.points.total}</span>
									<span className="text-2xl">Points</span>
								</div>
								<div className="text-2xl">
									Points to take:{' '}
									{hand.seatWind === '1' ? (
										hanFuScores.agari === 'tsumo' ? (
											<span>
												<span className="text-amber-700 dark:text-amber-500">{hanFuScores.points.oya.ko}</span> all
											</span>
										) : (
											<span className="text-amber-700 dark:text-amber-500">{hanFuScores.points.oya.ron}</span>
										)
									) : hanFuScores.agari === 'tsumo' ? (
										<>
											<span className="text-amber-700 dark:text-amber-500">{hanFuScores.points.ko.oya}</span>,{' '}
											<span className="text-amber-700 dark:text-amber-500">{hanFuScores.points.ko.ko}</span>
										</>
									) : (
										<span className="text-amber-700 dark:text-amber-500">{hanFuScores.points.ko.ron}</span>
									)}
								</div>
								{locState?.t === 'transfer' && (
									<button
										className={clsx(
											'border border-gray-800 rounded-xl shadow py-1 lg:p-2 disabled:bg-gray-300 dark:disabled:bg-gray-800 dark:disabled:text-gray-600',
											'w-full h-24 text-2xl',
											'bg-amber-500 hover:bg-amber-600 dark:bg-amber-700 dark:hover:bg-amber-800',
										)}
										onClick={() => {
											void transferScores(hanFuScores);
										}}
									>
										Quick Transfer
									</button>
								)}
							</div>
						</div>
					</div>
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
	children,
}: {
	t: Action['t'];
	currentAction: Action | null;
	onActionChange: (a: Action | null) => void;
	disabled?: boolean;
	children?: ReactNode;
}) {
	return (
		<Button
			onClick={() => onActionChange(currentAction?.t === t ? null : defaultAction(t))}
			active={currentAction?.t === t}
			disabled={disabled}
		>
			{children}
		</Button>
	);
}
