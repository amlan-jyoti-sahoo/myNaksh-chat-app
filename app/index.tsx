import { useState } from 'react';
import ChatScreen from './screens/ChatScreen';
import StartChatScreen from './screens/StartChatScreen';

const ASTROLOGER_NAME = 'Astrologer Vikram';

export default function IndexScreen() {
	const [isChatStarted, setIsChatStarted] = useState(false);

	if (!isChatStarted) {
		return (
			<StartChatScreen
				astrologerName={ASTROLOGER_NAME}
				onStartChat={() => setIsChatStarted(true)}
			/>
		);
	}

	return (
		<ChatScreen
			astrologerName={ASTROLOGER_NAME}
			onSessionCompleted={() => setIsChatStarted(false)}
		/>
	);
}
