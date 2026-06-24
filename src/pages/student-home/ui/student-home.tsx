import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'expo-router';
import { useAuthStore } from '@/shared/lib/providers/auth-provider';

export const StudentHomePage = () => {
	const { user, logout } = useAuthStore();
	const theme = useTheme();

	const userData = user?.data;

	return (
		<SafeAreaView
			style={[styles.container, { backgroundColor: theme.colors.background }]}>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={styles.header}>
					<Text style={styles.badge}>Студент</Text>
					<Text style={[styles.title, { color: theme.colors.text }]}>
						Главная
					</Text>
				</View>

				<View style={styles.content}>
					{/* Карточка профиля */}
					<View style={styles.card}>
						<Text style={styles.welcomeText}>Добро пожаловать,</Text>
						<Text style={[styles.nameText, { color: theme.colors.primary }]}>
							{userData?.full_name || 'Студент Державинского'}
						</Text>

						<InfoRow
							label='Логин'
							value={user?.sub}
						/>
						<InfoRow
							label='Почта'
							value={user?.email}
						/>
						<InfoRow
							label='ИНН'
							value={userData?.inn}
						/>
					</View>

					{/* Карточка данных */}
					<View style={styles.card}>
						<Text style={styles.sectionTitle}>Персональные данные</Text>
						<InfoRow
							label='Дата рождения'
							value={userData?.date_of_birth}
						/>
						<InfoRow
							label='Гражданство'
							value={userData?.country_name}
						/>
					</View>

					{/* Placeholder для сервисов */}
					<View style={[styles.card, styles.placeholderCard]}>
						<Text style={styles.placeholderText}>
							📚 Мои электронные сервисы
						</Text>
					</View>
				</View>

				<TouchableOpacity
					style={styles.logoutButton}
					onPress={logout}>
					<Text style={styles.logoutButtonText}>Выйти из аккаунта</Text>
				</TouchableOpacity>
			</ScrollView>
		</SafeAreaView>
	);
};

const InfoRow = ({ label, value }: { label: string; value?: string }) => (
	<View style={styles.infoBlock}>
		<Text style={styles.infoLabel}>{label}:</Text>
		<Text
			style={styles.infoValue}
			numberOfLines={1}>
			{value || '-'}
		</Text>
	</View>
);

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
	content: { gap: 16, marginBottom: 20 },
	card: {
		backgroundColor: '#fff',
		padding: 20,
		borderRadius: 14,
		elevation: 2,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: '600',
		marginBottom: 8,
		color: '#333',
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
	infoValue: {
		fontSize: 14,
		fontWeight: '500',
		color: '#1a1a1a',
		textAlign: 'right',
		flex: 1,
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
		backgroundColor: '#ff3b30',
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 16,
	},
	logoutButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
