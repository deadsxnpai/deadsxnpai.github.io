import { Platform } from 'react-native';

export const Colors = {
	// Brand
	primary: '#023D83',      // Blue
	secondary: '#E5E5EA',    // Grey L Bright (как замена старому secondary)

	// Text and Basics
	text: '#11181C',         // Оставил исходным, так как в палитре нет специфичного цвета текста
	background: '#FFFFFF',   // White
	white: '#FFFFFF',        // White
	black: '#000000',        // (Обычно стандартный черный)

	// UI Elements
	tint: '#023D83',         // Blue
	tabIconDefault: '#9AA0B1', // Grey Bright
	tabIconSelected: '#023D83',// Blue
	icon: '#9AA0B1',         // Grey Bright
	border: '#C7CBD6',       // Grey Light

	// Status/Semantic
	error: '#A92C5E',        // Bardo
	warning: '#E98C39',      // Orange
	info: '#BACDE0',         // Sky Bright

	// Other
	surface: '#E5E5EA',      // Grey L Bright
	light: '#7CA4D7',        // Blue Light

	// Дополнительно из палитры (названия соответствуют image_880993.png)
	beige: '#F3F2EE',
	rose: '#D086A6',         // Rose Bright
	mint: '#C9D3CA',         // Mint Bright
	peach: '#F4AA86',        // Peach Bright
};

export const Fonts = Platform.select({
	ios: {
		sans: 'system-ui',
		serif: 'ui-serif',
		rounded: 'ui-rounded',
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