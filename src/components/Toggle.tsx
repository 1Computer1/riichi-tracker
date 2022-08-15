/* eslint-disable no-negated-condition */

import clsx from 'clsx';
import { ReactNode } from 'react';

export default function Toggle({
	toggled,
	left,
	right,
	forced = false,
	onToggle,
}: {
	toggled: boolean;
	left: ReactNode;
	right: ReactNode;
	forced?: boolean;
	onToggle?: (toggled: boolean) => void;
}) {
	return (
		<div className="flex flex-row w-36 lg:w-80">
			{forced ? (
				<div
					className={clsx(
						'flex justify-center items-center rounded-xl border w-full shadow text-sm md:text-lg lg:text-2xl py-1 lg:p-2 border-gray-800',
						'bg-amber-500 dark:bg-amber-700',
					)}
				>
					{toggled ? right : left}
				</div>
			) : (
				<>
					<button
						className={clsx(
							'flex justify-center items-center rounded-xl w-1/2 border rounded-r-none shadow text-sm md:text-lg lg:text-2xl py-1 lg:p-2 border-gray-800 disabled:bg-gray-300 dark:disabled:bg-gray-800 dark:disabled:text-gray-600',
							!toggled
								? 'bg-amber-500 hover:bg-amber-600 dark:bg-amber-700 dark:hover:bg-amber-800'
								: 'bg-gray-50 hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-600',
						)}
						onClick={
							onToggle
								? (e) => {
										e.preventDefault();
										if (toggled) onToggle(false);
								  }
								: undefined
						}
					>
						{left}
					</button>
					<button
						className={clsx(
							'flex justify-center items-center border rounded-l-none w-1/2 rounded-xl shadow text-sm md:text-lg lg:text-2xl py-1 lg:p-2 border-gray-800 disabled:bg-gray-300 dark:disabled:bg-gray-800 dark:disabled:text-gray-600',
							toggled
								? 'bg-amber-500 hover:bg-amber-600 dark:bg-amber-700 dark:hover:bg-amber-800'
								: 'bg-gray-50 hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-600',
						)}
						onClick={
							onToggle
								? (e) => {
										e.preventDefault();
										if (!toggled) onToggle(true);
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
