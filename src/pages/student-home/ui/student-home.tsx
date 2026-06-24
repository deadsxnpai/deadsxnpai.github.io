import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/entities/user/model/auth.context';
import { useTheme } from 'expo-router';

export const StudentHomePage = () => {
	const { user, logout } = useAuthStore();
	const theme = useTheme();

	return (
		<SafeAreaView
			style={[styles.container, { backgroundColor: theme.colors.background }]}>
			<View style={styles.header}>
				<Text style={styles.badge}>Студент</Text>
				<Text style={[styles.title, { color: theme.colors.text }]}>
					Главная
				</Text>
			</View>

			<View style={styles.content}>
				<View style={styles.card}>
					<Text style={styles.welcomeText}>Добро пожаловать,</Text>
					<Text style={[styles.nameText, { color: theme.colors.primary }]}>
						{user?.name || 'Студент Державинского'}
					</Text>

					<View style={styles.infoBlock}>
						<Text style={styles.infoLabel}>Логин ТГУ:</Text>
						<Text style={styles.infoValue}>{user?.sub || 'не указан'}</Text>
					</View>

					<View style={styles.infoBlock}>
						<Text style={styles.infoLabel}>Рабочая почта:</Text>
						<Text style={styles.infoValue}>
							{user?.email_work || 'не указана'}
						</Text>
					</View>
				</View>

				{/* Здесь в будущем будет UI Kit зачеток и расписания */}
				<View style={[styles.card, styles.placeholderCard]}>
					<Text style={styles.placeholderText}>📚 Мои электронные сервисы</Text>
				</View>
			</View>

			<TouchableOpacity
				style={styles.logoutButton}
				onPress={logout}>
				<Text style={styles.logoutButtonText}>Выйти из аккаунта</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	header: { marginBottom: 24, alignItems: 'flex-start' },
	badge: {
		backgroundColor: '#0066cc',
		color: '#fff',
		fontSize: 11,
		fontWeight: '700',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
		overflow: 'hidden',
		marginBottom: 6,
		textTransform: 'uppercase',
	},
	title: { fontSize: 28, fontWeight: 'bold' },
	content: { flex: 1, gap: 16 },
	card: {
		backgroundColor: '#fff',
		padding: 20,
		borderRadius: 14,
		elevation: 2,
	},
	welcomeText: { fontSize: 14, color: '#8e8e93', marginBottom: 4 },
	nameText: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
	infoBlock: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 8,
		borderTopWidth: 1,
		borderTopColor: '#f2f2f7',
	},
	infoLabel: { fontSize: 14, color: '#8e8e93' },
	infoValue: { fontSize: 14, fontWeight: '500', color: '#1a1a1a' },
	placeholderCard: {
		borderStyle: 'dashed',
		borderWidth: 1,
		borderColor: '#c7c7cc',
		backgroundColor: 'transparent',
		elevation: 0,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 40,
	},
	placeholderText: { color: '#8e8e93', fontWeight: '500' },
	logoutButton: {
		height: 50,
		backgroundColor: '#ff3b30',
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 'auto',
		marginBottom: 16,
	},
	logoutButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
