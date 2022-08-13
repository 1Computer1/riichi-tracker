import Dexie, { Table } from 'dexie';
import { useLiveQuery } from 'dexie-react-hooks';
import { Wind } from '../../lib/hand';
import { Game, IRepository, none, Option, some } from '../interfaces';

interface Game_ {
	id: string;
	roundWind: string;
	round: number;
	bottomWind: string;
	scores: number[];
}

class Db extends Dexie {
	public games!: Table<Game_>;
}

const db = new Db('riichi-tracker');
db.version(1).stores({
	games: '++id',
});

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
			bottomWind: game.bottomWind as Wind,
			scores: game.scores,
		});
	},
	useGame(id): Option<Game> | null {
		const games = useLiveQuery(() => db.games.where('id').equals(id).toArray(), [id]);
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
				bottomWind: game.bottomWind as Wind,
				scores: game.scores,
			},
		};
	},
	async setGame(id: string, game: Game): Promise<void> {
		await db.games.put({
			id,
			roundWind: game.roundWind,
			round: game.round,
			bottomWind: game.bottomWind,
			scores: game.scores,
		});
	},
};
