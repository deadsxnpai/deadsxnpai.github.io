import { User } from '@/entities/user';
import { AuthMeResponse } from '@/features/auth/model/auth.types';

export const mapAuthMeToUser = (api: AuthMeResponse): User => ({
	id: api.data.guid,
	sub: api.sub,
	email: api.email,
	email_work: api.email_work,
	groups: api.groups,
	data: {
		id: api.data.guid,
		fullName: api.data.full_name,
		firstName: api.data.name,
		lastName: api.data.surname,
		middleName: api.data.patronymic,
		birthDate: api.data.date_of_birth,
		birthPlace: api.data.place_of_birth,
		inn: api.data.inn,
		snils: api.data.snils,
		gender: api.data.sex,
		country: api.data.country_name,
		passport: {
			type: api.data.document_type,
			series: api.data.document_series,
			number: api.data.document_number,
		},
		contacts: api.data.contacts.map((c) => ({
			kind: c.kind_contact_information,
			type: c.type_contact_information,
			value: c.value?.value,
			represent: c.represent,
		})),
	},
});
