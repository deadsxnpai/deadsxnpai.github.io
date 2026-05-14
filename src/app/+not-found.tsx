// app/+not-found.tsx
import { MainLayout } from '@/shared/layouts';
import { Button, Typography } from '@/shared/ui';
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
					onPress={() => router.replace('/(tabs)')}
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
