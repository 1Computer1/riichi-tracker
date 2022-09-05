import clsx from 'clsx';
import { useTheme } from '../hooks/useTheme';
import { TileCode } from '../lib/hand';

export function svgForTile(tile: TileCode): readonly [string, string] {
	const t = (name: string) => [`/tiles/light/${name}.svg`, `/tiles/dark/${name}.svg`] as const;
	switch (tile) {
		case '1z':
			return t('Ton');
		case '2z':
			return t('Nan');
		case '3z':
			return t('Shaa');
		case '4z':
			return t('Pei');
		case '5z':
			return t('Haku');
		case '6z':
			return t('Hatsu');
		case '7z':
			return t('Chun');
		default: {
			const suit = tile[1] === 'm' ? 'Man' : tile[1] === 'p' ? 'Pin' : 'Sou';
			const num = tile[0] === '0' ? '5-Dora' : tile[0];
			return t(suit + num);
		}
	}
}

export default function Tile({ tile }: { tile: TileCode | '00' }) {
	const theme = useTheme();
	if (tile === '00') {
		return (
			<img
				src={svgForTile('5z')[theme === 'dark' ? 1 : 0]}
				className={clsx('h-16 w-12 min-w-[3rem] lg:h-20 lg:w-[60px] lg:min-w-[60px] p-2 rounded-xl')}
			></img>
		);
	}
	const file = svgForTile(tile)[theme === 'dark' ? 1 : 0];
	return (
		<img src={file} className={clsx('h-16 w-12 min-w-[3rem] lg:h-20 lg:w-[60px] lg:min-w-[60px] p-2 rounded-xl')}></img>
	);
}

export function Placeholder() {
	return (
		<div className="h-16 w-12 min-w-[3rem] lg:h-20 lg:w-[60px] lg:min-w-[60px] p-2 rounded-xl border-2 border-black dark:border-white border-dashed"></div>
	);
}
