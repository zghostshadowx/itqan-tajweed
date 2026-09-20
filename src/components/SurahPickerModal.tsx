import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { ALL_SURAHS, SurahMeta } from '../constants/quranData';
import { Language, TRANSLATIONS } from '../constants/translations';
import { UserProgress } from '../services/progressService';
import { Search, X, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SurahPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectSurah: (surahNumber: number) => void;
  currentLanguage: Language;
  userProgress?: UserProgress;
  activeSurahNumber?: number;
}

type FilterType = 'all' | 'meccan' | 'medinan' | 'juz_amma';

export const SurahPickerModal: React.FC<SurahPickerModalProps> = ({
  visible,
  onClose,
  onSelectSurah,
  currentLanguage,
  userProgress,
  activeSurahNumber = 1,
}) => {
  const isAr = currentLanguage === 'ar';
  const t = TRANSLATIONS[currentLanguage];

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredSurahs = useMemo(() => {
    return ALL_SURAHS.filter((surah) => {
      // Filter by category
      if (activeFilter === 'meccan' && surah.revelationType !== 'Meccan') return false;
      if (activeFilter === 'medinan' && surah.revelationType !== 'Medinan') return false;
      if (activeFilter === 'juz_amma' && (surah.number < 78 || surah.number > 114)) return false;

      // Filter by search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.trim().toLowerCase();
      const numMatch = String(surah.number) === q;
      const arMatch = surah.nameAr.toLowerCase().includes(q);
      const enMatch = surah.nameEn.toLowerCase().includes(q);
      const transMatch = surah.nameTranslation.toLowerCase().includes(q);
      return numMatch || arMatch || enMatch || transMatch;
    });
  }, [searchQuery, activeFilter]);

  const renderSurahItem = ({ item }: { item: SurahMeta }) => {
    const isSelected = item.number === activeSurahNumber;
    const progressData = userProgress?.surahProgress?.[item.number];
    const completedCount = progressData?.completedAyahs || 0;
    const progressPercent = progressData?.percent || 0;
    const isCompleted = progressPercent === 100;

    return (
      <TouchableOpacity
        style={[styles.surahItem, isSelected && styles.surahItemSelected]}
        onPress={() => {
          onSelectSurah(item.number);
          onClose();
        }}
        activeOpacity={0.7}
      >
        <View style={[styles.itemRow, isAr ? styles.rtlRow : styles.ltrRow]}>
          {/* Number Badge */}
          <View style={[styles.numberBadge, isSelected && styles.numberBadgeSelected]}>
            <Text style={[styles.numberText, isSelected && styles.numberTextSelected]}>
              {item.number}
            </Text>
          </View>

          {/* Surah Info */}
          <View style={styles.infoCol}>
            <View style={[styles.nameRow, isAr ? styles.rtlRow : styles.ltrRow]}>
              <Text style={[styles.surahNameAr, isSelected && styles.goldText]}>
                {item.nameAr}
              </Text>
              <Text style={styles.surahNameEn}>{item.nameEn}</Text>
            </View>

            <View style={[styles.metaRow, isAr ? styles.rtlRow : styles.ltrRow]}>
              <Text style={styles.metaText}>
                {isAr
                  ? `${item.revelationTypeAr} • ${item.totalAyahs} آيات`
                  : `${item.revelationType} • ${item.totalAyahs} Ayahs`}
              </Text>

              {/* Progress Indicator */}
              <View style={[styles.progressTag, isAr ? styles.rtlRow : styles.ltrRow]}>
                {isCompleted ? (
                  <CheckCircle2 size={12} color={COLORS.emeraldLight} />
                ) : null}
                <Text
                  style={[
                    styles.progressTagText,
                    isCompleted && styles.completedText,
                  ]}
                >
                  {isAr
                    ? `${completedCount}/${item.totalAyahs} (${progressPercent}%)`
                    : `${completedCount}/${item.totalAyahs} (${progressPercent}%)`}
                </Text>
              </View>
            </View>

            {/* Mini Progress Bar */}
            <View style={styles.miniProgressBar}>
              <View
                style={[
                  styles.miniProgressFill,
                  { width: `${progressPercent}%` },
                  isCompleted && styles.miniProgressComplete,
                ]}
              />
            </View>
          </View>

          {/* Arrow */}
          {isAr ? (
            <ChevronLeft size={18} color={isSelected ? COLORS.gold : COLORS.textMuted} />
          ) : (
            <ChevronRight size={18} color={isSelected ? COLORS.gold : COLORS.textMuted} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={[styles.headerRow, isAr ? styles.rtlRow : styles.ltrRow]}>
            <View>
              <Text style={[styles.title, isAr ? styles.textRight : styles.textLeft]}>
                {isAr ? 'فهرس القرآن الكريم' : 'Holy Quran Index'}
              </Text>
              <Text style={[styles.subTitle, isAr ? styles.textRight : styles.textLeft]}>
                {isAr ? '114 سورة • 6,236 آية' : '114 Surahs • 6,236 Ayahs'}
              </Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Search Box */}
          <View style={[styles.searchBox, isAr ? styles.rtlRow : styles.ltrRow]}>
            <Search size={18} color={COLORS.gold} />
            <TextInput
              style={[styles.searchInput, isAr ? styles.textRight : styles.textLeft]}
              placeholder={isAr ? 'ابحث باسم السورة أو رقمها (1 - 114)...' : 'Search by name or number (1-114)...'}
              placeholderTextColor={COLORS.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={16} color={COLORS.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Category Filter Chips */}
          <View style={[styles.filterRow, isAr ? styles.rtlRow : styles.ltrRow]}>
            <TouchableOpacity
              style={[styles.filterChip, activeFilter === 'all' && styles.filterChipActive]}
              onPress={() => setActiveFilter('all')}
            >
              <Text style={[styles.filterChipText, activeFilter === 'all' && styles.filterChipTextActive]}>
                {isAr ? 'الكل (114)' : 'All (114)'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterChip, activeFilter === 'meccan' && styles.filterChipActive]}
              onPress={() => setActiveFilter('meccan')}
            >
              <Text style={[styles.filterChipText, activeFilter === 'meccan' && styles.filterChipTextActive]}>
                {isAr ? 'مكية (86)' : 'Meccan (86)'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterChip, activeFilter === 'medinan' && styles.filterChipActive]}
              onPress={() => setActiveFilter('medinan')}
            >
              <Text style={[styles.filterChipText, activeFilter === 'medinan' && styles.filterChipTextActive]}>
                {isAr ? 'مدنية (28)' : 'Medinan (28)'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterChip, activeFilter === 'juz_amma' && styles.filterChipActive]}
              onPress={() => setActiveFilter('juz_amma')}
            >
              <Text style={[styles.filterChipText, activeFilter === 'juz_amma' && styles.filterChipTextActive]}>
                {isAr ? 'جزء عمّ (37)' : "Juz' 'Amma"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Surah List */}
          <FlatList
            data={filteredSurahs}
            keyExtractor={(item) => String(item.number)}
            renderItem={renderSurahItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={true}
            initialNumToRender={20}
            maxToRenderPerBatch={30}
            windowSize={10}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: SCREEN_HEIGHT * 0.88,
    backgroundColor: COLORS.card,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    paddingTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  headerRow: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  title: {
    color: COLORS.gold,
    fontSize: 18,
    fontWeight: 'bold',
  },
  subTitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.cardElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBox: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    backgroundColor: COLORS.cardElevated,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 44,
    alignItems: 'center',
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
    height: '100%',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    gap: SPACING.xs,
  },
  filterChip: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.cardElevated,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  filterChipActive: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },
  filterChipText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: COLORS.background,
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  surahItem: {
    backgroundColor: COLORS.cardElevated,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  surahItemSelected: {
    borderColor: COLORS.gold,
    backgroundColor: '#0a231b',
  },
  itemRow: {
    alignItems: 'center',
    gap: SPACING.md,
  },
  numberBadge: {
    minWidth: 38,
    height: 34,
    paddingHorizontal: 4,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberBadgeSelected: {
    backgroundColor: COLORS.gold,
  },
  numberText: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: 'bold',
  },
  numberTextSelected: {
    color: COLORS.background,
  },
  infoCol: {
    flex: 1,
  },
  nameRow: {
    alignItems: 'baseline',
    gap: SPACING.sm,
  },
  surahNameAr: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: 'bold',
  },
  surahNameEn: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  metaRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 3,
  },
  metaText: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  progressTag: {
    alignItems: 'center',
    gap: 3,
  },
  progressTagText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },
  completedText: {
    color: COLORS.emeraldLight,
  },
  miniProgressBar: {
    height: 3,
    backgroundColor: COLORS.background,
    borderRadius: 2,
    marginTop: 4,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    backgroundColor: COLORS.gold,
    borderRadius: 2,
  },
  miniProgressComplete: {
    backgroundColor: COLORS.emeraldLight,
  },
  goldText: {
    color: COLORS.gold,
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
