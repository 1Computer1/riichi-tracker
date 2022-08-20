import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Game } from '../../data/interfaces';
import { nextWind, TileCode } from '../../lib/hand';
import { CalculatorState } from '../../lib/states';
import Button from '../Button';
import Toggle from '../Toggle';
import ToggleOnOff from '../ToggleOnOff';
import TileButton from '../calculator/TileButton';
import CustomDialog from '../layout/CustomDialog';
import HorizontalRow from '../layout/HorizontalRow';

export function WinnerDialog({
	winner,
	gameId,
	game,
	onClose,
}: {
	winner: number;
	gameId: string;
	game: Game;
	onClose: () => void;
}) {
	const navigate = useNavigate();

	const { bottomWind, roundWind, settings } = game;
	const isSanma = settings.sanma != null;
	const seatWind = nextWind(bottomWind, winner, isSanma);

	const [agari, setAgari] = useState<{ t: 'tsumo' } | { t: 'ron'; dealIn: number }>({ t: 'tsumo' });
	const [handleRotation, setHandleRotation] = useState(seatWind !== '1');
	const [dealerRepeat, setDealerRepeat] = useState(seatWind === '1');
	const [scoreRiichiSticks, setScoreRiichiSticks] = useState(true);
	const [scoreRepeatSticks, setScoreRepeatSticks] = useState(true);
	const [isPao, setIsPao] = useState(false);
	const [paoPlayer, setPaoPlayer] = useState<number | null>(null);

	const submitWinner = () => {
		const state: CalculatorState = {
			t: 'transfer',
			id: gameId,
			roundWind,
			seatWind,
			winner,
			handleRotation,
			dealerRepeat,
			scoreRiichiSticks,
			scoreRepeatSticks,
			pao: isPao ? paoPlayer : null,
			...(agari.t === 'tsumo' ? { agari: 'tsumo' } : { agari: 'ron', dealtInPlayer: agari.dealIn }),
		};
		navigate('/calculator', { state, replace: true });
	};

	return (
		<CustomDialog onClose={onClose} title="Transfer Points">
			<div className="flex flex-col justify-center items-center gap-y-8">
				<form
					className="flex flex-col justify-center items-center gap-y-2"
					onSubmit={(e) => {
						e.preventDefault();
						submitWinner();
					}}
				>
					<p className="text-xl lg:text-2xl">Point Distribution</p>
					<Toggle
						toggled={agari.t === 'ron'}
						onToggle={(b) => {
							setAgari(
								b
									? { t: 'ron', dealIn: (isSanma ? [0, 1, 2] : [0, 1, 2, 3]).filter((i) => i !== winner)[0] }
									: { t: 'tsumo' },
							);
						}}
						left="Tsumo"
						right="Ron"
					/>
					{agari.t === 'ron' && (
						<>
							<p className="text-xl lg:text-2xl">Dealt-In Player</p>
							<HorizontalRow>
								{(isSanma ? [0, 1, 2] : [0, 1, 2, 3])
									.filter((i) => i !== winner)
									.map((i) => (
										<TileButton
											key={i}
											tile={`${nextWind(bottomWind, i, isSanma)}z` as TileCode}
											dora={i === agari.dealIn}
											onClick={() => {
												setAgari({ t: 'ron', dealIn: i });
												if (paoPlayer === i) {
													setPaoPlayer((isSanma ? [0, 1, 2] : [0, 1, 2, 3]).filter((j) => j !== winner && j !== i)[0]);
												}
											}}
										/>
									))}
							</HorizontalRow>
						</>
					)}
					<ToggleOnOff toggled={scoreRiichiSticks} onToggle={(b) => setScoreRiichiSticks(b)}>
						Score Riichi Sticks
					</ToggleOnOff>
					{seatWind !== '1' && (
						<ToggleOnOff toggled={scoreRepeatSticks} onToggle={(b) => setScoreRepeatSticks(b)}>
							Score Repeat Sticks
						</ToggleOnOff>
					)}
					{settings.usePao && (
						<>
							<ToggleOnOff
								toggled={isPao}
								onToggle={(b) => {
									setIsPao(b);
									if (b) {
										setPaoPlayer(
											(isSanma ? [0, 1, 2] : [0, 1, 2, 3]).filter(
												(i) => i !== winner && (agari.t === 'ron' ? i !== agari.dealIn : true),
											)[0],
										);
									} else {
										setPaoPlayer(null);
									}
								}}
							>
								Pao
							</ToggleOnOff>
							{isPao && (
								<>
									<p className="text-xl lg:text-2xl">Responsible Player</p>
									<HorizontalRow>
										{(isSanma ? [0, 1, 2] : [0, 1, 2, 3])
											.filter((i) => i !== winner && (agari.t === 'ron' ? i !== agari.dealIn : true))
											.map((i) => (
												<TileButton
													key={i}
													tile={`${nextWind(bottomWind, i, isSanma)}z` as TileCode}
													dora={i === paoPlayer}
													onClick={() => setPaoPlayer(i)}
												/>
											))}
									</HorizontalRow>
								</>
							)}
						</>
					)}
					<p className="text-xl lg:text-2xl">Seat Rotation</p>
					{seatWind === '1' && (
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
					)}
					<ToggleOnOff
						toggled={handleRotation}
						incompatible={seatWind === '1' && dealerRepeat}
						onToggle={(b) => {
							setHandleRotation(b);
							if (b) {
								if (seatWind === '1') {
									setDealerRepeat(false);
								}
							}
						}}
					>
						Rotate Seats
					</ToggleOnOff>
				</form>
				<Button
					onClick={() => {
						void submitWinner();
					}}
				>
					Calculate Hand
				</Button>
			</div>
		</CustomDialog>
	);
}
