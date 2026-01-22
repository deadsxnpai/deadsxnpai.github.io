/* eslint-disable react-native/no-inline-styles */
import { Colors } from '@/shared/constants/theme';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

export const Loader = ({ text = 'Получение данных...' }) => {
	return (
		<View
			style={{
				flex: 1,
				flexGrow: 1,
				justifyContent: 'center',
				alignItems: 'center',
			}}>
			<ActivityIndicator
				size={'large'}
				color={Colors.primary}
			/>
			<Text style={{ color: Colors.text, marginTop: 10 }}>{text}</Text>
		</View>
	);
};
