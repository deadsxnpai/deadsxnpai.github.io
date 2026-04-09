import { useUser } from '@/features/auth';
import { InfoViewStyles } from '@/features/profile/model/types';
import { StudentInfoView } from '@/features/profile/ui/student-info-view';
import { InfoView, Loader, UserImage } from '@/shared/ui';
import { StyleSheet, View } from 'react-native';

export const ProfileView = ({ style, ...infoStyles }: InfoViewStyles) => {
	const user = useUser();

	if (!user) {
		return <Loader />;
	}

	const renderInfoView = () => {
		if (user?.groups?.includes('student')) {
			return (
				<StudentInfoView
					header={`${user?.data.firstName || ''} ${user?.data.lastName || ''}`.trim()}
					{...infoStyles}
				/>
			);
		}
		return (
			<InfoView
				header={`${user?.data.firstName || ''} ${user?.data.lastName || ''}`.trim()}
				subtitle={'Пользователь'}
				info={''}
				{...infoStyles}
			/>
		);
	};

	return (
		<View style={[styles.container, style]}>
			<UserImage
				id={user?.data.id}
				style={{ width: 40, height: 40, borderRadius: 50 }}
			/>
			{renderInfoView()}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'row',
		paddingLeft: 30,
		alignItems: 'center',
		minHeight: 100,
	},
});
