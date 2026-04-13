export function getUserType(groups: string[]): string {
	if (groups.includes('tester')) return 'tester';
	if (groups.includes('teacher')) return 'worker';
	if (groups.includes('teacherGPH')) return 'teacherGPH';
	if (groups.includes('student-rakus')) return 'student-rakus';
	if (groups.includes('student')) return 'student';
	if (groups.includes('employee')) return 'employee';
	return 'selfsignup';
}
