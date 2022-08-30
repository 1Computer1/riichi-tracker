import { Wind } from '../lib/hand';
import { Option } from '../lib/option';
import { ScoreSettings } from '../lib/settings';

export type RepositoryProvider = () => IRepository;

export interface IRepository {
	getGame: (id: string) => Promise<Option<Game>>;
	setGame: (id: string, game: Game) => Promise<void>;
	useGame: (id: string, options?: { enabled: boolean }) => Option<Game> | null;

	getSettings: (id: string) => Promise<Option<ScoreSettings>>;
	setSettings: (id: string, settings: ScoreSettings) => Promise<void>;
	useSettings: (id: string, options?: { enabled: boolean }) => Option<ScoreSettings> | null;
}

export interface Game {
	bottomWind: Wind;
	round: number;
	roundWind: Wind;
	repeats: number;
	scores: number[];
	riichiSticks: number;
	riichi: boolean[];
	settings: ScoreSettings;
}
