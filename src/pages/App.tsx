import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

export default function App() {
	const navigate = useNavigate();
	return (
		<div className="min-h-screen bg-slate-200 dark:bg-gray-900 text-black dark:text-white">
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
							<Button onClick={() => navigate('/calculator')}>Calculator</Button>
							<Button onClick={() => navigate('/compass')}>Compass</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
