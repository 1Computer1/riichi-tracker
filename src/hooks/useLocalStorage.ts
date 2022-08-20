import { useCallback, useState } from 'react';

export default function useLocalStorage(key: string): [string | null, (newValue: string | null) => void] {
	const [value, setValue_] = useState(localStorage.getItem(key));
	const setValue = useCallback(
		(newValue: string | null) => {
			if (newValue == null) {
				localStorage.removeItem(key);
			} else {
				localStorage.setItem(key, newValue);
			}
			setValue_(newValue);
		},
		[key],
	);
	return [value, setValue];
}
