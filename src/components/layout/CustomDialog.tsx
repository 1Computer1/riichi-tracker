import { Dialog } from '@headlessui/react';
import { MutableRefObject, ReactNode } from 'react';
import CircleButton from '../CircleButton';
import X from '../icons/heroicons/X';

export default function CustomDialog({
	onClose,
	initialFocus,
	children,
}: {
	onClose: () => void;
	initialFocus?: MutableRefObject<HTMLElement | null>;
	children?: ReactNode;
}) {
	return (
		<Dialog open onClose={onClose} initialFocus={initialFocus}>
			<div className="fixed inset-0 bg-black/80" aria-hidden="true" />
			<div className="fixed inset-0 w-screen h-screen overflow-auto">
				<div className="min-h-screen min-w-screen p-4 flex flex-col justify-center items-center">
					<Dialog.Panel className="bg-slate-200 dark:bg-gray-900 text-black dark:text-white rounded-xl shadow p-4">
						<div className="flex flex-row justify-end items-center w-full mb-1">
							<CircleButton onClick={onClose}>
								<X />
							</CircleButton>
						</div>
						{children}
					</Dialog.Panel>
				</div>
			</div>
		</Dialog>
	);
}
