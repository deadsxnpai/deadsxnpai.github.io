import { getAuthUrl } from '@/shared/constants/model/base';
import { Colors } from '@/shared/constants/model/theme';
import { FullScreenLayout } from '@/shared/layouts';
import { detectPlatform } from '@/shared/lib';
import { isTgPlatform } from '@/shared/lib/platform/get-platform';
import { Button, Typography } from '@/shared/ui';
import { retrieveRawInitData } from '@tma.js/sdk';
import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';

export default function AuthOnlyMaxScreen() {
	const handleLogin = () => {
		const platform = detectPlatform();
		if (isTgPlatform(platform)) {
			const initData = retrieveRawInitData();
			const url = getAuthUrl({ initData });
			Linking.openURL(url);
		}
	};
	return (
		<FullScreenLayout>
			<View style={styles.section}>
				<Typography
					variant='h1'
					style={styles.title}>
					Вход доступен только через Max.
				</Typography>
				<Typography
					variant='body'
					style={styles.description}>
					На данном этапе аутентификация доступна только в Max.
				</Typography>
			</View>
			<Button
				title='Связть Telegram и ЛК'
				onPress={handleLogin}
			/>
			;
		</FullScreenLayout>
	);
}

const styles = StyleSheet.create({
	section: {
		marginTop: 22,
		backgroundColor: Colors.background,
		padding: 16,
		borderRadius: 12,
		elevation: 3,
	},
	title: {
		marginBottom: 8,
	},
	description: {
		color: Colors.gray,
		marginBottom: 16,
	},
	spacer: {
		height: 12,
	},
});
