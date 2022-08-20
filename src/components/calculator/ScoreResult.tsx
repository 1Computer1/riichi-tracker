import clsx from 'clsx';
import PointsResult from './PointsResult';
import { CalculatedValue } from '../../lib/hand';

export default function ScoreResult({
	tileCount,
	result,
	transferButton,
	pao,
	onTransferClick,
}: {
	tileCount: number;
	result: CalculatedValue | null;
	transferButton?: boolean;
	pao?: boolean;
	onTransferClick?: () => void;
}) {
	return (
		<div className="w-full h-full flex flex-col justify-center items-center">
			{tileCount === 14 && result ? (
				<ScoreResultSheet result={result} transferButton={transferButton} pao={pao} onTransferClick={onTransferClick} />
			) : (
				<span className="text-2xl lg:text-4xl text-center">Not enough tiles to form a complete hand.</span>
			)}
		</div>
	);
}

function ScoreResultSheet({
	result,
	transferButton = false,
	pao = false,
	onTransferClick,
}: {
	result: CalculatedValue;
	transferButton?: boolean;
	pao?: boolean;
	onTransferClick?: () => void;
}) {
	return (
		<div className="flex flex-col justify-center items-center w-full h-full gap-y-2 lg:gap-y-4">
			{result.agari == null ? (
				<span className="text-2xl lg:text-4xl text-center">Tiles do not form a valid winning hand.</span>
			) : (
				<>
					<div>
						{result.yakuman ? (
							<span className="text-4xl text-amber-700 dark:text-amber-500">Yakuman</span>
						) : (
							<span className="text-4xl">
								<span className="text-amber-700 dark:text-amber-500">{result.han}</span> Han{' '}
								<span className="text-amber-700 dark:text-amber-500">{result.fu}</span> Fu
							</span>
						)}
					</div>
					<ul className="flex flex-col text-lg container lg:w-[50%] gap-y-0.5">
						{result.yaku.map((y) => (
							<li
								key={y[0]}
								className="flex flex-row items-center justify-between border-b border-dotted border-black dark:border-gray-50 dark:border-opacity-50 pb-0.5"
							>
								<span className="text-sm sm:text-lg md:text-xl lg:text-2xl">{y[0]}</span>
								{y[2] ? (
									<span className="text-sm sm:text-lg md:text-xl lg:text-2xl text-amber-700 dark:text-amber-500">
										{y[1] > 3 ? `${y[1]}★` : '★'.repeat(y[1])}
									</span>
								) : (
									<span className="text-sm sm:text-lg md:text-xl lg:text-2xl">
										<span className="text-amber-700 dark:text-amber-500">{y[1]}</span> Han
									</span>
								)}
							</li>
						))}
					</ul>
					<PointsResult result={result} pao={pao} />
					{transferButton && (
						<div className="flex flex-col container lg:w-[50%]">
							<button
								className={clsx(
									'border border-gray-800 rounded-xl shadow py-1 lg:p-2 disabled:bg-gray-300 dark:disabled:bg-gray-800 dark:disabled:text-gray-600',
									'w-full h-24 text-2xl',
									'bg-amber-500 hover:bg-amber-600 dark:bg-amber-700 dark:hover:bg-amber-800',
								)}
								onClick={onTransferClick}
							>
								Transfer Calculated Score
							</button>
						</div>
					)}
				</>
			)}
		</div>
	);
}
