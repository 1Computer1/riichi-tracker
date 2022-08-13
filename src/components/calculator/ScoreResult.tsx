import { CalculatedValue } from '../../lib/hand';

export default function ScoreResult({ tileCount, result }: { tileCount: number; result: CalculatedValue | null }) {
	return (
		<div className="w-full h-full flex flex-col justify-center items-center">
			{tileCount === 14 && result ? (
				<ScoreResultSheet result={result} />
			) : (
				<span className="text-2xl lg:text-4xl text-center">Not enough tiles to form a complete hand.</span>
			)}
		</div>
	);
}

function ScoreResultSheet({ result }: { result: CalculatedValue }) {
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
								{typeof y[1] === 'number' ? (
									<span className="text-sm sm:text-lg md:text-xl lg:text-2xl">
										<span className="text-amber-700 dark:text-amber-500">{y[1]}</span> Han
									</span>
								) : y[1] === 'y' ? (
									<span className="text-sm sm:text-lg md:text-xl lg:text-2xl text-amber-700 dark:text-amber-500">
										★
									</span>
								) : (
									<span className="text-sm sm:text-lg md:text-xl lg:text-2xl text-amber-700 dark:text-amber-500">
										★★
									</span>
								)}
							</li>
						))}
					</ul>
					<div className="flex flex-col justify-center items-center gap-y-2">
						{result.name && <div className="text-4xl italic">{result.name}</div>}
						<div className="flex flex-row items-end gap-x-2">
							<span className="text-6xl text-amber-700 dark:text-amber-500">{result.points.total}</span>
							<span className="text-2xl">Points</span>
						</div>
						<div className="text-2xl">
							Points to take:{' '}
							{result.isOya ? (
								result.agari === 'tsumo' ? (
									<span>
										<span className="text-amber-700 dark:text-amber-500">{result.points.oya[0]}</span> all
									</span>
								) : (
									<span className="text-amber-700 dark:text-amber-500">{result.points.oya[0]}</span>
								)
							) : (
								<>
									<span className="text-amber-700 dark:text-amber-500">{result.points.ko[0]}</span>
									{result.points.ko[1] && (
										<span>
											, <span className="text-amber-700 dark:text-amber-500">{result.points.ko[1]}</span>
										</span>
									)}
								</>
							)}
						</div>
					</div>
				</>
			)}
		</div>
	);
}
