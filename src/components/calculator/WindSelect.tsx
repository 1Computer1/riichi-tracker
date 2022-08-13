import TileButton from './TileButton';
import { nextWind, Wind } from '../../lib/hand';

export default function WindSelect({
	value,
	redEast = false,
	forced = false,
	onChange,
}: {
	value: Wind;
	redEast?: boolean;
	forced?: boolean;
	onChange?: (w: Wind) => void;
}) {
	return (
		<TileButton
			tile={`${value}z`}
			red={redEast && value === '1'}
			forced={forced}
			onClick={
				onChange &&
				(() => {
					onChange(nextWind(value));
				})
			}
		/>
	);
}
