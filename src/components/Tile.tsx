import clsx from 'clsx';
import { useTheme } from '../hooks/useTheme';
import { TileCode } from '../lib/hand';

/* eslint-disable import/order */
import { ReactComponent as Man1 } from '../assets/tiles/light/Man1.svg';
import { ReactComponent as Man2 } from '../assets/tiles/light/Man2.svg';
import { ReactComponent as Man3 } from '../assets/tiles/light/Man3.svg';
import { ReactComponent as Man4 } from '../assets/tiles/light/Man4.svg';
import { ReactComponent as Man5Dora } from '../assets/tiles/light/Man5-Dora.svg';
import { ReactComponent as Man5 } from '../assets/tiles/light/Man5.svg';
import { ReactComponent as Man6 } from '../assets/tiles/light/Man6.svg';
import { ReactComponent as Man7 } from '../assets/tiles/light/Man7.svg';
import { ReactComponent as Man8 } from '../assets/tiles/light/Man8.svg';
import { ReactComponent as Man9 } from '../assets/tiles/light/Man9.svg';

import { ReactComponent as Pin1 } from '../assets/tiles/light/Pin1.svg';
import { ReactComponent as Pin2 } from '../assets/tiles/light/Pin2.svg';
import { ReactComponent as Pin3 } from '../assets/tiles/light/Pin3.svg';
import { ReactComponent as Pin4 } from '../assets/tiles/light/Pin4.svg';
import { ReactComponent as Pin5Dora } from '../assets/tiles/light/Pin5-Dora.svg';
import { ReactComponent as Pin5 } from '../assets/tiles/light/Pin5.svg';
import { ReactComponent as Pin6 } from '../assets/tiles/light/Pin6.svg';
import { ReactComponent as Pin7 } from '../assets/tiles/light/Pin7.svg';
import { ReactComponent as Pin8 } from '../assets/tiles/light/Pin8.svg';
import { ReactComponent as Pin9 } from '../assets/tiles/light/Pin9.svg';

import { ReactComponent as Sou1 } from '../assets/tiles/light/Sou1.svg';
import { ReactComponent as Sou2 } from '../assets/tiles/light/Sou2.svg';
import { ReactComponent as Sou3 } from '../assets/tiles/light/Sou3.svg';
import { ReactComponent as Sou4 } from '../assets/tiles/light/Sou4.svg';
import { ReactComponent as Sou5Dora } from '../assets/tiles/light/Sou5-Dora.svg';
import { ReactComponent as Sou5 } from '../assets/tiles/light/Sou5.svg';
import { ReactComponent as Sou6 } from '../assets/tiles/light/Sou6.svg';
import { ReactComponent as Sou7 } from '../assets/tiles/light/Sou7.svg';
import { ReactComponent as Sou8 } from '../assets/tiles/light/Sou8.svg';
import { ReactComponent as Sou9 } from '../assets/tiles/light/Sou9.svg';

import { ReactComponent as Honor1 } from '../assets/tiles/light/Ton.svg';
import { ReactComponent as Honor2 } from '../assets/tiles/light/Nan.svg';
import { ReactComponent as Honor3 } from '../assets/tiles/light/Shaa.svg';
import { ReactComponent as Honor4 } from '../assets/tiles/light/Pei.svg';
import { ReactComponent as Honor5 } from '../assets/tiles/light/Haku.svg';
import { ReactComponent as Honor6 } from '../assets/tiles/light/Hatsu.svg';
import { ReactComponent as Honor7 } from '../assets/tiles/light/Chun.svg';
/* eslint-enable import/order */

/* eslint-disable import/order */
import { ReactComponent as DarkMan1 } from '../assets/tiles/dark/Man1.svg';
import { ReactComponent as DarkMan2 } from '../assets/tiles/dark/Man2.svg';
import { ReactComponent as DarkMan3 } from '../assets/tiles/dark/Man3.svg';
import { ReactComponent as DarkMan4 } from '../assets/tiles/dark/Man4.svg';
import { ReactComponent as DarkMan5Dora } from '../assets/tiles/dark/Man5-Dora.svg';
import { ReactComponent as DarkMan5 } from '../assets/tiles/dark/Man5.svg';
import { ReactComponent as DarkMan6 } from '../assets/tiles/dark/Man6.svg';
import { ReactComponent as DarkMan7 } from '../assets/tiles/dark/Man7.svg';
import { ReactComponent as DarkMan8 } from '../assets/tiles/dark/Man8.svg';
import { ReactComponent as DarkMan9 } from '../assets/tiles/dark/Man9.svg';

import { ReactComponent as DarkPin1 } from '../assets/tiles/dark/Pin1.svg';
import { ReactComponent as DarkPin2 } from '../assets/tiles/dark/Pin2.svg';
import { ReactComponent as DarkPin3 } from '../assets/tiles/dark/Pin3.svg';
import { ReactComponent as DarkPin4 } from '../assets/tiles/dark/Pin4.svg';
import { ReactComponent as DarkPin5Dora } from '../assets/tiles/dark/Pin5-Dora.svg';
import { ReactComponent as DarkPin5 } from '../assets/tiles/dark/Pin5.svg';
import { ReactComponent as DarkPin6 } from '../assets/tiles/dark/Pin6.svg';
import { ReactComponent as DarkPin7 } from '../assets/tiles/dark/Pin7.svg';
import { ReactComponent as DarkPin8 } from '../assets/tiles/dark/Pin8.svg';
import { ReactComponent as DarkPin9 } from '../assets/tiles/dark/Pin9.svg';

import { ReactComponent as DarkSou1 } from '../assets/tiles/dark/Sou1.svg';
import { ReactComponent as DarkSou2 } from '../assets/tiles/dark/Sou2.svg';
import { ReactComponent as DarkSou3 } from '../assets/tiles/dark/Sou3.svg';
import { ReactComponent as DarkSou4 } from '../assets/tiles/dark/Sou4.svg';
import { ReactComponent as DarkSou5Dora } from '../assets/tiles/dark/Sou5-Dora.svg';
import { ReactComponent as DarkSou5 } from '../assets/tiles/dark/Sou5.svg';
import { ReactComponent as DarkSou6 } from '../assets/tiles/dark/Sou6.svg';
import { ReactComponent as DarkSou7 } from '../assets/tiles/dark/Sou7.svg';
import { ReactComponent as DarkSou8 } from '../assets/tiles/dark/Sou8.svg';
import { ReactComponent as DarkSou9 } from '../assets/tiles/dark/Sou9.svg';

import { ReactComponent as DarkHonor1 } from '../assets/tiles/dark/Ton.svg';
import { ReactComponent as DarkHonor2 } from '../assets/tiles/dark/Nan.svg';
import { ReactComponent as DarkHonor3 } from '../assets/tiles/dark/Shaa.svg';
import { ReactComponent as DarkHonor4 } from '../assets/tiles/dark/Pei.svg';
import { ReactComponent as DarkHonor5 } from '../assets/tiles/dark/Haku.svg';
import { ReactComponent as DarkHonor6 } from '../assets/tiles/dark/Hatsu.svg';
import { ReactComponent as DarkHonor7 } from '../assets/tiles/dark/Chun.svg';
/* eslint-enable import/order */

type SVG = React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;

export function svgForTile(tile: TileCode): readonly [SVG, SVG] {
	return (
		{
			'1m': [Man1, DarkMan1],
			'2m': [Man2, DarkMan2],
			'3m': [Man3, DarkMan3],
			'4m': [Man4, DarkMan4],
			'5m': [Man5, DarkMan5],
			'6m': [Man6, DarkMan6],
			'7m': [Man7, DarkMan7],
			'8m': [Man8, DarkMan8],
			'9m': [Man9, DarkMan9],
			'0m': [Man5Dora, DarkMan5Dora],
			'1p': [Pin1, DarkPin1],
			'2p': [Pin2, DarkPin2],
			'3p': [Pin3, DarkPin3],
			'4p': [Pin4, DarkPin4],
			'5p': [Pin5, DarkPin5],
			'6p': [Pin6, DarkPin6],
			'7p': [Pin7, DarkPin7],
			'8p': [Pin8, DarkPin8],
			'9p': [Pin9, DarkPin9],
			'0p': [Pin5Dora, DarkPin5Dora],
			'1s': [Sou1, DarkSou1],
			'2s': [Sou2, DarkSou2],
			'3s': [Sou3, DarkSou3],
			'4s': [Sou4, DarkSou4],
			'5s': [Sou5, DarkSou5],
			'6s': [Sou6, DarkSou6],
			'7s': [Sou7, DarkSou7],
			'8s': [Sou8, DarkSou8],
			'9s': [Sou9, DarkSou9],
			'0s': [Sou5Dora, DarkSou5Dora],
			'1z': [Honor1, DarkHonor1],
			'2z': [Honor2, DarkHonor2],
			'3z': [Honor3, DarkHonor3],
			'4z': [Honor4, DarkHonor4],
			'5z': [Honor5, DarkHonor5],
			'6z': [Honor6, DarkHonor6],
			'7z': [Honor7, DarkHonor7],
		} as const
	)[tile];
}

export default function Tile({ tile }: { tile: TileCode | '00' }) {
	const theme = useTheme();
	if (tile === '00') {
		const C = svgForTile('5z')[theme === 'dark' ? 1 : 0];
		return (
			<C
				className={clsx('h-16 w-12 min-w-[3rem] lg:h-20 lg:w-[60px] lg:min-w-[60px] p-2 rounded-xl')}
				viewBox="0 0 300 400"
			/>
		);
	}
	const C = svgForTile(tile)[theme === 'dark' ? 1 : 0];
	return (
		<C
			className={clsx('h-16 w-12 min-w-[3rem] lg:h-20 lg:w-[60px] lg:min-w-[60px] p-2 rounded-xl')}
			viewBox="0 0 300 400"
		/>
	);
}

export function Placeholder() {
	return (
		<div className="h-16 w-12 min-w-[3rem] lg:h-20 lg:w-[60px] lg:min-w-[60px] p-2 rounded-xl border-2 border-black dark:border-white border-dashed"></div>
	);
}
