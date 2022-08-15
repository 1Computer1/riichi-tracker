import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GithubLogo from '../assets/github-corner-right.svg';
import Button from '../components/Button';
import WindSelect from '../components/calculator/WindSelect';
import CustomDialog from '../components/layout/CustomDialog';
import { Wind } from '../lib/hand';
import { useDb } from '../providers/DbProvider';

export default function App() {
	const navigate = useNavigate();

	const db = useDb();
	const toolsGame = db.useGame('$tools');

	const [makingNewCompass, setMakingNewCompass] = useState(false);
	const [newCompassInitialScore, setNewCompassInitialScore] = useState(25000);
	const [newCompassBottomWind, setNewCompassBottomWind] = useState<Wind>('1');

	function NewCompassDialog() {
		if (!makingNewCompass) {
			return null;
		}

		async function submitNewCompass() {
			await db.setGame('$tools', {
				bottomWind: newCompassBottomWind,
				roundWind: '1',
				round: 1,
				repeats: 0,
				scores: [newCompassInitialScore, newCompassInitialScore, newCompassInitialScore, newCompassInitialScore],
				riichiSticks: 0,
				riichi: [false, false, false, false],
			});
			navigate('/compass', { state: { t: 'load', id: '$tools' }, replace: true });
		}

		return (
			<CustomDialog onClose={() => setMakingNewCompass(false)}>
				<form
					className="flex flex-col justify-center items-center gap-y-2"
					onSubmit={(e) => {
						e.preventDefault();
						void submitNewCompass();
					}}
				>
					<p className="text-xl lg:text-2xl">Initial Score</p>
					<input
						type="tel"
						className="bg-slate-300 dark:bg-sky-900 text-amber-700 dark:text-amber-500 font-bold text-center text-2xl lg:text-4xl rounded-xl w-36 lg:w-80"
						value={newCompassInitialScore}
						onChange={(e) => {
							const n = Number(e.target.value.match(/^\d+/)?.[0] ?? 0);
							if (!isNaN(n)) {
								setNewCompassInitialScore(n);
							}
						}}
					/>
					<p className="text-xl lg:text-2xl">Your Seat Wind</p>
					<div>
						<WindSelect value={newCompassBottomWind} redEast onChange={(w) => setNewCompassBottomWind(w)} />
					</div>
				</form>
				<Button
					onClick={() => {
						void submitNewCompass();
					}}
				>
					Create Compass
				</Button>
			</CustomDialog>
		);
	}

	return (
		<div className="min-h-screen bg-slate-200 dark:bg-gray-900 text-black dark:text-white">
			<div className="fixed top-0 right-0">
				<a href="https://github.com/1Computer1/riichi-tracker">
					<img src={GithubLogo} />
				</a>
			</div>
			<div className="flex flex-col justify-center items-center min-h-screen gap-y-4 lg:gap-y-8 py-4 px-2">
				<h1 className="text-4xl lg:text-6xl text-center">Riichi Tracker</h1>
				<div className="flex flex-row justify-center items-start gap-x-8">
					<div className="flex flex-col justify-center items-center gap-y-2 lg:gap-y-4">
						<span className="flex flex-col justify-center items-center">
							<h2 className="text-2xl lg:text-4xl text-center">Games</h2>
							<p className="text-center">Track your Riichi Mahjong games!</p>
						</span>
						<div className="flex flex-col justify-center items-center gap-y-2 lg:gap-y-4">
							<Button disabled>New Game</Button>
							<Button disabled>Load Game</Button>
							<Button disabled>History</Button>
						</div>
					</div>
					<div className="flex flex-col justify-center items-center gap-y-2 lg:gap-y-4">
						<span className="flex flex-col justify-center items-center">
							<h2 className="text-2xl lg:text-4xl text-center">Tools</h2>
							<p className="text-center">Score can be kept separate from full games.</p>
						</span>
						<div className="flex flex-col justify-center items-center gap-y-2 lg:gap-y-4">
							<Button onClick={() => navigate('/calculator', { replace: true })}>Calculator</Button>
							<Button
								disabled={toolsGame == null || !toolsGame.ok}
								onClick={() => navigate('/compass', { state: { t: 'load', id: '$tools' }, replace: true })}
							>
								Continue Compass
							</Button>
							<Button onClick={() => setMakingNewCompass(true)}>New Compass</Button>
							<NewCompassDialog />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
