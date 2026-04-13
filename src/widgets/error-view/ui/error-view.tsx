import { Colors } from '@/shared/constants/model/theme';
import { FullScreenLayout } from '@/shared/layouts';
import { Button, IconSymbol, Typography } from '@/shared/ui';
import { IconSymbolName } from '@/shared/ui/icon-symbol/icon-symbol';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface ActionButton {
	text: string;
	onPress: () => void;
	icon?: IconSymbolName;
}

interface ErrorViewProps {
	error: any;
	title?: string;
	onRetry?: () => void;
	showDetailsToggle?: boolean;
	actionButton?: ActionButton;
	hideErrorDetails?: boolean;
}

// Helper to check if error is ApolloError
const isApolloError = (error: any): boolean => {
	return (
		error &&
		(error.name === 'ApolloError' ||
			error.graphQLErrors !== undefined ||
			error.networkError !== undefined ||
			error.protocolErrors !== undefined)
	);
};

// Helper to extract meaningful message from ApolloError
const getApolloErrorMessage = (error: any): string => {
	if (!error) return 'Неизвестная ошибка Apollo';

	// Check for GraphQL errors
	if (error.graphQLErrors && error.graphQLErrors.length > 0) {
		const graphQLError = error.graphQLErrors[0];
		if (graphQLError.message) {
			// Check for user-friendly messages in extensions
			if (graphQLError.extensions?.userMessage) {
				return graphQLError.extensions.userMessage;
			}
			if (graphQLError.extensions?.userFriendlyMessage) {
				return graphQLError.extensions.userFriendlyMessage;
			}
			return graphQLError.message;
		}
	}

	// Check for network error
	if (error.networkError) {
		if (error.networkError.message === 'Failed to fetch') {
			return 'Не удалось соединиться с сервером. Проверьте интернет-соединение.';
		}
		if (error.networkError.result?.message) {
			return error.networkError.result.message;
		}
		if (error.networkError.message) {
			return error.networkError.message;
		}
		return 'Проблема с сетью. Проверьте подключение к интернету.';
	}

	// Check for protocol errors
	if (error.protocolErrors && error.protocolErrors.length > 0) {
		return error.protocolErrors[0].message || 'Ошибка протокола связи';
	}

	// Check for client errors
	if (error.clientErrors && error.clientErrors.length > 0) {
		return error.clientErrors[0].message || 'Ошибка клиентской части';
	}

	// Fallback to default message
	if (error.message) return error.message;

	return 'Произошла ошибка при выполнении запроса';
};

export const ErrorView: React.FC<ErrorViewProps> = ({
	error,
	title = 'Что-то пошло не так',
	onRetry,
	showDetailsToggle = true,
	actionButton,
	hideErrorDetails = false,
}) => {
	const [showDetails, setShowDetails] = useState(false);

	// --- Error Logic ---
	const getErrorMessage = (): string => {
		if (!error) return 'Неизвестная ошибка';
		if (typeof error === 'string') return error;

		// Handle ApolloError specifically
		if (isApolloError(error)) {
			return getApolloErrorMessage(error);
		}

		// Handle other error types
		if (error?.userMessage || error?.userFriendlyMessage)
			return error.userMessage || error.userFriendlyMessage;
		if (error?.message) return error.message;
		if (error?.networkError?.result?.message)
			return error.networkError.result.message;
		if (error?.description) return error.description;
		if (error?.networkError) return 'Проблема с сетью. Проверьте подключение.';
		return 'Произошла непредвиденная ошибка';
	};

	const getErrorDetails = (): string | null => {
		if (!error || hideErrorDetails) return null;

		// For ApolloError, provide more structured details
		if (isApolloError(error)) {
			const details: any = {
				type: 'ApolloError',
				message: error.message,
			};

			if (error.graphQLErrors?.length > 0) {
				details.graphQLErrors = error.graphQLErrors.map((err: any) => ({
					message: err.message,
					path: err.path,
					extensions: err.extensions,
				}));
			}

			if (error.networkError) {
				details.networkError = {
					message: error.networkError.message,
					statusCode: error.networkError.statusCode,
					response: error.networkError.response,
				};
			}

			if (error.protocolErrors?.length > 0) {
				details.protocolErrors = error.protocolErrors;
			}

			if (error.clientErrors?.length > 0) {
				details.clientErrors = error.clientErrors;
			}

			if (error.cause) {
				details.cause = error.cause;
			}

			try {
				return JSON.stringify(details, null, 2);
			} catch {
				return 'Не удалось отобразить детали Apollo ошибки';
			}
		}

		// For regular errors
		try {
			return JSON.stringify(error, null, 2);
		} catch {
			return 'Не удалось отобразить детали ошибки';
		}
	};

	type ErrorType =
		| 'network'
		| 'auth'
		| 'not-found'
		| 'server'
		| 'graphql'
		| 'general';

	const getErrorType = (): ErrorType => {
		// Check for ApolloError specific types
		if (isApolloError(error)) {
			// Check GraphQL errors for specific status codes
			if (error.graphQLErrors?.length > 0) {
				const graphQLError = error.graphQLErrors[0];
				const extensions = graphQLError.extensions || {};

				if (
					extensions.code === 'UNAUTHENTICATED' ||
					extensions.statusCode === 401
				) {
					return 'auth';
				}
				if (extensions.code === 'NOT_FOUND' || extensions.statusCode === 404) {
					return 'not-found';
				}
				if (
					extensions.code === 'INTERNAL_SERVER_ERROR' ||
					extensions.statusCode === 500
				) {
					return 'server';
				}
				// GraphQL specific error
				return 'graphql';
			}

			// Check network error
			if (error.networkError) {
				if (error.networkError.statusCode === 401) return 'auth';
				if (error.networkError.statusCode === 404) return 'not-found';
				if (error.networkError.statusCode === 500) return 'server';
				return 'network';
			}
		}

		// Regular error handling
		if (error?.networkError) return 'network';
		if (error?.code === 'NETWORK_ERROR') return 'network';
		if (error?.statusCode === 401 || error?.code === 'UNAUTHORIZED')
			return 'auth';
		if (error?.statusCode === 404) return 'not-found';
		if (error?.statusCode === 500) return 'server';
		return 'general';
	};

	const getErrorConfig = () => {
		const type = getErrorType();
		switch (type) {
			case 'network':
				return {
					icon: 'wifi.exclamationmark' as IconSymbolName,
					color: Colors.error,
					title: 'Проблема с подключением',
					subtitle: 'Проверьте интернет-соединение и попробуйте снова',
				};
			case 'auth':
				return {
					icon: 'lock.fill' as IconSymbolName,
					color: Colors.warning,
					title: 'Ошибка авторизации',
					subtitle: 'Возможно, ваша сессия истекла. Требуется повторный вход',
				};
			case 'not-found':
				return {
					icon: 'questionmark.circle.fill' as IconSymbolName,
					color: Colors.info,
					title: 'Не найдено',
					subtitle: 'Запрашиваемый ресурс не найден',
				};
			case 'server':
				return {
					icon: 'exclamationmark.triangle.fill' as IconSymbolName,
					color: Colors.error,
					title: 'Проблема на сервере',
					subtitle: 'Сервер временно недоступен. Попробуйте позже',
				};
			case 'graphql':
				return {
					icon: 'doc.text.magnifyingglass' as IconSymbolName,
					color: Colors.warning,
					title: 'Ошибка запроса',
					subtitle: getErrorMessage(),
				};
			default:
				return {
					icon: 'exclamationmark.triangle.fill' as IconSymbolName,
					color: Colors.error,
					title,
					subtitle: getErrorMessage(),
				};
		}
	};

	const config = getErrorConfig();
	const errorDetails = getErrorDetails();
	const isApollo = isApolloError(error);

	return (
		<FullScreenLayout
			contentStyle={{ paddingHorizontal: 0, justifyContent: 'center' }}>
			<ScrollView
				contentContainerStyle={styles.container}
				showsVerticalScrollIndicator={false}>
				<View style={styles.content}>
					{/* Icon */}
					<View
						style={[
							styles.iconContainer,
							{ backgroundColor: `${config.color}15` },
						]}>
						<IconSymbol
							name={config.icon}
							size={64}
							color={config.color || Colors.error}
						/>
					</View>

					{/* Title & Subtitle */}
					<Typography
						variant='h2'
						style={styles.title}>
						{config.title}
					</Typography>
					<Typography
						variant='body'
						style={styles.subtitle}>
						{config.subtitle}
					</Typography>

					{/* Apollo-specific hint */}
					{isApollo && error?.networkError?.message === 'Failed to fetch' && (
						<View style={styles.apolloHint}>
							<IconSymbol
								name='info.circle'
								size={16}
								color={Colors.warning}
							/>
							<Typography
								variant='caption'
								style={styles.apolloHintText}>
								Проверьте URL GraphQL эндпоинта и CORS настройки сервера
							</Typography>
						</View>
					)}

					{/* Helpful Tips */}
					<View style={styles.tipsContainer}>
						<View style={styles.tipItem}>
							<IconSymbol
								name='wifi.exclamationmark'
								size={16}
								color='#666'
							/>
							<Typography
								variant='body'
								style={styles.tipText}>
								Проверьте интернет-соединение
							</Typography>
						</View>
						<View style={styles.tipItem}>
							<IconSymbol
								name='clock'
								size={16}
								color='#666'
							/>
							<Typography
								variant='body'
								style={styles.tipText}>
								Попробуйте позже, если проблема сохраняется
							</Typography>
						</View>
						<View style={styles.tipItem}>
							<IconSymbol
								name='repeat'
								size={16}
								color='#666'
							/>
							<Typography
								variant='body'
								style={styles.tipText}>
								Полностью закройте приложение и откройте его
							</Typography>
						</View>
					</View>

					{/* Error Details Toggle */}
					{showDetailsToggle && errorDetails && (
						<>
							<TouchableOpacity
								style={styles.detailsToggle}
								onPress={() => setShowDetails(!showDetails)}
								activeOpacity={0.7}>
								<Typography
									variant='caption'
									style={styles.detailsToggleText}>
									{showDetails ? 'Скрыть детали' : 'Показать детали ошибки'}
								</Typography>
								<IconSymbol
									name={showDetails ? 'chevron.up' : 'chevron.down'}
									size={20}
									color={Colors.gray || '#666'}
								/>
							</TouchableOpacity>

							{showDetails && (
								<ScrollView style={styles.detailsContainer}>
									<Typography
										variant='body'
										style={styles.detailsText}>
										{errorDetails}
									</Typography>
								</ScrollView>
							)}
						</>
					)}

					{/* Buttons */}
					<View style={styles.buttonsContainer}>
						{onRetry && (
							<Button
								title='Повторить попытку'
								onPress={onRetry}
								variant='primary'
								style={styles.button}
							/>
						)}

						{actionButton && (
							<View style={styles.buttonWithIcon}>
								{actionButton.icon && (
									<IconSymbol
										name={actionButton.icon}
										size={18}
										color={Colors.primary}
									/>
								)}
								<Button
									title={actionButton.text}
									onPress={actionButton.onPress}
									variant='secondary'
									style={styles.button}
								/>
							</View>
						)}
					</View>
				</View>
			</ScrollView>
		</FullScreenLayout>
	);
};

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		justifyContent: 'center',
		padding: 24,
		backgroundColor: Colors.background,
	},
	content: {
		alignItems: 'center',
		width: '100%',
		maxWidth: 500,
		alignSelf: 'center',
	},
	iconContainer: {
		padding: 20,
		borderRadius: 50,
		marginBottom: 24,
		justifyContent: 'center',
		alignItems: 'center',
		width: 104,
		height: 104,
	},
	title: {
		textAlign: 'center',
		marginBottom: 12,
		color: Colors.text,
		flexShrink: 1,
	},
	subtitle: {
		textAlign: 'center',
		marginBottom: 32,
		color: Colors.gray,
		lineHeight: 22,
		flexWrap: 'wrap',
		flexShrink: 1,
	},
	tipsContainer: { width: '100%', marginBottom: 32 },
	tipItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12,
		padding: 12,
		backgroundColor: Colors.surface,
		borderRadius: 8,
	},
	tipText: { marginLeft: 12, flex: 1 },
	detailsToggle: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
		padding: 12,
		backgroundColor: Colors.surface,
		borderRadius: 8,
		marginBottom: 12,
	},
	detailsToggleText: { color: Colors.gray },
	detailsContainer: {
		maxHeight: 150,
		width: '100%',
		padding: 12,
		backgroundColor: Colors.surface,
		borderRadius: 8,
		marginBottom: 16,
	},
	detailsText: {
		fontFamily: 'monospace',
		fontSize: 12,
		color: Colors.text,
		lineHeight: 18,
		flexShrink: 1,
		flexWrap: 'wrap',
		includeFontPadding: false,
	},
	buttonsContainer: { width: '100%', gap: 12, marginBottom: 24 },
	button: { marginVertical: 4 },
	buttonWithIcon: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
	},
	apolloHint: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: `${Colors.warning}20`,
		padding: 12,
		borderRadius: 8,
		marginBottom: 24,
		gap: 8,
	},
	apolloHintText: {
		flex: 1,
		color: Colors.warning,
	},
});
