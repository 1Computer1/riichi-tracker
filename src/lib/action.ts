import { TileCode } from './hand';

export type Action =
	| {
			t: 'chii';
			tiles: TileCode[];
	  }
	| { t: 'pon' }
	| { t: 'kan' }
	| { t: 'closedKan' }
	| { t: 'dora' }
	| { t: 'uradora' };

export function defaultAction(t: Action['t']): Action & { t: typeof t } {
	switch (t) {
		case 'chii':
			return { t, tiles: [] };
		default:
			return { t };
	}
}
