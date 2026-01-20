import { Button, Container, Typography } from '@/shared';
import { Header } from '@/widgets';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export function HomeScreen() {
	return (
		<Container>
			<Header title='' />
			<ScrollView style={styles.content}>
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
			</ScrollView>
		</Container>
	);
}

const styles = StyleSheet.create({
	content: {
		flex: 1,
		paddingHorizontal: 16,
	},
	section: {
		marginTop: 22,
		backgroundColor: '#fff',
		padding: 16,
		borderRadius: 12,
		elevation: 3,
	},
	title: {
		marginBottom: 8,
	},
	description: {
		color: '#666',
		marginBottom: 16,
	},
	spacer: {
		height: 12,
	},
});
