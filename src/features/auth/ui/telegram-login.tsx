import { Button, Container, Typography } from '@/shared';
import { Header } from '@/widgets';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAuthStore } from '../model/auth.store';

export const TelegramLogin = () => {
	const checkAuth = useAuthStore((s) => s.checkAuth);

	useEffect(() => {
		const tg = (window as any).Telegram?.WebApp;

		if (!tg) return;

		tg.ready();
		tg.expand();
		checkAuth(); // проверяем initData и сохраняем user
	}, []);

	return (
		<Container>
			<Header title='' />
			<View style={styles.section}>
				<Typography
					variant='h1'
					style={styles.title}>
					Вход через Telegram
				</Typography>
				<Button
					title='Вернуться на главную'
					onPress={() => router.replace('/')}
					variant='primary'
				/>
			</View>
		</Container>
	);
};

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
