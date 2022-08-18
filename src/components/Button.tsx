import clsx from 'clsx';
import { ReactNode } from 'react';

export default function Button({
	active = false,
	disabled = false,
	onClick,
	children,
}: {
	active?: boolean;
	disabled?: boolean;
	onClick?: () => void;
	children?: ReactNode;
}) {
	return (
		<button
			className={clsx(
				'border border-gray-800 rounded-xl shadow p-1 lg:p-2 disabled:bg-gray-300 dark:disabled:bg-gray-800 dark:disabled:text-gray-600',
				'w-52 lg:w-80 h-10 lg:h-14 text-xl lg:text-2xl',
				active
					? 'bg-amber-500 hover:bg-amber-600 dark:bg-amber-700 dark:hover:bg-amber-800'
					: 'bg-gray-50 hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-600',
			)}
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</button>
	);
}
