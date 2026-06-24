export interface UserInfoResponse {
    name: string;
    uid: string;
    groups: string; // На бэкенде приходит строкой через запятую!
    sub: string;
    GUID1C: string;
    email_work: string;
}

export type UserRole = 'student' | 'employee'

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

export type AuthMeResponse = {
    access_token: string;
    email: string;
    email_work: string;
    sub?: string;
    groups: string[];
    data: DataMe;
};

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