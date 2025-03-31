import { useState } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import CircleButton from '../components/CircleButton';
import { NewCompassDialog } from '../components/home/NewCompassDialog';
import Computer from '../components/icons/heroicons/Computer';
import Moon from '../components/icons/heroicons/Moon';
import Sun from '../components/icons/heroicons/Sun';
import H from '../components/text/H';
import useLocalStorage from '../hooks/useLocalStorage';
import { DefaultSettings } from '../lib/settings';
import { CalculatorState, CompassState } from '../lib/states';
import { updateTheme } from '../lib/util';
import { useDb } from '../providers/DbProvider';

export default function App() {
	const navigate = useNavigate();

	const db = useDb();
	const toolsGame = db.useGame('$tools');

	const [theme, setTheme] = useLocalStorage('theme');
	const [openNewCompassDialog, setOpenNewCompassDialog] = useState(false);

	return (
		<div className="min-h-screen bg-slate-200 dark:bg-gray-900 text-black dark:text-white">
			<div className="fixed top-0 right-0">
				<a href="https://github.com/1Computer1/riichi-tracker">
					<img src={`${import.meta.env.BASE_URL}github/github-corner-right.svg`} />
				</a>
			</div>
			<div className="fixed top-2 left-2 lg:top-4 lg:left-4 flex flex-col gap-y-2">
				<CircleButton
					onClick={() => {
						flushSync(() => {
							if (theme === 'dark') {
								setTheme(null);
							} else if (theme === 'light') {
								setTheme('dark');
							} else {
								setTheme('light');
							}
						});
						updateTheme();
					}}
				>
					{theme === 'dark' ? <Moon /> : theme === 'light' ? <Sun /> : <Computer />}
				</CircleButton>
			</div>
			<div className="flex flex-col justify-center items-center min-h-screen gap-y-4 lg:gap-y-8 py-4 px-2">
				<h1 className="text-4xl lg:text-6xl text-center">Riichi Tracker</h1>
				<h2 className="text-xl lg:text-2xl text-center">Keep track of your games!</h2>
				<div className="flex flex-row justify-center items-start gap-x-8">
					<div className="flex flex-col justify-center items-center gap-y-2 lg:gap-y-4">
						<div className="flex flex-col justify-center items-center gap-y-2 lg:gap-y-4">
							<Button onClick={() => setOpenNewCompassDialog(true)}>New Game</Button>
							<Button
								disabled={toolsGame == null || !toolsGame.ok}
								onClick={() => {
									const state: CompassState = { t: 'load', id: '$tools' };
									navigate('/compass', { state, replace: true });
								}}
							>
								Continue
							</Button>
							<Button
								onClick={() => {
									(async () => {
										const res = await db.getSettings('$global');
										if (!res.ok) {
											await db.setSettings('$global', DefaultSettings);
										}
										const state: CalculatorState = { t: 'load', id: '$global' };
										navigate('/calculator', { state, replace: true });
									})();
								}}
							>
								Calculator
							</Button>
							<Button
								onClick={() => {
									navigate('/reference', { replace: true });
								}}
							>
								Reference
							</Button>
						</div>
					</div>
				</div>
				<ul className="text-base lg:text-xl flex flex-col justify-center items-start gap-y-1 lg:gap-y-2 list-disc px-6">
					<li>
						Create a <H>Compass</H> by using the <H>New Game</H> button.
					</li>
					<li>
						Add riichi sticks by tapping on the <H>Riichi</H> button.
					</li>
					<li>
						Transfer scores by tapping on the <H>winning player&apos;s wind tile</H> and using the <H>Calculator</H>.
					</li>
					<li>
						Beginners can input their hand while advanced players can input the han and fu values.
						<br />
						This can be toggled at the <H>top-right of the Calculator</H>.
						<br />
						The default input can be set with the <H>Prefer Han &amp; Fu Input</H> option.
					</li>
					<li>
						Handle draws and repeats by tapping on the <H>center wind tile</H>.
					</li>
					<li>
						Manually edit scores by tapping on a <H>player&apos;s score display</H>.
					</li>
					<li>
						Manually edit seats, rounds, and sticks by tapping on the <H>gear button</H>.
					</li>
					<li>Place your phone at the center of the table and enjoy!</li>
					<li>
						You can also use the <H>Calculator</H> by itself outside of a game.
					</li>
					<li>
						Learn the tiles, yaku, and the scoring table in the <H>Reference</H>.
					</li>
				</ul>
			</div>
			{openNewCompassDialog && <NewCompassDialog onClose={() => setOpenNewCompassDialog(false)} />}
		</div>
	);
}
