import { ProfileInfoProps } from '@/features/profile/model/types';
import { Colors } from '@/shared/constants';
import { StyleSheet, Text, View } from 'react-native';

export const InfoView = ({
	header,
	subtitle,
	info,
	style,
	headerStyle,
	infoStyle,
	subTitleStyle,
}: ProfileInfoProps) => {
	return (
		<View style={[styles.infoView, style]}>
			<Text style={[styles.line1, headerStyle]}>{header}</Text>
			<Text style={[styles.line2, subTitleStyle]}>{subtitle}</Text>
			<Text style={[styles.line3, infoStyle]}>{info}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	infoView: {
		marginLeft: 15,
		flex: 1,
	},
	line1: {
		maxWidth: '99%',
		fontSize: 18,
		fontWeight: '600',
		color: Colors.white,
		marginBottom: 4,
	},
	line2: {
		fontSize: 12,
		color: Colors.light,
		marginBottom: 2,
	},
	line3: {
		fontSize: 12,
		color: Colors.light,
	},
});
