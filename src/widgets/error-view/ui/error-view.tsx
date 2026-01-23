import { Button, IconSymbol, Typography } from '@/shared';
import { Colors } from '@/shared/constants/theme';
import { MainLayout } from '@/shared/layouts';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export const ErrorView = ({ error, onRetry }: any) => {
	const errorMessage = getErrorMessage(error);

	return (
		<MainLayout
			contentStyle={{
				paddingHorizontal: 0,
				justifyContent: 'center',
			}}>
			<View style={styles.enhancedContainer}>
				<View style={styles.enhancedErrorContainer}>
					<View style={styles.iconWrapper}>
						<IconSymbol
							size={50}
							name={getErrorIcon(error)}
							color={Colors.error || Colors.primary}
						/>
						<Typography
							variant='h2'
							style={styles.errorTitle}>
							Даже роботы иногда ошибаются!
						</Typography>
					</View>

					<Typography
						variant='body'
						style={styles.errorSubtitle}>
						При обработке вашего запроса возникла проблема
					</Typography>

					<View style={styles.enhancedErrorBox}>
						<Typography
							variant='body'
							style={styles.enhancedErrorText}>
							{errorMessage}
						</Typography>
					</View>

					<Typography
						variant='caption'
						style={styles.instructions}>
						Пожалуйста, попробуйте снова или обратитесь в поддержку
					</Typography>

					<Button
						style={styles.buttonBack}
						title='Вернуться назад'
						onPress={() => {
							router.replace('/');
						}}
						variant='primary'
					/>
				</View>
			</View>
		</MainLayout>
	);
};

// Helper function to get appropriate error icon
const getErrorIcon = (error: any) => {
	if (error?.networkError) return 'wifi.exclamationmark';
	if (error?.status === 404) return 'questionmark.circle.fill';
	if (error?.status === 401 || error?.status === 403) return 'lock.fill';
	return 'exclamationmark.triangle.fill';
};

const getErrorMessage = (error: any) => {
	if (typeof error === 'string') return error;

	const message =
		error?.networkError?.result?.message ||
		error?.description ||
		error?.message ||
		error?.toString?.() ||
		'Произошла непредвиденная ошибка';

	if (typeof message === 'object') {
		return JSON.stringify(message, null, 2);
	}

	return String(message);
};

const styles = StyleSheet.create({
	enhancedContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Colors.background,
		padding: 24,
	},
	enhancedErrorContainer: {
		alignItems: 'center',
		width: '100%',
		maxWidth: 500,
	},
	iconWrapper: {
		paddingHorizontal: 25,
		marginBottom: 8,
		flexDirection: 'row',
	},
	errorTitle: {
		color: Colors.error || Colors.primary,
		marginBottom: 24,
		textAlign: 'center',
	},
	errorSubtitle: {
		color: Colors.text,
		marginBottom: 24,
		textAlign: 'center',
	},
	enhancedErrorBox: {
		borderRadius: 16,
		padding: 20,
		backgroundColor: Colors.surface || '#f8f9fa',
		marginBottom: 24,
		width: '100%',
		borderWidth: 1,
		borderColor: (Colors.error || Colors.primary) + '10', // 10% opacity
	},
	enhancedErrorText: {
		color: Colors.text,
		textAlign: 'center',
		lineHeight: 24,
		fontSize: 15,
	},
	instructions: {
		color: Colors.gray || '#6c757d',
		textAlign: 'center',
		marginTop: 8,
	},
	buttonContainer: {
		marginTop: 32,
		width: '100%',
		maxWidth: 200,
	},
	buttonBack: {
		marginTop: 20,
	},
});
