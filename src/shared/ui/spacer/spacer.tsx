import { Colors } from '@/shared/constants/model/theme';
import { View } from 'react-native';

export const Spacer = () => {
	return (
		<View
			style={{
				marginBottom: 120,
				backgroundColor: Colors.primary,
				height: 0,
			}}
		/>
	);
};
