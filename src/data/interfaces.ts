import { ScoreSettings, Wind } from '../lib/hand';

export type RepositoryProvider = () => IRepository;

export interface IRepository {
	getGame: (id: string) => Promise<Option<Game>>;
	setGame: (id: string, game: Game) => Promise<void>;
	useGame: (id: string, options?: { enabled: boolean }) => Option<Game> | null;
}

export type Option<T> = { ok: true; value: T } | { ok: false; value: null };

export function some<T>(t: T): Option<T> {
	return { ok: true, value: t };
}

export function none<T>(): Option<T> {
	return { ok: false, value: null };
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
