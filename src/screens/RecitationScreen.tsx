import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { FEATURED_SURAHS, Surah, Ayah } from '../constants/quranData';
import { Language, TRANSLATIONS } from '../constants/translations';
import { VerseDisplay } from '../components/VerseDisplay';
import { AudioPlayerBar, ReciterKey } from '../components/AudioPlayerBar';
import { RecitationRecorder } from '../components/RecitationRecorder';
import { AIFeedbackCard } from '../components/AIFeedbackCard';
import { AITajweedService, AIEvaluationReport } from '../services/aiService';
import { ChevronLeft, ChevronRight, BookOpen, Layers } from 'lucide-react-native';

interface RecitationScreenProps {
  currentLanguage: Language;
  initialSurah?: Surah;
}

export const RecitationScreen: React.FC<RecitationScreenProps> = ({
  currentLanguage,
  initialSurah = FEATURED_SURAHS[0],
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const isAr = currentLanguage === 'ar';

  const [currentSurah, setCurrentSurah] = useState<Surah>(initialSurah);
  const [ayahIndex, setAyahIndex] = useState<number>(0);
  const [selectedReciter, setSelectedReciter] = useState<ReciterKey>('husary');

  // AI evaluation state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiReport, setAiReport] = useState<AIEvaluationReport | null>(null);

  const currentAyah: Ayah = currentSurah.ayahs[ayahIndex] || currentSurah.ayahs[0];

  const handleNextAyah = () => {
    if (ayahIndex < currentSurah.ayahs.length - 1) {
      setAyahIndex(ayahIndex + 1);
      setAiReport(null);
    }
  };

  const handlePrevAyah = () => {
    if (ayahIndex > 0) {
      setAyahIndex(ayahIndex - 1);
      setAiReport(null);
    }
  };

  const handleSwitchSurah = (surah: Surah) => {
    setCurrentSurah(surah);
    setAyahIndex(0);
    setAiReport(null);
  };

  const handleFinishRecording = async (audioUri: string | null) => {
    setIsAnalyzing(true);
    try {
      const report = await AITajweedService.evaluateRecitation(currentAyah, audioUri);
      setAiReport(report);
    } catch (e) {
      console.error('AI evaluation error:', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Surah Switcher Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.surahScroll}
      >
        {FEATURED_SURAHS.map((s) => {
          const isSelected = s.number === currentSurah.number;
          return (
            <TouchableOpacity
              key={s.number}
              style={[styles.surahChip, isSelected && styles.surahChipSelected]}
              onPress={() => handleSwitchSurah(s)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.surahChipText,
                  isSelected && styles.surahChipTextSelected,
                ]}
              >
                {isAr ? s.nameAr : s.nameEn}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Main Verse Display */}
      <VerseDisplay
        ayah={currentAyah}
        surahNameAr={currentSurah.nameAr}
        surahNameEn={currentSurah.nameEn}
        currentLanguage={currentLanguage}
      />

      {/* Ayah Navigation Bar (Previous / Next) */}
      <View style={[styles.navRow, isAr ? styles.rtlRow : styles.ltrRow]}>
        <TouchableOpacity
          style={[styles.navBtn, ayahIndex === 0 && styles.navBtnDisabled]}
          onPress={handlePrevAyah}
          disabled={ayahIndex === 0}
          activeOpacity={0.7}
        >
          {isAr ? (
            <ChevronRight size={18} color={ayahIndex === 0 ? COLORS.textMuted : COLORS.gold} />
          ) : (
            <ChevronLeft size={18} color={ayahIndex === 0 ? COLORS.textMuted : COLORS.gold} />
          )}
          <Text
            style={[
              styles.navBtnText,
              ayahIndex === 0 && { color: COLORS.textMuted },
            ]}
          >
            {t.prevAyah}
          </Text>
        </TouchableOpacity>

        <Text style={styles.ayahIndicator}>
          {ayahIndex + 1} / {currentSurah.ayahs.length}
        </Text>

        <TouchableOpacity
          style={[
            styles.navBtn,
            ayahIndex === currentSurah.ayahs.length - 1 && styles.navBtnDisabled,
          ]}
          onPress={handleNextAyah}
          disabled={ayahIndex === currentSurah.ayahs.length - 1}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.navBtnText,
              ayahIndex === currentSurah.ayahs.length - 1 && { color: COLORS.textMuted },
            ]}
          >
            {t.nextAyah}
          </Text>
          {isAr ? (
            <ChevronLeft
              size={18}
              color={ayahIndex === currentSurah.ayahs.length - 1 ? COLORS.textMuted : COLORS.gold}
            />
          ) : (
            <ChevronRight
              size={18}
              color={ayahIndex === currentSurah.ayahs.length - 1 ? COLORS.textMuted : COLORS.gold}
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Step 1: Listen to Master Reciter */}
      <AudioPlayerBar
        ayah={currentAyah}
        currentLanguage={currentLanguage}
        selectedReciter={selectedReciter}
        onSelectReciter={setSelectedReciter}
      />

      {/* Step 2: Record Recitation with Real-time Waveform */}
      <RecitationRecorder
        currentLanguage={currentLanguage}
        isAnalyzing={isAnalyzing}
        onStartRecording={() => setAiReport(null)}
        onFinishRecording={handleFinishRecording}
      />

      {/* Step 3: Instant AI Pronunciation & Tajweed Evaluation Card */}
      {aiReport && (
        <AIFeedbackCard
          report={aiReport}
          currentLanguage={currentLanguage}
          onTryAgain={() => setAiReport(null)}
        />
      )}
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
  surahScroll: {
    gap: SPACING.xs,
    paddingBottom: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  surahChip: {
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  surahChipSelected: {
    backgroundColor: COLORS.cardElevated,
    borderColor: COLORS.gold,
  },
  surahChipText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  surahChipTextSelected: {
    color: COLORS.gold,
    fontWeight: 'bold',
  },
  navRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: SPACING.xs,
    paddingHorizontal: SPACING.xs,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardElevated,
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  navBtnDisabled: {
    opacity: 0.5,
    borderColor: 'transparent',
  },
  navBtnText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  ayahIndicator: {
    color: COLORS.textGold,
    fontSize: 13,
    fontWeight: 'bold',
  },
});
