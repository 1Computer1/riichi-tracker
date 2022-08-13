import clsx from 'clsx';
import { ReactNode } from 'react';

export default function ToggleOnOff({
	toggled,
	incompatible = false,
	disabled = false,
	children,
	onToggle,
}: {
	toggled: boolean;
	incompatible?: boolean;
	disabled?: boolean;
	children?: ReactNode;
	onToggle?: (toggled: boolean) => void;
}) {
	return (
		<div className="flex flex-row w-36 lg:w-80">
			<button
				className={clsx(
					'flex justify-center items-center rounded-xl w-full border shadow text-sm md:text-lg lg:text-2xl py-1 lg:p-2 border-gray-800 disabled:bg-gray-300 dark:disabled:bg-gray-800 dark:disabled:text-gray-600',
					!toggled && incompatible
						? 'bg-gray-200 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-500'
						: toggled
						? 'bg-amber-500 hover:bg-amber-600 dark:bg-amber-700 dark:hover:bg-amber-800'
						: 'bg-gray-50 hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-600',
				)}
				disabled={disabled}
				onClick={onToggle && (() => onToggle(!toggled))}
			>
				{children}
			</button>
		</div>
	);
}
