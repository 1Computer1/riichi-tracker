import TileButton from './TileButton';
import { Hand, isDora, Meld } from '../../lib/hand';

export default function MeldButton({
	meld,
	hand,
	onClick,
}: {
	meld: Meld;
	hand: Hand;
	onClick?: (meld: Meld) => void;
}) {
	return (
		<div className="flex flex-row gap-x-0.5 group">
			{meld.t === 'chiipon'
				? meld.tiles.map((t, i) => (
						<TileButton key={i} tile={t} onClick={onClick && (() => onClick(meld))} dora={isDora(t, hand)} />
				  ))
				: meld.closed
				? meld.tiles.map((t, i) => (
						<TileButton
							key={i}
							tile={i === 1 || i === 2 ? '00' : t}
							onClick={onClick && (() => onClick(meld))}
							dora={!(i === 1 || i === 2) && isDora(t, hand)}
						/>
				  ))
				: meld.tiles.map((t, i) => (
						<TileButton key={i} tile={t} onClick={onClick && (() => onClick(meld))} dora={isDora(t, hand)} />
				  ))}
		</div>
	);
}
