import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { AIEvaluationReport } from '../services/aiService';
import { Language, TRANSLATIONS } from '../constants/translations';
import { Award, CheckCircle2, AlertTriangle, XCircle, RefreshCw, Sparkles, ShieldAlert, ShieldCheck } from 'lucide-react-native';

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
    if (score >= 75) return COLORS.warning;
    return COLORS.error;
  };

  const scoreColor = getScoreColor(report.overallScore);

  const getLahnStyle = () => {
    if (report.lahnAudit.status === 'lahn_jali') {
      return {
        borderColor: COLORS.error,
        backgroundColor: 'rgba(255, 82, 82, 0.12)',
        iconColor: COLORS.error,
        textColor: '#FF5252',
      };
    }
    if (report.lahnAudit.status === 'lahn_khafi') {
      return {
        borderColor: COLORS.warning,
        backgroundColor: 'rgba(255, 159, 67, 0.12)',
        iconColor: COLORS.warning,
        textColor: '#FF9F43',
      };
    }
    return {
      borderColor: COLORS.success,
      backgroundColor: 'rgba(46, 204, 113, 0.12)',
      iconColor: COLORS.success,
      textColor: COLORS.success,
    };
  };

  const lahnStyle = getLahnStyle();

  return (
    <View style={styles.container}>
      {/* Top Banner */}
      <View style={[styles.headerRow, isAr ? styles.rtlRow : styles.ltrRow]}>
        <View style={styles.titleWithIcon}>
          <Sparkles size={18} color={COLORS.gold} />
          <Text style={styles.cardTitle}>{t.aiCorrectionTitle}</Text>
        </View>
        <View style={styles.timeTag}>
          <Text style={styles.timeTagText}>تقييم مباشر وصريح</Text>
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
              ? 'تلاوة متقنة ومستوفية للأحكام 🌟'
              : report.overallScore >= 75
              ? 'تلاوة مقبولة مع وجود ملحوظات تجويدية ⚠️'
              : 'لم تُجز التلاوة: وقعت في أخطاء بحاجة لتصحيح 🛑'}
          </Text>
          <Text style={[styles.adviceText, isAr ? styles.textRight : styles.textLeft]}>
            {isAr ? report.generalAdviceAr : report.generalAdviceEn}
          </Text>
        </View>
      </View>

      {/* Strict Lahn Audit Card (فحص اللحن الجلي والخفي) */}
      <View style={[styles.lahnCard, { borderColor: lahnStyle.borderColor, backgroundColor: lahnStyle.backgroundColor }]}>
        <View style={[styles.lahnHeader, isAr ? styles.rtlRow : styles.ltrRow]}>
          {report.lahnAudit.status === 'clean' ? (
            <ShieldCheck size={18} color={lahnStyle.iconColor} />
          ) : (
            <ShieldAlert size={18} color={lahnStyle.iconColor} />
          )}
          <Text style={[styles.lahnTitle, { color: lahnStyle.textColor }]}>
            {isAr ? report.lahnAudit.titleAr : report.lahnAudit.titleEn}
          </Text>
        </View>
        <Text style={[styles.lahnDetail, isAr ? styles.textRight : styles.textLeft]}>
          {isAr ? report.lahnAudit.detailAr : report.lahnAudit.detailEn}
        </Text>
      </View>

      {/* Section 1: Makharij (Articulation Points) Inspection */}
      {report.makharijResults && report.makharijResults.length > 0 && (
        <View style={styles.sectionBox}>
          <Text style={[styles.sectionTitle, isAr ? styles.textRight : styles.textLeft]}>
            🎯 {t.makharijCheck}
          </Text>

          {report.makharijResults.map((item, idx) => {
            const isPassed = item.status === 'passed';
            const isWarning = item.status === 'warning';

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
                    ) : isWarning ? (
                      <View style={styles.warnBadge}>
                        <AlertTriangle size={13} color={COLORS.warning} />
                        <Text style={styles.warnText}>{isAr ? 'تنبيه مخرج' : 'Warning'}</Text>
                      </View>
                    ) : (
                      <View style={styles.errorBadge}>
                        <XCircle size={13} color={COLORS.error} />
                        <Text style={styles.errorText}>{isAr ? 'خطأ في المخرج' : 'Defect'}</Text>
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
      )}

      {/* Section 2: Tajweed & Madd Regulations */}
      {report.tajweedResults && report.tajweedResults.length > 0 && (
        <View style={styles.sectionBox}>
          <Text style={[styles.sectionTitle, isAr ? styles.textRight : styles.textLeft]}>
            📜 {t.tajweedRuleCheck}
          </Text>

          {report.tajweedResults.map((rule, idx) => {
            const ruleScoreColor = getScoreColor(rule.scorePercent);
            return (
              <View key={idx} style={styles.tajweedRow}>
                <View style={[styles.ruleHeader, isAr ? styles.rtlRow : styles.ltrRow]}>
                  <Text style={styles.ruleName}>
                    {isAr ? rule.ruleNameAr : rule.ruleNameEn}
                  </Text>
                  <Text style={[styles.ruleScoreBadge, { color: ruleScoreColor, borderColor: ruleScoreColor }]}>
                    {rule.scorePercent}%
                  </Text>
                </View>
                <Text style={[styles.ruleFeedback, isAr ? styles.textRight : styles.textLeft]}>
                  {isAr ? rule.feedbackAr : rule.feedbackEn}
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {/* Try Again Button */}
      <TouchableOpacity
        style={styles.retryBtn}
        onPress={onTryAgain}
        activeOpacity={0.85}
      >
        <RefreshCw size={18} color={COLORS.background} />
        <Text style={styles.retryBtnText}>{t.tryAgain}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.lg,
    borderWidth: 1.5,
    borderColor: COLORS.gold,
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  ltrRow: {
    flexDirection: 'row',
  },
  headerRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  cardTitle: {
    color: COLORS.textGold,
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeTag: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  timeTagText: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '700',
  },
  scoreBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardElevated,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  scoreCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: '900',
  },
  scoreLabel: {
    fontSize: 9,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  gradeMessageContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  gradeMessage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  adviceText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  lahnCard: {
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  lahnHeader: {
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: 4,
  },
  lahnTitle: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  lahnDetail: {
    fontSize: 12,
    color: COLORS.textPrimary,
    lineHeight: 18,
  },
  sectionBox: {
    backgroundColor: COLORS.cardElevated,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  sectionTitle: {
    color: COLORS.textGold,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
  },
  makhrajRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    paddingBottom: SPACING.sm,
  },
  letterPill: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterText: {
    color: COLORS.textGold,
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  makhrajContent: {
    flex: 1,
  },
  makhrajTopRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  makhrajZone: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: 'bold',
  },
  passBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 204, 113, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
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
    backgroundColor: 'rgba(255, 159, 67, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    gap: 3,
  },
  warnText: {
    color: COLORS.warning,
    fontSize: 10,
    fontWeight: '700',
  },
  errorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 82, 82, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    gap: 3,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 10,
    fontWeight: '700',
  },
  makhrajComment: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  makhrajTip: {
    color: COLORS.emeraldLight,
    fontSize: 11,
    marginTop: 4,
    lineHeight: 16,
  },
  tajweedRow: {
    marginBottom: SPACING.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    paddingBottom: SPACING.xs,
  },
  ruleHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  ruleName: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  ruleScoreBadge: {
    fontSize: 11,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    marginLeft: 6,
  },
  ruleFeedback: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
  retryBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.gold,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm + 2,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  retryBtnText: {
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
