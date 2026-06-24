import { StyleSheet, View, Text } from 'react-native';

export default function NotFoundScreen() {
	return (
		<View>
			<Text> Text</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	section: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: '100%',
		borderRadius: 12,
		elevation: 3,
	},
	title: { textAlign: 'center', width: '100%', marginBottom: 50 },
});
