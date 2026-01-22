export const http = async <T>(input: RequestInfo): Promise<T | null> => {
	try {
		const res = await fetch(input, {
			credentials: 'include',
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
