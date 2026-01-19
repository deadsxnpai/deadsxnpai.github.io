import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface HeaderProps {
	title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>{title}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
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
