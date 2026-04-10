import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

type Props = {
  draft: string;
  onDraftChange: (value: string) => void;
  replyingToText?: string;
  onCancelReply: () => void;
};

export function ChatComposer({ draft, onDraftChange, replyingToText, onCancelReply }: Props) {
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

      <View style={styles.inputRow}>
        <TextInput
          placeholder="Type your message"
          value={draft}
          onChangeText={onDraftChange}
          style={styles.input}
          placeholderTextColor="#6b7280"
        />

        <Pressable style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#111827',
    fontSize: 15,
  },
  sendButton: {
    backgroundColor: '#1d4ed8',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
