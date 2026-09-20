import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { FEATURED_SURAHS, ALL_SURAHS, getFullSurah, Surah, SurahMeta } from '../constants/quranData';
import { Language, TRANSLATIONS } from '../constants/translations';
import { ProgressService, UserProgress, INITIAL_PROGRESS } from '../services/progressService';
import { SurahPickerModal } from '../components/SurahPickerModal';
import {
  PlayCircle,
  Award,
  Target,
  Flame,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Mic,
  BookMarked,
  CheckCircle2,
} from 'lucide-react-native';

interface HomeScreenProps {
  currentLanguage: Language;
  onSelectSurah: (surah: Surah) => void;
  onNavigateToMakharij: () => void;
  onNavigateToAcademy: () => void;
}

type TabCategory = 'featured' | 'juz_amma' | 'all';

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currentLanguage,
  onSelectSurah,
  onNavigateToMakharij,
  onNavigateToAcademy,
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const isAr = currentLanguage === 'ar';

  const [progress, setProgress] = useState<UserProgress>(INITIAL_PROGRESS);
  const [activeCategory, setActiveCategory] = useState<TabCategory>('featured');
  const [isPickerVisible, setIsPickerVisible] = useState<boolean>(false);

  useEffect(() => {
    return ProgressService.subscribe(setProgress);
  }, []);

  const displayedSurahs = useMemo(() => {
    if (activeCategory === 'featured') {
      return FEATURED_SURAHS.map((s) => ({
        number: s.number,
        nameAr: s.nameAr,
        nameEn: s.nameEn,
        nameTranslation: '',
        revelationType: s.revelationType,
        revelationTypeAr: s.revelationTypeAr,
        totalAyahs: s.totalAyahs,
      }));
    }
    if (activeCategory === 'juz_amma') {
      return ALL_SURAHS.filter((s) => s.number >= 78 && s.number <= 114);
    }
    return ALL_SURAHS.slice(0, 15); // Show first 15 of all 114 on home page, with quick browse modal for all
  }, [activeCategory]);

  const handleOpenSurah = (surahNumber: number) => {
    const fullSurah = getFullSurah(surahNumber);
    onSelectSurah(fullSurah);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Hero Card: Overall Quran Progress (0 to 100%) */}
        <View style={styles.heroCard}>
        <View style={[styles.heroHeader, isAr ? styles.rtlRow : styles.ltrRow]}>
          <View style={styles.targetIconBox}>
            <Target size={22} color={COLORS.gold} />
          </View>
          <View style={styles.heroTitles}>
            <Text style={[styles.heroTitle, isAr ? styles.textRight : styles.textLeft]}>
              {isAr ? 'ختمة التجويد والإتقان' : 'Quran Mastery Progression'}
            </Text>
            <Text style={[styles.heroSubtitle, isAr ? styles.textRight : styles.textLeft]}>
              {isAr
                ? `${progress.completedAyahsCount} من 6,236 آية مكتملة (${progress.overallProgressPercent}%)`
                : `${progress.completedAyahsCount} of 6,236 Ayahs completed (${progress.overallProgressPercent}%)`}
            </Text>
          </View>
        </View>

        {/* Dynamic Overall 0 - 100% Progress Bar */}
        <View style={styles.overallProgressBar}>
          <View
            style={[
              styles.overallProgressFill,
              { width: `${Math.max(progress.overallProgressPercent, 1)}%` },
            ]}
          />
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Flame size={16} color="#FF9F43" />
            <Text style={styles.statNumber}>{progress.streakDays}</Text>
            <Text style={styles.statLabel}>{t.streakDays}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Award size={16} color={COLORS.gold} />
            <Text style={styles.statNumber}>
              {progress.averageScore > 0 ? `${progress.averageScore}%` : '0%'}
            </Text>
            <Text style={styles.statLabel}>{t.overallScore}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <BookOpen size={16} color={COLORS.emeraldLight} />
            <Text style={styles.statNumber}>{progress.masteredMakharijCount}/28</Text>
            <Text style={styles.statLabel}>{t.makharijMastery}</Text>
          </View>
        </View>

        {/* Start Practice Action */}
        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => handleOpenSurah(FEATURED_SURAHS[0].number)}
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

      {/* 114 Surahs Section Header & Navigation */}
      <View style={[styles.sectionHeaderRow, isAr ? styles.rtlRow : styles.ltrRow]}>
        <Text style={[styles.sectionTitle, isAr ? styles.textRight : styles.textLeft]}>
          {isAr ? 'سور القرآن الكريم' : 'Holy Quran Surahs'}
        </Text>
        <TouchableOpacity
          style={[styles.allSurahsBtn, isAr ? styles.rtlRow : styles.ltrRow]}
          onPress={() => setIsPickerVisible(true)}
          activeOpacity={0.75}
        >
          <BookMarked size={16} color={COLORS.gold} />
          <Text style={styles.allSurahsBtnText}>
            {isAr ? 'فهرس الـ 114 سورة' : 'All 114 Surahs'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Category Tabs */}
      <View style={[styles.categoryTabs, isAr ? styles.rtlRow : styles.ltrRow]}>
        <TouchableOpacity
          style={[styles.catTab, activeCategory === 'featured' && styles.catTabActive]}
          onPress={() => setActiveCategory('featured')}
        >
          <Text
            style={[
              styles.catTabText,
              activeCategory === 'featured' && styles.catTabTextActive,
            ]}
          >
            {isAr ? 'المميزة (4)' : 'Featured (4)'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.catTab, activeCategory === 'juz_amma' && styles.catTabActive]}
          onPress={() => setActiveCategory('juz_amma')}
        >
          <Text
            style={[
              styles.catTabText,
              activeCategory === 'juz_amma' && styles.catTabTextActive,
            ]}
          >
            {isAr ? 'جزء عمّ (37)' : "Juz' 'Amma (37)"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.catTab, activeCategory === 'all' && styles.catTabActive]}
          onPress={() => setActiveCategory('all')}
        >
          <Text
            style={[
              styles.catTabText,
              activeCategory === 'all' && styles.catTabTextActive,
            ]}
          >
            {isAr ? 'كل السور (114)' : 'All (114)'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Surahs List */}
      {displayedSurahs.map((surah) => {
        const surahProg = progress.surahProgress[surah.number];
        const completedAyahs = surahProg?.completedAyahs || 0;
        const percent = surahProg?.percent || 0;
        const isSurahComplete = percent === 100;

        return (
          <TouchableOpacity
            key={surah.number}
            style={styles.surahCard}
            onPress={() => handleOpenSurah(surah.number)}
            activeOpacity={0.8}
          >
            <View style={[styles.surahRow, isAr ? styles.rtlRow : styles.ltrRow]}>
              {/* Surah Number Badge */}
              <View style={styles.surahNumberBadge}>
                <Text style={styles.surahNumberText} numberOfLines={1}>
                  {surah.number}
                </Text>
              </View>

              {/* Surah Information */}
              <View style={styles.surahDetails}>
                <View style={[styles.surahNameRow, isAr ? styles.rtlRow : styles.ltrRow]}>
                  <Text style={[styles.surahName, isAr ? styles.textRight : styles.textLeft]}>
                    {isAr ? surah.nameAr : surah.nameEn}
                  </Text>
                  {isSurahComplete ? (
                    <CheckCircle2 size={16} color={COLORS.emeraldLight} />
                  ) : null}
                </View>

                <View style={[styles.surahMetaRow, isAr ? styles.rtlRow : styles.ltrRow]}>
                  <Text style={styles.surahMeta}>
                    {isAr
                      ? `${surah.revelationTypeAr} • ${surah.totalAyahs} آيات`
                      : `${surah.revelationType} • ${surah.totalAyahs} Ayahs`}
                  </Text>
                  <Text style={styles.surahProgText}>
                    {isAr
                      ? `${completedAyahs}/${surah.totalAyahs} (${percent}%)`
                      : `${completedAyahs}/${surah.totalAyahs} (${percent}%)`}
                  </Text>
                </View>

                {/* Individual Surah Progress Bar */}
                <View style={styles.surahProgressBar}>
                  <View
                    style={[
                      styles.surahProgressFill,
                      { width: `${percent}%` },
                      isSurahComplete && styles.surahProgressFillDone,
                    ]}
                  />
                </View>
              </View>

              {/* Action Icon */}
              <View style={styles.playIconBox}>
                <PlayCircle size={28} color={COLORS.gold} />
              </View>
            </View>
          </TouchableOpacity>
        );
      })}

      {/* Button to View Full 114 Index */}
      <TouchableOpacity
        style={styles.fullCatalogBtn}
        onPress={() => setIsPickerVisible(true)}
        activeOpacity={0.8}
      >
        <BookMarked size={20} color={COLORS.background} />
        <Text style={styles.fullCatalogBtnText}>
          {isAr ? 'فتح فهرس القرآن الكريم كاملاً (114 سورة)' : 'Open Full 114-Surah Index'}
        </Text>
      </TouchableOpacity>

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
          {isAr ? (
            <ChevronLeft size={20} color={COLORS.gold} />
          ) : (
            <ChevronRight size={20} color={COLORS.gold} />
          )}
        </View>
      </TouchableOpacity>
      </ScrollView>

      {/* Surah Picker Modal outside ScrollView */}
      <SurahPickerModal
        visible={isPickerVisible}
        onClose={() => setIsPickerVisible(false)}
        onSelectSurah={handleOpenSurah}
        currentLanguage={currentLanguage}
        userProgress={progress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl * 2,
  },
  heroCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorderActive,
    marginBottom: SPACING.lg,
  },
  heroHeader: {
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  targetIconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.cardElevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  heroTitles: {
    flex: 1,
  },
  heroTitle: {
    color: COLORS.textGold,
    fontSize: 18,
    fontWeight: 'bold',
  },
  heroSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  overallProgressBar: {
    height: 6,
    backgroundColor: COLORS.cardElevated,
    borderRadius: 3,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  overallProgressFill: {
    height: '100%',
    backgroundColor: COLORS.gold,
    borderRadius: 3,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardElevated,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: SPACING.lg,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.cardBorder,
  },
  startBtn: {
    backgroundColor: COLORS.gold,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  startBtnText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  ruleBanner: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.gold,
    marginBottom: SPACING.lg,
  },
  ruleBannerContent: {
    alignItems: 'center',
    gap: SPACING.md,
  },
  ruleBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.cardElevated,
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
    fontSize: 15,
    fontWeight: 'bold',
  },
  ruleBannerSub: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  sectionHeaderRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    color: COLORS.textGold,
    fontSize: 16,
    fontWeight: 'bold',
  },
  allSurahsBtn: {
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.cardElevated,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  allSurahsBtnText: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: 'bold',
  },
  categoryTabs: {
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  catTab: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.cardElevated,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  catTabActive: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },
  catTabText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  catTabTextActive: {
    color: COLORS.background,
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
    minWidth: 44,
    height: 36,
    paddingHorizontal: 4,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.cardElevated,
    borderWidth: 1,
    borderColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  surahNumberText: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  surahDetails: {
    flex: 1,
  },
  surahNameRow: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  surahName: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: 'bold',
  },
  surahMetaRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  surahMeta: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  surahProgText: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '600',
  },
  surahProgressBar: {
    height: 3,
    backgroundColor: COLORS.cardElevated,
    borderRadius: 2,
    marginTop: 4,
    overflow: 'hidden',
  },
  surahProgressFill: {
    height: '100%',
    backgroundColor: COLORS.gold,
    borderRadius: 2,
  },
  surahProgressFillDone: {
    backgroundColor: COLORS.emeraldLight,
  },
  playIconBox: {
    padding: 4,
  },
  fullCatalogBtn: {
    backgroundColor: COLORS.gold,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
    marginVertical: SPACING.sm,
  },
  fullCatalogBtnText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: 'bold',
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
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  ltrRow: {
    flexDirection: 'row',
  },
  textRight: {
    textAlign: 'right',
  },
  textLeft: {
    textAlign: 'left',
  },
});
