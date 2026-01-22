import { CrossPlatformWebView } from '@/shared';
import { EndPoints } from '@/shared/config/base';

export function ChatbotScreen() {
	return <CrossPlatformWebView url={EndPoints.chatbotStudent} />;
}
