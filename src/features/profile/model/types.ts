import { StyleProp, TextStyle, ViewStyle } from 'react-native';

export type InfoViewStyles = {
	style?: StyleProp<ViewStyle> | undefined;
	headerStyle?: StyleProp<TextStyle> | undefined;
	subTitleStyle?: StyleProp<TextStyle> | undefined;
	infoStyle?: StyleProp<TextStyle> | undefined;
};

export type ProfileInfoProps = {
	header: string;
	subtitle: string;
	info: string;
} & InfoViewStyles;
