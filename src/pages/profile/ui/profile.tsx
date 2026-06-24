import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	Image,
	ScrollView,
	TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'expo-router';
import { useAuthStore } from '@/shared/lib/providers/auth-provider';
import { Colors } from '@/shared/constants';

export const ProfilePage = () => {
	const { user, logout } = useAuthStore();
	const theme = useTheme();
	const userData = user?.data;

	return (
		<SafeAreaView
			style={[styles.container, { backgroundColor: Colors.surface }]}>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				{/* Аватар */}
				<View style={styles.avatarContainer}>
					<View style={[styles.avatar, { backgroundColor: Colors.primary }]}>
						<Text style={styles.avatarText}>
							{userData?.name?.[0]}
							{userData?.surname?.[0]}
						</Text>
					</View>
					<Text style={[styles.userName, { color: Colors.text }]}>
						{userData?.full_name}
					</Text>
					<Text style={styles.userRole}>
						{user?.groups.includes('employee') ? 'Сотрудник' : 'Студент'}
					</Text>
				</View>

				{/* Инфо-карточки */}
				<View style={styles.card}>
					<InfoRow
						label='Email'
						value={user?.email || '-'}
					/>
					<InfoRow
						label='Рабочий email'
						value={user?.email_work || '-'}
					/>
					<InfoRow
						label='Дата рождения'
						value={userData?.date_of_birth || '-'}
					/>
					<InfoRow
						label='Гражданство'
						value={userData?.country_name || '-'}
					/>
				</View>

				<View style={styles.card}>
					<Text style={styles.sectionTitle}>Документы</Text>
					<InfoRow
						label='Тип документа'
						value={userData?.document_type || '-'}
					/>
					<InfoRow
						label='Серия/Номер'
						value={`${userData?.document_series || ''} ${userData?.document_number || ''}`}
					/>
				</View>
				<TouchableOpacity
					style={[
						styles.logoutButton,
						{ backgroundColor: theme.colors.notification },
					]}
					onPress={logout}>
					<Text style={styles.logoutButtonText}>Выйти из системы</Text>
				</TouchableOpacity>
			</ScrollView>
		</SafeAreaView>
	);
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
	<View style={styles.infoRow}>
		<Text style={styles.label}>{label}</Text>
		<Text style={styles.value}>{value}</Text>
	</View>
);

const styles = StyleSheet.create({
	container: { flex: 1 },
	scrollContent: { padding: 20 },
	avatarContainer: { alignItems: 'center', marginBottom: 30 },
	avatar: {
		width: 100,
		height: 100,
		borderRadius: 50,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 15,
	},
	avatarText: { fontSize: 36, color: '#fff', fontWeight: 'bold' },
	userName: { fontSize: 22, fontWeight: '700', marginBottom: 5 },
	userRole: { fontSize: 16, color: '#8e8e93' },
	card: {
		backgroundColor: '#fff',
		borderRadius: 16,
		padding: 20,
		marginBottom: 16,
		elevation: 2,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 15,
		color: '#333',
	},
	infoRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#f2f2f7',
	},
	label: { color: '#8e8e93', fontSize: 14 },
	value: {
		fontWeight: '500',
		fontSize: 14,
		color: '#1a1a1a',
		textAlign: 'right',
		flex: 1,
		marginLeft: 10,
	},
	logoutButton: {
		height: 50,
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	logoutButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
