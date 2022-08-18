import clsx from 'clsx';
import { ReactNode } from 'react';

export default function ToggleOnOff({
	toggled,
	incompatible = false,
	disabled = false,
	forced = false,
	children,
	onToggle,
}: {
	toggled: boolean;
	incompatible?: boolean;
	disabled?: boolean;
	forced?: boolean;
	children?: ReactNode;
	onToggle?: (toggled: boolean) => void;
}) {
	return (
		<div className="flex flex-row w-52 lg:w-80 h-10 lg:h-14 text-xl lg:text-2xl">
			{forced ? (
				<button
					disabled
					className={clsx(
						'flex justify-center items-center rounded-xl border w-full shadow p-1 lg:p-2 border-gray-800',
						toggled ? 'bg-amber-500 dark:bg-amber-700' : 'bg-gray-300 dark:bg-gray-800 dark:text-gray-600',
					)}
				>
					{children}
				</button>
			) : (
				<button
					className={clsx(
						'flex justify-center items-center rounded-xl w-full border shadow p-1 lg:p-2 border-gray-800 disabled:bg-gray-300 dark:disabled:bg-gray-800 dark:disabled:text-gray-600',
						!toggled && incompatible
							? 'bg-gray-200 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600'
							: toggled
							? 'bg-amber-500 hover:bg-amber-600 dark:bg-amber-700 dark:hover:bg-amber-800'
							: 'bg-gray-50 hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-600',
					)}
					disabled={disabled}
					onClick={
						onToggle &&
						((e) => {
							e.preventDefault();
							onToggle(!toggled);
						})
					}
				>
					{children}
				</button>
			)}
		</div>
	);
}
