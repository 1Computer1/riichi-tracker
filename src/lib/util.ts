export function replicate<T>(x: T, n: number): T[] {
	return Array.from({ length: n }, () => x);
}

export function updateTheme() {
	if (
		localStorage.theme === 'dark' ||
		(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
	) {
		document.documentElement.classList.add('dark');
	} else {
		document.documentElement.classList.remove('dark');
	}
}
