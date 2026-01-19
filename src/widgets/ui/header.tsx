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
		backgroundColor: '#007AFF',
		paddingVertical: 40,
		paddingHorizontal: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},
	webContainer: {
		backgroundColor: '#007AFF',
		paddingVertical: 16,
		paddingHorizontal: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		color: '#FFFFFF',
		fontSize: 20,
		fontWeight: 'bold',
	},
});
