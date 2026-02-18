import { Container } from '@/shared/ui/container/container';
import { Stack } from 'expo-router';
import React from 'react';

export default function Layout() {
	return (
		<Container>
			<Stack
				screenOptions={{
					headerShown: false,
				}}>
				<Stack.Screen name='max' />
			</Stack>
		</Container>
	);
}
