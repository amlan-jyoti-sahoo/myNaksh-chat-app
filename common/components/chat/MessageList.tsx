import { useEffect, useRef } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import type { ChatMessage } from '../../types/chat';
import type { AiFeedbackState } from '../../types/aiFeedback';
import { SwipeReplyMessage } from './SwipeReplyMessage';

type Props = {
  messages: ChatMessage[];
  messageById: Map<string, ChatMessage>;
  reactions: Record<string, string>;
  aiFeedback: Record<string, AiFeedbackState>;
  openReactionMessageId: string | null;
  onOpenReaction: (messageId: string | null) => void;
  onReply: (message: ChatMessage) => void;
  onReact: (messageId: string, emoji: string) => void;
  onToggleAiVote: (messageId: string, vote: 'like' | 'dislike') => void;
  onSelectAiReason: (messageId: string, reason: string) => void;
};

export function MessageList({
  messages,
  messageById,
  reactions,
  aiFeedback,
  openReactionMessageId,
  onOpenReaction,
  onReply,
  onReact,
  onToggleAiVote,
  onSelectAiReason,
}: Props) {
  const listRef = useRef<FlatList<ChatMessage>>(null);

  useEffect(() => {
    if (messages.length === 0) {
      return;
    }

    const timeout = setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true });
    }, 0);

    return () => clearTimeout(timeout);
  }, [messages.length]);

  return (
    <FlatList
      ref={listRef}
      data={messages}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      keyboardShouldPersistTaps="handled"
      scrollEnabled={!openReactionMessageId}
      onScrollBeginDrag={() => onOpenReaction(null)}
      onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
      renderItem={({ item }) => {
        const replyMessage = item.replyTo ? messageById.get(item.replyTo) : undefined;
        const replyPreview = replyMessage?.text;
        return (
          <SwipeReplyMessage
            message={item}
            replyPreview={replyPreview}
            reaction={reactions[item.id]}
            aiFeedback={aiFeedback[item.id]}
            isReactionBarOpen={openReactionMessageId === item.id}
            onOpenReactionBar={() => onOpenReaction(item.id)}
            onCloseReactionBar={() => onOpenReaction(null)}
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
