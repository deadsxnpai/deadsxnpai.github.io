import { Container } from '@/shared/ui/container/container';
import { Typography } from '@/shared/ui/typography/typography';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function ProfileScreen() {
	return (
		<Container>
			<View style={styles.content}>
				<Typography variant='h1'>Profile</Typography>
				<Typography variant='body'>Welcome to your profile!</Typography>
			</View>
		</Container>
	);
}

const styles = StyleSheet.create({
	content: {
		flex: 1,
		padding: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
