import { Colors } from '@/shared/constants/theme';
import { Container } from '@/shared/ui/container/container';
import { Header, HeaderProps } from '@/widgets';
import React, { ReactNode } from 'react';
import {
	ScrollView,
	StatusBar,
	StyleSheet,
	View,
	ViewStyle,
} from 'react-native';

export interface MainLayoutProps {
	/** Content to display in the main area */
	children: ReactNode;
	/** Header title */
	title?: string;
	/** Header props */
	headerProps?: Omit<HeaderProps, 'title'>;
	/** Whether to use ScrollView (default) or regular View */
	scrollable?: boolean;
	/** Custom style for content container */
	contentStyle?: ViewStyle;
	/** Custom style for the main container */
	containerStyle?: ViewStyle;
	/** Whether to show header (default: true) */
	showHeader?: boolean;
	/** Custom header component */
	customHeader?: ReactNode;
}

export function MainLayout({
	children,
	title = '',
	headerProps,
	scrollable = true,
	contentStyle,
	containerStyle,
	showHeader = true,
	customHeader,
}: MainLayoutProps) {
	const renderContent = () => {
		const content = (
			<View style={[styles.content, contentStyle]}>{children}</View>
		);

		if (scrollable) {
			return (
				<ScrollView
					style={styles.flex}
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}>
					{content}
				</ScrollView>
			);
		}

		return content;
	};

	return (
		<View style={[styles.flex, containerStyle]}>
			<StatusBar
				barStyle={'light-content'}
				backgroundColor={Colors.background}
			/>
			<Container>
				{showHeader &&
					(customHeader || (
						<Header
							title={title}
							{...headerProps}
						/>
					))}
				{renderContent()}
			</Container>
		</View>
	);
}

const styles = StyleSheet.create({
	flex: {
		flex: 1,
	},
	content: {
		flex: 1,
		paddingHorizontal: 10,
	},
	scrollContent: {
		flexGrow: 1,
	},
});
