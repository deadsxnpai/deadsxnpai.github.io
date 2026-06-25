import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
	Platform,
	Linking,
	Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSso } from '@/features/auth-by-sso';
import { Colors, EndPoints } from '@/shared/constants';
import { usePlatform } from '@/shared/lib';
import { useTelegramLogin } from '@/features/auth-by-sso/lib/use-tg-login';
import { useMaxLogin } from '@/features/auth-by-sso/lib/use-max-login';
import Icon from '@/shared/assets/logo/favicon.png';

const isWeb = Platform.OS === 'web';

export const LoginPage = () => {
	const { handleSsoLogin, isLoading: isSsoLoading } = useSso();

	const { handleTelegramLogin, isLoading: isTgLoading } = useTelegramLogin();

	const { handleMaxLogin, isLoading: maxLoading } = useMaxLogin();

	const platform = usePlatform();

	const getButtonsConfig = () => {
		// TG: 2 buttons (vertical)
		if (platform === 'tg') {
			return {
				layout: 'vertical',
				buttons: [
					{
						id: 'tg',
						text: 'Войти через Telegram',
						handler: handleTelegramLogin,
						loading: isTgLoading,
						bgColor: '#0088cc',
					},
					{
						id: 'max',
						text: 'Открыть в Max',
						handler: () => Linking.openURL(EndPoints.bot_max),
						loading: false,
						bgColor: '#334FEF',
						isExternal: true,
					},
				],
			};
		}

		// MAX: 2 buttons (vertical)
		if (platform === 'max') {
			return {
				layout: 'vertical',
				buttons: [
					{
						id: 'max',
						text: 'Войти через Max',
						handler: handleMaxLogin,
						loading: maxLoading,
						bgColor: '#334FEF',
					},
					{
						id: 'tg',
						text: 'Открыть в Telegram',
						handler: () => Linking.openURL(EndPoints.bot_tg),
						loading: false,
						bgColor: '#0088cc',
						isExternal: true,
					},
				],
			};
		}

		// Default fallback: 2 buttons (vertical)
		return {
			layout: 'mixed',
			buttons: [
				{
					id: 'sso',
					text: 'Войти через ТГУ.ID',
					handler: handleSsoLogin,
					loading: isSsoLoading,
					bgColor: Colors.primary,
				},
				{
					id: 'max',
					text: 'Открыть в Max',
					handler: () => Linking.openURL(EndPoints.bot_max),
					loading: false,
					bgColor: '#334FEF',
					isExternal: true,
				},
				{
					id: 'tg',
					text: 'Открыть в Telegram',
					handler: () => Linking.openURL(EndPoints.bot_tg),
					loading: false,
					bgColor: '#0088cc',
					isExternal: true,
				},
			],
		};
	};

	const { layout, buttons } = getButtonsConfig();

	const renderButtons = () => {
		if (layout === 'mixed') {
			const [firstButton, ...restButtons] = buttons;

			return (
				<>
					<TouchableOpacity
						style={[
							styles.nativeButton,
							{ backgroundColor: firstButton.bgColor },
							firstButton.loading && styles.disabledButton,
						]}
						onPress={firstButton.handler}
						disabled={firstButton.loading}>
						{firstButton.loading ? (
							<ActivityIndicator color={Colors.white} />
						) : (
							<Text style={styles.buttonText}>{firstButton.text}</Text>
						)}
					</TouchableOpacity>

					<View style={styles.dividerContainer}>
						<View style={styles.dividerLine} />
						<Text style={styles.dividerText}>или</Text>
						<View style={styles.dividerLine} />
					</View>

					{/* Rest buttons in a row */}
					<View style={styles.horizontalContainer}>
						{restButtons.map((button) => (
							<TouchableOpacity
								key={button.id}
								style={[
									styles.horizontalButton,
									{ backgroundColor: button.bgColor },
									button.loading && styles.disabledButton,
								]}
								onPress={button.handler}
								disabled={button.loading}>
								{button.loading ? (
									<ActivityIndicator color={Colors.white} />
								) : (
									<Text style={styles.buttonText}>{button.text}</Text>
								)}
							</TouchableOpacity>
						))}
					</View>
				</>
			);
		}

		return (
			<>
				{buttons.map((button, index) => (
					<React.Fragment key={button.id}>
						<TouchableOpacity
							style={[
								styles.nativeButton,
								{ backgroundColor: button.bgColor },
								button.loading && styles.disabledButton,
							]}
							onPress={button.handler}
							disabled={button.loading}>
							{button.loading ? (
								<ActivityIndicator color={Colors.white} />
							) : (
								<Text style={styles.buttonText}>{button.text}</Text>
							)}
						</TouchableOpacity>

						{index < buttons.length - 1 && (
							<View style={styles.dividerContainer}>
								<View style={styles.dividerLine} />
								<Text style={styles.dividerText}>или</Text>
								<View style={styles.dividerLine} />
							</View>
						)}
					</React.Fragment>
				))}
			</>
		);
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<View style={styles.logoContainer}>
					<View style={styles.logoPlaceholder}>
						{/* <Text style={styles.logoText}>ТГУ</Text> */}
						<View style={styles.logoPlaceholder}>
							<Image
								source={Icon}
								style={styles.logoImage}
								resizeMode='contain'
							/>
						</View>
					</View>
					<Text style={styles.title}>Державинский университет</Text>
					<Text style={styles.subtitle}>
						Единая точка входа в цифровые сервисы
					</Text>
				</View>

				{/* Карточка авторизации */}
				<View style={[styles.card, isWeb && styles.webCard]}>
					<Text style={styles.cardTitle}>Авторизация</Text>
					{renderButtons()}
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
		borderRadius: '50%',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 8,
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
	logoImage: {
		width: 80,
		height: 80,
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
	horizontalContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
		gap: 12,
	},
	horizontalButton: {
		flex: 1,
		height: 50,
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
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
