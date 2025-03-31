import clsx from 'clsx';
import { ForwardedRef, forwardRef, ReactNode } from 'react';

// eslint-disable-next-line prefer-arrow-callback
export default forwardRef(function VerticalRow(
	{ className = '', children }: { className?: string; children?: ReactNode },
	ref: ForwardedRef<HTMLDivElement>,
) {
	return (
		<div className={clsx('w-full', className)} ref={ref}>
			<div className="w-full flex flex-col justify-center items-center gap-1 lg:gap-2 min-w-min lg:px-2">
				{children}
			</div>
		</div>
	);
});
