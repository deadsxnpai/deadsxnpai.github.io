import { getAuthUrl } from '@/shared/constants/model/base';
import { Colors } from '@/shared/constants/model/theme';
import { FullScreenLayout } from '@/shared/layouts';
import { detectPlatform } from '@/shared/lib';
import { isTgPlatform } from '@/shared/lib/platform/get-platform';
import { Button, Typography } from '@/shared/ui';
import { retrieveRawInitData } from '@tma.js/sdk';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function AuthOnlyMaxScreen() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleLogin = async () => {
		const platform = detectPlatform();

		if (!isTgPlatform(platform)) {
			setError(
				'Вход доступен только через Telegram. Откройте приложение внутри Telegram.',
			);
			return;
		}

		try {
			setLoading(true);
			setError(null);

			const initData = retrieveRawInitData();

			if (!initData) {
				throw new Error('Не удалось получить данные Telegram');
			}

			const url = getAuthUrl({ initData });

			if (window.Telegram?.WebApp) {
				window.Telegram.WebApp.openLink(url);
			} else {
				window.open(url, '_blank');
			}
		} catch (e) {
			setError('Ошибка входа. Попробуйте ещё раз.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<FullScreenLayout>
			<View style={styles.container}>
				<Typography
					variant='h1'
					style={styles.title}>
					Вход в личный кабинет
				</Typography>

				<Typography
					variant='body'
					style={styles.description}>
					Для входа используйте Telegram. Мы автоматически свяжем ваш аккаунт с
					системой через SSO.
				</Typography>

				{error && (
					<View style={styles.errorBox}>
						<Typography style={styles.errorText}>{error}</Typography>
					</View>
				)}

				<Button
					title={loading ? 'Открываем...' : 'Войти через Telegram'}
					onPress={handleLogin}
				/>
			</View>
		</FullScreenLayout>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 24,
		backgroundColor: Colors.background,
		padding: 20,
		borderRadius: 16,
		elevation: 4,
	},

	title: {
		marginBottom: 10,
	},

	description: {
		color: Colors.gray,
		marginBottom: 20,
		lineHeight: 20,
	},

	errorBox: {
		backgroundColor: '#ffe5e5',
		padding: 12,
		borderRadius: 10,
		marginBottom: 16,
	},

	errorText: {
		color: '#b00020',
		fontSize: 14,
	},
});
