import Dexie, { Table } from 'dexie';
import { useLiveQuery } from 'dexie-react-hooks';
import { Wind } from '../../lib/hand';
import { Game, IRepository, none, Option, some } from '../interfaces';

interface Game_ {
	id: string;
	roundWind: string;
	round: number;
	repeats: number;
	bottomWind: string;
	scores: number[];
	riichiSticks: number;
	riichi: boolean[];
}

class Db extends Dexie {
	public games!: Table<Game_>;
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

export const repository: IRepository = {
	async getGame(id): Promise<Option<Game>> {
		const games = await db.games.where('id').equals(id).toArray();
		if (!games.length) {
			return none();
		}
		const [game] = games;
		return some({
			roundWind: game.roundWind as Wind,
			round: game.round,
			repeats: game.repeats,
			bottomWind: game.bottomWind as Wind,
			scores: game.scores,
			riichiSticks: game.riichiSticks,
			riichi: game.riichi,
		});
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
		return {
			ok: true,
			value: {
				roundWind: game.roundWind as Wind,
				round: game.round,
				repeats: game.repeats,
				bottomWind: game.bottomWind as Wind,
				scores: game.scores,
				riichiSticks: game.riichiSticks,
				riichi: game.riichi,
			},
		};
	},
	async setGame(id: string, game: Game): Promise<void> {
		await db.games.put({
			id,
			roundWind: game.roundWind,
			round: game.round,
			repeats: game.repeats,
			bottomWind: game.bottomWind,
			scores: game.scores,
			riichiSticks: game.riichiSticks,
			riichi: game.riichi,
		});
	},
};
