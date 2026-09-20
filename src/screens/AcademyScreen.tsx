import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { TAJWEED_RULES_ENCYCLOPEDIA, TajweedRuleEncyclopedia } from '../constants/tajweedData';
import { Language, TRANSLATIONS } from '../constants/translations';
import { BookOpen, Sparkles, Volume2 } from 'lucide-react-native';

interface AcademyScreenProps {
  currentLanguage: Language;
}

export const AcademyScreen: React.FC<AcademyScreenProps> = ({ currentLanguage }) => {
  const t = TRANSLATIONS[currentLanguage];
  const isAr = currentLanguage === 'ar';

  const [activeCategory, setActiveCategory] = useState<string>(
    TAJWEED_RULES_ENCYCLOPEDIA[0].id
  );

  const selectedCategory: TajweedRuleEncyclopedia =
    TAJWEED_RULES_ENCYCLOPEDIA.find((c) => c.id === activeCategory) ||
    TAJWEED_RULES_ENCYCLOPEDIA[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Title */}
      <View style={styles.header}>
        <Text style={[styles.title, isAr ? styles.textRight : styles.textLeft]}>
          {t.tajweedRulesTitle}
        </Text>
        <Text style={[styles.subtitle, isAr ? styles.textRight : styles.textLeft]}>
          {isAr
            ? 'دليل تعليمي مفصل لكافة قواعد وأحكام التلاوة والتجويد المعتمدة'
            : 'Comprehensive educational guide for all authenticated Tajweed rules'}
        </Text>
      </View>

      {/* Category Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {TAJWEED_RULES_ENCYCLOPEDIA.map((cat) => {
          const isSelected = cat.id === activeCategory;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryPill,
                isSelected && {
                  backgroundColor: COLORS.cardElevated,
                  borderColor: cat.color,
                },
              ]}
              onPress={() => setActiveCategory(cat.id)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.dot,
                  { backgroundColor: cat.color },
                ]}
              />
              <Text
                style={[
                  styles.categoryPillText,
                  isSelected && { color: COLORS.textGold, fontWeight: 'bold' },
                ]}
              >
                {isAr ? cat.titleAr : cat.titleEn}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Selected Category Summary Card */}
      <View style={[styles.summaryCard, { borderLeftColor: selectedCategory.color }]}>
        <Text style={[styles.summaryTitle, isAr ? styles.textRight : styles.textLeft]}>
          {isAr ? selectedCategory.titleAr : selectedCategory.titleEn}
        </Text>
        <Text style={[styles.summaryText, isAr ? styles.textRight : styles.textLeft]}>
          {isAr ? selectedCategory.summaryAr : selectedCategory.summaryEn}
        </Text>
      </View>

      {/* Rules Breakdown List */}
      <View style={styles.rulesList}>
        {selectedCategory.rules.map((rule, idx) => (
          <View key={idx} style={styles.ruleCard}>
            <View style={[styles.ruleHeaderRow, isAr ? styles.rtlRow : styles.ltrRow]}>
              <View style={[styles.ruleBadge, { backgroundColor: selectedCategory.color }]}>
                <Text style={styles.ruleBadgeIndex}>{idx + 1}</Text>
              </View>
              <Text style={styles.ruleNameText}>
                {isAr ? rule.nameAr : rule.nameEn}
              </Text>
            </View>

            {/* Target Letters */}
            <View style={styles.lettersContainer}>
              <Text style={styles.lettersLabel}>
                {isAr ? 'حروف هذا الحكم:' : 'Target Letters:'}
              </Text>
              <Text style={styles.lettersValue}>{rule.letters}</Text>
            </View>

            {/* Explanation */}
            <Text style={[styles.explanationText, isAr ? styles.textRight : styles.textLeft]}>
              {isAr ? rule.explanationAr : rule.explanationEn}
            </Text>

            {/* Quranic Example Box */}
            <View style={styles.exampleBox}>
              <View style={[styles.exampleHeader, isAr ? styles.rtlRow : styles.ltrRow]}>
                <Volume2 size={14} color={COLORS.gold} />
                <Text style={styles.exampleLabel}>
                  {isAr ? 'شواهد وأمثلة من القرآن الكريم:' : 'Quranic Examples:'}
                </Text>
              </View>
              <Text style={styles.exampleAyahText}>{rule.exampleAyahAr}</Text>
            </View>
          </View>
        ))}
      </View>
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
  header: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textGold,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  categoryScroll: {
    gap: SPACING.xs,
    paddingBottom: SPACING.xs,
    marginBottom: SPACING.md,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryPillText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: COLORS.cardElevated,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderLeftWidth: 4,
    marginBottom: SPACING.md,
  },
  summaryTitle: {
    color: COLORS.textGold,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summaryText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  rulesList: {
    gap: SPACING.md,
  },
  ruleCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  ruleHeaderRow: {
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  ltrRow: {
    flexDirection: 'row',
  },
  ruleBadge: {
    width: 26,
    height: 26,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ruleBadgeIndex: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  ruleNameText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  lettersContainer: {
    backgroundColor: COLORS.cardElevated,
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  lettersLabel: {
    color: COLORS.textGold,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  lettersValue: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  explanationText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: SPACING.sm,
  },
  exampleBox: {
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
  },
  exampleHeader: {
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  exampleLabel: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '600',
  },
  exampleAyahText: {
    color: COLORS.textGold,
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 4,
  },
  textRight: {
    textAlign: 'right',
  },
  textLeft: {
    textAlign: 'left',
  },
});
