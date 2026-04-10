// Updated CrossPlatformWebView component for Telegram Mini App
import { Colors } from '@/shared/constants/model/theme';
import { MainLayout } from '@/shared/layouts/main-layout/main-layout';
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
	injectedJavaScript?: string;
	injectedJavaScriptBeforeContentLoaded?: string;
}

export function CrossPlatformWebView({
	url,
	injectedJavaScript,
	injectedJavaScriptBeforeContentLoaded,
}: CrossPlatformWebViewProps) {
	const [currentUrl, setCurrentUrl] = useState(url);
	const [inputUrl, setInputUrl] = useState(url);
	const [loading, setLoading] = useState(true);
	const [canGoBack, setCanGoBack] = useState(false);
	const [canGoForward, setCanGoForward] = useState(false);
	const [history, setHistory] = useState<string[]>([url]);
	const [historyIndex, setHistoryIndex] = useState(0);
	const [htmlContent, setHtmlContent] = useState<string | null>(null);

	const iframeRef: any = useRef(null);
	const webViewRef: any = useRef(null);

	// Detect if running in Telegram Mini App
	const isTelegramWebView =
		typeof window !== 'undefined' &&
		(window as any).TelegramWebviewProxy !== undefined;

	useEffect(() => {
		if (Platform.OS === 'web') {
			const newHistory = [...history.slice(0, historyIndex + 1), currentUrl];
			setHistory(newHistory);
			setHistoryIndex(newHistory.length - 1);
			setCanGoBack(historyIndex > 0);
			setCanGoForward(historyIndex < newHistory.length - 1);
		}
	}, [currentUrl]);

	// For Telegram WebView, fetch and inject content with scripts
	useEffect(() => {
		if (Platform.OS === 'web' && isTelegramWebView && injectedJavaScript) {
			fetchAndInjectContent(currentUrl);
		}
	}, [currentUrl, isTelegramWebView]);

	const fetchAndInjectContent = async (targetUrl: string) => {
		try {
			setLoading(true);
			const response = await fetch(targetUrl);
			let html = await response.text();

			// Inject JavaScript before content loads
			if (injectedJavaScriptBeforeContentLoaded) {
				html = html.replace(
					'</head>',
					`<script>${injectedJavaScriptBeforeContentLoaded}</script></head>`,
				);
			}

			if (injectedJavaScript) {
				const injectScript = `
					<script>
						(function() {
							${injectedJavaScript}
						})();
					</script>
				`;
				html = html.replace('</body>', `${injectScript}</body>`);
			}

			setHtmlContent(html);
			setLoading(false);
		} catch (error) {
			console.error('Failed to fetch and inject content:', error);
			setLoading(false);
			// Fallback to iframe
			setHtmlContent(null);
		}
	};

	const handleIframeLoad = () => {
		setLoading(false);

		// Alternative injection for regular iframe (non-Telegram)
		if (!isTelegramWebView && injectedJavaScript && iframeRef.current) {
			try {
				const iframeWindow = iframeRef.current.contentWindow;
				const script = iframeWindow.document.createElement('script');
				script.textContent = injectedJavaScript;
				iframeWindow.document.head?.appendChild(script);
			} catch (error) {
				console.warn('Failed to inject into iframe:', error);
			}
		}
	};

	const handleWebBack = () => {
		if (historyIndex > 0) {
			const newIndex = historyIndex - 1;
			setHistoryIndex(newIndex);
			const prevUrl = history[newIndex];
			setCurrentUrl(prevUrl);
			setInputUrl(prevUrl);
			setLoading(true);
			if (isTelegramWebView && injectedJavaScript) {
				fetchAndInjectContent(prevUrl);
			}
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
			if (isTelegramWebView && injectedJavaScript) {
				fetchAndInjectContent(nextUrl);
			}
		}
	};

	const handleWebReload = () => {
		if (isTelegramWebView && injectedJavaScript) {
			fetchAndInjectContent(currentUrl);
		} else {
			setCurrentUrl((prev) => {
				const separator = prev.includes('?') ? '&' : '?';
				return `${prev}${separator}t=${Date.now()}`;
			});
			setLoading(true);
		}
	};

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

	const handleHomePress = () => {
		setCurrentUrl(url);
		setInputUrl(url);
		setLoading(true);

		if (Platform.OS !== 'web') {
			if (webViewRef.current) {
				webViewRef.current.injectJavaScript(`
					window.location.href = "${url}";
				`);
			}
		} else if (isTelegramWebView && injectedJavaScript) {
			fetchAndInjectContent(url);
		}
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
						color={canGoBack ? Colors.primary : Colors.secondary}
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
						color={Colors.primary}
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
						color={canGoForward ? Colors.primary : Colors.secondary}
					/>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.navButton}
					onPress={handleHomePress}>
					<Ionicons
						name='home'
						size={24}
						color={Colors.primary}
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
						color={Colors.secondPrimary}
					/>
				</TouchableOpacity>
			</View>
		</View>
	);

	// Render for native platforms
	if (Platform.OS !== 'web') {
		return (
			<MainLayout contentStyle={styles.content}>
				<View style={styles.container}>
					<NavigationButtons />
					<WebView
						ref={webViewRef}
						source={{ uri: currentUrl }}
						style={styles.webview}
						injectedJavaScript={injectedJavaScript}
						injectedJavaScriptBeforeContentLoaded={
							injectedJavaScriptBeforeContentLoaded
						}
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
									color={Colors.primary}
								/>
							</View>
						)}
						allowsBackForwardNavigationGestures={true}
						scalesPageToFit={true}
						javaScriptEnabled={true}
						domStorageEnabled={true}
					/>
				</View>
			</MainLayout>
		);
	}

	// Render for web (including Telegram Mini App)
	return (
		<MainLayout contentStyle={styles.content}>
			<View style={styles.container}>
				<NavigationButtons />
				{isTelegramWebView && htmlContent ? (
					<iframe
						ref={iframeRef}
						srcDoc={htmlContent}
						style={styles.webIframe}
						title='Web Content'
						onLoad={handleIframeLoad}
						sandbox='allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-popups-to-escape-sandbox'
						allow='accelerometer; autoplay; clipboard-write; encrypted-media; geolocation; gyroscope; picture-in-picture'
						allowFullScreen
					/>
				) : (
					<iframe
						ref={iframeRef}
						key={currentUrl}
						src={currentUrl}
						style={styles.webIframe}
						title='Web Content'
						onLoad={handleIframeLoad}
						onLoadStart={() => setLoading(true)}
						sandbox='allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-popups-to-escape-sandbox'
						allow='accelerometer; autoplay; clipboard-write; encrypted-media; geolocation; gyroscope; picture-in-picture'
						allowFullScreen
					/>
				)}
			</View>
		</MainLayout>
	);
}

const styles = StyleSheet.create({
	content: {
		paddingHorizontal: 0,
	},
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
		backgroundColor: Colors.background,
		borderBottomWidth: 1,
		borderBottomColor: Colors.border,
		paddingHorizontal: 15,
		paddingVertical: 10,
	},
	navButtons: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	navButton: {
		padding: 8,
		marginRight: 10,
		borderRadius: 4,
		backgroundColor: Colors.background,
		borderWidth: 1,
		borderColor: '#ddd',
	},
	disabledButton: {
		opacity: 0.5,
	},
	loadingContainer: {
		position: 'absolute',
		top: 60,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(255, 255, 255, 0.9)',
		zIndex: 1000,
	},
});
