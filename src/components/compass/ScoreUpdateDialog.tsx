import { useRef, useState } from 'react';
import { Game } from '../../data/interfaces';
import { nextWind } from '../../lib/hand';
import { useDb } from '../../providers/DbProvider';
import Button from '../Button';
import ToggleThree from '../ToggleThree';
import TileButton from '../calculator/TileButton';
import Hashtag from '../icons/heroicons/Hashtag';
import Minus from '../icons/heroicons/Minus';
import Plus from '../icons/heroicons/Plus';
import CustomDialog from '../layout/CustomDialog';

export function ScoreUpdateDialog({
	scoreUpdater,
	gameId,
	game,
	onScoreUpdate,
	onClose,
}: {
	scoreUpdater: number;
	gameId: string;
	game: Game;
	onScoreUpdate: (oldScores: number[]) => void;
	onClose: () => void;
}) {
	const db = useDb();

	const { bottomWind, scores, settings } = game;
	const isSanma = settings.sanma != null;

	const [scoreUpdateMode, setScoreUpdateMode] = useState<0 | 1 | 2>(0);
	const [scoreUpdateDelta, setScoreUpdateDelta] = useState(0);
	const scoreDeltaInputRef = useRef<HTMLInputElement | null>(null);

	const submitScoreUpdate = async () => {
		const scores_ = scores.slice();
		switch (scoreUpdateMode) {
			case 0:
				scores_[scoreUpdater] -= scoreUpdateDelta;
				break;
			case 1:
				scores_[scoreUpdater] = scoreUpdateDelta;
				break;
			case 2:
				scores_[scoreUpdater] += scoreUpdateDelta;
				break;
		}
		await db.setGame(gameId, { ...game, scores: scores_ });
		onScoreUpdate(game.scores);
		onClose();
	};

	return (
		<CustomDialog initialFocus={scoreDeltaInputRef} onClose={onClose} title="Edit Score">
			<div className="flex flex-col gap-y-2 items-center justify-center">
				<TileButton
					forced
					red={nextWind(bottomWind, scoreUpdater, isSanma) === '1'}
					tile={`${nextWind(bottomWind, scoreUpdater, isSanma)}z`}
				/>
				<div className="flex flex-col justify-center items-center gap-y-2">
					<ToggleThree
						left={
							<div className="w-4 h-4 lg:w-6 lg:h-6">
								<Minus />
							</div>
						}
						middle={
							<div className="w-4 h-4 lg:w-6 lg:h-6">
								<Hashtag />
							</div>
						}
						right={
							<div className="w-4 h-4 lg:w-6 lg:h-6">
								<Plus />
							</div>
						}
						toggled={scoreUpdateMode}
						onToggle={(x) => setScoreUpdateMode(x)}
					/>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							void submitScoreUpdate();
						}}
					>
						<input
							ref={scoreDeltaInputRef}
							type="text"
							inputMode="numeric"
							className="bg-slate-300 dark:bg-sky-900 text-amber-700 dark:text-amber-500 font-bold text-center text-2xl lg:text-4xl rounded-xl w-52 lg:w-80 h-10 lg:h-14 p-1"
							value={scoreUpdateDelta}
							onChange={(e) => {
								const n = Number(e.target.value.match(/^\d+/)?.[0] ?? 0);
								if (!isNaN(n)) {
									setScoreUpdateDelta(n);
								}
							}}
						/>
					</form>
					<Button
						onClick={() => {
							void submitScoreUpdate();
						}}
					>
						Submit
					</Button>
				</div>
			</div>
		</CustomDialog>
	);
}
