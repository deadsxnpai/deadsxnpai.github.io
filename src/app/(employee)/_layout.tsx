import React from 'react';
import { StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Colors } from '@/shared/constants';

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: Colors.tabIconSelected,
				tabBarInactiveTintColor: Colors.tabIconDefault,

				tabBarBackground: () => (
					<BlurView
						intensity={80}
						tint='light'
						style={StyleSheet.absoluteFill}
					/>
				),

				tabBarStyle: {
					position: 'absolute',
					bottom: 20,
					marginHorizontal: 20,
					height: 60,
					borderRadius: 100,
					overflow: 'hidden',
					backgroundColor: Colors.background,
					borderTopWidth: 0,
					elevation: 0,
					borderTopColor: 'transparent',
				},
			}}>
			<Tabs.Screen
				name='index'
				options={{
					title: 'Главная',
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? 'home' : 'home-outline'}
							size={26}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name='profile'
				options={{
					title: 'Профиль',
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? 'person' : 'person-outline'}
							size={26}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
