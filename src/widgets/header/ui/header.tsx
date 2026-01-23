import { Colors } from '@/shared/constants/theme';
import React from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';

export interface HeaderProps {
	title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
	const logoImage = require('@/shared/assets/logos/logo.png');

	return (
		<View
			style={
				Platform.OS === 'web' ? styles.webContainer : styles.mobileContainer
			}>
			{/* Добавляем логотип */}
			<Image
				source={logoImage}
				style={styles.logo}
				resizeMode='contain'
			/>
			<Text style={styles.title}>{title}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	mobileContainer: {
		backgroundColor: Colors.primary,
		paddingTop: 60,
		paddingBottom: 10,
		paddingHorizontal: 20,
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
		flexDirection: 'row', // Для размещения логотипа и текста в строку
	},
	webContainer: {
		backgroundColor: Colors.primary,
		paddingVertical: 16,
		paddingHorizontal: 20,
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
		flexDirection: 'row', // Для размещения логотипа и текста в строку
	},
	logo: {
		width: 240, // Настройте размер по необходимости
		height: 80,
		marginRight: 0,
	},
	title: {
		color: Colors.white,
		fontSize: 20,
		fontWeight: 'bold',
	},
});
