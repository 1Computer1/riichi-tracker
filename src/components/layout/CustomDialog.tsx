import { Dialog } from '@headlessui/react';
import { MutableRefObject, ReactNode } from 'react';
import CircleButton from '../CircleButton';
import X from '../icons/heroicons/X';

export default function CustomDialog({
	onClose,
	initialFocus,
	title,
	children,
}: {
	onClose: () => void;
	initialFocus?: MutableRefObject<HTMLElement | null>;
	title?: ReactNode;
	children?: ReactNode;
}) {
	return (
		<Dialog open onClose={onClose} initialFocus={initialFocus}>
			<div className="fixed inset-0 bg-black/80" aria-hidden="true" />
			<div className="fixed inset-0 w-screen h-screen overflow-auto">
				<div className="min-h-screen min-w-screen py-8 px-4 flex flex-col justify-center items-center">
					<Dialog.Panel className="bg-slate-200 dark:bg-gray-900 text-black dark:text-white rounded-xl shadow">
						<div className="flex flex-row justify-between items-center w-full bg-slate-400 dark:bg-gray-700 rounded-t-xl p-2">
							<div className="text-xl lg:text-3xl font-bold ml-1 lg:ml-2">{title}</div>
							<CircleButton onClick={onClose}>
								<X />
							</CircleButton>
						</div>
						<div className="p-4">{children}</div>
					</Dialog.Panel>
				</div>
			</div>
		</Dialog>
	);
}
