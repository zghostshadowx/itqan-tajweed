import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Ayah, TajweedSegment } from '../constants/quranData';
import { Language } from '../constants/translations';
import { Info, X, BookOpen } from 'lucide-react-native';

interface VerseDisplayProps {
  ayah: Ayah;
  surahNameAr: string;
  surahNameEn: string;
  currentLanguage: Language;
}

export const VerseDisplay: React.FC<VerseDisplayProps> = ({
  ayah,
  surahNameAr,
  surahNameEn,
  currentLanguage,
}) => {
  const isAr = currentLanguage === 'ar';
  const [selectedSegment, setSelectedSegment] = useState<TajweedSegment | null>(null);

  const getRuleColor = (rule?: TajweedSegment['rule']) => {
    switch (rule) {
      case 'madd':
        return COLORS.tajweedMadd;
      case 'ghunnah':
        return COLORS.tajweedGhunnah;
      case 'qalqalah':
        return COLORS.tajweedQalqalah;
      case 'idgham':
        return COLORS.tajweedIdgham;
      case 'iqlab':
        return COLORS.tajweedIqlab;
      case 'silent':
        return COLORS.tajweedSilent;
      default:
        return COLORS.textPrimary;
    }
  };

  const getRuleBadgeName = (rule?: TajweedSegment['rule']) => {
    switch (rule) {
      case 'madd':
        return isAr ? 'مد' : 'Madd';
      case 'ghunnah':
        return isAr ? 'غنة' : 'Ghunnah';
      case 'qalqalah':
        return isAr ? 'قلقلة' : 'Qalqalah';
      case 'idgham':
        return isAr ? 'إدغام' : 'Idgham';
      case 'iqlab':
        return isAr ? 'إقلاب' : 'Iqlab';
      case 'silent':
        return isAr ? 'حرف صامت' : 'Silent';
      default:
        return '';
    }
  };

  return (
    <View style={styles.cardContainer}>
      {/* Surah & Ayah Top Badge */}
      <View style={[styles.headerRow, isAr ? styles.rtlRow : styles.ltrRow]}>
        <View style={styles.surahTag}>
          <BookOpen size={14} color={COLORS.gold} />
          <Text style={styles.surahTagText}>
            {isAr ? surahNameAr : surahNameEn}
          </Text>
        </View>
        <View style={styles.ayahBadge}>
          <Text style={styles.ayahBadgeText}>
            {isAr ? `الآية ${ayah.numberInSurah}` : `Ayah ${ayah.numberInSurah}`}
          </Text>
        </View>
      </View>

      {/* Decorative Golden Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerSymbol}>۞</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Uthmani Scripture with Tajweed Colors */}
      <View style={styles.verseContainer}>
        <Text style={styles.uthmaniParagraph}>
          {ayah.segments.map((seg, idx) => {
            const hasRule = seg.rule && seg.rule !== 'normal';
            return (
              <Text
                key={idx}
                onPress={hasRule ? () => setSelectedSegment(seg) : undefined}
                style={[
                  styles.segmentText,
                  hasRule && {
                    color: getRuleColor(seg.rule),
                    textDecorationLine: 'underline',
                    textDecorationColor: getRuleColor(seg.rule),
                  },
                ]}
              >
                {seg.text}
              </Text>
            );
          })}
          {/* Ayah End Ornament */}
          <Text style={styles.ayahEndOrnament}>
            {' '}
            ۝ {ayah.numberInSurah}
          </Text>
        </Text>
      </View>

      {/* Tajweed Instruction Bar */}
      <View style={[styles.notesContainer, isAr ? styles.rtlRow : styles.ltrRow]}>
        <Info size={16} color={COLORS.gold} style={styles.noteIcon} />
        <Text style={[styles.notesText, isAr ? styles.textRight : styles.textLeft]}>
          {isAr ? ayah.tajweedNotesAr : ayah.tajweedNotesEn}
        </Text>
      </View>

      {/* Interactive Tajweed Rule Modal */}
      <Modal
        visible={selectedSegment !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedSegment(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={[styles.modalHeader, isAr ? styles.rtlRow : styles.ltrRow]}>
              <View
                style={[
                  styles.ruleIndicatorPill,
                  { backgroundColor: getRuleColor(selectedSegment?.rule) },
                ]}
              >
                <Text style={styles.ruleIndicatorText}>
                  {getRuleBadgeName(selectedSegment?.rule)}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedSegment(null)}
                style={styles.closeBtn}
              >
                <X size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalTargetWord}>"{selectedSegment?.text.trim()}"</Text>

            <Text style={[styles.modalExplanation, isAr ? styles.textRight : styles.textLeft]}>
              {isAr
                ? selectedSegment?.explanationAr || 'حكم تجويدي وارد في هذه الكلمة'
                : selectedSegment?.explanationEn || 'Tajweed rule applied to this word'}
            </Text>

            <TouchableOpacity
              style={styles.modalConfirmBtn}
              onPress={() => setSelectedSegment(null)}
            >
              <Text style={styles.modalConfirmText}>{isAr ? 'فهمت الحكم' : 'Understood'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
    marginVertical: SPACING.sm,
  },
  headerRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  ltrRow: {
    flexDirection: 'row',
  },
  surahTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardElevated,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    gap: 6,
  },
  surahTagText: {
    color: COLORS.gold,
    fontSize: 13,
    fontWeight: '700',
  },
  ayahBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  ayahBadgeText: {
    color: COLORS.textGold,
    fontSize: 12,
    fontWeight: '600',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.xs,
    opacity: 0.6,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.gold,
  },
  dividerSymbol: {
    color: COLORS.gold,
    fontSize: 14,
    paddingHorizontal: SPACING.sm,
  },
  verseContainer: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  uthmaniParagraph: {
    textAlign: 'center',
    writingDirection: 'rtl',
    lineHeight: 48,
  },
  segmentText: {
    fontSize: 26,
    color: COLORS.textPrimary,
    fontWeight: '500',
    fontFamily: 'System',
  },
  ayahEndOrnament: {
    color: COLORS.gold,
    fontSize: 24,
    fontWeight: '700',
  },
  notesContainer: {
    backgroundColor: COLORS.cardElevated,
    borderRadius: RADIUS.md,
    padding: SPACING.sm + 2,
    alignItems: 'center',
    marginTop: SPACING.sm,
    gap: SPACING.sm,
  },
  noteIcon: {
    marginHorizontal: 2,
  },
  notesText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  textRight: {
    textAlign: 'right',
  },
  textLeft: {
    textAlign: 'left',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalCard: {
    backgroundColor: COLORS.cardElevated,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    width: '100%',
    maxWidth: 380,
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    alignItems: 'center',
  },
  modalHeader: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  ruleIndicatorPill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  ruleIndicatorText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  closeBtn: {
    padding: 4,
  },
  modalTargetWord: {
    fontSize: 32,
    color: COLORS.textGold,
    fontWeight: 'bold',
    marginVertical: SPACING.sm,
    textAlign: 'center',
  },
  modalExplanation: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 22,
    marginVertical: SPACING.md,
    width: '100%',
  },
  modalConfirmBtn: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.md,
    width: '100%',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  modalConfirmText: {
    color: COLORS.background,
    fontWeight: 'bold',
    fontSize: 14,
  },
});
