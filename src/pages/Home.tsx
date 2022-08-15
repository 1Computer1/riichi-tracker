import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GithubLogo from '../assets/github/github-corner-right.svg';
import Button from '../components/Button';
import { NewCompassDialog } from '../components/home/NewCompassDialog';
import { CompassState } from '../lib/states';
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
								onClick={() => {
									const state: CompassState = { t: 'load', id: '$tools' };
									navigate('/compass', { state, replace: true });
								}}
							>
								Continue Compass
							</Button>
							<Button onClick={() => setOpenNewCompassDialog(true)}>New Compass</Button>
							{openNewCompassDialog && <NewCompassDialog onClose={() => setOpenNewCompassDialog(false)} />}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
