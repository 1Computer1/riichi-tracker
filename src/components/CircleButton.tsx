import clsx from 'clsx';
import { MouseEventHandler, ReactNode } from 'react';

export default function CircleButton({
	onClick,
	highlight = false,
	children,
}: {
	highlight?: boolean;
	onClick?: MouseEventHandler<HTMLButtonElement>;
	children?: ReactNode;
}) {
	return (
		<button
			className={clsx(
				'border border-gray-800 rounded-full p-1 disabled:bg-gray-300 dark:disabled:bg-gray-800 dark:disabled:text-gray-600',
				highlight
					? 'bg-amber-500 hover:bg-amber-600 dark:bg-amber-700 dark:hover:bg-amber-800'
					: 'bg-gray-50 hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-600',
			)}
			onClick={onClick}
		>
			<div className="w-5 h-5 lg:w-12 lg:h-12 text-base lg:text-3xl flex flex-col justify-center items-center">
				{children}
			</div>
		</button>
	);
}
