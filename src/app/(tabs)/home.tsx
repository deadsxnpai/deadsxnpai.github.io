import { Button, Typography } from '@/shared';
import { useMe } from '@/shared/api';
import { Colors } from '@/shared/constants/theme';
import { MainLayout } from '@/shared/layouts';
import { ErrorView } from '@/widgets/error-view';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function HomeScreenTab() {
	const me = useMe();
	console.log('me', me);
	const error = false;
	if (error) {
		return (
			<ErrorView
				error={{
					message: 'ошибка при запросе',
				}}
			/>
		);
	}

	return (
		<MainLayout>
			<View style={styles.section}>
				<Typography
					variant='h1'
					style={styles.title}>
					Welcome to FSD Structure
				</Typography>
				<Typography
					variant='body'
					style={styles.description}>
					This is a simple Expo app with Feature-Sliced Design architecture
				</Typography>
			</View>

			<View style={styles.section}>
				<Typography variant='h2'>Shared UI Components</Typography>
				<Button
					title='Primary Button'
					onPress={() => console.log('Clicked!')}
					variant='primary'
				/>
				<View style={styles.spacer} />
				<Button
					title='Secondary Button'
					onPress={() => console.log('Clicked!')}
					variant='secondary'
				/>
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
