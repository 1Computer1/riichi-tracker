import clsx from 'clsx';
import { ReactNode } from 'react';
import Minus from './icons/heroicons/Minus';
import Plus from './icons/heroicons/Plus';

export default function Counter({
	onIncrement,
	onDecrement,
	canIncrement = true,
	canDecrement = true,
	children,
}: {
	onIncrement?: () => void;
	onDecrement?: () => void;
	canIncrement?: boolean;
	canDecrement?: boolean;
	children?: ReactNode;
}) {
	return (
		<div className={clsx('flex flex-row justify-center items-stretch w-52 lg:w-80 text-xl lg:text-2xl')}>
			<button
				onClick={onDecrement}
				disabled={!canDecrement}
				className="flex justify-center items-center rounded-xl w-[15%] border rounded-r-none border-r-0 shadow bg-gray-50 hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-600 border-gray-800 disabled:bg-gray-300 dark:disabled:bg-gray-800 dark:disabled:text-gray-600"
			>
				<div className="w-3 h-3 lg:w-6 lg:h-6">
					<Minus />
				</div>
			</button>
			<div className="flex justify-center items-center p-1 lg:p-2 w-[70%] border bg-gray-50 dark:bg-gray-500 border-gray-800">
				{children}
			</div>
			<button
				onClick={onIncrement}
				disabled={!canIncrement}
				className="flex justify-center items-center border border-l-0 rounded-l-none w-[15%] rounded-xl shadow bg-gray-50 hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-600 border-gray-800 disabled:bg-gray-300 dark:disabled:bg-gray-800 dark:disabled:text-gray-600"
			>
				<div className="w-3 h-3 lg:w-6 lg:h-6">
					<Plus />
				</div>
			</button>
		</div>
	);
}
