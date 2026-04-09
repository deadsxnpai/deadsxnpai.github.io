import { useStudentInfo } from '@/features/profile/api/hooks/use-student-info';
import { InfoViewStyles } from '@/features/profile/model/types';
import { InfoView, Loader } from '@/shared/ui';
import { Text, View } from 'react-native';

export const StudentInfoView = ({
	header = '',
	...styles
}: { header: string } & InfoViewStyles) => {
	const { data, loading, error } = useStudentInfo();

	if (loading) {
		return <Loader />;
	}

	if (!data || error) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<Text>Нет данных о студенте</Text>
			</View>
		);
	}

	return (
		<InfoView
			header={header}
			subtitle={`Группа ${data[0]?.group || 'не назначена'}`}
			info={`Курс ${data[0]?.course || 'не указан'}`}
			{...styles}
		/>
	);
};
