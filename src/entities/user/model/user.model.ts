export type User = {
	uid: string;
	sub: string;
	name: string;
	email_work: string;
	groups: string; // raw from backend
};
