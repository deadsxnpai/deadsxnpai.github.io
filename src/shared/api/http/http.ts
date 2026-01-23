import { BASE_URL } from '@/shared/constants/base';

export async function apiFetch<T>(
	endpoint: string,
	options: RequestInit = {},
): Promise<T> {
	const url = `${BASE_URL}${endpoint}`;

	const res = await fetch(url, {
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Credentials': 'true',
		},
		...options,
	});

	if (!res.ok) {
		throw new Error(`HTTP error: ${res.status}`);
	}

	return res.json();
}

export const http = {
	get: <T>(endpoint: string) => apiFetch<T>(endpoint, { method: 'GET' }),
	post: <T>(endpoint: string, data?: any) =>
		apiFetch<T>(endpoint, {
			method: 'POST',
			body: JSON.stringify(data),
		}),
	put: <T>(endpoint: string, data?: any) =>
		apiFetch<T>(endpoint, {
			method: 'PUT',
			body: JSON.stringify(data),
		}),
	delete: <T>(endpoint: string) => apiFetch<T>(endpoint, { method: 'DELETE' }),
};
