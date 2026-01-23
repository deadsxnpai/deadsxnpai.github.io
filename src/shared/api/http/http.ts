// @/shared/api/http.ts
import { BASE_URL } from '@/shared/constants/base';

export const http = async <T>(
	input: RequestInfo,
	options?: RequestInit,
): Promise<T | null> => {
	try {
		const url =
			typeof input === 'string' && !input.startsWith('http')
				? `${BASE_URL}${input}`
				: input;

		const res = await fetch(url, {
			...options,
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				...options?.headers,
			},
		});

		if (!res.ok) {
			console.error(`HTTP error! Status: ${res.status}`, res);
			return null;
		}

		const data: T = await res.json();
		return data;
	} catch (error) {
		console.error('Fetch failed:', error);
		return null;
	}
};
