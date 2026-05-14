import { Button } from '@/shared/ui/button/button';
import { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { fn } from 'storybook/test';

const meta = {
	title: 'shared/Button',
	component: Button,
	tags: ['autodocs'],
	args: { onPress: fn() },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		title: 'Button',
	},
	parameters: {
		docs: {
			description: {
				story: 'Основная кнопка — используется для главных действий на экране',
			},
		},
	},
};

export const Secondary: Story = {
	args: {
		title: 'Button',
		variant: 'secondary',
	},
};
