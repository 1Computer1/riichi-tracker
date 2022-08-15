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

	const { bottomWind, roundWind } = game;
	const seatWind = nextWind(bottomWind, winner);

	const [agari, setAgari] = useState<{ t: 'tsumo' } | { t: 'ron'; dealIn: number }>({ t: 'tsumo' });
	const [handleRotation, setHandleRotation] = useState(seatWind !== '1');
	const [dealerRepeat, setDealerRepeat] = useState(seatWind === '1');
	const [scoreRiichiSticks, setScoreRiichiSticks] = useState(true);
	const [scoreRepeatSticks, setScoreRepeatSticks] = useState(true);

	const submitWinner = () => {
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
			...(agari.t === 'tsumo' ? { agari: 'tsumo' } : { agari: 'ron', dealtInPlayer: agari.dealIn }),
		};
		navigate('/calculator', { state, replace: true });
	};

	return (
		<CustomDialog onClose={onClose}>
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
						toggled={agari.t === 'ron'}
						onToggle={(b) => {
							setAgari(b ? { t: 'ron', dealIn: [0, 1, 2, 3].filter((i) => i !== winner)[0] } : { t: 'tsumo' });
						}}
						left="Tsumo"
						right="Ron"
					/>
					{agari.t === 'ron' && (
						<>
							<p className="text-xl lg:text-2xl">Dealt-In Player</p>
							<HorizontalRow>
								{[0, 1, 2, 3]
									.filter((i) => i !== winner)
									.map((i) => (
										<TileButton
											key={i}
											tile={`${nextWind(bottomWind, i)}z` as TileCode}
											dora={i === agari.dealIn}
											onClick={() => setAgari({ t: 'ron', dealIn: i })}
										/>
									))}
							</HorizontalRow>
						</>
					)}
					<ToggleOnOff toggled={scoreRiichiSticks} onToggle={(b) => setScoreRiichiSticks(b)}>
						Score Riichi Sticks
					</ToggleOnOff>
					{seatWind === '1' ? (
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
