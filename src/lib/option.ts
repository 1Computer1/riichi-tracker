export type Option<T> = { ok: true; value: T } | { ok: false; value: null };

export function some<T>(t: T): Option<T> {
	return { ok: true, value: t };
}

export function none<T>(): Option<T> {
	return { ok: false, value: null };
}
