import { useState } from 'react';
import { useImmer } from 'use-immer';
import { Game } from '../../data/interfaces';
import { nextWind, TileCode } from '../../lib/hand';
import { replicate } from '../../lib/util';
import { useDb } from '../../providers/DbProvider';
import Button from '../Button';
import ToggleOnOff from '../ToggleOnOff';
import ToggleThree from '../ToggleThree';
import TileButton from '../calculator/TileButton';
import CustomDialog from '../layout/CustomDialog';
import HorizontalRow from '../layout/HorizontalRow';
import H from '../text/H';

export function DrawDialog({
	gameId,
	game,
	onClose,
	onScoreUpdate,
}: {
	gameId: string;
	game: Game;
	onClose: () => void;
	onScoreUpdate: (oldScores: number[]) => void;
}) {
	const db = useDb();

	const { bottomWind, roundWind, round, repeats, settings } = game;
	const isSanma = settings.sanma != null;
	const roundCap = isSanma ? 3 : 4;
	const playerIxes = isSanma ? [0, 1, 2] : [0, 1, 2, 3];

	// exhaustive, abortive, chombo
	const [drawType, setDrawType] = useState<0 | 1 | 2>(0);
	const [tenpaiPlayers, updateTenpaiPlayers] = useImmer(new Set<number>(game.riichi.flatMap((x, i) => (x ? [i] : []))));
	const [drawRepeat, setDrawRepeat] = useState(
		playerIxes.some((i) => tenpaiPlayers.has(i) && nextWind(bottomWind, i, isSanma) === '1'),
	);
	const [violationPlayer, setViolationPlayer] = useState<number>(0);

	const submitDraw = async () => {
		if (drawType === 0) {
			const scores_ = game.scores.slice();
			const win = (isSanma ? [0, 2000, 1000, 0] : [0, 3000, 1500, 1000, 0])[tenpaiPlayers.size];
			const lose = (isSanma ? [0, 1000, 2000, 0] : [0, 1000, 1500, 3000, 0])[tenpaiPlayers.size];
			for (const i of isSanma ? [0, 1, 2] : [0, 1, 2, 3]) {
				if (tenpaiPlayers.has(i)) {
					scores_[i] += win;
				} else {
					scores_[i] -= lose;
				}
			}
			const repeat =
				drawRepeat && playerIxes.some((i) => tenpaiPlayers.has(i) && nextWind(bottomWind, i, isSanma) === '1');
			await db.setGame(gameId, {
				...game,
				bottomWind: repeat ? bottomWind : nextWind(bottomWind, -1, isSanma),
				roundWind: repeat ? roundWind : round === roundCap ? nextWind(roundWind, 1, isSanma) : roundWind,
				round: repeat ? round : round === roundCap ? 1 : round + 1,
				repeats: repeats + 1,
				scores: scores_,
				riichi: replicate(false, isSanma ? 3 : 4),
			});
			onScoreUpdate(game.scores);
		} else if (drawType === 1) {
			await db.setGame(gameId, {
				...game,
				repeats: game.repeats + 1,
				riichi: replicate(false, isSanma ? 3 : 4),
			});
		} else {
			const scores_ = game.scores.slice();
			const winDealer = isSanma && settings.sanma === 'bisection' ? 6000 : 4000;
			const winNonDealer = isSanma && settings.sanma === 'bisection' ? 3000 : 2000;
			const loseDealer = isSanma && settings.sanma === 'bisection' ? 12000 : 8000;
			const loseNonDealer = isSanma && settings.sanma === 'bisection' ? 8000 : 6000;
			for (const i of isSanma ? [0, 1, 2] : [0, 1, 2, 3]) {
				const isOya = nextWind(bottomWind, i, isSanma) === '1';
				if (i === violationPlayer) {
					scores_[i] -= isOya ? loseDealer : loseNonDealer;
				} else {
					scores_[i] += isOya ? winDealer : winNonDealer;
				}
				if (game.riichi[i]) {
					scores_[i] += 1000;
				}
			}
			await db.setGame(gameId, {
				...game,
				scores: scores_,
				riichi: replicate(false, isSanma ? 3 : 4),
				riichiSticks: game.riichiSticks - game.riichi.filter((x) => x).length,
			});
			onScoreUpdate(game.scores);
		}
		onClose();
	};

	return (
		<CustomDialog onClose={onClose} title="Handle Draws">
			<div className="flex flex-col justify-center items-center gap-y-8">
				<form
					className="flex flex-col justify-center items-center gap-y-2"
					onSubmit={(e) => {
						e.preventDefault();
						void submitDraw();
					}}
				>
					<p className="text-xl lg:text-2xl">Draw Type</p>
					<ToggleThree
						left="Exhaust"
						middle="Abort"
						right="Chombo"
						toggled={drawType}
						onToggle={(b) => setDrawType(b)}
					/>
					{drawType === 0 && (
						<>
							<p className="text-xl lg:text-2xl">Ready Players</p>
							<HorizontalRow>
								{playerIxes.map((i) => (
									<TileButton
										key={i}
										tile={`${nextWind(bottomWind, i, isSanma)}z` as TileCode}
										dora={tenpaiPlayers.has(i)}
										forced={game.riichi[i]}
										onClick={() => {
											if (nextWind(bottomWind, i, isSanma) === '1') {
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
					{drawType === 2 && (
						<>
							<p className="text-xl lg:text-2xl">Player in Violation</p>
							<HorizontalRow>
								{playerIxes.map((i) => (
									<TileButton
										key={i}
										tile={`${nextWind(bottomWind, i, isSanma)}z` as TileCode}
										dora={violationPlayer === i}
										forced={game.riichi[i]}
										onClick={() => {
											setViolationPlayer(i);
										}}
									/>
								))}
							</HorizontalRow>
							<ul className="text-base lg:text-xl">
								<li>
									Pays out a <H>reverse mangan</H>.
								</li>
								<li>Redoes the round from the start.</li>
							</ul>
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
