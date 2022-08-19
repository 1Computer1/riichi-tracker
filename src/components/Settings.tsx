import clsx from 'clsx';
import produce from 'immer';
import { ReactNode, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { DraftFunction } from 'use-immer';
import Button from './Button';
import Question from './icons/heroicons/Question';
import CustomDialog from './layout/CustomDialog';
import { ScoreSettings } from '../lib/hand';

export default function Settings({
	settings,
	onSettingsChange,
}: {
	settings: ScoreSettings;
	onSettingsChange?: (s: ScoreSettings) => void;
}) {
	function change(f: DraftFunction<ScoreSettings>) {
		const updated = produce(f)(settings);
		onSettingsChange?.(updated);
	}

	return (
		<div className="flex flex-col justify-center items-center gap-y-2">
			<table className="table table-auto border border-y-0 border-separate border-spacing-2 lg:border-spacing-4 border-transparent -my-1 lg:-my-2">
				<tbody>
					<SettingRow
						name="Game Mode"
						help={
							<span>
								The number of players in the game. <br />
								<span className="text-amber-700 dark:text-amber-500">Three-Player</span> mahjong uses the sanma rules,
								which includes no chii, no 2 to 8 of Man, and Kita.
							</span>
						}
					>
						<Button
							active={settings.sanma == null}
							onClick={() =>
								change((s) => {
									s.sanma = null;
								})
							}
						>
							Four-Player
						</Button>
						<Button
							active={settings.sanma != null}
							onClick={() =>
								change((s) => {
									s.sanma = 'loss';
								})
							}
						>
							Three-Player
						</Button>
					</SettingRow>
					{settings.sanma != null && (
						<SettingRow
							name="Tsumo Points"
							help={
								<span>
									The distribution of points when a player wins with tsumo.
									<br />
									If <span className="text-amber-700 dark:text-amber-500">Loss</span> is enabled, the base points are
									the same as in four player. In effect, the winning player loses the points from the missing North
									player.
									<br />
									If <span className="text-amber-700 dark:text-amber-500">Bisection</span> is enabled, the base points
									will include the points from the North player that should have been paid. In effect, the other two
									players will pay more.
								</span>
							}
						>
							<Button
								active={settings.sanma === 'loss'}
								onClick={() =>
									change((s) => {
										s.sanma = 'loss';
									})
								}
							>
								Loss
							</Button>
							<Button
								active={settings.sanma === 'bisection'}
								onClick={() =>
									change((s) => {
										s.sanma = 'bisection';
									})
								}
							>
								Bisection
							</Button>
						</SettingRow>
					)}
					<SettingRow
						name="Red Fives"
						help={<span>The number of red fives available in the calculator when building a hand.</span>}
					>
						<Button
							active={settings.akadora}
							onClick={() =>
								change((s) => {
									s.akadora = true;
								})
							}
						>
							{settings.sanma ? '2' : '3'} Red Fives
						</Button>
						<Button
							active={!settings.akadora}
							onClick={() =>
								change((s) => {
									s.akadora = false;
								})
							}
						>
							0 Red Fives
						</Button>
					</SettingRow>
				</tbody>
			</table>
		</div>
	);
}

function SettingRow({ name, help, children }: { name: string; help: ReactNode; children?: ReactNode }) {
	const isLg = useMediaQuery({ query: '(min-width: 768px)' });
	const [helpOpened, setHelpOpened] = useState(false);
	return (
		<>
			<tr className="table-row">
				{isLg ? (
					<>
						<td className="table-cell">
							<div className="flex flex-row flex-wrap justify-between items-center gap-4">
								<span className="text-right text-2xl w-48">{name}</span>
								<HelpButton highlight={helpOpened} onClick={() => setHelpOpened(!helpOpened)} />
							</div>
						</td>
						<td className="table-cell">
							<div className="flex flex-row flex-wrap gap-2 justify-start items-center">{children}</div>
						</td>
					</>
				) : (
					<td className="table-cell">
						<div className="flex flex-col justify-center items-center gap-y-2">
							<div className="flex flex-row w-full gap-x-2 items-center">
								<HelpButton highlight={helpOpened} onClick={() => setHelpOpened(!helpOpened)} />
								<span className="text-xl break-words">{name}</span>
							</div>
							{children}
						</div>
					</td>
				)}
			</tr>
			{helpOpened && (
				<CustomDialog title={name} onClose={() => setHelpOpened(false)}>
					<div className="text-lg lg:text-xl">{help}</div>
				</CustomDialog>
			)}
		</>
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
