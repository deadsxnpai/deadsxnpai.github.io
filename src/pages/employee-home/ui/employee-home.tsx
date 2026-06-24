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

export const EmployeeHomePage = () => {
	const { user, logout } = useAuthStore();
	const theme = useTheme();

	const userData = user?.data;

	return (
		<SafeAreaView
			style={[styles.container, { backgroundColor: theme.colors.background }]}>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={styles.header}>
					<Text style={styles.badge}>Сотрудник / Преподаватель</Text>
					<Text style={[styles.title, { color: theme.colors.text }]}>
						Личный кабинет
					</Text>
				</View>

				<View style={styles.content}>
					<View
						style={[
							styles.card,
							{ borderLeftWidth: 4, borderLeftColor: theme.colors.primary },
						]}>
						<Text style={styles.welcomeText}>ФИО сотрудника</Text>
						<Text style={[styles.nameText, { color: theme.colors.text }]}>
							{userData?.full_name || 'Сотрудник ТГУ'}
						</Text>

						{/* Основные данные из DataMe */}
						<InfoRow
							label='GUID 1C'
							value={userData?.guid}
						/>
						<InfoRow
							label='ИНН'
							value={userData?.inn}
						/>
						<InfoRow
							label='СНИЛС'
							value={userData?.snils}
						/>
						<InfoRow
							label='Гражданство'
							value={userData?.country_name}
						/>
					</View>

					<View style={styles.card}>
						<Text style={styles.sectionTitle}>Документ</Text>
						<InfoRow
							label='Тип'
							value={userData?.document_type}
						/>
						<InfoRow
							label='Серия'
							value={userData?.document_series}
						/>
						<InfoRow
							label='Номер'
							value={userData?.document_number}
						/>
					</View>

					{/* Пример отображения контактов */}
					<View style={styles.card}>
						<Text style={styles.sectionTitle}>Контакты</Text>
						{userData?.contacts.map((contact, index) => (
							<InfoRow
								key={index}
								label={contact.kind_contact_information}
								value={contact.value.value}
							/>
						))}
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
			</ScrollView>
		</SafeAreaView>
	);
};

// Вспомогательный компонент для строки данных
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
	header: { marginBottom: 24 },
	badge: {
		backgroundColor: '#34c759',
		color: '#fff',
		fontSize: 11,
		fontWeight: '700',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
		alignSelf: 'flex-start',
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
		marginBottom: 12,
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
	infoLabel: { fontSize: 14, color: '#8e8e93', marginRight: 8 },
	infoValue: {
		fontSize: 14,
		fontWeight: '500',
		color: '#1a1a1a',
		flex: 1,
		textAlign: 'right',
	},
	logoutButton: {
		height: 50,
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	logoutButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
