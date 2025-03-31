/* eslint-disable no-negated-condition */

import clsx from 'clsx';
import { ReactNode } from 'react';

export default function ToggleThree({
	toggled,
	left,
	middle,
	right,
	forced = false,
	onToggle,
}: {
	toggled: 0 | 1 | 2;
	left: ReactNode;
	middle: ReactNode;
	right: ReactNode;
	forced?: boolean;
	onToggle?: (toggled: 0 | 1 | 2) => void;
}) {
	return (
		<div className="flex flex-row w-64 lg:w-80 h-10 lg:h-14 text-xl lg:text-2xl">
			{forced ? (
				<button
					disabled
					className={clsx(
						'flex justify-center items-center rounded-xl border w-full shadow p-1 lg:p-2 border-gray-800',
						'bg-amber-500 dark:bg-amber-700',
					)}
				>
					{[left, middle, right][toggled]}
				</button>
			) : (
				<>
					<button
						className={clsx(
							'flex justify-center items-center rounded-xl w-1/3 border rounded-r-none shadow p-1 lg:p-2 border-gray-800 disabled:bg-gray-300 dark:disabled:bg-gray-800 dark:disabled:text-gray-600',
							toggled === 0
								? 'bg-amber-500 hover:bg-amber-600 dark:bg-amber-700 dark:hover:bg-amber-800'
								: 'bg-gray-50 hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-600',
						)}
						onClick={
							onToggle
								? (e) => {
										e.preventDefault();
										if (toggled !== 0) onToggle(0);
								  }
								: undefined
						}
					>
						{left}
					</button>
					<button
						className={clsx(
							'flex justify-center items-center w-1/3 border shadow p-1 lg:p-2 border-gray-800 disabled:bg-gray-300 dark:disabled:bg-gray-800 dark:disabled:text-gray-600',
							toggled === 1
								? 'bg-amber-500 hover:bg-amber-600 dark:bg-amber-700 dark:hover:bg-amber-800'
								: 'bg-gray-50 hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-600',
						)}
						onClick={
							onToggle
								? (e) => {
										e.preventDefault();
										if (toggled !== 1) onToggle(1);
								  }
								: undefined
						}
					>
						{middle}
					</button>
					<button
						className={clsx(
							'flex justify-center items-center border rounded-l-none w-1/3 rounded-xl shadow p-1 lg:p-2 border-gray-800 disabled:bg-gray-300 dark:disabled:bg-gray-800 dark:disabled:text-gray-600',
							toggled === 2
								? 'bg-amber-500 hover:bg-amber-600 dark:bg-amber-700 dark:hover:bg-amber-800'
								: 'bg-gray-50 hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-600',
						)}
						onClick={
							onToggle
								? (e) => {
										e.preventDefault();
										if (toggled !== 2) onToggle(2);
								  }
								: undefined
						}
					>
						{right}
					</button>
				</>
			)}
		</div>
	);
}
