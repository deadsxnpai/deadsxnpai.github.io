import { CrossPlatformWebView } from '@/shared';
import { EndPoints } from '@/shared/config/base';
import React from 'react';

export function LoginScreen() {
	return <CrossPlatformWebView url={EndPoints.auth} />;
}
