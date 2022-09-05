import { useState } from 'react';
import useLocalStorage from './useLocalStorage';

export function useTheme(): 'dark' | 'light' {
	const [theme] = useLocalStorage('theme');
	const mq = window.matchMedia('(prefers-color-scheme: dark)');
	const [dark, setDark] = useState(mq.matches);
	mq.addEventListener('change', (x) => setDark(x.matches));
	return (theme as 'light' | 'dark' | null) ?? (dark ? 'dark' : 'light');
}
