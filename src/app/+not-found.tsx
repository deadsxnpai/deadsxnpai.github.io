// app/+not-found.tsx
import { Button, Container, Typography } from '@/shared';
import { Header } from '@/widgets';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function NotFoundScreen() {
	return (
		<Container>
			<Header title='' />
			<View style={styles.section}>
				<Typography
					variant='h1'
					style={styles.title}>
					Страница не найдена
				</Typography>
				<Button
					title='Вернуться на главную'
					onPress={() => router.replace('/')}
					variant='primary'
				/>
			</View>
		</Container>
	);
}

const styles = StyleSheet.create({
	content: {
		flex: 1,
		paddingHorizontal: 16,
	},
	section: {
		marginTop: '60%',

		padding: 16,
		borderRadius: 12,
		elevation: 3,
	},
	title: { textAlign: 'center', width: '100%', marginBottom: 50 },
});
