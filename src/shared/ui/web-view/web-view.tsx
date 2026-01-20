import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
	ActivityIndicator,
	Platform,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import { WebView } from 'react-native-webview';

interface CrossPlatformWebViewProps {
	url: string;
}

export function CrossPlatformWebView({ url }: CrossPlatformWebViewProps) {
	const [currentUrl, setCurrentUrl] = useState(url);
	const [inputUrl, setInputUrl] = useState(url);
	const [loading, setLoading] = useState(true);
	const [canGoBack, setCanGoBack] = useState(false);
	const [canGoForward, setCanGoForward] = useState(false);
	const [history, setHistory] = useState<string[]>([url]);
	const [historyIndex, setHistoryIndex] = useState(0);

	const iframeRef: any = useRef(null);
	const webViewRef: any = useRef(null);

	// Обновляем историю при загрузке URL
	useEffect(() => {
		if (Platform.OS === 'web') {
			const newHistory = [...history.slice(0, historyIndex + 1), currentUrl];
			setHistory(newHistory);
			setHistoryIndex(newHistory.length - 1);
			setCanGoBack(historyIndex > 0);
			setCanGoForward(historyIndex < newHistory.length - 1);
		}
	}, [currentUrl]);

	// Функции навигации для веб-платформы
	const handleWebBack = () => {
		if (historyIndex > 0) {
			const newIndex = historyIndex - 1;
			setHistoryIndex(newIndex);
			const prevUrl = history[newIndex];
			setCurrentUrl(prevUrl);
			setInputUrl(prevUrl);
			setLoading(true);
		}
	};

	const handleWebForward = () => {
		if (historyIndex < history.length - 1) {
			const newIndex = historyIndex + 1;
			setHistoryIndex(newIndex);
			const nextUrl = history[newIndex];
			setCurrentUrl(nextUrl);
			setInputUrl(nextUrl);
			setLoading(true);
		}
	};

	const handleWebReload = () => {
		setCurrentUrl((prev) => {
			const separator = prev.includes('?') ? '&' : '?';
			return `${prev}${separator}t=${Date.now()}`;
		});
		setLoading(true);
	};

	// Функции навигации для нативного WebView
	const handleNativeBack = () => {
		if (webViewRef.current && canGoBack) {
			webViewRef.current.goBack();
		}
	};

	const handleNativeForward = () => {
		if (webViewRef.current && canGoForward) {
			webViewRef.current.goForward();
		}
	};

	const handleNativeReload = () => {
		if (webViewRef.current) {
			webViewRef.current.reload();
		}
	};

	const handleUrlSubmit = () => {
		let newUrl = inputUrl.trim();
		if (!newUrl) return;

		// Добавляем протокол если отсутствует
		if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
			newUrl = 'https://' + newUrl;
		}

		setCurrentUrl(newUrl);
		setInputUrl(newUrl);
		setLoading(true);

		// Для нативного WebView
		if (Platform.OS !== 'web' && webViewRef.current) {
			webViewRef.current.injectJavaScript(`
				window.location.href = "${newUrl}";
			`);
		}
	};

	const handleHomePress = () => {
		setCurrentUrl(url);
		setInputUrl(url);
		setLoading(true);

		if (Platform.OS !== 'web' && webViewRef.current) {
			webViewRef.current.injectJavaScript(`
				window.location.href = "${url}";
			`);
		}
	};

	const handleIframeLoad = () => {
		setLoading(false);
	};

	const NavigationButtons = () => (
		<View style={styles.navContainer}>
			<View style={styles.navButtons}>
				<TouchableOpacity
					style={[styles.navButton, !canGoBack && styles.disabledButton]}
					onPress={Platform.OS === 'web' ? handleWebBack : handleNativeBack}
					disabled={!canGoBack}>
					<Ionicons
						name='arrow-back'
						size={24}
						color={canGoBack ? '#007AFF' : '#999'}
					/>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.navButton}
					onPress={
						Platform.OS === 'web' ? handleWebReload : handleNativeReload
					}>
					<Ionicons
						name='refresh'
						size={24}
						color='#007AFF'
					/>
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.navButton, !canGoForward && styles.disabledButton]}
					onPress={
						Platform.OS === 'web' ? handleWebForward : handleNativeForward
					}
					disabled={!canGoForward}>
					<Ionicons
						name='arrow-forward'
						size={24}
						color={canGoForward ? '#007AFF' : '#999'}
					/>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.navButton}
					onPress={handleHomePress}>
					<Ionicons
						name='home'
						size={24}
						color='#007AFF'
					/>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.navButton}
					onPress={() => {
						if (Platform.OS !== 'web' && webViewRef.current) {
							webViewRef.current.stopLoading();
						}
						setLoading(false);
					}}>
					<Ionicons
						name='close'
						size={24}
						color='#FF3B30'
					/>
				</TouchableOpacity>
			</View>
		</View>
	);

	return (
		<View style={styles.container}>
			<NavigationButtons />
			{/* Веб-контент */}
			{Platform.OS === 'web' ? (
				// Iframe для веб-платформы
				<iframe
					ref={iframeRef}
					key={currentUrl}
					src={currentUrl}
					style={styles.webIframe}
					title='Web Content'
					onLoad={handleIframeLoad}
					onLoadStart={() => setLoading(true)}
					sandbox='allow-same-origin allow-scripts allow-forms allow-popups allow-modals'
					allow='accelerometer; autoplay; clipboard-write; encrypted-media; geolocation; gyroscope; picture-in-picture'
					allowFullScreen
				/>
			) : (
				// Нативный WebView для iOS/Android
				<WebView
					ref={webViewRef}
					source={{ uri: currentUrl }}
					style={styles.webview}
					onNavigationStateChange={(navState) => {
						setCanGoBack(navState.canGoBack);
						setCanGoForward(navState.canGoForward);
						setCurrentUrl(navState.url);
						setInputUrl(navState.url);
					}}
					onLoadStart={() => setLoading(true)}
					onLoadEnd={() => setLoading(false)}
					onError={(syntheticEvent) => {
						const { nativeEvent } = syntheticEvent;
						console.warn('WebView error: ', nativeEvent);
						setLoading(false);
					}}
					startInLoadingState={true}
					renderLoading={() => (
						<View style={styles.loadingContainer}>
							<ActivityIndicator
								size='large'
								color='#007AFF'
							/>
						</View>
					)}
					// Дополнительные пропсы для лучшего UX
					allowsBackForwardNavigationGestures={true}
					scalesPageToFit={true}
					javaScriptEnabled={true}
					domStorageEnabled={true}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	webview: {
		flex: 1,
	},
	webIframe: {
		flex: 1,
		width: '100%',
		height: '100%',
	},
	navContainer: {
		flexDirection: 'column',
		backgroundColor: '#f5f5f5',
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
		paddingHorizontal: 15,
		paddingVertical: 10,
		paddingTop: Platform.OS === 'web' ? 10 : 40,
	},
	navButtons: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	urlContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	navButton: {
		padding: 8,
		marginRight: 10,
		borderRadius: 4,
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: '#ddd',
	},
	disabledButton: {
		opacity: 0.5,
	},
	urlInput: {
		flex: 1,
		height: 40,
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 8,
		paddingHorizontal: 12,
		marginRight: 8,
		fontSize: 14,
	},
	goButton: {
		height: 40,
		backgroundColor: '#007AFF',
		paddingHorizontal: 16,
		paddingVertical: 10,
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
	},
	goButtonText: {
		color: '#fff',
		fontWeight: '600',
		fontSize: 14,
	},
	loadingContainer: {
		position: 'absolute',
		top: Platform.OS === 'web' ? 60 : 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(255, 255, 255, 0.9)',
		zIndex: 1000,
	},
	loadingText: {
		marginTop: 12,
		marginBottom: 20,
		fontSize: 16,
		color: '#666',
	},
	cancelButton: {
		backgroundColor: '#FF3B30',
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 8,
	},
	cancelButtonText: {
		color: '#fff',
		fontWeight: '600',
		fontSize: 14,
	},
});
