/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Theme } from '@react-navigation/native';
import { Platform } from 'react-native';

const tintColorLight = '#013D83';
const white = '#fff';
export const Colors = {
	text: '#11181C',
	background: white,
	tint: tintColorLight,
	icon: '#687076',
	tabIconDefault: '#687076',
	tabIconSelected: tintColorLight,
	primary: '#013D83',
	secondary: '#E5E5EA',
	red: '#FF3B30',
	border: '#ddd',
	white: white,
	secondPrimary: '#A92B5E',
	gray: '#666',
	black: '#000',
	error: '#A92B5E',
	surface: '#E5E5EA',
};

export const Fonts = Platform.select({
	ios: {
		/** iOS `UIFontDescriptorSystemDesignDefault` */
		sans: 'system-ui',
		/** iOS `UIFontDescriptorSystemDesignSerif` */
		serif: 'ui-serif',
		/** iOS `UIFontDescriptorSystemDesignRounded` */
		rounded: 'ui-rounded',
		/** iOS `UIFontDescriptorSystemDesignMonospaced` */
		mono: 'ui-monospace',
	},
	default: {
		sans: 'normal',
		serif: 'serif',
		rounded: 'normal',
		mono: 'monospace',
	},
	web: {
		sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
		serif: "Georgia, 'Times New Roman', serif",
		rounded:
			"'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
		mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
	},
});

export const AppDefaultTheme: Theme = {
	dark: false,
	colors: {
		primary: Colors.primary,
		background: Colors.background,
		card: Colors.white,
		text: Colors.text,
		border: Colors.border,
		notification: Colors.red,
	},
	fonts: {
		regular: {
			fontFamily: Fonts.sans,
			fontWeight: '400',
		},
		medium: {
			fontFamily: Fonts.sans,
			fontWeight: '500',
		},
		bold: {
			fontFamily: Fonts.sans,
			fontWeight: '700',
		},
		heavy: {
			fontFamily: Fonts.sans,
			fontWeight: '800',
		},
	},
};
