import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';

interface TypographyProps {
	children: React.ReactNode;
	variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
	style?: TextStyle;
}

export const Typography: React.FC<TypographyProps> = ({
	children,
	variant = 'body',
	style,
}) => {
	const variantStyles = {
		h1: styles.h1,
		h2: styles.h2,
		h3: styles.h3,
		body: styles.body,
		caption: styles.caption,
	};

	return <Text style={[variantStyles[variant], style]}>{children}</Text>;
};

const styles = StyleSheet.create({
	h1: {
		fontSize: 32,
		fontWeight: 'bold',
		color: '#333',
	},
	h2: {
		fontSize: 24,
		fontWeight: '600',
		color: '#333',
		marginBottom: 8,
	},
	h3: {
		fontSize: 18,
		fontWeight: '600',
		color: '#333',
	},
	body: {
		fontSize: 16,
		color: '#333',
		lineHeight: 24,
	},
	caption: {
		fontSize: 14,
		color: '#666',
	},
});
