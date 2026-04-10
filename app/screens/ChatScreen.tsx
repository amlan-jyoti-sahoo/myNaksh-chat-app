import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  SafeAreaView,
  StyleSheet,
  UIManager,
} from 'react-native';
import { CHAT_MESSAGES } from '../common/data/chatMessages';
import { ChatComposer } from '../common/components/chat/ChatComposer';
import { ChatHeader } from '../common/components/chat/ChatHeader';
import { MessageList } from '../common/components/chat/MessageList';
import { SessionRatingOverlay } from '../common/components/chat/SessionRatingOverlay';
import type { AiFeedbackState } from '../common/types/aiFeedback';
import type { ChatMessage } from '../common/types/chat';

type Props = {
  astrologerName: string;
  onSessionCompleted: () => void;
};

const BACKGROUND_IMAGE = require('../common/assets/horoscope-background.png');

export default function ChatScreen({ astrologerName, onSessionCompleted }: Props) {
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [draft, setDraft] = useState('');
  const [reactions, setReactions] = useState<Record<string, string>>({});
  const [aiFeedback, setAiFeedback] = useState<Record<string, AiFeedbackState>>({});
  const [isRatingOverlayVisible, setIsRatingOverlayVisible] = useState(false);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const messageById = useMemo(() => {
    const map = new Map<string, ChatMessage>();
    for (const message of CHAT_MESSAGES) {
      map.set(message.id, message);
    }
    return map;
  }, []);

  return (
    <ImageBackground source={BACKGROUND_IMAGE} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.root}>
        <KeyboardAvoidingView
          style={styles.keyboardWrap}
          behavior={Platform.select({ ios: 'padding', android: undefined })}
        >
        <ChatHeader
          astrologerName={astrologerName}
          onEndChat={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setIsRatingOverlayVisible(true);
          }}
        />

        <MessageList
          messageById={messageById}
          reactions={reactions}
          aiFeedback={aiFeedback}
          onReply={setReplyingTo}
          onReact={(messageId, emoji) => {
            setReactions((prev) => ({
              ...prev,
              [messageId]: prev[messageId] === emoji ? '' : emoji,
            }));
          }}
          onToggleAiVote={(messageId, vote) => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setAiFeedback((prev) => {
              const existing = prev[messageId] ?? {};
              const nextVote = existing.vote === vote ? undefined : vote;
              return {
                ...prev,
                [messageId]: {
                  vote: nextVote,
                  reason: nextVote === 'dislike' ? existing.reason : undefined,
                },
              };
            });
          }}
          onSelectAiReason={(messageId, reason) => {
            setAiFeedback((prev) => ({
              ...prev,
              [messageId]: {
                ...(prev[messageId] ?? {}),
                vote: 'dislike',
                reason,
              },
            }));
          }}
        />

        <ChatComposer
          draft={draft}
          onDraftChange={setDraft}
          replyingToText={replyingTo?.text}
          onCancelReply={() => setReplyingTo(null)}
        />

        <SessionRatingOverlay
          visible={isRatingOverlayVisible}
          rating={rating}
          onRatingChange={setRating}
          onClose={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setIsRatingOverlayVisible(false);
          }}
          onSubmit={() => {
            Alert.alert(
              'Rating Captured',
              `Thanks for rating this session ${rating} star${rating > 1 ? 's' : ''}.`
            );
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setIsRatingOverlayVisible(false);
            setRating(0);
            setReplyingTo(null);
            setDraft('');
            setReactions({});
            setAiFeedback({});
            onSessionCompleted();
          }}
        />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  root: {
    flex: 1,
    backgroundColor: 'rgba(248, 250, 252, 0.72)',
  },
  keyboardWrap: {
    flex: 1,
  },
});
