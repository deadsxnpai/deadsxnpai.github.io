// app/providers/storage/secure-storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

class SecureStorage {
	private prefix = '@app_';

	private sanitizeKey(key: string): string {
		return key.replace(/[^a-zA-Z0-9._-]/g, '_');
	}

	private getKey(key: string): string {
		return `${this.prefix}${key}`;
	}

	// Get sanitized key for SecureStore
	private getSecureKey(key: string): string {
		const fullKey = this.getKey(key);
		if (Platform.OS === 'web') {
			return fullKey;
		}
		return this.sanitizeKey(fullKey);
	}

	async setItem(key: string, value: string): Promise<void> {
		const fullKey = this.getKey(key);
		const secureKey = this.getSecureKey(key);

		if (Platform.OS === 'web') {
			await AsyncStorage.setItem(fullKey, value);
		} else {
			if (!value || value.trim().length === 0) {
				throw new Error('Cannot store empty value in SecureStore');
			}
			await SecureStore.setItemAsync(secureKey, value);
		}
	}

	async getItem(key: string): Promise<string | null> {
		const fullKey = this.getKey(key);
		const secureKey = this.getSecureKey(key);

		if (Platform.OS === 'web') {
			return await AsyncStorage.getItem(fullKey);
		} else {
			return await SecureStore.getItemAsync(secureKey);
		}
	}

	async removeItem(key: string): Promise<void> {
		const fullKey = this.getKey(key);
		const secureKey = this.getSecureKey(key);

		if (Platform.OS === 'web') {
			await AsyncStorage.removeItem(fullKey);
		} else {
			await SecureStore.deleteItemAsync(secureKey);
		}
	}

	async saveAuthData(accessToken: string, refreshToken: string): Promise<void> {
		if (!accessToken || accessToken.trim().length === 0) {
			throw new Error('Invalid access token');
		}

		await Promise.all([
			this.setItem('access_token', accessToken),
			this.setItem('refresh_token', refreshToken || ''),
		]);
	}

	async getAuthData(): Promise<{
		accessToken: string | null;
		refreshToken: string | null;
	}> {
		try {
			const [accessToken, refreshToken] = await Promise.all([
				this.getItem('access_token'),
				this.getItem('refresh_token'),
			]);

			return {
				accessToken,
				refreshToken,
			};
		} catch (error) {
			console.error('Error getting auth data:', error);
			return {
				accessToken: null,
				refreshToken: null,
			};
		}
	}

	async clearAuthData(): Promise<void> {
		try {
			await Promise.all([
				this.removeItem('access_token'),
				this.removeItem('refresh_token'),
			]);
		} catch (error) {
			console.error('Error clearing auth data:', error);
		}
	}

	async getAccessToken(): Promise<string | null> {
		return await this.getItem('access_token');
	}

	async hasItem(key: string): Promise<boolean> {
		const value = await this.getItem(key);
		return value !== null && value !== undefined;
	}

	async clearAll(): Promise<void> {
		if (Platform.OS === 'web') {
			const keys = await AsyncStorage.getAllKeys();
			const ourKeys = keys.filter((key) => key.startsWith(this.prefix));
			await AsyncStorage.multiRemove(ourKeys);
		} else {
			await this.clearAuthData();
		}
	}
}

export const secureStorage = new SecureStorage();
