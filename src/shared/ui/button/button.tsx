import { Colors } from '@/shared/constants/model/theme';
import React from 'react';
import {
	StyleSheet,
	Text,
	TextStyle,
	TouchableOpacity,
	ViewStyle,
} from 'react-native';

interface ButtonProps {
	title: string;
	onPress: () => void;
	variant?: 'primary' | 'secondary';
	style?: ViewStyle;
	textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
	title,
	onPress,
	variant = 'primary',
	style,
	textStyle,
}) => {
	const buttonStyles = {
		primary: styles.primaryButton,
		secondary: styles.secondaryButton,
	};

	const textStyles = {
		primary: styles.primaryText,
		secondary: styles.secondaryText,
	};

	return (
		<TouchableOpacity
			style={[buttonStyles[variant], style]}
			onPress={onPress}>
			<Text style={[textStyles[variant], textStyle]}>{title}</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	primaryButton: {
		backgroundColor: Colors.primary,
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
	},
	secondaryButton: {
		backgroundColor: Colors.secondary,
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
	},
	primaryText: {
		color: Colors.white,
		fontSize: 16,
		fontWeight: '600',
	},
	secondaryText: {
		color: Colors.text,
		fontSize: 16,
		fontWeight: '600',
	},
});
