import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { FEATURED_SURAHS, Surah } from '../constants/quranData';
import { Language, TRANSLATIONS } from '../constants/translations';
import { PlayCircle, Award, Target, Flame, ChevronLeft, ChevronRight, BookOpen, Mic } from 'lucide-react-native';

interface HomeScreenProps {
  currentLanguage: Language;
  onSelectSurah: (surah: Surah) => void;
  onNavigateToMakharij: () => void;
  onNavigateToAcademy: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currentLanguage,
  onSelectSurah,
  onNavigateToMakharij,
  onNavigateToAcademy,
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const isAr = currentLanguage === 'ar';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero Card: Daily Target & Practice Call to Action */}
      <View style={styles.heroCard}>
        <View style={[styles.heroHeader, isAr ? styles.rtlRow : styles.ltrRow]}>
          <View style={styles.targetIconBox}>
            <Target size={22} color={COLORS.gold} />
          </View>
          <View style={styles.heroTitles}>
            <Text style={[styles.heroTitle, isAr ? styles.textRight : styles.textLeft]}>
              {t.dailyGoal}
            </Text>
            <Text style={[styles.heroSubtitle, isAr ? styles.textRight : styles.textLeft]}>
              {t.readyToRecite}
            </Text>
          </View>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Flame size={16} color="#FF9F43" />
            <Text style={styles.statNumber}>7</Text>
            <Text style={styles.statLabel}>{t.streakDays}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Award size={16} color={COLORS.gold} />
            <Text style={styles.statNumber}>94%</Text>
            <Text style={styles.statLabel}>{t.overallScore}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <BookOpen size={16} color={COLORS.emeraldLight} />
            <Text style={styles.statNumber}>18/28</Text>
            <Text style={styles.statLabel}>{t.makharijMastery}</Text>
          </View>
        </View>

        {/* Start Practice Action */}
        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => onSelectSurah(FEATURED_SURAHS[0])}
          activeOpacity={0.85}
        >
          <Mic size={20} color={COLORS.background} />
          <Text style={styles.startBtnText}>{t.startPractice}</Text>
        </TouchableOpacity>
      </View>

      {/* Featured Tajweed Rule of the Day Banner */}
      <TouchableOpacity
        style={styles.ruleBanner}
        onPress={onNavigateToAcademy}
        activeOpacity={0.8}
      >
        <View style={[styles.ruleBannerContent, isAr ? styles.rtlRow : styles.ltrRow]}>
          <View style={styles.ruleBadge}>
            <Text style={styles.ruleBadgeText}>🌟</Text>
          </View>
          <View style={styles.ruleTextCol}>
            <Text style={[styles.ruleBannerTitle, isAr ? styles.textRight : styles.textLeft]}>
              {t.todayTajweedRule}
            </Text>
            <Text style={[styles.ruleBannerSub, isAr ? styles.textRight : styles.textLeft]}>
              {isAr ? 'اضغط لفتح درس وتطبيقات القلقلة الصوتية' : 'Tap to explore the interactive lesson'}
            </Text>
          </View>
          {isAr ? (
            <ChevronLeft size={20} color={COLORS.gold} />
          ) : (
            <ChevronRight size={20} color={COLORS.gold} />
          )}
        </View>
      </TouchableOpacity>

      {/* Featured Surahs Section */}
      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.sectionTitle, isAr ? styles.textRight : styles.textLeft]}>
          {t.surahListTitle}
        </Text>
      </View>

      {FEATURED_SURAHS.map((surah) => (
        <TouchableOpacity
          key={surah.number}
          style={styles.surahCard}
          onPress={() => onSelectSurah(surah)}
          activeOpacity={0.8}
        >
          <View style={[styles.surahRow, isAr ? styles.rtlRow : styles.ltrRow]}>
            {/* Surah Number Icon */}
            <View style={styles.surahNumberBadge}>
              <Text style={styles.surahNumberText}>{surah.number}</Text>
            </View>

            {/* Surah Information */}
            <View style={styles.surahDetails}>
              <Text style={[styles.surahName, isAr ? styles.textRight : styles.textLeft]}>
                {isAr ? surah.nameAr : surah.nameEn}
              </Text>
              <Text style={[styles.surahMeta, isAr ? styles.textRight : styles.textLeft]}>
                {isAr
                  ? `${surah.revelationTypeAr} • ${surah.totalAyahs} آيات • مرتل ومعلم`
                  : `${surah.revelationType} • ${surah.totalAyahs} Ayahs • Audio AI`}
              </Text>
            </View>

            {/* Action Icon */}
            <View style={styles.playIconBox}>
              <PlayCircle size={28} color={COLORS.gold} />
            </View>
          </View>
        </TouchableOpacity>
      ))}

      {/* Articulation Points Callout */}
      <TouchableOpacity
        style={styles.makharijCallout}
        onPress={onNavigateToMakharij}
        activeOpacity={0.85}
      >
        <View style={[styles.makharijCalloutContent, isAr ? styles.rtlRow : styles.ltrRow]}>
          <Text style={styles.calloutIcon}>👄</Text>
          <View style={styles.calloutTextCol}>
            <Text style={[styles.calloutTitle, isAr ? styles.textRight : styles.textLeft]}>
              {t.makharijTitle}
            </Text>
            <Text style={[styles.calloutDesc, isAr ? styles.textRight : styles.textLeft]}>
              {t.makharijDesc}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  ltrRow: {
    flexDirection: 'row',
  },
  heroCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  heroHeader: {
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  targetIconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTitles: {
    flex: 1,
  },
  heroTitle: {
    color: COLORS.textGold,
    fontSize: 16,
    fontWeight: 'bold',
  },
  heroSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.cardElevated,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.md,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statNumber: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.gold,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm + 4,
    gap: SPACING.sm,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  startBtnText: {
    color: COLORS.background,
    fontSize: 15,
    fontWeight: 'bold',
  },
  ruleBanner: {
    backgroundColor: COLORS.cardElevated,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    marginBottom: SPACING.md,
  },
  ruleBannerContent: {
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  ruleBadge: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ruleBadgeText: {
    fontSize: 18,
  },
  ruleTextCol: {
    flex: 1,
  },
  ruleBannerTitle: {
    color: COLORS.textGold,
    fontSize: 13,
    fontWeight: 'bold',
  },
  ruleBannerSub: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  sectionHeaderRow: {
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    color: COLORS.textGold,
    fontSize: 15,
    fontWeight: 'bold',
  },
  surahCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: SPACING.sm,
  },
  surahRow: {
    alignItems: 'center',
    gap: SPACING.md,
  },
  surahNumberBadge: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.cardElevated,
    borderWidth: 1,
    borderColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  surahNumberText: {
    color: COLORS.gold,
    fontSize: 14,
    fontWeight: 'bold',
  },
  surahDetails: {
    flex: 1,
  },
  surahName: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: 'bold',
  },
  surahMeta: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 3,
  },
  playIconBox: {
    padding: 4,
  },
  makharijCallout: {
    backgroundColor: COLORS.cardElevated,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorderActive,
    marginTop: SPACING.sm,
  },
  makharijCalloutContent: {
    alignItems: 'center',
    gap: SPACING.md,
  },
  calloutIcon: {
    fontSize: 28,
  },
  calloutTextCol: {
    flex: 1,
  },
  calloutTitle: {
    color: COLORS.textGold,
    fontSize: 14,
    fontWeight: 'bold',
  },
  calloutDesc: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 2,
    lineHeight: 16,
  },
  textRight: {
    textAlign: 'right',
  },
  textLeft: {
    textAlign: 'left',
  },
});
