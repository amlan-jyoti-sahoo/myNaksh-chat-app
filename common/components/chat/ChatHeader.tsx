import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  astrologerName: string;
  onEndChat: () => void;
};

export function ChatHeader({ astrologerName, onEndChat }: Props) {
  // Extract initials from astrologer name
  const initials = astrologerName
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.profileIcon}>
          <Text style={styles.profileInitials}>{initials}</Text>
        </View>
        <View style={styles.nameContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.headerTitle}>{astrologerName}</Text>
            <View style={styles.freeBadge}>
              <Text style={styles.freeBadgeText}>FREE</Text>
            </View>
          </View>
          <Text style={styles.headerSubtitle}>0:44 • Live Session</Text>
        </View>
      </View>
      <View style={styles.headerRight}>
        <Pressable style={styles.endChatButton} onPress={onEndChat}>
          <Text style={styles.endChatText}>End</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  profileIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#d97706',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0f172a',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  profileInitials: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  nameContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  freeBadge: {
    backgroundColor: '#dcfce7',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  freeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#166534',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  headerRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  endChatButton: {
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  endChatText: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '600',
  },
});
