export interface Contact {
	kind: string;
	type: string;
	value: string;
	represent: string;
}

export interface Passport {
	type: string;
	series: string;
	number: string;
}

export interface UserData {
	id: string;
	fullName: string;
	firstName: string;
	lastName: string;
	middleName?: string;
	birthDate?: string;
	birthPlace?: string;
	inn?: string;
	snils?: string;
	gender?: string;
	country?: string;
	passport?: Passport;
	contacts?: Contact[];
}

export interface User {
	id: string;
	email: string;
	email_work: string;
	sub?: string;
	groups: string[];
	data: UserData;
}
