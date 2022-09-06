import { ReactNode } from 'react';

export default function HorizontalRow({ children }: { children?: ReactNode }) {
	return (
		<div className="w-full">
			<div className="flex flex-row flex-wrap justify-center items-center gap-1 lg:gap-2 min-w-min lg:px-2">
				{children}
			</div>
		</div>
	);
}
