import clsx from 'clsx';
import { useState } from 'react';
import { TileCode } from '../lib/hand';

/* eslint-disable import/order */
import Man1 from '../assets/tiles/light/Man1.svg';
import Man2 from '../assets/tiles/light/Man2.svg';
import Man3 from '../assets/tiles/light/Man3.svg';
import Man4 from '../assets/tiles/light/Man4.svg';
import Man5Dora from '../assets/tiles/light/Man5-Dora.svg';
import Man5 from '../assets/tiles/light/Man5.svg';
import Man6 from '../assets/tiles/light/Man6.svg';
import Man7 from '../assets/tiles/light/Man7.svg';
import Man8 from '../assets/tiles/light/Man8.svg';
import Man9 from '../assets/tiles/light/Man9.svg';

import Pin1 from '../assets/tiles/light/Pin1.svg';
import Pin2 from '../assets/tiles/light/Pin2.svg';
import Pin3 from '../assets/tiles/light/Pin3.svg';
import Pin4 from '../assets/tiles/light/Pin4.svg';
import Pin5Dora from '../assets/tiles/light/Pin5-Dora.svg';
import Pin5 from '../assets/tiles/light/Pin5.svg';
import Pin6 from '../assets/tiles/light/Pin6.svg';
import Pin7 from '../assets/tiles/light/Pin7.svg';
import Pin8 from '../assets/tiles/light/Pin8.svg';
import Pin9 from '../assets/tiles/light/Pin9.svg';

import Sou1 from '../assets/tiles/light/Sou1.svg';
import Sou2 from '../assets/tiles/light/Sou2.svg';
import Sou3 from '../assets/tiles/light/Sou3.svg';
import Sou4 from '../assets/tiles/light/Sou4.svg';
import Sou5Dora from '../assets/tiles/light/Sou5-Dora.svg';
import Sou5 from '../assets/tiles/light/Sou5.svg';
import Sou6 from '../assets/tiles/light/Sou6.svg';
import Sou7 from '../assets/tiles/light/Sou7.svg';
import Sou8 from '../assets/tiles/light/Sou8.svg';
import Sou9 from '../assets/tiles/light/Sou9.svg';

import Honor1 from '../assets/tiles/light/Ton.svg';
import Honor2 from '../assets/tiles/light/Nan.svg';
import Honor3 from '../assets/tiles/light/Shaa.svg';
import Honor4 from '../assets/tiles/light/Pei.svg';
import Honor5 from '../assets/tiles/light/Haku.svg';
import Honor6 from '../assets/tiles/light/Hatsu.svg';
import Honor7 from '../assets/tiles/light/Chun.svg';
/* eslint-enable import/order */

/* eslint-disable import/order */
import DarkMan1 from '../assets/tiles/dark/Man1.svg';
import DarkMan2 from '../assets/tiles/dark/Man2.svg';
import DarkMan3 from '../assets/tiles/dark/Man3.svg';
import DarkMan4 from '../assets/tiles/dark/Man4.svg';
import DarkMan5Dora from '../assets/tiles/dark/Man5-Dora.svg';
import DarkMan5 from '../assets/tiles/dark/Man5.svg';
import DarkMan6 from '../assets/tiles/dark/Man6.svg';
import DarkMan7 from '../assets/tiles/dark/Man7.svg';
import DarkMan8 from '../assets/tiles/dark/Man8.svg';
import DarkMan9 from '../assets/tiles/dark/Man9.svg';

import DarkPin1 from '../assets/tiles/dark/Pin1.svg';
import DarkPin2 from '../assets/tiles/dark/Pin2.svg';
import DarkPin3 from '../assets/tiles/dark/Pin3.svg';
import DarkPin4 from '../assets/tiles/dark/Pin4.svg';
import DarkPin5Dora from '../assets/tiles/dark/Pin5-Dora.svg';
import DarkPin5 from '../assets/tiles/dark/Pin5.svg';
import DarkPin6 from '../assets/tiles/dark/Pin6.svg';
import DarkPin7 from '../assets/tiles/dark/Pin7.svg';
import DarkPin8 from '../assets/tiles/dark/Pin8.svg';
import DarkPin9 from '../assets/tiles/dark/Pin9.svg';

import DarkSou1 from '../assets/tiles/dark/Sou1.svg';
import DarkSou2 from '../assets/tiles/dark/Sou2.svg';
import DarkSou3 from '../assets/tiles/dark/Sou3.svg';
import DarkSou4 from '../assets/tiles/dark/Sou4.svg';
import DarkSou5Dora from '../assets/tiles/dark/Sou5-Dora.svg';
import DarkSou5 from '../assets/tiles/dark/Sou5.svg';
import DarkSou6 from '../assets/tiles/dark/Sou6.svg';
import DarkSou7 from '../assets/tiles/dark/Sou7.svg';
import DarkSou8 from '../assets/tiles/dark/Sou8.svg';
import DarkSou9 from '../assets/tiles/dark/Sou9.svg';

import DarkHonor1 from '../assets/tiles/dark/Ton.svg';
import DarkHonor2 from '../assets/tiles/dark/Nan.svg';
import DarkHonor3 from '../assets/tiles/dark/Shaa.svg';
import DarkHonor4 from '../assets/tiles/dark/Pei.svg';
import DarkHonor5 from '../assets/tiles/dark/Haku.svg';
import DarkHonor6 from '../assets/tiles/dark/Hatsu.svg';
import DarkHonor7 from '../assets/tiles/dark/Chun.svg';
/* eslint-enable import/order */

export function svgForTile(tile: TileCode): readonly [string, string] {
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

export default function Tile({ tile, ...props }: { tile: TileCode | '00' }) {
	const mq = window.matchMedia('(prefers-color-scheme: dark)');
	const [dark, setDark] = useState(mq.matches);
	mq.addEventListener('change', (x) => setDark(x.matches));
	if (tile === '00') {
		return (
			<img
				src={svgForTile('5z')[dark ? 1 : 0]}
				className={clsx('h-16 w-12 min-w-[3rem] lg:h-20 lg:w-[60px] lg:min-w-[60px] p-2 rounded-xl')}
			></img>
		);
	}
	const file = svgForTile(tile)[dark ? 1 : 0];
	return (
		<img
			src={file}
			className={clsx('h-16 w-12 min-w-[3rem] lg:h-20 lg:w-[60px] lg:min-w-[60px] p-2 rounded-xl')}
			{...props}
		></img>
	);
}

export function Placeholder() {
	return (
		<div className="h-16 w-12 min-w-[3rem] lg:h-20 lg:w-[60px] lg:min-w-[60px] p-2 rounded-xl border-2 border-black dark:border-white border-dashed"></div>
	);
}
