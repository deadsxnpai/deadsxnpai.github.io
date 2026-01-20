import { CrossPlatformWebView } from '@/shared';
import { EndPoints } from '@/shared/constants/base';

export function ChatbotScreen() {
	const injectedJs = `
    function jivo_onLoadCallback() {
      jivo_api.setContactInfo({
        name: "$Поумолчанов Новый Пользович",
        email: "kluchnikovds@tsutmb.ru",
        phone: "+79005125355"
      });
    }
  `;
	return (
		<CrossPlatformWebView
			url={EndPoints.chatbotStudent}
			injectedJavaScript={injectedJs}
		/>
	);
}
