import { FlatList, StyleSheet } from 'react-native';
import { CHAT_MESSAGES } from '../../data/chatMessages';
import type { ChatMessage } from '../../types/chat';
import type { AiFeedbackState } from '../../types/aiFeedback';
import { SwipeReplyMessage } from './SwipeReplyMessage';

type Props = {
  messageById: Map<string, ChatMessage>;
  reactions: Record<string, string>;
  aiFeedback: Record<string, AiFeedbackState>;
  onReply: (message: ChatMessage) => void;
  onReact: (messageId: string, emoji: string) => void;
  onToggleAiVote: (messageId: string, vote: 'like' | 'dislike') => void;
  onSelectAiReason: (messageId: string, reason: string) => void;
};

export function MessageList({
  messageById,
  reactions,
  aiFeedback,
  onReply,
  onReact,
  onToggleAiVote,
  onSelectAiReason,
}: Props) {
  return (
    <FlatList
      data={CHAT_MESSAGES}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => {
        const replyMessage = item.replyTo ? messageById.get(item.replyTo) : undefined;
        const replyPreview = replyMessage?.text;
        return (
          <SwipeReplyMessage
            message={item}
            replyPreview={replyPreview}
            reaction={reactions[item.id]}
            aiFeedback={aiFeedback[item.id]}
            onReply={onReply}
            onReact={onReact}
            onToggleAiVote={onToggleAiVote}
            onSelectAiReason={onSelectAiReason}
          />
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
});
