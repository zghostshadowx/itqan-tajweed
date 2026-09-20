import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { FEATURED_SURAHS, ALL_SURAHS, getFullSurah, Surah, Ayah } from '../constants/quranData';
import { Language, TRANSLATIONS } from '../constants/translations';
import { VerseDisplay } from '../components/VerseDisplay';
import { AudioPlayerBar, ReciterKey } from '../components/AudioPlayerBar';
import { RecitationRecorder } from '../components/RecitationRecorder';
import { AIFeedbackCard } from '../components/AIFeedbackCard';
import { SurahPickerModal } from '../components/SurahPickerModal';
import { AudioService } from '../services/audioService';
import { AITajweedService, AIEvaluationReport } from '../services/aiService';
import { ProgressService, UserProgress, INITIAL_PROGRESS } from '../services/progressService';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  BookMarked,
  Hash,
  X,
  CheckCircle2,
} from 'lucide-react-native';

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
  const [isPickerVisible, setIsPickerVisible] = useState<boolean>(false);
  const [isJumpModalVisible, setIsJumpModalVisible] = useState<boolean>(false);
  const [jumpInput, setJumpInput] = useState<string>('');

  // AI evaluation state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiReport, setAiReport] = useState<AIEvaluationReport | null>(null);

  // User progress state
  const [progress, setProgress] = useState<UserProgress>(INITIAL_PROGRESS);

  useEffect(() => {
    return ProgressService.subscribe(setProgress);
  }, []);

  const currentAyah: Ayah = currentSurah.ayahs[ayahIndex] || currentSurah.ayahs[0];

  const handleNextAyah = () => {
    if (ayahIndex < currentSurah.ayahs.length - 1) {
      setAyahIndex(ayahIndex + 1);
      setAiReport(null);
    } else if (currentSurah.number < 114) {
      // Auto-advance to next Surah
      const nextSurah = getFullSurah(currentSurah.number + 1);
      setCurrentSurah(nextSurah);
      setAyahIndex(0);
      setAiReport(null);
    }
  };

  const handlePrevAyah = () => {
    if (ayahIndex > 0) {
      setAyahIndex(ayahIndex - 1);
      setAiReport(null);
    } else if (currentSurah.number > 1) {
      // Go to previous Surah
      const prevSurah = getFullSurah(currentSurah.number - 1);
      setCurrentSurah(prevSurah);
      setAyahIndex(prevSurah.ayahs.length - 1);
      setAiReport(null);
    }
  };

  const handleSwitchSurah = (surahNumber: number) => {
    const s = getFullSurah(surahNumber);
    setCurrentSurah(s);
    setAyahIndex(0);
    setAiReport(null);
  };

  const handleJumpToAyah = () => {
    const num = parseInt(jumpInput, 10);
    if (!isNaN(num) && num >= 1 && num <= currentSurah.ayahs.length) {
      setAyahIndex(num - 1);
      setAiReport(null);
      setIsJumpModalVisible(false);
      setJumpInput('');
    }
  };

  const handleFinishRecording = async (audioUri: string | null) => {
    setIsAnalyzing(true);
    try {
      const transcript = AudioService.getLastTranscript();
      const report = await AITajweedService.evaluateRecitation(currentAyah, audioUri, transcript);
      setAiReport(report);

      // Record progress into persistent tracking engine (0 to 100%)
      if (report) {
        const passedMakharij = report.makharijResults
          ?.filter((r) => r.status === 'passed')
          ?.map((r) => r.letter) || [];

        await ProgressService.recordRecitation(
          currentSurah.number,
          currentAyah.numberInSurah,
          currentSurah.totalAyahs,
          report.overallScore,
          passedMakharij
        );
      }
    } catch (e) {
      console.error('AI evaluation error:', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const surahProg = progress.surahProgress[currentSurah.number];
  const completedAyahs = surahProg?.completedAyahs || 0;
  const surahPercent = surahProg?.percent || 0;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Surah Header & Quick Switcher Banner */}
        <View style={[styles.surahHeaderBanner, isAr ? styles.rtlRow : styles.ltrRow]}>
        <TouchableOpacity
          style={[styles.surahTitleBtn, isAr ? styles.rtlRow : styles.ltrRow]}
          onPress={() => setIsPickerVisible(true)}
          activeOpacity={0.8}
        >
          <BookMarked size={18} color={COLORS.gold} />
          <View>
            <Text style={[styles.surahBannerTitle, isAr ? styles.textRight : styles.textLeft]}>
              {isAr ? currentSurah.nameAr : currentSurah.nameEn} ({currentSurah.number}/114)
            </Text>
            <Text style={[styles.surahBannerSub, isAr ? styles.textRight : styles.textLeft]}>
              {isAr
                ? `${currentSurah.revelationTypeAr} • ${currentSurah.totalAyahs} آيات • ${completedAyahs}/${currentSurah.totalAyahs} مكتملة (${surahPercent}%)`
                : `${currentSurah.revelationType} • ${currentSurah.totalAyahs} Ayahs • ${surahPercent}% done`}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.changeSurahBtn}
          onPress={() => setIsPickerVisible(true)}
          activeOpacity={0.75}
        >
          <Text style={styles.changeSurahBtnText}>
            {isAr ? 'تغيير السورة' : 'Change'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Surah Progress Bar */}
      <View style={styles.surahProgressBar}>
        <View
          style={[
            styles.surahProgressFill,
            { width: `${Math.max(surahPercent, 1)}%` },
            surahPercent === 100 && styles.surahProgressFillDone,
          ]}
        />
      </View>

      {/* Main Verse Display */}
      <VerseDisplay
        ayah={currentAyah}
        surahNameAr={currentSurah.nameAr}
        surahNameEn={currentSurah.nameEn}
        currentLanguage={currentLanguage}
      />

      {/* Ayah Navigation Bar (Previous / Jump / Next) */}
      <View style={[styles.navRow, isAr ? styles.rtlRow : styles.ltrRow]}>
        <TouchableOpacity
          style={[
            styles.navBtn,
            ayahIndex === 0 && currentSurah.number === 1 && styles.navBtnDisabled,
          ]}
          onPress={handlePrevAyah}
          disabled={ayahIndex === 0 && currentSurah.number === 1}
          activeOpacity={0.7}
        >
          {isAr ? (
            <ChevronRight
              size={18}
              color={ayahIndex === 0 && currentSurah.number === 1 ? COLORS.textMuted : COLORS.gold}
            />
          ) : (
            <ChevronLeft
              size={18}
              color={ayahIndex === 0 && currentSurah.number === 1 ? COLORS.textMuted : COLORS.gold}
            />
          )}
          <Text
            style={[
              styles.navBtnText,
              ayahIndex === 0 && currentSurah.number === 1 && { color: COLORS.textMuted },
            ]}
          >
            {t.prevAyah}
          </Text>
        </TouchableOpacity>

        {/* Clickable Ayah Indicator with Jump-to-Ayah Modal */}
        <TouchableOpacity
          style={styles.ayahJumpTrigger}
          onPress={() => setIsJumpModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.ayahIndicator}>
            {ayahIndex + 1} / {currentSurah.ayahs.length}
          </Text>
          <Text style={styles.ayahJumpHint}>
            {isAr ? 'انقر للانتقال' : 'Jump'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navBtn,
            ayahIndex === currentSurah.ayahs.length - 1 &&
              currentSurah.number === 114 &&
              styles.navBtnDisabled,
          ]}
          onPress={handleNextAyah}
          disabled={ayahIndex === currentSurah.ayahs.length - 1 && currentSurah.number === 114}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.navBtnText,
              ayahIndex === currentSurah.ayahs.length - 1 &&
                currentSurah.number === 114 && { color: COLORS.textMuted },
            ]}
          >
            {t.nextAyah}
          </Text>
          {isAr ? (
            <ChevronLeft
              size={18}
              color={
                ayahIndex === currentSurah.ayahs.length - 1 && currentSurah.number === 114
                  ? COLORS.textMuted
                  : COLORS.gold
              }
            />
          ) : (
            <ChevronRight
              size={18}
              color={
                ayahIndex === currentSurah.ayahs.length - 1 && currentSurah.number === 114
                  ? COLORS.textMuted
                  : COLORS.gold
              }
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Step 1: Listen to Master Reciter with Voice Reading */}
      <AudioPlayerBar
        ayah={currentAyah}
        currentLanguage={currentLanguage}
        selectedReciter={selectedReciter}
        onSelectReciter={setSelectedReciter}
      />

      {/* Step 2: Record Recitation with Real-time Microphone */}
      <RecitationRecorder
        currentLanguage={currentLanguage}
        isAnalyzing={isAnalyzing}
        onStartRecording={() => setAiReport(null)}
        onFinishRecording={handleFinishRecording}
      />

      {/* Step 3: Honest AI Tajweed Evaluation Card */}
      {aiReport && (
        <AIFeedbackCard
          report={aiReport}
          currentLanguage={currentLanguage}
          onTryAgain={() => setAiReport(null)}
        />
      )}
      </ScrollView>

      {/* 114-Surah Search & Jump Modal */}
      <SurahPickerModal
        visible={isPickerVisible}
        onClose={() => setIsPickerVisible(false)}
        onSelectSurah={handleSwitchSurah}
        currentLanguage={currentLanguage}
        userProgress={progress}
        activeSurahNumber={currentSurah.number}
      />

      {/* Jump to Ayah Modal */}
      <Modal
        visible={isJumpModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsJumpModalVisible(false)}
      >
        <View style={styles.jumpModalOverlay}>
          <View style={styles.jumpModalBox}>
            <View style={[styles.jumpHeader, isAr ? styles.rtlRow : styles.ltrRow]}>
              <Text style={styles.jumpTitle}>
                {isAr
                  ? `الانتقال لآية في ${currentSurah.nameAr}`
                  : `Jump to Ayah in ${currentSurah.nameEn}`}
              </Text>
              <TouchableOpacity onPress={() => setIsJumpModalVisible(false)}>
                <X size={18} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.jumpPrompt, isAr ? styles.textRight : styles.textLeft]}>
              {isAr
                ? `أدخل رقم الآية (1 - ${currentSurah.ayahs.length}):`
                : `Enter Ayah number (1 - ${currentSurah.ayahs.length}):`}
            </Text>

            <TextInput
              style={styles.jumpInput}
              keyboardType="number-pad"
              placeholder={`1 - ${currentSurah.ayahs.length}`}
              placeholderTextColor={COLORS.textMuted}
              value={jumpInput}
              onChangeText={setJumpInput}
              autoFocus
            />

            <TouchableOpacity style={styles.jumpConfirmBtn} onPress={handleJumpToAyah}>
              <Text style={styles.jumpConfirmText}>
                {isAr ? 'انتقال الآن' : 'Jump Now'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    padding: SPACING.md,
    paddingBottom: SPACING.xxl * 2,
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  ltrRow: {
    flexDirection: 'row',
  },
  surahHeaderBanner: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.sm + 2,
    borderWidth: 1,
    borderColor: COLORS.gold,
    marginBottom: SPACING.xs,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  surahTitleBtn: {
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  surahBannerTitle: {
    color: COLORS.textGold,
    fontSize: 15,
    fontWeight: 'bold',
  },
  surahBannerSub: {
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },
  changeSurahBtn: {
    backgroundColor: COLORS.cardElevated,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  changeSurahBtnText: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: 'bold',
  },
  surahProgressBar: {
    height: 4,
    backgroundColor: COLORS.cardElevated,
    borderRadius: 2,
    marginBottom: SPACING.sm,
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
  ayahJumpTrigger: {
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  ayahIndicator: {
    color: COLORS.textGold,
    fontSize: 13,
    fontWeight: 'bold',
  },
  ayahJumpHint: {
    color: COLORS.textMuted,
    fontSize: 9,
  },
  jumpModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  jumpModalBox: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  jumpHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  jumpTitle: {
    color: COLORS.textGold,
    fontSize: 15,
    fontWeight: 'bold',
  },
  jumpPrompt: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: SPACING.sm,
  },
  jumpInput: {
    backgroundColor: COLORS.cardElevated,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: SPACING.md,
  },
  jumpConfirmBtn: {
    backgroundColor: COLORS.gold,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  jumpConfirmText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: 'bold',
  },
  textRight: {
    textAlign: 'right',
  },
  textLeft: {
    textAlign: 'left',
  },
});
