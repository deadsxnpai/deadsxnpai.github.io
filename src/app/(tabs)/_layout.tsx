import { useGetRole } from '@/features/auth/model/auth.selectors';
import { Colors } from '@/shared/constants/model/theme';
import { IconSymbol } from '@/shared/ui/icon-symbol/icon-symbol';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabsLayout() {
	const role = useGetRole();
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors.tint,
				headerShown: false,
			}}>
			<Tabs.Screen
				name='index'
				options={{
					title: ' ',
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
				name='chatbot'
				options={{
					title: ' ',
					tabBarIcon: ({ color }) => (
						<IconSymbol
							size={28}
							name={'message.fill'}
							color={color}
						/>
					),
				}}
			/>

			<Tabs.Screen
				name='student'
				options={{
					href: null,
				}}
			/>
		</Tabs>
	);
}
