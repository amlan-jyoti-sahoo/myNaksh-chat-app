export type Sender = 'system' | 'user' | 'ai_astrologer' | 'human_astrologer';
export type MessageType = 'event' | 'text' | 'ai' | 'human';

export type ChatMessage = {
  id: string;
  sender: Sender;
  text: string;
  timestamp: number;
  type: MessageType;
  hasFeedback?: boolean;
  feedbackType?: 'liked' | 'disliked';
  replyTo?: string;
};
