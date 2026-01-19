import { Colors } from '@/shared/constants/theme';
import { useColorScheme } from '@/shared/lib/hooks/use-color-scheme';
import { IconSymbol } from '@/shared/ui/icon-symbol/icon-symbol';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? 'light'].background,
				headerShown: false,
				tabBarStyle: {
					height: 60,
				},
			}}>
			<Tabs.Screen
				name='index'
				options={{
					title: 'Главная',
					tabBarIcon: ({ color }) => (
						<IconSymbol
							size={28}
							name={'house.fill'}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name='profile'
				options={{
					title: 'Профиль',
					tabBarIcon: ({ color }) => (
						<IconSymbol
							size={28}
							name={'person.fill'}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
