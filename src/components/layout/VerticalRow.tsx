import { ReactNode } from 'react';

export default function VerticalRow({ children }: { children?: ReactNode }) {
	return (
		<div className="w-full overflow-x-auto">
			<div className="w-full flex flex-col justify-center items-center gap-2 min-w-min px-2">{children}</div>
		</div>
	);
}
