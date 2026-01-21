import { Colors } from '@/shared/config/theme';
import { IconSymbol } from '@/shared/ui/icon-symbol/icon-symbol';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabsLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors.tint,
				headerShown: false,
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
				name='chatbot'
				options={{
					title: 'Чат-бот',
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
				name='moodle'
				options={{
					title: 'Moodle',
					tabBarIcon: ({ color }) => (
						<IconSymbol
							size={28}
							name={'books.vertical.fill'}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
