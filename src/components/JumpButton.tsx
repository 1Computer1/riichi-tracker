import { ReactNode } from 'react';
import CircleButton from './CircleButton';

export default function JumpButton({
	element,
	alignToTop = true,
	highlight,
	onJump,
	children,
}: {
	element: Element | null;
	alignToTop?: boolean;
	highlight?: boolean;
	onJump?: () => void;
	children?: ReactNode;
}) {
	return (
		<CircleButton
			highlight={highlight}
			onClick={() => {
				element?.scrollIntoView(alignToTop);
				onJump?.();
			}}
		>
			{children}
		</CircleButton>
	);
}
