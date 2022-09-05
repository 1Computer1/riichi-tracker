import { ReactNode } from 'react';

export default function H({ children }: { children: ReactNode }) {
	return <span className="text-amber-700 dark:text-amber-500">{children}</span>;
}

H.Gold = function Gold({ children }: { children: ReactNode }) {
	return <span className="text-amber-700 dark:text-amber-500">{children}</span>;
};

H.Red = function Red({ children }: { children: ReactNode }) {
	return <span className="text-red-600 dark:text-red-700">{children}</span>;
};
