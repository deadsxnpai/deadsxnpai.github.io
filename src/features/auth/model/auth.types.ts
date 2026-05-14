export type DataMeContactItem = {
	kind_contact_information: string;
	type_contact_information: string;
	represent: string;
	value: {
		value: string;
		type: string;
		comment?: string;
	};
};

export type DataMe = {
	guid: string;
	full_name: string;
	name: string;
	surname: string;
	patronymic: string;
	date_of_birth: string;
	place_of_birth: string;
	inn: string;
	snils: string;
	sex: string;
	country: string;
	country_name: string;

	document_type: string;
	document_series: string;
	document_number: string;

	contacts: DataMeContactItem[];
};

export type AuthMeResponse = {
	access_token: string;
	email: string;
	email_work: string;
	sub?: string;
	groups: string[];
	data: DataMe;
};
