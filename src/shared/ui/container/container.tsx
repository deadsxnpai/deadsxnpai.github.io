import { Colors } from '@/shared/constants/model/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface ContainerProps {
	children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ children }) => {
	return <View style={styles.inner}>{children}</View>;
};

const styles = StyleSheet.create({
	inner: {
		flex: 1,
		backgroundColor: Colors.secondary,
	},
});
