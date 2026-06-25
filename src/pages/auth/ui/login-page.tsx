import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
	Platform,
	Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSso } from '@/features/auth-by-sso';
import { Colors, EndPoints } from '@/shared/constants';
import { usePlatform } from '@/shared/lib';
import { useTelegramLogin } from '@/features/auth-by-sso/lib/use-tg-login';

const isWeb = Platform.OS === 'web';

export const LoginPage = () => {
	const { handleSsoLogin, isLoading: isSsoLoading } = useSso();
	const {
		handleTelegramLogin,
		isLoading: isTgLoading,
		error: tgError,
	} = useTelegramLogin();

	const platform = usePlatform();
	const handleLogin = platform === 'tg' ? handleTelegramLogin : handleSsoLogin;
	const isLoading = isWeb ? isSsoLoading : isTgLoading;
	const error = isWeb ? null : tgError;

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<View style={styles.logoContainer}>
					<View style={styles.logoPlaceholder}>
						<Text style={styles.logoText}>ТГУ</Text>
					</View>
					<Text style={styles.title}>Державинский университет</Text>
					<Text style={styles.subtitle}>
						Единая точка входа в цифровые сервисы
					</Text>
				</View>

				{/* Карточка авторизации */}
				<View style={[styles.card, isWeb && styles.webCard]}>
					<Text style={styles.cardTitle}>Авторизация</Text>

					{/* Кнопка SSO (ТГУ Сеть) */}
					<TouchableOpacity
						style={[styles.nativeButton, isSsoLoading && styles.disabledButton]}
						onPress={handleLogin}
						disabled={isLoading}>
						{isLoading ? (
							<ActivityIndicator color={Colors.white} />
						) : (
							<Text style={styles.buttonText}>Войти через ТГУ.ID</Text>
						)}
					</TouchableOpacity>

					{/* Разделитель */}
					<View style={styles.dividerContainer}>
						<View style={styles.dividerLine} />
						<Text style={styles.dividerText}>или</Text>
						<View style={styles.dividerLine} />
					</View>

					{/* Кнопка Telegram */}
					<TouchableOpacity
						style={[
							styles.nativeButton,
							{ backgroundColor: '#26A8EA' },
							(isTgLoading || isSsoLoading) && styles.disabledButton,
						]}
						onPress={() => Linking.openURL(EndPoints.bot)}
						disabled={isTgLoading || isSsoLoading}>
						{isTgLoading ? (
							<ActivityIndicator color={Colors.white} />
						) : (
							<Text style={styles.buttonText}>Открыть в Telegram</Text>
						)}
					</TouchableOpacity>

					{/* Блок вывода ошибки */}
					{error && (
						<View style={styles.errorContainer}>
							<Text style={styles.errorText}>{error}</Text>
						</View>
					)}
				</View>

				{/* Футер */}
				<Text style={styles.footerText}>
					© {new Date().getFullYear()} ФГБОУ ВО «ТГУ им. Г.Р. Державина»
				</Text>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
	},
	content: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
		width: '100%',
	},
	logoContainer: {
		alignItems: 'center',
		marginBottom: 40,
	},
	logoPlaceholder: {
		width: 80,
		height: 80,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 16,
		backgroundColor: Colors.primary,
		...Platform.select({
			ios: {
				shadowColor: Colors.black,
				shadowOffset: { width: 0, height: 4 },
				shadowOpacity: 0.1,
				shadowRadius: 8,
			},
			android: {
				elevation: 4,
			},
			web: {
				boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
			},
		}),
	},
	logoText: {
		color: Colors.white,
		fontSize: 24,
		fontWeight: 'bold',
		letterSpacing: 1,
	},
	title: {
		fontSize: 22,
		fontWeight: '700',
		textAlign: 'center',
		marginBottom: 6,
		color: Colors.text,
	},
	subtitle: {
		fontSize: 14,
		color: Colors.icon,
		textAlign: 'center',
	},
	card: {
		width: '100%',
		maxWidth: 400,
		alignItems: 'center',
		paddingHorizontal: 16,
	},
	webCard: {
		backgroundColor: Colors.white,
		borderRadius: 16,
		padding: 32,
		borderWidth: 1,
		borderColor: Colors.secondary,
	},
	cardTitle: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 20,
		alignSelf: 'center',
		color: Colors.text,
	},
	nativeButton: {
		height: 50,
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		marginVertical: 4,
		backgroundColor: Colors.primary,
	},
	disabledButton: {
		opacity: 0.6,
	},
	buttonText: {
		color: Colors.white,
		fontSize: 16,
		fontWeight: '600',
	},
	dividerContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 16,
		width: '100%',
	},
	dividerLine: {
		flex: 1,
		height: 1,
		backgroundColor: Colors.secondary,
	},
	dividerText: {
		marginHorizontal: 12,
		color: Colors.icon,
		fontSize: 14,
	},
	footerText: {
		position: isWeb ? 'relative' : 'absolute',
		bottom: isWeb ? -60 : 20,
		fontSize: 12,
		color: Colors.icon,
		textAlign: 'center',
	},
	errorContainer: {
		marginTop: 12,
		padding: 8,
		backgroundColor: Colors.background,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: Colors.border,
	},
	errorText: {
		color: Colors.error,
		fontSize: 13,
		textAlign: 'center',
	},
	debugText: {
		fontSize: 10,
		color: '#888',
		paddingHorizontal: 20,
		marginTop: 10,
		textAlign: 'center',
	},
	footerContainer: {
		position: 'absolute',
		bottom: 10,
		width: '100%',
	},
});
