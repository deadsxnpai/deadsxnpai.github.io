import { Contact } from '@/entities/user/model/user.types';

export function findContact(
	list: Contact[] | undefined,
	type: Record<string, any>,
): string {
	const info = list?.find((item: any) => {
		return Object.keys(type).every((key) => item[key] === type[key]);
	});

	if (info) {
		return info.represent ?? '--';
	}
	return '--';
}

export function formatPhoneNumber(phone: string): string {
	return phone.replace(/(?!^)[^0-9]/g, '');
}
