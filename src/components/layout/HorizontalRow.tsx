import { ReactNode } from 'react';

export default function HorizontalRow({ children }: { children?: ReactNode }) {
	return (
		<div className="w-full overflow-x-auto">
			<div className="flex flex-row justify-center items-stretch gap-x-2 gap-y-2 min-w-min px-2">{children}</div>
		</div>
	);
}
