import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  visible: boolean;
  rating: number;
  onRatingChange: (rating: number) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export function SessionRatingOverlay({
  visible,
  rating,
  onRatingChange,
  onClose,
  onSubmit,
}: Props) {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlayRoot}>
      <View style={styles.blurLayer} />

      <View style={styles.overlayCard}>
        <Text style={styles.overlayTitle}>Thank You</Text>
        <Text style={styles.overlaySubtitle}>
          Your astrological session has ended. Please rate your experience.
        </Text>

        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Pressable key={star} onPress={() => onRatingChange(star)} hitSlop={8}>
              <Text style={[styles.star, rating >= star ? styles.starActive : styles.starInactive]}>
                ★
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.overlayActions}>
          <Pressable style={styles.overlaySecondaryButton} onPress={onClose}>
            <Text style={styles.overlaySecondaryText}>Close</Text>
          </Pressable>

          <Pressable
            style={[
              styles.overlayPrimaryButton,
              rating === 0 && styles.overlayPrimaryButtonDisabled,
            ]}
            disabled={rating === 0}
            onPress={onSubmit}
          >
            <Text style={styles.overlayPrimaryText}>Submit</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlayRoot: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  blurLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 20, 52, 0.72)',
  },
  overlayCard: {
    width: '86%',
    borderRadius: 18,
    padding: 18,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.45)',
  },
  overlayTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#e2e8f0',
    textAlign: 'center',
  },
  overlaySubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#bfdbfe',
    textAlign: 'center',
    lineHeight: 20,
  },
  starsRow: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  star: {
    fontSize: 34,
  },
  starActive: {
    color: '#f59e0b',
  },
  starInactive: {
    color: '#475569',
  },
  overlayActions: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  overlaySecondaryButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  overlaySecondaryText: {
    color: '#cbd5e1',
    fontWeight: '600',
  },
  overlayPrimaryButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#92400e',
  },
  overlayPrimaryButtonDisabled: {
    backgroundColor: '#c2410c',
    opacity: 0.55,
  },
  overlayPrimaryText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
