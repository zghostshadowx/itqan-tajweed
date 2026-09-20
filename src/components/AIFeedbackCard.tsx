import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { AIEvaluationReport } from '../services/aiService';
import { Language, TRANSLATIONS } from '../constants/translations';
import { Award, CheckCircle2, AlertTriangle, RefreshCw, VolumeX, Sparkles } from 'lucide-react-native';

interface AIFeedbackCardProps {
  report: AIEvaluationReport;
  currentLanguage: Language;
  onTryAgain: () => void;
}

export const AIFeedbackCard: React.FC<AIFeedbackCardProps> = ({
  report,
  currentLanguage,
  onTryAgain,
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const isAr = currentLanguage === 'ar';

  const getScoreColor = (score: number) => {
    if (score >= 90) return COLORS.success;
    if (score >= 80) return COLORS.warning;
    return COLORS.error;
  };

  const scoreColor = getScoreColor(report.overallScore);

  return (
    <View style={styles.container}>
      {/* Top Banner */}
      <View style={[styles.headerRow, isAr ? styles.rtlRow : styles.ltrRow]}>
        <View style={styles.titleWithIcon}>
          <Sparkles size={18} color={COLORS.gold} />
          <Text style={styles.cardTitle}>{t.aiCorrectionTitle}</Text>
        </View>
        <View style={styles.timeTag}>
          <Text style={styles.timeTagText}>AI Engine v2.5</Text>
        </View>
      </View>

      {/* Main Score Banner */}
      <View style={styles.scoreBanner}>
        <View style={[styles.scoreCircle, { borderColor: scoreColor }]}>
          <Text style={[styles.scoreValue, { color: scoreColor }]}>
            {report.overallScore}%
          </Text>
          <Text style={styles.scoreLabel}>{t.accuracyScore}</Text>
        </View>

        <View style={styles.gradeMessageContainer}>
          <Text style={[styles.gradeMessage, isAr ? styles.textRight : styles.textLeft]}>
            {report.overallScore >= 90
              ? t.perfectRecitation
              : report.overallScore >= 80
              ? t.goodAttempt
              : t.needsImprovement}
          </Text>
          <Text style={[styles.adviceText, isAr ? styles.textRight : styles.textLeft]}>
            {isAr ? report.generalAdviceAr : report.generalAdviceEn}
          </Text>
        </View>
      </View>

      {/* Section 1: Makharij (Articulation Points) Inspection */}
      <View style={styles.sectionBox}>
        <Text style={[styles.sectionTitle, isAr ? styles.textRight : styles.textLeft]}>
          🎯 {t.makharijCheck}
        </Text>

        {report.makharijResults.map((item, idx) => {
          const isPassed = item.status === 'passed';
          return (
            <View key={idx} style={styles.makhrajRow}>
              <View style={styles.letterPill}>
                <Text style={styles.letterText}>{item.letter}</Text>
              </View>

              <View style={styles.makhrajContent}>
                <View style={[styles.makhrajTopRow, isAr ? styles.rtlRow : styles.ltrRow]}>
                  <Text style={styles.makhrajZone}>
                    {isAr ? item.makhrajZoneAr : item.makhrajZoneEn}
                  </Text>
                  {isPassed ? (
                    <View style={styles.passBadge}>
                      <CheckCircle2 size={13} color={COLORS.success} />
                      <Text style={styles.passText}>{isAr ? 'متقن' : 'Passed'}</Text>
                    </View>
                  ) : (
                    <View style={styles.warnBadge}>
                      <AlertTriangle size={13} color={COLORS.warning} />
                      <Text style={styles.warnText}>{isAr ? 'تنبيه مخرج' : 'Needs Work'}</Text>
                    </View>
                  )}
                </View>

                <Text style={[styles.makhrajComment, isAr ? styles.textRight : styles.textLeft]}>
                  {isAr ? item.commentAr : item.commentEn}
                </Text>

                <Text style={[styles.makhrajTip, isAr ? styles.textRight : styles.textLeft]}>
                  💡 {isAr ? item.anatomicalTipAr : item.anatomicalTipEn}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Section 2: Tajweed & Madd Regulations */}
      <View style={styles.sectionBox}>
        <Text style={[styles.sectionTitle, isAr ? styles.textRight : styles.textLeft]}>
          📜 {t.tajweedRuleCheck}
        </Text>

        {report.tajweedResults.map((rule, idx) => (
          <View key={idx} style={styles.tajweedRow}>
            <View style={[styles.ruleHeader, isAr ? styles.rtlRow : styles.ltrRow]}>
              <Text style={styles.ruleName}>
                {isAr ? rule.ruleNameAr : rule.ruleNameEn}
              </Text>
              <Text style={styles.ruleScoreBadge}>{rule.scorePercent}%</Text>
            </View>
            <Text style={[styles.ruleFeedback, isAr ? styles.textRight : styles.textLeft]}>
              {isAr ? rule.feedbackAr : rule.feedbackEn}
            </Text>
          </View>
        ))}
      </View>

      {/* Try Again Action Button */}
      <TouchableOpacity
        style={styles.retryButton}
        onPress={onTryAgain}
        activeOpacity={0.85}
      >
        <RefreshCw size={18} color={COLORS.background} />
        <Text style={styles.retryButtonText}>{t.tryAgain}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    marginVertical: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  headerRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  ltrRow: {
    flexDirection: 'row',
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardTitle: {
    color: COLORS.textGold,
    fontSize: 15,
    fontWeight: 'bold',
  },
  timeTag: {
    backgroundColor: COLORS.cardElevated,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  timeTagText: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  scoreBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardElevated,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginVertical: SPACING.xs,
    gap: SPACING.md,
  },
  scoreCircle: {
    width: 74,
    height: 74,
    borderRadius: RADIUS.full,
    borderWidth: 3.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.card,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 9,
    color: COLORS.textSecondary,
  },
  gradeMessageContainer: {
    flex: 1,
  },
  gradeMessage: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  adviceText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
  sectionBox: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.cardElevated,
    borderRadius: RADIUS.md,
    padding: SPACING.sm + 2,
  },
  sectionTitle: {
    color: COLORS.textGold,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  makhrajRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    marginBottom: SPACING.xs,
    gap: SPACING.sm,
  },
  letterPill: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterText: {
    color: COLORS.gold,
    fontSize: 18,
    fontWeight: 'bold',
  },
  makhrajContent: {
    flex: 1,
  },
  makhrajTopRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  makhrajZone: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  passBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 204, 113, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    gap: 3,
  },
  passText: {
    color: COLORS.success,
    fontSize: 10,
    fontWeight: '700',
  },
  warnBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(243, 156, 18, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    gap: 3,
  },
  warnText: {
    color: COLORS.warning,
    fontSize: 10,
    fontWeight: '700',
  },
  makhrajComment: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginBottom: 3,
    lineHeight: 16,
  },
  makhrajTip: {
    color: COLORS.goldLight,
    fontSize: 10.5,
    lineHeight: 15,
  },
  tajweedRow: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  ruleHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  ruleName: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  ruleScoreBadge: {
    color: COLORS.success,
    fontSize: 11,
    fontWeight: 'bold',
  },
  ruleFeedback: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 15,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.gold,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm + 2,
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  retryButtonText: {
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
