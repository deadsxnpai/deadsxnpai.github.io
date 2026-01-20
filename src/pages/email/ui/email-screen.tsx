import { CrossPlatformWebView } from '@/shared';
import { EndPoints } from '@/shared/constants/base';

export function EmailScreen() {
	return <CrossPlatformWebView url={EndPoints.vkmail} />;
}
