import { Game } from '../../data/interfaces';
import { nextWind, translateWind } from '../../lib/hand';
import { useDb } from '../../providers/DbProvider';
import Button from '../Button';
import Counter from '../Counter';
import CustomDialog from '../layout/CustomDialog';

export function AdvancedDialog({ gameId, game, onClose }: { gameId: string; game: Game; onClose: () => void }) {
	const db = useDb();

	const { bottomWind, roundWind, round, repeats, riichiSticks, riichi } = game;

	return (
		<CustomDialog onClose={onClose}>
			<div className="flex flex-col justify-center items-center gap-y-2 w-[232px] lg:w-80">
				<div className="flex flex-col justify-center items-center gap-y-2">
					<p className="text-xl lg:text-2xl">Other Actions</p>
					<Button
						onClick={() => {
							(async () => {
								await db.setGame(gameId, {
									...game,
									bottomWind: nextWind(bottomWind, -1),
								});
							})();
						}}
					>
						Rotate Seats
					</Button>
					<Counter
						onDecrement={() => {
							(async () => {
								await db.setGame(gameId, {
									...game,
									roundWind: round === 1 ? nextWind(roundWind, -1) : roundWind,
									round: round === 1 ? 4 : round - 1,
								});
							})();
						}}
						onIncrement={() => {
							(async () => {
								await db.setGame(gameId, {
									...game,
									roundWind: round === 4 ? nextWind(roundWind) : roundWind,
									round: round === 4 ? 1 : round + 1,
								});
							})();
						}}
					>
						{translateWind(roundWind)} {round}
					</Counter>
					<Counter
						canDecrement={repeats > 0}
						onDecrement={() => {
							(async () => {
								await db.setGame(gameId, {
									...game,
									repeats: repeats - 1,
								});
							})();
						}}
						onIncrement={() => {
							(async () => {
								await db.setGame(gameId, {
									...game,
									repeats: repeats + 1,
								});
							})();
						}}
					>
						Repeats ({repeats})
					</Counter>
					<Counter
						canDecrement={riichiSticks > riichi.filter((r) => r).length}
						onDecrement={() => {
							(async () => {
								await db.setGame(gameId, {
									...game,
									riichiSticks: riichiSticks - 1,
								});
							})();
						}}
						onIncrement={() => {
							(async () => {
								await db.setGame(gameId, {
									...game,
									riichiSticks: riichiSticks + 1,
								});
							})();
						}}
					>
						Riichi ({riichiSticks})
					</Counter>
				</div>
			</div>
		</CustomDialog>
	);
}
