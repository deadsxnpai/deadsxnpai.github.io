import { CrossPlatformWebView } from '@/shared';
import { EndPoints } from '@/shared/constants/base';

export function ChatbotScreen() {
	return <CrossPlatformWebView url={EndPoints.chatbotStudent} />;
}
