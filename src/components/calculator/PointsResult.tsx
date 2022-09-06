import { CalculatedValue, ceil100 } from '../../lib/hand';
import H from '../text/H';

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
				<span className="text-6xl">
					<H>{result.points.total}</H>
				</span>
				<span className="text-2xl">Points</span>
			</div>
			<div className="text-2xl text-center">
				Points to take: <TakeText result={result} pao={pao} />
			</div>
		</div>
	);
}

export function TakeText({ result, pao }: { result: CalculatedValue & { agari: 'ron' | 'tsumo' }; pao: boolean }) {
	return result.isOya ? (
		result.agari === 'tsumo' ? (
			pao ? (
				<span>
					<H>{result.points.total}</H> from liable
				</span>
			) : (
				<span>
					<H>{result.points.oya.ko}</H> all
				</span>
			)
		) : pao ? (
			<span>
				<H>{ceil100(result.points.oya.ron / 2)}</H> from both
			</span>
		) : (
			<H>{result.points.oya.ron}</H>
		)
	) : result.agari === 'tsumo' ? (
		pao ? (
			<span>
				<H>{result.points.total}</H> from liable
			</span>
		) : (
			<>
				<H>{result.points.ko.oya}</H>, <H>{result.points.ko.ko}</H>
			</>
		)
	) : pao ? (
		<span>
			<H>{ceil100(result.points.ko.ron / 2)}</H> from both
		</span>
	) : (
		<H>{result.points.ko.ron}</H>
	);
}
