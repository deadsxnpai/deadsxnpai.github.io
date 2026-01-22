export const parseGroups = (groups?: string): string[] =>
	groups ? groups.split(',').map((g) => g.trim()) : [];
