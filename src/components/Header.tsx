import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Language, TRANSLATIONS } from '../constants/translations';
import { Sparkles, Globe, Flame } from 'lucide-react-native';

interface HeaderProps {
  currentLanguage: Language;
  onToggleLanguage: () => void;
  streakCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onToggleLanguage,
  streakCount = 7,
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const isAr = currentLanguage === 'ar';

  return (
    <View style={[styles.container, isAr ? styles.rtlRow : styles.ltrRow]}>
      {/* Brand & Title */}
      <View style={[styles.brandContainer, isAr ? styles.rtlRow : styles.ltrRow, { flex: 1 }]}>
        <View style={styles.logoBadge}>
          <Sparkles size={18} color={COLORS.gold} />
        </View>
        <View style={[styles.textColumn, { flex: 1, marginHorizontal: 6 }]}>
          <Text style={styles.appName}>{t.appName}</Text>
          <Text style={styles.appSubtitle} numberOfLines={1} ellipsizeMode="tail">
            {t.appSubtitle}
          </Text>
        </View>
      </View>

      {/* Actions: Streak & Language Switcher */}
      <View style={[styles.actionsContainer, isAr ? styles.rtlRow : styles.ltrRow]}>
        {/* Streak Badge */}
        <View style={styles.streakBadge}>
          <Flame size={16} color="#FF9F43" />
          <Text style={styles.streakText}>
            {streakCount} {isAr ? 'يوم' : 'd'}
          </Text>
        </View>

        {/* Language Toggle Pill */}
        <TouchableOpacity
          style={styles.langPill}
          onPress={onToggleLanguage}
          activeOpacity={0.8}
        >
          <Globe size={15} color={COLORS.gold} />
          <Text style={styles.langText}>
            {currentLanguage === 'ar' ? 'EN' : 'عربي'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.15)',
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  ltrRow: {
    flexDirection: 'row',
  },
  brandContainer: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.cardElevated,
    borderWidth: 1,
    borderColor: COLORS.cardBorderActive,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textColumn: {
    justifyContent: 'center',
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textGold,
    letterSpacing: 0.5,
  },
  appSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  actionsContainer: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 159, 67, 0.12)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 159, 67, 0.3)',
    gap: 4,
  },
  streakText: {
    color: '#FF9F43',
    fontSize: 12,
    fontWeight: '700',
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    gap: 5,
  },
  langText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
});
