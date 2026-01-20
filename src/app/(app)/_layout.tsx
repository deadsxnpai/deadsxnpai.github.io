import { Colors } from '@/shared/constants/theme';
import { IconSymbol } from '@/shared/ui/icon-symbol/icon-symbol';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabsLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors['light'].tint,
				headerShown: false,
			}}>
			<Tabs.Screen
				name='index'
				options={{
					title: '',
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
				name='profile/index'
				options={{
					title: '',
					tabBarIcon: ({ color }) => (
						<IconSymbol
							size={28}
							name={'person.fill'}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name='chatbot/index'
				options={{
					title: '',
					tabBarIcon: ({ color }) => (
						<IconSymbol
							size={28}
							name={'message.fill'}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
