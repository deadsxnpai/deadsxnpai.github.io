export const http = async <T>(
	input: RequestInfo,
	init?: RequestInit,
): Promise<T> => {
	const res = await fetch(input, {
		credentials: 'include', // 🍪 SSO
		...init,
	});
	console.log('res', res);
	if (!res.ok) {
		throw new Error(res.status.toString());
	}

	return res.json();
};
