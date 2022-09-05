import clsx from 'clsx';
import produce from 'immer';
import { useState } from 'react';
import { DraftFunction } from 'use-immer';
import { Yaku, YakuList } from '../../lib/yaku';
import Button from '../Button';
import Tiles from '../Tiles';
import Question from '../icons/heroicons/Question';
import CustomDialog from '../layout/CustomDialog';
import H from '../text/H';

export default function YakuDialog({
	yakuList,
	inverted,
	local,
	onChange,
	onClose,
}: {
	yakuList: Set<string>;
	/**
	 * If inverted, adds disabled yaku to the set.
	 * Otherwise, adds enabled yaku to the set.
	 */
	inverted: boolean;
	local: boolean;
	onChange?: (xs: Set<string>) => void;
	onClose: () => void;
}) {
	return (
		<CustomDialog title={local ? 'Toggle Local Yaku' : 'Toggle Yaku'} onClose={onClose}>
			<div className="flex flex-col justify-center items-center gap-y-8">
				{local && !inverted && (
					<Button
						onClick={() => {
							if (onChange) {
								const all = Object.values(YakuList)
									.filter((y) => y.type === 'local')
									.map((y) => y.id);
								if (yakuList.size === all.length) {
									onChange(new Set());
								} else {
									onChange(new Set(all));
								}
							}
						}}
					>
						Toggle All
					</Button>
				)}
				<div className="flex flex-col gap-2">
					{Object.values(YakuList)
						.filter((y) => (local ? y.type === 'local' : y.type === 'optional'))
						.map((y) => (
							<YakuToggle key={y.id} inverted={inverted} yakuList={yakuList} yaku={y} onChange={onChange} />
						))}
				</div>
				<Button
					onClick={() => {
						onClose();
					}}
				>
					Close
				</Button>
			</div>
		</CustomDialog>
	);
}

function YakuToggle({
	inverted,
	yakuList,
	yaku,
	onChange,
}: {
	inverted: boolean;
	yakuList: Set<string>;
	yaku: Yaku;
	onChange?: (xs: Set<string>) => void;
}) {
	function change(f: DraftFunction<Set<string>>) {
		const updated = produce(f)(yakuList);
		onChange?.(updated);
	}

	const [helpOpened, setHelpOpened] = useState(false);

	return (
		<div key={yaku.id} className="flex flex-row justify-center items-center gap-2">
			<button
				className={clsx(
					'border border-gray-800 rounded-xl shadow p-1 lg:p-2 disabled:bg-gray-300 dark:disabled:bg-gray-800 dark:disabled:text-gray-600',
					'w-52 lg:w-80 h-10 lg:h-14 text-base lg:text-xl',
					(inverted ? !yakuList.has(yaku.id) : yakuList.has(yaku.id))
						? 'bg-amber-500 hover:bg-amber-600 dark:bg-amber-700 dark:hover:bg-amber-800'
						: 'bg-gray-50 hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-600',
				)}
				onClick={(e) => {
					e.preventDefault();
					change((s) => {
						let together;
						switch (yaku.id) {
							case '海底摸月':
							case '河底撈魚':
								together = ['海底摸月', '河底撈魚'];
								break;
							case '嶺上開花':
							case '搶槓':
								together = ['嶺上開花', '搶槓'];
								break;
							default:
								together = [yaku.id];
						}
						for (const x of together) {
							if (s.has(x)) {
								s.delete(x);
							} else {
								s.add(x);
							}
						}
					});
				}}
			>
				{yaku.name}
			</button>
			{yaku.help && <HelpButton highlight={helpOpened} onClick={() => setHelpOpened(true)} />}
			{helpOpened && (
				<CustomDialog title={yaku.name} onClose={() => setHelpOpened(false)}>
					<div className="flex flex-col gap-2">
						<div className="w-full flex flex-row justify-between items-center">
							{yaku.yakuman ? (
								<span className="text-lg lg:text-xl">
									<H>
										{['', 'Double', 'Triple', 'Quadruple', 'Quintuple', 'Sextuple'][yaku.value - 1] ?? `${yaku.value}x`}{' '}
										Yakuman
									</H>
								</span>
							) : (
								<span className="text-lg lg:text-xl">
									<H>{yaku.value}</H> Han
								</span>
							)}
							<div className="flex flex-row justify-end items-center">
								{yaku.closedOnly && (
									<span className="text-lg lg:text-xl">
										<H.Red>Closed only</H.Red>
									</span>
								)}
								{yaku.openMinus && (
									<span className="text-lg lg:text-xl">
										<H.Red>-1 if open</H.Red>
									</span>
								)}
							</div>
						</div>
						<div className="text-lg lg:text-xl">{yaku.help}</div>
						{yaku.example && <Tiles tiles={yaku.example.tiles} melds={yaku.example.melds} small />}
					</div>
				</CustomDialog>
			)}
		</div>
	);
}

function HelpButton({ highlight, onClick }: { highlight?: boolean; onClick?: () => void }) {
	return (
		<button
			className={clsx(
				'border border-gray-800 rounded-full p-1 disabled:bg-gray-300 dark:disabled:bg-gray-800 dark:disabled:text-gray-600',
				highlight
					? 'bg-amber-500 hover:bg-amber-600 dark:bg-amber-700 dark:hover:bg-amber-800'
					: 'bg-gray-50 hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-600',
			)}
			onClick={(e) => {
				e.preventDefault();
				onClick?.();
			}}
		>
			<div className="w-6 h-6 lg:w-8 lg:h-8 flex flex-col justify-center items-center">
				<Question />
			</div>
		</button>
	);
}
