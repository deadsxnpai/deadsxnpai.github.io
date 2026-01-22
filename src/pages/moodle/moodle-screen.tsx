import { CrossPlatformWebView } from '@/shared';
import { EndPoints } from '@/shared/constants/base';

export function MoodleScreen() {
	return <CrossPlatformWebView url={EndPoints.moodle} />;
}
