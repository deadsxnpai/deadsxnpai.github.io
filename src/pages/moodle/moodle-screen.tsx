import { CrossPlatformWebView } from '@/shared';
import { EndPoints } from '@/shared/config/base';

export function MoodleScreen() {
	return <CrossPlatformWebView url={EndPoints.moodle} />;
}
