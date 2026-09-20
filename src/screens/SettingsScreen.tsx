import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Language, TRANSLATIONS } from '../constants/translations';
import { Globe, Mic, ShieldCheck, Info, Check, Smartphone } from 'lucide-react-native';

interface SettingsScreenProps {
  currentLanguage: Language;
  onSetLanguage: (lang: Language) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  currentLanguage,
  onSetLanguage,
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const isAr = currentLanguage === 'ar';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Title */}
      <View style={styles.header}>
        <Text style={[styles.title, isAr ? styles.textRight : styles.textLeft]}>
          {t.settings}
        </Text>
      </View>

      {/* Language Section */}
      <View style={styles.card}>
        <View style={[styles.cardHeader, isAr ? styles.rtlRow : styles.ltrRow]}>
          <Globe size={18} color={COLORS.gold} />
          <Text style={styles.cardTitle}>{t.languageSelect}</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.optionRow,
            currentLanguage === 'ar' && styles.optionRowActive,
            isAr ? styles.rtlRow : styles.ltrRow,
          ]}
          onPress={() => onSetLanguage('ar')}
          activeOpacity={0.8}
        >
          <Text style={styles.optionText}>{t.arabicLanguage}</Text>
          {currentLanguage === 'ar' && <Check size={18} color={COLORS.gold} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionRow,
            currentLanguage === 'en' && styles.optionRowActive,
            isAr ? styles.rtlRow : styles.ltrRow,
          ]}
          onPress={() => onSetLanguage('en')}
          activeOpacity={0.8}
        >
          <Text style={styles.optionText}>{t.englishLanguage}</Text>
          {currentLanguage === 'en' && <Check size={18} color={COLORS.gold} />}
        </TouchableOpacity>
      </View>

      {/* Audio & Privacy Section (Google Play Store compliance) */}
      <View style={styles.card}>
        <View style={[styles.cardHeader, isAr ? styles.rtlRow : styles.ltrRow]}>
          <Mic size={18} color={COLORS.gold} />
          <Text style={styles.cardTitle}>{t.microphoneAccess}</Text>
        </View>
        <Text style={[styles.descText, isAr ? styles.textRight : styles.textLeft]}>
          {isAr
            ? 'يستخدم التطبيق الميكروفون لتحليل مخارج الحروف وقواعد التجويد فورياً. لا يتم مشاركة أو بيع التسجيلات الصوتية مطلقاً، وتتم معالجة التلاوة لحساب درجة الإتقان فقط.'
            : 'Itqan utilizes microphone input exclusively for real-time articulation and Tajweed scoring. Your audio is private, encrypted, and never sold.'}
        </Text>
      </View>

      {/* App & Google Play Store Info */}
      <View style={styles.card}>
        <View style={[styles.cardHeader, isAr ? styles.rtlRow : styles.ltrRow]}>
          <Smartphone size={18} color={COLORS.gold} />
          <Text style={styles.cardTitle}>{t.playStoreVersion}</Text>
        </View>

        <View style={[styles.infoRow, isAr ? styles.rtlRow : styles.ltrRow]}>
          <Text style={styles.infoLabel}>Package ID:</Text>
          <Text style={styles.infoValue}>com.itqan.tajweed</Text>
        </View>

        <View style={[styles.infoRow, isAr ? styles.rtlRow : styles.ltrRow]}>
          <Text style={styles.infoLabel}>{isAr ? 'الإصدار:' : 'Version:'}</Text>
          <Text style={styles.infoValue}>1.0.0 (Release Build 1)</Text>
        </View>

        <View style={[styles.infoRow, isAr ? styles.rtlRow : styles.ltrRow]}>
          <Text style={styles.infoLabel}>{isAr ? 'المحرك الذكي:' : 'AI Engine:'}</Text>
          <Text style={styles.infoValue}>Itqan Neural Acoustic v2.5</Text>
        </View>
      </View>

      {/* Privacy Policy Card */}
      <View style={styles.card}>
        <View style={[styles.cardHeader, isAr ? styles.rtlRow : styles.ltrRow]}>
          <ShieldCheck size={18} color={COLORS.gold} />
          <Text style={styles.cardTitle}>{t.privacyPolicy}</Text>
        </View>
        <Text style={[styles.descText, isAr ? styles.textRight : styles.textLeft]}>
          {isAr
            ? 'تطبيق إتقان متوافق مع سياسات متجر Google Play للأمان وحماية البيانات وسلامة الأطفال والخصوصية الدينية.'
            : 'Itqan adheres strictly to Google Play Developer Distribution Agreement standards for data safety and educational apps.'}
        </Text>
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
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: SPACING.md,
  },
  cardHeader: {
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
  cardTitle: {
    color: COLORS.textGold,
    fontSize: 14,
    fontWeight: 'bold',
  },
  optionRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.cardElevated,
    marginTop: SPACING.xs,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionRowActive: {
    borderColor: COLORS.gold,
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
  },
  optionText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  descText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  infoRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  infoLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  infoValue: {
    color: COLORS.textGold,
    fontSize: 12,
    fontWeight: '600',
  },
  textRight: {
    textAlign: 'right',
  },
  textLeft: {
    textAlign: 'left',
  },
});
