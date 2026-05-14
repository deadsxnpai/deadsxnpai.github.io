import Student from '@/app/(tabs)/student';
import { User } from '@/entities/user';
import { useUser } from '@/features/auth';
import React, { useMemo } from 'react';
import { View } from 'react-native';

const getRoleComponent = (user: User | null) => {
	if (!user) return null;

	const { groups } = user;
	if (groups?.indexOf('student') !== -1) {
		return <Student />;
	}

	if (groups?.indexOf('tester') !== -1) {
		return <Student />;
	}

	return null;
};

export default function HomeScreenTab() {
	const user = useUser();

	const roleView = useMemo(() => {
		return getRoleComponent(user);
	}, [user]);

	return <View style={{ flex: 1 }}>{roleView}</View>;
}
