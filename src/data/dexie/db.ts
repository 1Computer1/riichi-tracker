import Dexie, { Table } from 'dexie';
import { useLiveQuery } from 'dexie-react-hooks';
import { none, Option, some } from '../../lib/option';
import { DefaultSettings, ScoreSettings } from '../../lib/settings';
import { Game, IRepository } from '../interfaces';

type Game_ = Game & {
	id: string;
};

function toGame(game: Game_): Game {
	return {
		roundWind: game.roundWind,
		round: game.round,
		repeats: game.repeats,
		bottomWind: game.bottomWind,
		scores: game.scores,
		riichiSticks: game.riichiSticks,
		riichi: game.riichi,
		settings: game.settings,
	};
}

function fromGame(id: string, game: Game): Game_ {
	return {
		id,
		roundWind: game.roundWind,
		round: game.round,
		repeats: game.repeats,
		bottomWind: game.bottomWind,
		scores: game.scores,
		riichiSticks: game.riichiSticks,
		riichi: game.riichi,
		settings: game.settings,
	};
}

type ScoreSettings_ = ScoreSettings & { id: string };

function toSettings(settings: ScoreSettings_): ScoreSettings {
	return {
		noYakuFu: settings.noYakuFu,
		noYakuDora: settings.noYakuDora,
		openTanyao: settings.openTanyao,
		ryuuiisouHatsu: settings.ryuuiisouHatsu,
		multiYakuman: settings.multiYakuman,
		doubleYakuman: settings.doubleYakuman,
		kiriageMangan: settings.kiriageMangan,
		kazoeYakuman: settings.kazoeYakuman,
		doubleWindFu: settings.doubleWindFu,
		rinshanFu: settings.rinshanFu,
		sanma: settings.sanma,
		northYakuhai: settings.northYakuhai,
		akadora: settings.akadora,
		usePao: settings.usePao,
		otherScoring: settings.otherScoring,
		disabledYaku: settings.disabledYaku,
		enabledLocalYaku: settings.enabledLocalYaku,
	};
}

function fromSettings(id: string, settings: ScoreSettings): ScoreSettings_ {
	return {
		id,
		noYakuFu: settings.noYakuFu,
		noYakuDora: settings.noYakuDora,
		openTanyao: settings.openTanyao,
		ryuuiisouHatsu: settings.ryuuiisouHatsu,
		multiYakuman: settings.multiYakuman,
		doubleYakuman: settings.doubleYakuman,
		kiriageMangan: settings.kiriageMangan,
		kazoeYakuman: settings.kazoeYakuman,
		doubleWindFu: settings.doubleWindFu,
		rinshanFu: settings.rinshanFu,
		sanma: settings.sanma,
		northYakuhai: settings.northYakuhai,
		akadora: settings.akadora,
		usePao: settings.usePao,
		otherScoring: settings.otherScoring,
		disabledYaku: settings.disabledYaku,
		enabledLocalYaku: settings.enabledLocalYaku,
	};
}

class Db extends Dexie {
	public games!: Table<Game_>;
	public settings!: Table<ScoreSettings_>;
}

const db = new Db('riichi-tracker');

db.version(1).stores({
	games: '++id', // id, roundWind, round, bottomWind, scores
});

db.version(2)
	.stores({
		games: '++id', // id, roundWind, round, repeats, bottomWind, scores, riichiSticks, riichi
	})
	.upgrade((tx) =>
		tx
			.table('games')
			.toCollection()
			.modify((old) => {
				/* eslint-disable @typescript-eslint/no-unsafe-member-access */
				old.riichiSticks = 0;
				old.riichi = [false, false, false, false];
				old.repeats = 0;
				/* eslint-enable @typescript-eslint/no-unsafe-member-access */
			}),
	);

// From here onwards, database updates may include settings changes.
// Only use this if new fields were added. If old fields were changed, we need to be more specific.
function updateSettings(old: any) {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
	old.settings = { ...DefaultSettings, ...(old.settings ?? {}) };
}

db.version(3)
	.stores({
		games: '++id', // id, roundWind, round, repeats, bottomWind, scores, riichiSticks, riichi, settings
	})
	.upgrade((tx) =>
		tx
			.table('games')
			.toCollection()
			.modify((old) => {
				updateSettings(old);
			}),
	);

db.version(4)
	.stores({
		games: '++id', // id, roundWind, round, repeats, bottomWind, scores, riichiSticks, riichi, settings(..., disabledYaku, enabledLocaledYaku)
		settings: '++id', // id, ...settings
	})
	.upgrade((tx) =>
		tx
			.table('games')
			.toCollection()
			.modify((old) => {
				updateSettings(old);
			}),
	);

db.version(5)
	.stores({
		games: '++id', // id, roundWind, round, repeats, bottomWind, scores, riichiSticks, riichi, settings(..., northYakuhai)
		settings: '++id', // id, ...settings(..., northYakuhai)
	})
	.upgrade(async (tx) => {
		await tx
			.table('games')
			.toCollection()
			.modify((old) => {
				updateSettings(old);
			});
		await tx
			.table('settings')
			.toCollection()
			.modify((old) => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				old.northYakuhai = false;
			});
	});

export const repository: IRepository = {
	async getGame(id): Promise<Option<Game>> {
		const games = await db.games.where('id').equals(id).toArray();
		if (!games.length) {
			return none();
		}
		const [game] = games;
		return some(toGame(game));
	},
	useGame(id, options = { enabled: true }): Option<Game> | null {
		const games = useLiveQuery<Game_[] | null>(
			() => (options.enabled ? db.games.where('id').equals(id).toArray() : null),
			[id],
		);
		if (games == null) {
			return null;
		}
		if (!games.length) {
			return none();
		}
		const [game] = games;
		return some(toGame(game));
	},
	async setGame(id: string, game: Game): Promise<void> {
		await db.games.put(fromGame(id, game));
	},
	async getSettings(id: string): Promise<Option<ScoreSettings>> {
		const settings = await db.settings.where('id').equals(id).toArray();
		if (!settings.length) {
			return none();
		}
		const [s] = settings;
		return some(toSettings(s));
	},
	async setSettings(id: string, settings: ScoreSettings): Promise<void> {
		await db.settings.put(fromSettings(id, settings));
	},
	useSettings(id: string, options = { enabled: true }): Option<ScoreSettings> | null {
		const settings = useLiveQuery<ScoreSettings_[] | null>(() =>
			options.enabled ? db.settings.where('id').equals(id).toArray() : null,
		);
		if (settings == null) {
			return null;
		}
		if (!settings.length) {
			return none();
		}
		const [s] = settings;
		return some(toSettings(s));
	},
};
