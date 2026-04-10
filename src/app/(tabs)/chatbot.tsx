import React, { useEffect, useMemo, useState } from 'react';

import { useUser } from '@/features/auth';
import { EndPoints } from '@/shared/constants';
import { findContact, formatPhoneNumber } from '@/shared/lib';
import { CrossPlatformWebView } from '@/shared/ui';

const DEFAULT_PHONE = '+79000000000';

const ChatbotScreen = () => {
	const { data: userData, email, email_work, groups } = useUser() || {};
	const [uri, setUri] = useState<string | null>(null);

	const isEmployee = useMemo(() => groups?.includes('employee'), [groups]);

	const phone = useMemo(() => {
		const contact = findContact(userData?.contacts, {
			kind_contact_information: 'ТелефонМобильныйФизическиеЛица',
		});

		return contact !== '--' ? formatPhoneNumber(contact) : DEFAULT_PHONE;
	}, [userData]);

	const userInfo = useMemo(() => {
		return {
			name: userData?.fullName || 'Guest',
			email: isEmployee ? email_work || '' : email || '',
			phone,
		};
	}, [userData, email, email_work, isEmployee, phone]);

	const injectedJavaScript = useMemo(() => {
		return `
      (function() {
        function waitForJivo() {
          if (typeof jivo_api !== 'undefined') {
            jivo_api.setContactInfo({
              name: "${userInfo.name}",
              email: "${userInfo.email}",
              phone: "${userInfo.phone}",
              description: "User profile information"
            });
          } else {
            setTimeout(waitForJivo, 100);
          }
        }
        waitForJivo();
      })();
    `;
	}, [userInfo]);

	useEffect(() => {
		if (!userData) return;

		setUri(isEmployee ? EndPoints.chatbot : EndPoints.chatbotStudent);
	}, [userData, isEmployee]);

	if (!uri) return null;

	return (
		<CrossPlatformWebView
			url={uri}
			injectedJavaScriptBeforeContentLoaded={injectedJavaScript}
		/>
	);
};

export default ChatbotScreen;
