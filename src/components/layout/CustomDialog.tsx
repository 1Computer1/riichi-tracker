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
			<div className="fixed z-20 inset-0 bg-black/70" aria-hidden="true" />
			<div className="fixed z-20 inset-0 flex flex-col justify-center items-center">
				<div className="flex flex-col justify-center items-center">
					<Dialog.Panel className="max-w-[100vw] max-h-screen">
						<div className="text-black dark:text-white flex flex-col max-w-[100vw] max-h-screen px-4 py-8">
							<div className="flex flex-row justify-between items-center w-full bg-slate-400 dark:bg-gray-700 rounded-t-xl p-2">
								<div className="text-xl lg:text-3xl font-bold ml-1 lg:ml-2">{title}</div>
								<CircleButton onClick={onClose}>
									<X />
								</CircleButton>
							</div>
							<div className="bg-slate-200 dark:bg-gray-900 rounded-b-xl shadow overflow-auto py-4 px-4 lg:px-8">
								{children}
							</div>
						</div>
					</Dialog.Panel>
				</div>
			</div>
		</Dialog>
	);
}
