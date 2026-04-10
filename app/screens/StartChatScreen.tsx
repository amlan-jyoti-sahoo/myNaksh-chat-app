import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  astrologerName: string;
  onStartChat: () => void;
};

const BACKGROUND_IMAGE = require('../common/assets/horoscope-background.png');

export default function StartChatScreen({ astrologerName, onStartChat }: Props) {
  return (
    <ImageBackground source={BACKGROUND_IMAGE} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
        <View style={styles.contentCard}>
          <Text style={styles.kicker}>Welcome</Text>
          <Text style={styles.title}>{astrologerName}</Text>
          <Text style={styles.subtitle}>Your personalized astrology session is ready.</Text>

          <Pressable style={styles.startButton} onPress={onStartChat}>
            <Text style={styles.startButtonText}>Start Chat</Text>
          </Pressable>
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
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  contentCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.90)',
    borderRadius: 18,
    paddingVertical: 26,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  kicker: {
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#6b7280',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: '#374151',
  },
  startButton: {
    marginTop: 20,
    borderRadius: 999,
    backgroundColor: '#1d4ed8',
    paddingVertical: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
