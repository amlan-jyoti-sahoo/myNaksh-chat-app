import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

type Props = {
  draft: string;
  onDraftChange: (value: string) => void;
  replyingToText?: string;
  onCancelReply: () => void;
  onSend?: () => void;
  onInputFocus?: () => void;
};

export function ChatComposer({
  draft,
  onDraftChange,
  replyingToText,
  onCancelReply,
  onSend,
  onInputFocus,
}: Props) {
  const isDisabled = draft.trim().length === 0;

  return (
    <View style={styles.composerArea}>
      {replyingToText ? (
        <View style={styles.replyBar}>
          <View style={styles.replyTextWrap}>
            <Text style={styles.replyBarLabel}>Replying to...</Text>
            <Text numberOfLines={1} style={styles.replyBarText}>
              {replyingToText}
            </Text>
          </View>

          <Pressable onPress={onCancelReply} hitSlop={8}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      ) : null}

      <View style={styles.inputShell}>
        <TextInput
          placeholder="Type a message"
          value={draft}
          onChangeText={onDraftChange}
          onFocus={onInputFocus}
          style={styles.input}
          placeholderTextColor="#a0a0a0"
          multiline
          // maxHeight={100}
        />

        <Pressable
          style={isDisabled ? styles.sendButtonDisabled : styles.sendButton}
          disabled={isDisabled}
          onPress={onSend}
        >
          <Ionicons
            name="send"
            size={isDisabled ? 22 : 16}
            color={isDisabled ? 'grey' : '#ffffff'}
            style={styles.sendIcon}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  composerArea: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  replyBar: {
    marginBottom: 8,
    backgroundColor: '#fff7ed',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fed7aa',
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  replyTextWrap: {
    flex: 1,
    marginRight: 12,
  },
  replyBarLabel: {
    fontSize: 11,
    color: '#9a3412',
    marginBottom: 2,
  },
  replyBarText: {
    fontSize: 13,
    color: '#7c2d12',
  },
  cancelText: {
    color: '#b91c1c',
    fontSize: 13,
    fontWeight: '600',
  },
  inputShell: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#d4cfc7',
    borderRadius: 16,
    backgroundColor: '#faf8f6',
    paddingLeft: 16,
    paddingRight: 8,
    justifyContent:'center',
    paddingTop: 8,
    paddingBottom: 8,
  },
  input: {
    flex: 1,
    paddingRight: 10,
    paddingVertical: 8,
    color: '#111827',
    fontSize: 15,
    backgroundColor: 'transparent',
    // minHeight: 44,
  },
  sendButton: {
    backgroundColor: '#8b5a3c',
    borderRadius: 12,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0f172a',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  sendButtonDisabled: {
    // backgroundColor: '#8b5a3c',
    borderRadius: 12,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0f172a',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  sendIcon: {
    marginLeft: 2,
  },
});
