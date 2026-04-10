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
    backgroundColor: 'rgba(250, 245, 238, 0.74)',
  },
  overlayCard: {
    width: '86%',
    borderRadius: 18,
    padding: 18,
    backgroundColor: 'rgba(255,255,255,0.93)',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  overlayTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  overlaySubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#4b5563',
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
    color: '#d1d5db',
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
    backgroundColor: '#f3f4f6',
  },
  overlaySecondaryText: {
    color: '#374151',
    fontWeight: '600',
  },
  overlayPrimaryButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#2563eb',
  },
  overlayPrimaryButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  overlayPrimaryText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
