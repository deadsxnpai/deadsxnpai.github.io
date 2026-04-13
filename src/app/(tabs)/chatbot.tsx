import { useUser } from '@/features/auth';
import { EndPoints } from '@/shared/constants';
import { findContact, formatPhoneNumber } from '@/shared/lib';
import { CrossPlatformWebView } from '@/shared/ui';

import React, { useEffect, useState } from 'react';

const ChatbotScreen = () => {
	const [uri, setUri] = useState<string | null>(null);
	const user = useUser();

	const phone = findContact(user?.data?.contacts, {
		kind_contact_information: 'ТелефонМобильныйФизическиеЛица',
	});

	const isEmployee = user?.groups?.some((group: any) => group === 'employee');

	const injectedJavaScript = `
    (function() {
      function waitForJivo() {
        if (typeof jivo_api !== 'undefined') {
          jivo_api.setContactInfo({
            name: "${user?.data?.fullName || 'Guest'}",
            email: "${user?.email && isEmployee ? user?.email_work : user?.email || ''}",
            phone: "${phone !== '--' ? formatPhoneNumber(phone) : '+79000000000'}",
            description: "User profile information"
          });
        } else {
          setTimeout(waitForJivo, 100);
        }
      }
      waitForJivo();
    })();
  `;

	useEffect(() => {
		if (user) {
			setUri(isEmployee ? EndPoints.chatbot : EndPoints.chatbotStudent);
		}
	}, [user, isEmployee]);

	if (!uri) {
		return null;
	}

	return (
		<CrossPlatformWebView
			url={uri}
			injectedJavaScript={injectedJavaScript}
			injectedJavaScriptBeforeContentLoaded={injectedJavaScript}
		/>
	);
};

export default ChatbotScreen;
