import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import FoxAvatar from './FoxAvatar';

export default function QuestionBubble({
  question,
  avatarContent,
  avatarSize = 44,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      {/* Fox avatar */}
      <View
        style={[
          styles.avatar,
          {
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
          },
        ]}
      >
        {avatarContent || <FoxAvatar mood="happy" size={avatarSize - 4} />}
      </View>

      {/* Speech bubble */}
      <View style={styles.bubbleWrapper}>
        {/* Triangle pointer */}
        <View style={styles.triangleContainer}>
          <View style={styles.triangle} />
        </View>
        <View style={styles.bubble}>
          <Text style={styles.questionText}>{question}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
  },
  avatar: {
    backgroundColor: '#FFF0E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
    marginTop: SPACING.xs,
    ...SHADOWS.small,
  },
  avatarEmoji: {
    fontSize: 22,
  },
  bubbleWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  triangleContainer: {
    justifyContent: 'center',
    height: 40,
    marginLeft: -2,
  },
  triangle: {
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderRightWidth: 10,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: COLORS.white,
  },
  bubble: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.base,
    ...SHADOWS.card,
  },
  questionText: {
    fontSize: FONTS.body,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
    lineHeight: 24,
  },
});
