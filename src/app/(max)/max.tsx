import { useAuthStore } from '@/features';
import { useMaxAuth } from '@/features/auth/hooks/useMaxAuth';
import { Colors } from '@/shared/constants/theme';

import { router } from 'expo-router';
import React, { useEffect } from 'react';
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

export default function MaxAuthScreen() {
	const { checkAuth } = useAuthStore();
	const { maxInitialized, maxUser, isMaxEnvironment } = useMaxAuth();

	// Автоматическая авторизация при получении пользователя из MAX
	useEffect(() => {
		if (maxUser) {
			const appUser = {
				id: maxUser.id.toString(),
				email: `${maxUser.id}@max.user`,
				firstName: maxUser.first_name || '',
				lastName: maxUser.last_name || '',
				username: maxUser.username || '',
				language: maxUser.language_code || 'ru',
				isMaxUser: true,
			};

			router.replace('/(tabs)');
		}
	}, [maxUser]);

	// Показываем загрузку
	if (!maxInitialized && isMaxEnvironment) {
		return (
			<View style={styles.container}>
				<ActivityIndicator
					size='large'
					color='#3390ec'
				/>
				<Text style={styles.loadingText}>Подключение к MAX...</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>ЛК ТГУ</Text>
			<Text style={styles.subtitle}>Вход через MAX</Text>

			{isMaxEnvironment ? (
				<TouchableOpacity
					style={styles.maxButton}
					onPress={() => {
						// Отправляем запрос на авторизацию
						console.log('window.WebApp', window.WebApp);
						if (window.WebApp) {
							// window.WebApp.sendData(
							// 	JSON.stringify({
							// 		action: 'auth_request',
							// 		timestamp: Date.now(),
							// 	}),
							// );
							checkAuth();
						}
					}}>
					<Text style={styles.buttonText}>Продолжить с MAX</Text>
				</TouchableOpacity>
			) : (
				<View style={styles.errorContainer}>
					<Text style={styles.errorText}>
						⚠️ Это приложение доступно только через MAX
					</Text>
					<TouchableOpacity
						style={styles.altButton}
						onPress={() => router.push('/(auth)/login')}>
						<Text style={styles.altButtonText}>Обычный вход</Text>
					</TouchableOpacity>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
		backgroundColor: '#fff',
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold',
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 18,
		color: '#666',
		marginBottom: 48,
	},
	loadingText: {
		marginTop: 16,
		fontSize: 16,
		color: '#666',
	},
	maxButton: {
		backgroundColor: Colors.primary,
		paddingHorizontal: 32,
		paddingVertical: 16,
		borderRadius: 12,
		width: '100%',
		maxWidth: 300,
	},
	buttonText: {
		color: 'white',
		fontSize: 18,
		fontWeight: '600',
		textAlign: 'center',
	},
	errorContainer: {
		padding: 24,
		backgroundColor: Colors.background,
		borderRadius: 16,
		maxWidth: 300,
		width: '100%',
		alignItems: 'center',
	},
	errorText: {
		color: Colors.red,
		textAlign: 'center',
		fontSize: 16,
		marginBottom: 20,
	},
	altButton: {
		backgroundColor: Colors.background,
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: 8,
		width: '100%',
	},
	altButtonText: {
		color: '#333',
		fontSize: 16,
		fontWeight: '500',
		textAlign: 'center',
	},
});
