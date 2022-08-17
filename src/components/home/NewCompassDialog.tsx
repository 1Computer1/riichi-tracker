import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImmer } from 'use-immer';
import { DefaultSettings, Wind } from '../../lib/hand';
import { CompassState } from '../../lib/states';
import { replicate } from '../../lib/util';
import { useDb } from '../../providers/DbProvider';
import Button from '../Button';
import Toggle from '../Toggle';
import ToggleOnOff from '../ToggleOnOff';
import WindSelect from '../calculator/WindSelect';
import CustomDialog from '../layout/CustomDialog';

export function NewCompassDialog({ onClose }: { onClose: () => void }) {
	const navigate = useNavigate();
	const db = useDb();

	const [newCompassInitialScore, setNewCompassInitialScore] = useState(25000);
	const [newCompassBottomWind, setNewCompassBottomWind] = useState<Wind>('1');
	const [newCompassSettings, updateNewCompassSettings] = useImmer(DefaultSettings);
	const initialScoreInputRef = useRef<HTMLInputElement | null>(null);

	const submitNewCompass = async () => {
		await db.setGame('$tools', {
			bottomWind: newCompassBottomWind,
			roundWind: '1',
			round: 1,
			repeats: 0,
			scores: replicate(newCompassInitialScore, newCompassSettings.sanma ? 3 : 4),
			riichiSticks: 0,
			riichi: replicate(false, newCompassSettings.sanma ? 3 : 4),
			settings: newCompassSettings,
		});
		const state: CompassState = { t: 'load', id: '$tools' };
		navigate('/compass', { state, replace: true });
	};

	return (
		<CustomDialog initialFocus={initialScoreInputRef} onClose={onClose}>
			<div className="flex flex-col justify-center items-center gap-y-2">
				<form
					className="flex flex-col justify-center items-center gap-y-2"
					onSubmit={(e) => {
						e.preventDefault();
						void submitNewCompass();
					}}
				>
					<p className="text-xl lg:text-2xl">Initial Score</p>
					<input
						ref={initialScoreInputRef}
						key="scoreInput"
						type="text"
						inputMode="numeric"
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
						<WindSelect
							value={newCompassBottomWind}
							redEast
							sanma={newCompassSettings.sanma != null}
							onChange={(w) => setNewCompassBottomWind(w)}
						/>
					</div>
					<ToggleOnOff
						toggled={newCompassSettings.akadora}
						onToggle={(b) =>
							updateNewCompassSettings((s) => {
								s.akadora = b;
							})
						}
					>
						Red Fives
					</ToggleOnOff>
					<ToggleOnOff
						toggled={newCompassSettings.sanma != null}
						onToggle={(b) => {
							updateNewCompassSettings((s) => {
								s.sanma = b ? 'loss' : null;
							});
							if (b) {
								setNewCompassInitialScore(35000);
							} else {
								setNewCompassInitialScore(25000);
							}
						}}
					>
						Three Player
					</ToggleOnOff>
					{newCompassSettings.sanma != null && (
						<Toggle
							left="Loss"
							right="Bisection"
							toggled={newCompassSettings.sanma === 'bisection'}
							onToggle={(b) =>
								updateNewCompassSettings((s) => {
									s.sanma = b ? 'bisection' : 'loss';
								})
							}
						/>
					)}
				</form>
				<Button
					onClick={() => {
						void submitNewCompass();
					}}
				>
					Create Compass
				</Button>
			</div>
		</CustomDialog>
	);
}
