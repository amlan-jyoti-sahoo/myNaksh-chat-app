import { useEffect, useMemo } from 'react';
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  StyleSheet,
  UIManager,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CHAT_MESSAGES } from '../../common/data/chatMessages';
import { ChatComposer } from '../../common/components/chat/ChatComposer';
import { ChatHeader } from '../../common/components/chat/ChatHeader';
import { MessageList } from '../../common/components/chat/MessageList';
import { SessionRatingOverlay } from '../../common/components/chat/SessionRatingOverlay';
import type { AiFeedbackState } from '../../common/types/aiFeedback';
import type { ChatMessage } from '../../common/types/chat';
import {
  initializeMessages,
  addUserMessage,
  updateDraft,
  setReplyingTo,
  setReaction,
  setAiFeedback,
  clearSession,
} from '../../store/chatSlice';
import type { RootState } from '../../store/store';
import { useState } from 'react';

type Props = {
  astrologerName: string;
  onSessionCompleted: () => void;
};

const BACKGROUND_IMAGE = require('../../common/assets/horoscope-background.png');

export default function ChatScreen({ astrologerName, onSessionCompleted }: Props) {
  const dispatch = useDispatch();
  const [openReactionMessageId, setOpenReactionMessageId] = useState<string | null>(null);
  const [isRatingOverlayVisible, setIsRatingOverlayVisible] = useState(false);
  const [rating, setRating] = useState(0);

  // Select from Redux store
  const messages = useSelector((state: RootState) => state.chat.messages);
  const draft = useSelector((state: RootState) => state.chat.draft);
  const reactions = useSelector((state: RootState) => state.chat.reactions);
  const aiFeedback = useSelector((state: RootState) => state.chat.aiFeedback);
  const replyingTo = useSelector((state: RootState) => state.chat.replyingTo);

  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  // Initialize messages from CHAT_MESSAGES data
  useEffect(() => {
    if (messages.length === 0) {
      dispatch(initializeMessages(CHAT_MESSAGES));
    }
  }, [dispatch, messages.length]);

  const messageById = useMemo(() => {
    const map = new Map<string, ChatMessage>();
    for (const message of messages) {
      map.set(message.id, message);
    }
    return map;
  }, [messages]);

  return (
    <ImageBackground source={BACKGROUND_IMAGE} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
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
            messages={messages}
            messageById={messageById}
            reactions={reactions}
            aiFeedback={aiFeedback}
            openReactionMessageId={openReactionMessageId}
            onOpenReaction={setOpenReactionMessageId}
            onReply={(message) => {
              dispatch(setReplyingTo(message));
            }}
            onReact={(messageId, emoji) => {
              dispatch(setReaction({ messageId, emoji }));
              setOpenReactionMessageId(null);
            }}
            onToggleAiVote={(messageId, vote) => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              const existing = aiFeedback[messageId] ?? {};
              const nextVote = existing.vote === vote ? undefined : vote;
              dispatch(
                setAiFeedback({
                  messageId,
                  feedback: nextVote
                    ? {
                        vote: nextVote,
                        reason: nextVote === 'dislike' ? existing.reason : undefined,
                      }
                    : undefined,
                })
              );
            }}
            onSelectAiReason={(messageId, reason) => {
              dispatch(
                setAiFeedback({
                  messageId,
                  feedback: {
                    ...(aiFeedback[messageId] ?? {}),
                    vote: 'dislike',
                    reason,
                  },
                })
              );
            }}
          />

          <ChatComposer
            draft={draft}
            onDraftChange={(value) => {
              setOpenReactionMessageId(null);
              dispatch(updateDraft(value));
            }}
            onInputFocus={() => setOpenReactionMessageId(null)}
            replyingToText={replyingTo?.text}
            onCancelReply={() => {
              dispatch(setReplyingTo(null));
            }}
            onSend={() => {
              if (draft.trim()) {
                setOpenReactionMessageId(null);
                // Add new user message to Redux store
                dispatch(
                  addUserMessage({
                    sender: 'user',
                    text: draft,
                    timestamp: Date.now(),
                    type: 'text',
                    replyTo: replyingTo?.id,
                  })
                );
                // Clear reply state after sending
                if (replyingTo) {
                  dispatch(setReplyingTo(null));
                }
              }
            }}
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
              setOpenReactionMessageId(null);
              dispatch(clearSession());
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
