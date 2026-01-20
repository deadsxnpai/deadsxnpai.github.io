// app/+not-found.tsx
import { Colors } from '@/shared/config/theme';
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Страница не найдена</Text>
			<Link
				href='/'
				style={styles.link}>
				Назад
			</Link>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
	title: { fontSize: 20, fontWeight: 'bold' },
	link: { marginTop: 16, color: Colors.primary },
});
