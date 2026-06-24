export interface UserInfoResponse {
    name: string;
    uid: string;
    groups: string; // На бэкенде приходит строкой через запятую!
    sub: string;
    GUID1C: string;
    email_work: string;
}

export type UserRole = 'student' | 'employee' 