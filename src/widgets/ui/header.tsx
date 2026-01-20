import { Colors } from '@/shared/constants/theme';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

interface HeaderProps {
	title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
	return (
		<View
			style={
				Platform.OS === 'web' ? styles.webContainer : styles.mobileContainer
			}>
			<Text style={styles.title}>{title}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	mobileContainer: {
		backgroundColor: Colors.primary,
		paddingTop: 60,
		paddingBottom: 40,
		paddingHorizontal: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},
	webContainer: {
		backgroundColor: Colors.primary,
		paddingVertical: 16,
		paddingHorizontal: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		color: Colors.white,
		fontSize: 20,
		fontWeight: 'bold',
	},
});
