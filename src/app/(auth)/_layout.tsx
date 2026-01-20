import { Container } from '@/shared/ui/container/container';
import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
	return (
		<Container>
			<Stack
				screenOptions={{
					headerShown: false,
				}}>
				<Stack.Screen name='login' />
			</Stack>
		</Container>
	);
}
