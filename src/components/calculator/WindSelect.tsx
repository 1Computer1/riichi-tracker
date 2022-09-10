import TileButton from './TileButton';
import { nextWind, Wind } from '../../lib/hand';

export default function WindSelect({
	value,
	dealerOnly = false,
	redEast = false,
	forced = false,
	sanma,
	onChange,
}: {
	value: Wind;
	dealerOnly?: boolean;
	redEast?: boolean;
	forced?: boolean;
	sanma: boolean;
	onChange?: (w: Wind) => void;
}) {
	return (
		<TileButton
			tile={dealerOnly && value !== '1' ? '00' : `${value}z`}
			red={redEast && value === '1'}
			forced={forced}
			onClick={
				onChange &&
				(() => {
					if (dealerOnly) {
						onChange(value === '1' ? '2' : '1');
					} else {
						onChange(nextWind(value, 1, sanma));
					}
				})
			}
		/>
	);
}
