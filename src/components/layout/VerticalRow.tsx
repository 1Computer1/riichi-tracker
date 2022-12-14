import { ReactNode } from 'react';

export default function VerticalRow({ children }: { children?: ReactNode }) {
	return (
		<div className="w-full">
			<div className="w-full flex flex-col justify-center items-center gap-1 lg:gap-2 min-w-min lg:px-2">
				{children}
			</div>
		</div>
	);
}
