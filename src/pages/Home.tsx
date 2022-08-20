import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GithubLogo from '../assets/github/github-corner-right.svg';
import Button from '../components/Button';
import { NewCompassDialog } from '../components/home/NewCompassDialog';
import { DefaultSettings } from '../lib/hand';
import { CalculatorState, CompassState } from '../lib/states';
import { useDb } from '../providers/DbProvider';

export default function App() {
	const navigate = useNavigate();

	const db = useDb();
	const toolsGame = db.useGame('$tools');

	const [openNewCompassDialog, setOpenNewCompassDialog] = useState(false);

	return (
		<div className="min-h-screen bg-slate-200 dark:bg-gray-900 text-black dark:text-white">
			<div className="fixed top-0 right-0">
				<a href="https://github.com/1Computer1/riichi-tracker">
					<img src={GithubLogo} />
				</a>
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
						</div>
					</div>
				</div>
				<ul className="text-base lg:text-xl flex flex-col justify-center items-start gap-y-1 lg:gap-y-2 list-disc px-6">
					<li>
						Create a <span className="text-amber-700 dark:text-amber-500">Compass</span> by using the{' '}
						<span className="text-amber-700 dark:text-amber-500">New Game</span> button.
					</li>
					<li>
						Add riichi sticks by tapping on the <span className="text-amber-700 dark:text-amber-500">Riichi</span>{' '}
						button.
					</li>
					<li>
						Transfer scores by tapping on the{' '}
						<span className="text-amber-700 dark:text-amber-500">winning player&apos;s wind tile</span> and using the{' '}
						<span className="text-amber-700 dark:text-amber-500">Calculator</span>.
					</li>
					<li>
						Handle draws and repeats by tapping on the{' '}
						<span className="text-amber-700 dark:text-amber-500">center wind tile</span>.
					</li>
					<li>
						Manually edit scores by tapping on a{' '}
						<span className="text-amber-700 dark:text-amber-500">player&apos;s score display</span>.
					</li>
					<li>
						Manually edit seats, rounds, and sticks by tapping on the{' '}
						<span className="text-amber-700 dark:text-amber-500">gear button</span>.
					</li>
					<li>Place your phone at the center of the table and enjoy!</li>
					<li>
						You can also use the <span className="text-amber-700 dark:text-amber-500">Calculator</span> by itself
						outside of a game.
					</li>
				</ul>
			</div>
			{openNewCompassDialog && <NewCompassDialog onClose={() => setOpenNewCompassDialog(false)} />}
		</div>
	);
}
