import { HapticTab, IconSymbol } from '@/shared';
import { Colors } from '@/shared/constants/theme';
import { useColorScheme } from '@/shared/lib/hooks/use-color-scheme';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
				headerShown: false,
				tabBarButton: HapticTab,
			}}>
			<Tabs.Screen
				name='index'
				options={{
					title: 'Home',
					tabBarIcon: ({ color }) => (
						<IconSymbol
							size={28}
							name='house.fill'
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
