// app/+not-found.tsx
import { Button, Typography } from '@/shared';
import { MainLayout } from '@/shared/layouts';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function NotFoundScreen() {
	return (
		<MainLayout>
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
		</MainLayout>
	);
}

const styles = StyleSheet.create({
	section: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: '100%',
		borderRadius: 12,
		elevation: 3,
	},
	title: { textAlign: 'center', width: '100%', marginBottom: 50 },
});
