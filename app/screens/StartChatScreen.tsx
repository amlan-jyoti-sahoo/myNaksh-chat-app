import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  astrologerName: string;
  onStartChat: () => void;
};

const BACKGROUND_IMAGE = require('../../common/assets/horoscope-background.png');

export default function StartChatScreen({ astrologerName, onStartChat }: Props) {
  return (
    <ImageBackground source={BACKGROUND_IMAGE} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
        <View style={styles.astroCard}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarText}>AV</Text>
            <View style={styles.chatCountBadge}>
              <Text style={styles.chatCountTitle}>Total chats</Text>
              <Text style={styles.chatCountValue}>13.8k+</Text>
            </View>
          </View>

          <View style={styles.contentArea}>
            <View style={styles.topRow}>
              <View>
                <Text style={styles.nameText}>{astrologerName}</Text>
                <Text style={styles.tagText}>Vedic</Text>
              </View>

              <View style={styles.priceArea}>
                {/* <Text style={styles.astroBadge}>AI ASTRO</Text> */}
              </View>
            </View>

            <View style={styles.skillsWrap}>
              <Text style={styles.skillItem}>Sharp Reader</Text>
              <Text style={styles.skillItem}>Yuva Margdarshak</Text>
            </View>

            <Pressable style={styles.startButton} onPress={onStartChat}>
              <Text style={styles.startButtonText}>AI Chat</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.helperTextWrap}>
          <Text style={styles.helperText}>Tap AI Chat to start with Astrologer Vikram.</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(20, 20, 20, 0.28)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  astroCard: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#d9c6af',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#c3af97',
    gap: 12,
  },
  avatarWrap: {
    width: 84,
    alignItems: 'center',
  },
  avatarText: {
    width: 84,
    height: 84,
    borderRadius: 14,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    backgroundColor: '#f19863',
    lineHeight: 84,
  },
  chatCountBadge: {
    marginTop: 6,
    width: '100%',
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.45)',
    paddingVertical: 4,
    alignItems: 'center',
  },
  chatCountTitle: {
    fontSize: 11,
    color: '#1f2937',
  },
  chatCountValue: {
    fontSize: 13,
    color: '#0f7a16',
    fontWeight: '800',
  },
  contentArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  nameText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  tagText: {
    marginTop: 6,
    alignSelf: 'flex-start',
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#c8b39a',
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  astroBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#b45309',
    backgroundColor: '#efc18d',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  priceText: {
    marginTop: 8,
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  offerText: {
    marginTop: 2,
    fontSize: 14,
    color: '#0f7a16',
    fontWeight: '700',
  },
  skillsWrap: {
    marginTop: 10,
    gap: 4,
  },
  skillItem: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  startButton: {
    marginTop: 10,
    // alignSelf: 'flex-end',
    borderRadius: 10,
    backgroundColor: '#129100',
    paddingHorizontal: 24,
    paddingVertical: 10,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  helperTextWrap: {
    marginTop: 18,
    paddingHorizontal: 12,
  },
  helperText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#f9fafb',
  },
});
