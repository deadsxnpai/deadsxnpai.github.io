import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/entities/user/model/auth.context';
import { useTheme } from 'expo-router';

export const EmployeeHomePage = () => {
	const { user, logout } = useAuthStore();
	const theme = useTheme();

	return (
		<SafeAreaView
			style={[styles.container, { backgroundColor: theme.colors.background }]}>
			<View style={styles.header}>
				<Text style={styles.badge}>Сотрудник / Преподаватель</Text>
				<Text style={[styles.title, { color: theme.colors.text }]}>
					Панель управления
				</Text>
			</View>

			<View style={styles.content}>
				<View
					style={[
						styles.card,
						{ borderLeftWidth: 4, borderLeftColor: theme.colors.primary },
					]}>
					<Text style={styles.welcomeText}>Личный кабинет сотрудника</Text>
					<Text style={[styles.nameText, { color: theme.colors.text }]}>
						{user?.name || 'Уважаемый сотрудник ТГУ'}
					</Text>

					<View style={styles.infoBlock}>
						<Text style={styles.infoLabel}>Идентификатор 1С:</Text>
						<Text
							style={styles.infoValue}
							numberOfLines={1}>
							{user?.GUID1C || 'не привязан'}
						</Text>
					</View>

					<View style={styles.infoBlock}>
						<Text style={styles.infoLabel}>Учетная запись:</Text>
						<Text style={styles.infoValue}>{user?.sub}</Text>
					</View>
				</View>

				<View style={[styles.card, styles.placeholderCard]}>
					<Text style={styles.placeholderText}>
						📊 Сервисы документооборота и УМО
					</Text>
				</View>
			</View>

			<TouchableOpacity
				style={[
					styles.logoutButton,
					{ backgroundColor: theme.colors.notification },
				]}
				onPress={logout}>
				<Text style={styles.logoutButtonText}>Выйти из системы</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	header: { marginBottom: 24, alignItems: 'flex-start' },
	badge: {
		backgroundColor: '#34c759',
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
		alignItems: 'center',
		paddingVertical: 8,
		borderTopWidth: 1,
		borderTopColor: '#f2f2f7',
	},
	infoLabel: { fontSize: 14, color: '#8e8e93', marginRight: 8 },
	infoValue: {
		fontSize: 14,
		fontWeight: '500',
		color: '#1a1a1a',
		flex: 1,
		textAlign: 'right',
	},
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
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 'auto',
		marginBottom: 16,
	},
	logoutButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
