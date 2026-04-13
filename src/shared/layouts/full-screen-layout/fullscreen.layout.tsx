import { Colors } from '@/shared/constants/model/theme';
import React, { ReactNode } from 'react';
import { StatusBar, StyleSheet, View, ViewStyle } from 'react-native';

interface FullScreenLayoutProps {
	children: ReactNode;
	contentStyle?: ViewStyle;
	containerStyle?: ViewStyle;
	statusBarStyle?: 'light-content' | 'dark-content';
}

export const FullScreenLayout: React.FC<FullScreenLayoutProps> = ({
	children,
	contentStyle,
	containerStyle,
	statusBarStyle = 'light-content',
}) => {
	return (
		<View style={[styles.container, containerStyle]}>
			<StatusBar
				barStyle={statusBarStyle}
				backgroundColor={Colors.background}
			/>
			<View style={[styles.content, contentStyle]}>{children}</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'absolute', // cover entire screen
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 9999, // sit above everything
		backgroundColor: Colors.background, // optional overlay color
		justifyContent: 'center',
		alignItems: 'center',
	},
	content: {
		flex: 1,
		width: '100%',
	},
});
