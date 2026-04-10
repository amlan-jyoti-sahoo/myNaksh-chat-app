import { memo, useEffect, useState } from 'react';
import { CheckCheck, Reply } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import type { ChatMessage } from '../../types/chat';
import type { AiFeedbackState } from '../../types/aiFeedback';

type Props = {
  message: ChatMessage;
  replyPreview?: string;
  reaction?: string;
  aiFeedback?: AiFeedbackState;
  onReply: (message: ChatMessage) => void;
  onReact: (messageId: string, emoji: string) => void;
  onToggleAiVote: (messageId: string, vote: 'like' | 'dislike') => void;
  onSelectAiReason: (messageId: string, reason: string) => void;
  isReactionBarOpen: boolean;
  onOpenReactionBar: () => void;
  onCloseReactionBar: () => void;
};

const MAX_SWIPE = 84;
const REPLY_TRIGGER = 52;
const REACTION_EMOJIS = ['🙏', '✨', '🌙', '🔮', '💫'];
const DISLIKE_CHIPS = ['Inaccurate', 'Too Vague', 'Too Long'];

function SwipeReplyMessageBase({
  message,
  replyPreview,
  reaction,
  aiFeedback,
  onReply,
  onReact,
  onToggleAiVote,
  onSelectAiReason,
  isReactionBarOpen,
  onOpenReactionBar,
  onCloseReactionBar,
}: Props) {
  const canReply = message.type !== 'event';
  const isUser = message.sender === 'user';
  const isAiMessage = message.sender === 'ai_astrologer';
  const translateX = useSharedValue(0);
  const reactionBarProgress = useSharedValue(0);
  const chipProgress = useSharedValue(0);
  const [localAiFeedback, setLocalAiFeedback] = useState<AiFeedbackState>(aiFeedback ?? {});

  useEffect(() => {
    reactionBarProgress.value = withTiming(isReactionBarOpen ? 1 : 0, {
      duration: isReactionBarOpen ? 220 : 180,
    });
  }, [isReactionBarOpen, reactionBarProgress]);

  useEffect(() => {
    const shouldShowChips = localAiFeedback.vote === 'dislike' && !localAiFeedback.reason;
    chipProgress.value = withTiming(shouldShowChips ? 1 : 0, {
      duration: 170,
    });
  }, [localAiFeedback.vote, localAiFeedback.reason, chipProgress]);

  useEffect(() => {
    setLocalAiFeedback(aiFeedback ?? {});
  }, [aiFeedback?.vote, aiFeedback?.reason, message.id]);

  const handleToggleAiVote = (vote: 'like' | 'dislike') => {
    setLocalAiFeedback((prev) => {
      const nextVote = prev.vote === vote ? undefined : vote;
      return {
        vote: nextVote,
        reason: nextVote === 'dislike' ? prev.reason : undefined,
      };
    });
    onToggleAiVote(message.id, vote);
  };

  const handleSelectAiReason = (reason: string) => {
    setLocalAiFeedback((prev) => ({
      ...prev,
      vote: 'dislike',
      reason,
    }));
    onSelectAiReason(message.id, reason);
  };

  const pan = Gesture.Pan()
    .enabled(canReply)
    .activeOffsetX([12, 999])
    .onUpdate((event) => {
      const next = Math.max(0, Math.min(event.translationX, MAX_SWIPE));
      translateX.value = next;
    })
    .onEnd(() => {
      const shouldReply = translateX.value > REPLY_TRIGGER;
      translateX.value = withSpring(0, {
        damping: 16,
        stiffness: 180,
      });
      if (shouldReply) {
        runOnJS(onReply)(message);
      }
    })
    .onFinalize(() => {
      if (translateX.value < REPLY_TRIGGER) {
        translateX.value = withSpring(0, {
          damping: 16,
          stiffness: 180,
        });
      }
    });

  const longPress = Gesture.LongPress()
    .minDuration(200)
    .onStart(() => {
      runOnJS(onOpenReactionBar)();
    });

  const tap = Gesture.Tap()
    .maxDuration(200)
    .onStart(() => {
      if (isReactionBarOpen) {
        runOnJS(onCloseReactionBar)();
      }
    });

  // Use Race so that whichever gesture completes first takes priority
  const composedGesture = Gesture.Race(
    Gesture.Simultaneous(pan, longPress),
    tap
  );

  const animatedBubble = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const animatedReplyIcon = useAnimatedStyle(() => {
    return {
      opacity: interpolate(translateX.value, [0, 24, MAX_SWIPE], [0, 0.45, 1]),
      transform: [{ scale: interpolate(translateX.value, [0, MAX_SWIPE], [0.8, 1]) }],
    };
  });

  const animatedReactionBar = useAnimatedStyle(() => {
    return {
      opacity: reactionBarProgress.value,
      transform: [
        { translateY: interpolate(reactionBarProgress.value, [0, 1], [12, 0]) },
        { scale: interpolate(reactionBarProgress.value, [0, 1], [0.85, 1]) },
      ],
    };
  });

  const animatedChipWrap = useAnimatedStyle(() => {
    return {
      opacity: chipProgress.value,
      maxHeight: interpolate(chipProgress.value, [0, 1], [0, 58]),
      transform: [{ translateY: interpolate(chipProgress.value, [0, 1], [-4, 0]) }],
      overflow: 'hidden',
    };
  });

  return (
    <View
      style={[
        styles.wrapper,
        isUser ? styles.rightAlign : styles.leftAlign,
        reaction && styles.wrapperWithReaction,
      ]}
    >
      <Animated.View style={[styles.replyIconWrap, animatedReplyIcon]}>
        <Reply size={14} color="#ffffff" strokeWidth={2.25} />
      </Animated.View>

      {isReactionBarOpen && (
        <Animated.View
          style={[
            styles.reactionBar,
            isUser ? styles.reactionBarRight : styles.reactionBarLeft,
            animatedReactionBar,
          ]}
          pointerEvents="box-none"
        >
          {REACTION_EMOJIS.map((emoji) => (
            <Pressable
              key={`${message.id}-${emoji}`}
              style={styles.reactionOption}
              onPress={() => {
                onReact(message.id, emoji);
                onCloseReactionBar();
              }}
              android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
            >
              <Text style={styles.reactionOptionText}>{emoji}</Text>
            </Pressable>
          ))}
        </Animated.View>
      )}

      <GestureDetector gesture={composedGesture}>
        <Animated.View
          style={[
            styles.bubble,
            isUser ? styles.userBubble : styles.otherBubble,
            message.type === 'event' && styles.eventBubble,
            animatedBubble,
          ]}
        >
          {replyPreview ? (
            <View style={styles.replyPreviewContainer}>
              <Text style={styles.replyPreviewLabel}>Replying to</Text>
              <Text style={styles.replyPreviewText} numberOfLines={2}>
                {replyPreview}
              </Text>
            </View>
          ) : null}

          <Text style={[styles.messageText, message.type === 'event' && styles.eventText]}>
            {message.text}
          </Text>

          {message.type !== 'event' ? (
            <View style={styles.timestampWrap}>
              <Text style={styles.timestamp}>
                {new Date(message.timestamp).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </Text>
              {isUser ? <CheckCheck size={14} color="#3b82f6" strokeWidth={2.2} /> : null}
            </View>
          ) : null}

          {isAiMessage ? (
            <View style={styles.aiFeedbackWrap}>
              <View style={styles.aiVoteRow}>
                <Pressable
                  onPress={() => handleToggleAiVote('like')}
                  style={[
                    styles.aiVoteButton,
                    localAiFeedback.vote === 'like' && styles.aiVoteButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.aiVoteText,
                      localAiFeedback.vote === 'like' && styles.aiVoteTextActive,
                    ]}
                  >
                    Like
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => handleToggleAiVote('dislike')}
                  style={[
                    styles.aiVoteButton,
                    localAiFeedback.vote === 'dislike' && styles.aiVoteButtonDislike,
                  ]}
                >
                  <Text
                    style={[
                      styles.aiVoteText,
                      localAiFeedback.vote === 'dislike' && styles.aiVoteTextDislike,
                    ]}
                  >
                    {localAiFeedback.vote === 'dislike' && localAiFeedback.reason
                      ? `Dislike (${localAiFeedback.reason})`
                      : 'Dislike'}
                  </Text>
                </Pressable>
              </View>

              <Animated.View
                style={[styles.chipsWrap, animatedChipWrap]}
                pointerEvents={localAiFeedback.vote === 'dislike' && !localAiFeedback.reason ? 'auto' : 'none'}
              >
                <View style={styles.chipsRow}>
                  {DISLIKE_CHIPS.map((chip) => (
                    <Pressable
                      key={`${message.id}-${chip}`}
                      onPress={() => handleSelectAiReason(chip)}
                      style={[styles.chip, localAiFeedback.reason === chip && styles.chipActive]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          localAiFeedback.reason === chip && styles.chipTextActive,
                        ]}
                      >
                        {chip}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </Animated.View>
            </View>
          ) : null}

          {reaction && reaction.trim() ? (
            <View style={styles.selectedReactionPill}>
              <Text style={styles.selectedReactionText}>{reaction}</Text>
            </View>
          ) : null}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

export const SwipeReplyMessage = memo(SwipeReplyMessageBase);

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 6,
    position: 'relative',
    minHeight: 46,
  },
  wrapperWithReaction: {
    marginBottom: 28,
  },
  leftAlign: {
    alignItems: 'flex-start',
  },
  rightAlign: {
    alignItems: 'flex-end',
  },
  replyIconWrap: {
    position: 'absolute',
    left: 10,
    top: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(17, 24, 39, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  reactionBar: {
    position: 'absolute',
    top: -48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 10,
    paddingVertical: 6,
    shadowColor: '#0f172a',
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
    zIndex: 3,
  },
  reactionBarLeft: {
    left: 0,
  },
  reactionBarRight: {
    right: 0,
  },
  reactionOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  reactionOptionText: {
    fontSize: 18,
  },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    zIndex: 1,
  },
  userBubble: {
    backgroundColor: '#d1fae5',
    borderBottomRightRadius: 6,
  },
  otherBubble: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 6,
  },
  eventBubble: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    alignSelf: 'center',
    maxWidth: '92%',
  },
  messageText: {
    color: '#111827',
    fontSize: 15,
    lineHeight: 21,
  },
  timestampWrap: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#9ca3af',
  },
  eventText: {
    textAlign: 'center',
    color: '#4b5563',
    fontSize: 13,
  },
  replyPreviewContainer: {
    borderLeftWidth: 2,
    borderLeftColor: '#f59e0b',
    paddingLeft: 8,
    marginBottom: 8,
  },
  replyPreviewLabel: {
    color: '#6b7280',
    fontSize: 11,
    marginBottom: 2,
  },
  replyPreviewText: {
    color: '#374151',
    fontSize: 12,
    lineHeight: 16,
  },
  aiFeedbackWrap: {
    marginTop: 10,
  },
  aiVoteRow: {
    flexDirection: 'row',
    gap: 8,
  },
  aiVoteButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 4,
    backgroundColor: '#ffffff',
  },
  aiVoteButtonActive: {
    borderColor: '#22c55e',
    backgroundColor: '#dcfce7',
  },
  aiVoteButtonDislike: {
    borderColor: '#ef4444',
    backgroundColor: '#fee2e2',
  },
  aiVoteText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  aiVoteTextActive: {
    color: '#166534',
  },
  aiVoteTextDislike: {
    color: '#991b1b',
  },
  chipsWrap: {
    marginTop: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#fdba74',
    backgroundColor: '#fff7ed',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipActive: {
    borderColor: '#f97316',
    backgroundColor: '#ffedd5',
  },
  chipText: {
    color: '#9a3412',
    fontSize: 12,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#7c2d12',
  },
  selectedReactionPill: {
    position: 'absolute',
    bottom: -14,
    right: 10,
    backgroundColor: '#ffffff',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  selectedReactionText: {
    fontSize: 14,
  },
});
