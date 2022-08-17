export function replicate<T>(x: T, n: number): T[] {
	return Array.from({ length: n }, () => x);
}
