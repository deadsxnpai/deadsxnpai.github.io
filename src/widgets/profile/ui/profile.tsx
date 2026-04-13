import { ProfileView } from '@/features/profile/ui/profile-view';
import { Colors } from '@/shared/constants';
import { StyleSheet, View } from 'react-native';

export const Profile = () => {
	return (
		<View style={styles.container}>
			<ProfileView
				infoStyle={{ textAlign: 'left', minWidth: 300 }}
				subTitleStyle={{ textAlign: 'left' }}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		height: 200,
		width: '100%',
		borderBottomEndRadius: 30,
		borderBottomStartRadius: 30,
		paddingHorizontal: 7,
		backgroundColor: Colors.primary,
	},
});
