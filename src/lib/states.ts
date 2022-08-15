import { Wind } from './hand';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type CompassState = { t: 'load'; id: string };

export type CalculatorState = {
	t: 'transfer';
	id: string;
	roundWind: Wind;
	seatWind: Wind;
	winner: number;
	handleRotation: boolean;
	dealerRepeat: boolean;
	scoreRiichiSticks: boolean;
	scoreRepeatSticks: boolean;
} & ({ agari: 'tsumo' } | { agari: 'ron'; dealtInPlayer: number });
