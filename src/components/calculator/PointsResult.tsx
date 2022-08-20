import { CalculatedValue, ceil100 } from '../../lib/hand';

export default function PointsResult({
	result,
	pao,
}: {
	result: CalculatedValue & { agari: 'ron' | 'tsumo' };
	pao: boolean;
}) {
	return (
		<div className="flex flex-col justify-center items-center gap-y-2">
			{result.name ? (
				<div className="text-4xl italic">{result.name}</div>
			) : result.noYaku ? (
				<div className="text-4xl italic">No Yaku</div>
			) : null}
			<div className="flex flex-row items-end gap-x-2">
				<span className="text-6xl text-amber-700 dark:text-amber-500">{result.points.total}</span>
				<span className="text-2xl">Points</span>
			</div>
			<div className="text-2xl">
				Points to take:{' '}
				{result.isOya ? (
					result.agari === 'tsumo' ? (
						pao ? (
							<span>
								<span className="text-amber-700 dark:text-amber-500">{result.points.total}</span> from liable
							</span>
						) : (
							<span>
								<span className="text-amber-700 dark:text-amber-500">{result.points.oya.ko}</span> all
							</span>
						)
					) : pao ? (
						<span>
							<span className="text-amber-700 dark:text-amber-500">{ceil100(result.points.oya.ron / 2)}</span> from both
						</span>
					) : (
						<span className="text-amber-700 dark:text-amber-500">{result.points.oya.ron}</span>
					)
				) : result.agari === 'tsumo' ? (
					pao ? (
						<span>
							<span className="text-amber-700 dark:text-amber-500">{result.points.total}</span> from liable
						</span>
					) : (
						<>
							<span className="text-amber-700 dark:text-amber-500">{result.points.ko.oya}</span>,{' '}
							<span className="text-amber-700 dark:text-amber-500">{result.points.ko.ko}</span>
						</>
					)
				) : pao ? (
					<span>
						<span className="text-amber-700 dark:text-amber-500">{ceil100(result.points.ko.ron / 2)}</span> from both
					</span>
				) : (
					<span className="text-amber-700 dark:text-amber-500">{result.points.ko.ron}</span>
				)}
			</div>
		</div>
	);
}
