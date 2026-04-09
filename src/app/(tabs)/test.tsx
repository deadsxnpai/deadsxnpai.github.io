import { Colors } from '@/shared/constants/model/theme';
import { MainLayout } from '@/shared/layouts';
import { Typography } from '@/shared/ui';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function HomeScreenTab() {
	return (
		<MainLayout>
			<View style={styles.section}>
				<Typography
					variant='h2'
					style={styles.title}>
					ТЕСТ
				</Typography>
			</View>
		</MainLayout>
	);
}

const styles = StyleSheet.create({
	section: {
		marginTop: 22,
		backgroundColor: Colors.background,
		padding: 16,
		borderRadius: 12,
		elevation: 3,
	},
	title: {
		marginBottom: 8,
	},
	description: {
		color: Colors.gray,
		marginBottom: 16,
	},
	spacer: {
		height: 12,
	},
});
