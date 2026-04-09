import { closeTelegramWebApp } from '@/features/auth';
import { getAuthUrl } from '@/shared/constants/model/base';
import { Colors } from '@/shared/constants/model/theme';
import { FullScreenLayout } from '@/shared/layouts';
import { detectPlatform } from '@/shared/lib';
import { getMaxInitData } from '@/shared/lib/max/max.sdk';
import {
	isMaxPlatform,
	isTgPlatform,
} from '@/shared/lib/platform/get-platform';
import { Button, Typography } from '@/shared/ui';
import { retrieveRawInitData } from '@tma.js/sdk';
import React, { useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';

export default function AuthScreen() {
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

			closeTelegramWebApp();

			setTimeout(() => {
				Linking.openURL(url);
			}, 100);
		} catch (e) {
			setError('Ошибка входа. Попробуйте ещё раз.');
		} finally {
			setLoading(false);
		}
	};

	const handleLoginMax = async () => {
		const platform = detectPlatform();

		if (!isMaxPlatform(platform)) {
			setError(
				'Вход доступен только через Max. Откройте приложение внутри Max.',
			);
			return;
		}

		try {
			setLoading(true);
			setError(null);
			const initDataMax = getMaxInitData();

			if (!initDataMax) {
				throw new Error('Не удалось получить данные Max');
			}

			const url = getAuthUrl({ initDataMax });

			await Linking.openURL(url);
		} catch (e) {
			setError('Ошибка входа. Попробуйте ещё раз.');
		} finally {
			setLoading(false);
		}
	};

	const handleLoginSSO = async () => {
		try {
			setLoading(true);
			setError(null);
			const url = getAuthUrl();

			await Linking.openURL(url);
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
					Для входа используйте Telegram или Max. Мы автоматически свяжем ваш
					аккаунт с системой через SSO.
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
				<Button
					style={{ marginTop: 15 }}
					title={loading ? 'Открываем...' : 'Войти через Max'}
					onPress={handleLoginMax}
				/>
				<Button
					style={{ marginTop: 15 }}
					title={loading ? 'Открываем...' : 'Войти через SSO'}
					onPress={handleLoginSSO}
				/>
			</View>
		</FullScreenLayout>
	);
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
		width: '90%',
		maxWidth: 400,
		marginTop: 0,
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
		backgroundColor: Colors.info,
		padding: 12,
		borderRadius: 10,
		marginBottom: 16,
	},

	errorText: {
		color: Colors.red,
		fontSize: 14,
	},
});
