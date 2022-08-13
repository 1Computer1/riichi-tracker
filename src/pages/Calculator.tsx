import { ReactNode, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useImmer } from 'use-immer';
import BackButton from '../components/BackButton';
import Button from '../components/Button';
import Counter from '../components/Counter';
import JumpButton from '../components/JumpButton';
import Toggle from '../components/Toggle';
import ToggleOnOff from '../components/ToggleOnOff';
import ScoreResult from '../components/calculator/ScoreResult';
import Selected from '../components/calculator/Selected';
import SelectedDora from '../components/calculator/SelectedDora';
import { SuitRow, HonorRow } from '../components/calculator/TileRow';
import WindSelect from '../components/calculator/WindSelect';
import Left from '../components/icons/Left';
import HorizontalRow from '../components/layout/HorizontalRow';
import VerticalRow from '../components/layout/VerticalRow';
import { Action, defaultAction } from '../lib/action';
import { calculate, DefaultSettings, Hand, sortMelds, sortTiles, TileCode, Wind } from '../lib/hand';

export default function Calculator() {
	const location = useLocation();
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const gameValues: {
		agari: 'ron' | 'tsumo' | null;
		roundWind: Wind | null;
		seatWind: Wind | null;
	} | null = (location.state ?? null) as any;

	const initialHand: Hand = {
		tiles: [],
		melds: [],
		agariIndex: -1,
		agari: gameValues?.agari ?? 'tsumo',
		dora: [],
		uradora: [],
		nukidora: 0,
		riichi: null,
		blessing: false,
		lastTile: false,
		kan: false,
		roundWind: gameValues?.roundWind ?? '1',
		seatWind: gameValues?.seatWind ?? '1',
	};
	const [hand, updateHand] = useImmer<Hand>(initialHand);

	const [action, updateAction] = useImmer<Action | null>(null);

	const updateTiles = (t: TileCode) => {
		if (!action) {
			updateHand((h) => {
				h.tiles.push(t);
				sortTiles(h.tiles);
				const i = h.tiles.findIndex((t2) => t2 === t);
				h.agariIndex = i;
			});
			return;
		}

		switch (action.t) {
			case 'dora': {
				updateHand((h) => {
					if (t[0] === '0') {
						h.dora.push(`5${t[1]}` as TileCode);
					} else {
						h.dora.push(t);
					}
					updateAction(null);
				});
				break;
			}
			case 'uradora': {
				updateHand((h) => {
					if (t[0] === '0') {
						h.uradora.push(`5${t[1]}` as TileCode);
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
					});
					updateAction(null);
				}
				break;
			}
			case 'pon': {
				updateHand((h) => {
					const tx = t[0] === '0' ? (`5${t[1]}` as TileCode) : t;
					h.melds.push({ t: 'chiipon', tiles: [t, tx, tx] });
					sortMelds(h.melds);
				});
				updateAction(null);
				break;
			}
			case 'kan': {
				updateHand((h) => {
					const tx = t[0] === '0' ? (`5${t[1]}` as TileCode) : t;
					h.melds.push({ t: 'kan', closed: false, tiles: [t, tx, tx, tx] });
					sortMelds(h.melds);
				});
				updateAction(null);
				break;
			}
			case 'closedKan': {
				updateHand((h) => {
					const tx = t[0] === '0' ? (`5${t[1]}` as TileCode) : t;
					h.melds.push({ t: 'kan', closed: true, tiles: [t, tx, tx, tx] });
					sortMelds(h.melds);
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

	function ActionButton({ t, disabled, children }: { t: Action['t']; disabled?: boolean; children?: ReactNode }) {
		return (
			<Button
				onClick={() => updateAction(action?.t === t ? null : defaultAction(t))}
				active={action?.t === t}
				disabled={disabled}
			>
				{children}
			</Button>
		);
	}

	const [handBuilderEl, setHandBuilderEl] = useState<Element | null>(null);
	const [scoreResultEl, setScoreResultEl] = useState<Element | null>(null);
	const scoreResult = tileCount === 14 ? calculate(hand, { ...DefaultSettings, noYakuBase: 100 }) : null;

	return (
		<div className="min-h-screen bg-slate-200 dark:bg-gray-900 text-black dark:text-white">
			<div className="flex flex-row justify-center">
				<div className="w-full h-screen overflow-y-auto">
					<div className="fixed top-2 left-2 lg:top-4 lg:left-4">
						<BackButton>
							<Left />
						</BackButton>
					</div>
					<div className="fixed bottom-2 right-2 lg:bottom-4 lg:right-8 flex flex-col gap-y-2">
						<JumpButton element={handBuilderEl}>役</JumpButton>
						<JumpButton element={scoreResultEl} highlight={scoreResult?.agari != null}>
							点
						</JumpButton>
					</div>
					<div ref={setHandBuilderEl} className="flex flex-col justify-center items-center w-full gap-y-2 lg:gap-y-4">
						<div className="flex flex-col justify-center items-center w-full min-h-screen gap-y-2 lg:gap-y-4 px-2 py-2">
							<div className="flex flex-row gap-x-2 items-end">
								<h1 className="text-xl lg:text-4xl">Score Calculator</h1>
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
											if (h.agariIndex === i) {
												h.agariIndex = -1;
											} else if (h.agariIndex > i) {
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
								<ActionButton t="chii" disabled={hand.riichi != null || hand.blessing || tileCount + 3 > 14}>
									Chii
								</ActionButton>
								<ActionButton t="pon" disabled={hand.riichi != null || hand.blessing || tileCount + 3 > 14}>
									Pon
								</ActionButton>
								<ActionButton t="kan" disabled={hand.riichi != null || hand.blessing || tileCount + 3 > 14}>
									Kan
								</ActionButton>
								<ActionButton t="closedKan" disabled={hand.blessing || tileCount + 3 > 14}>
									Closed Kan
								</ActionButton>
							</HorizontalRow>
							<VerticalRow>
								<SuitRow
									suit="m"
									hand={hand}
									allTiles={allTiles}
									tileCount={tileCount}
									action={action}
									onClick={updateTiles}
								/>
								<SuitRow
									suit="p"
									hand={hand}
									allTiles={allTiles}
									tileCount={tileCount}
									action={action}
									onClick={updateTiles}
								/>
								<SuitRow
									suit="s"
									hand={hand}
									allTiles={allTiles}
									tileCount={tileCount}
									action={action}
									onClick={updateTiles}
								/>
								<HonorRow hand={hand} allTiles={allTiles} tileCount={tileCount} action={action} onClick={updateTiles} />
							</VerticalRow>
							<div className="w-full overflow-x-auto mb-1">
								<div className="flex flex-row gap-x-8 justify-center items-center min-w-min">
									<div className="flex flex-col justify-center items-center gap-y-1">
										<span className="text-xl">Round</span>
										<WindSelect
											forced={gameValues?.roundWind != null}
											value={hand.roundWind}
											redEast
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
											forced={gameValues?.seatWind != null}
											value={hand.seatWind}
											redEast
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
									forced={gameValues?.agari != null}
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
									disabled={hand.melds.filter((m) => m.t === 'kan' && !m.closed).length > 0}
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
									disabled={hand.melds.filter((m) => m.t === 'kan' && !m.closed).length > 0}
									incompatible={hand.riichi == null}
									onToggle={(b) => {
										updateAction(null);
										updateHand((h) => {
											if (b && h.riichi == null) {
												h.riichi = { double: true, ippatsu: false };
											}
											h.riichi!.double = b;
										});
									}}
								>
									Double Riichi
								</ToggleOnOff>
								<ToggleOnOff
									toggled={hand.riichi?.ippatsu ?? false}
									disabled={hand.melds.filter((m) => m.t === 'kan' && !m.closed).length > 0}
									incompatible={
										hand.riichi == null ||
										(hand.agari === 'tsumo' && hand.kan) ||
										(hand.agari === 'ron' && hand.lastTile)
									}
									onToggle={(b) => {
										updateAction(null);
										updateHand((h) => {
											if (b && h.riichi == null) {
												h.riichi = { double: false, ippatsu: true };
											}
											h.riichi!.ippatsu = b;
											// If ippatsu, cannot be after a kan or under the river.
											if (b) {
												if (h.agari === 'tsumo') {
													h.kan = false;
												}
												if (h.agari === 'ron') {
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
										(hand.agari === 'ron' && hand.melds.filter((m) => m.t === 'kan').length === 4)
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
									incompatible={hand.blessing || (hand.agari === 'ron' && hand.riichi?.ippatsu) || hand.kan}
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
											}
										});
									}}
								>
									{hand.agari === 'tsumo' ? 'Under the Sea' : 'Under the River'}
								</ToggleOnOff>
								<ToggleOnOff
									toggled={hand.blessing}
									disabled={hand.agari === 'ron' || hand.melds.length > 0}
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
								<ActionButton t="dora" disabled={hand.dora.length >= 5}>
									Add Dora
								</ActionButton>
								<ActionButton t="uradora" disabled={hand.riichi == null || hand.uradora.length >= 5}>
									Add Uradora
								</ActionButton>
								<Counter
									canDecrement={hand.nukidora > 0}
									onDecrement={() => {
										updateAction(null);
										updateHand((h) => {
											h.nukidora--;
										});
									}}
									onIncrement={() => {
										updateAction(null);
										updateHand((h) => {
											h.nukidora++;
										});
									}}
								>
									Nuki ({hand.nukidora})
								</Counter>
							</HorizontalRow>
						</div>
						<div
							ref={setScoreResultEl}
							className="w-full min-h-screen flex flex-col justify-center px-4 py-4 lg:py-8 bg-slate-300 dark:bg-sky-900"
						>
							<ScoreResult tileCount={tileCount} result={scoreResult} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
