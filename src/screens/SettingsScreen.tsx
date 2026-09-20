import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  Linking,
  Share,
  TextInput,
  Alert,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Language, TRANSLATIONS } from '../constants/translations';
import {
  Globe,
  Mic,
  ShieldCheck,
  Info,
  Check,
  Smartphone,
  Cloud,
  ExternalLink,
  Share2,
  Key,
  Sparkles,
  Trash2,
} from 'lucide-react-native';
import { AITajweedService } from '../services/aiService';

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

  const [geminiKey, setGeminiKey] = useState<string>('');
  const [isKeySaved, setIsKeySaved] = useState<boolean>(false);

  useEffect(() => {
    AITajweedService.init().then((savedKey) => {
      if (savedKey) {
        setGeminiKey(savedKey);
        setIsKeySaved(true);
      }
    });
  }, []);

  const handleOpenCloudWeb = async () => {
    try {
      await Linking.openURL('https://itqan-tajweed.surge.sh');
    } catch (e) {
      console.warn('Could not open URL', e);
    }
  };

  const handleShareCloudWeb = async () => {
    try {
      await Share.share({
        title: 'تطبيق إتقان لتعليم التجويد',
        message: isAr
          ? 'جرّب تطبيق إتقان لتعليم التجويد ومخارج الحروف بالذكاء الاصطناعي أونلاين على السحابة مجاناً:\nhttps://itqan-tajweed.surge.sh'
          : 'Experience Itqan - AI Quran Tajweed & Makharij Tutor online in your browser:\nhttps://itqan-tajweed.surge.sh',
        url: 'https://itqan-tajweed.surge.sh',
      });
    } catch (e) {
      console.warn('Could not share', e);
    }
  };

  const handleOpenAiStudio = async () => {
    try {
      await Linking.openURL('https://aistudio.google.com/app/apikey');
    } catch (e) {
      console.warn('Could not open AI Studio', e);
    }
  };

  const handleSaveGeminiKey = async () => {
    if (!geminiKey.trim()) {
      Alert.alert(
        isAr ? 'تنبيه' : 'Notice',
        isAr ? 'يرجى إدخال مفتاح Gemini API' : 'Please enter a Gemini API Key'
      );
      return;
    }
    await AITajweedService.setGeminiApiKey(geminiKey.trim());
    setIsKeySaved(true);
    Alert.alert(
      isAr ? 'تم التفعيل بنجاح' : 'Activated Successfully',
      isAr
        ? 'تم حفظ وربط الذكاء الاصطناعي السحابي Google Gemini 2.5 Flash Audio بنجاح ومزامنة المفتاح!'
        : 'Google Gemini 2.5 Flash Audio Cloud AI key saved and synced successfully!'
    );
  };

  const handleRemoveGeminiKey = async () => {
    await AITajweedService.setGeminiApiKey('');
    setGeminiKey('');
    setIsKeySaved(false);
    Alert.alert(
      isAr ? 'تم الحذف' : 'Removed',
      isAr
        ? 'تم مسح المفتاح والعودة إلى محرك التحليل الصوتي الداخلي (بدون إنترنت).'
        : 'Key removed. Reverted to internal offline acoustic engine.'
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* App Identity Banner with Logo */}
      <View style={[styles.appBanner, isAr ? styles.rtlRow : styles.ltrRow]}>
        <View style={styles.bannerLogoWrapper}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.bannerLogo}
            resizeMode="cover"
          />
        </View>
        <View style={[styles.bannerTextCol, isAr ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' }]}>
          <Text style={styles.bannerTitle}>{t.appName}</Text>
          <Text style={styles.bannerSubtitle}>{t.appSubtitle}</Text>
          <View style={styles.versionPill}>
            <Text style={styles.versionText}>v1.0.0 • AI Tajweed Edition</Text>
          </View>
        </View>
      </View>

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

      {/* Cloud & Web Version Card */}
      <View style={styles.card}>
        <View style={[styles.cardHeader, isAr ? styles.rtlRow : styles.ltrRow]}>
          <Cloud size={18} color={COLORS.gold} />
          <Text style={styles.cardTitle}>
            {isAr ? 'النسخة السحابية المباشرة (Cloud Web)' : 'Live Cloud Web App'}
          </Text>
        </View>
        <Text style={[styles.descText, isAr ? styles.textRight : styles.textLeft]}>
          {isAr
            ? 'تطبيق إتقان منشور مباشرة على الكلاود، يعمل 24/7 دون الحاجة لتشغيل جهاز الكمبيوتر، ويمكنك فتحه أو مشاركته مع أي شخص حول العالم:'
            : 'Itqan is deployed live to the cloud, accessible 24/7 without needing your PC online. Open it on any browser or share it globally:'}
        </Text>
        <Text style={[styles.cloudUrlText, isAr ? styles.textRight : styles.textLeft]}>
          https://itqan-tajweed.surge.sh
        </Text>

        <View style={[styles.cloudButtonsRow, isAr ? styles.rtlRow : styles.ltrRow]}>
          <TouchableOpacity
            style={[styles.cloudBtn, isAr ? styles.rtlRow : styles.ltrRow]}
            onPress={handleOpenCloudWeb}
            activeOpacity={0.8}
          >
            <ExternalLink size={16} color={COLORS.background} />
            <Text style={styles.cloudBtnText}>
              {isAr ? 'فتح في المتصفح' : 'Open in Browser'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cloudBtnSecondary, isAr ? styles.rtlRow : styles.ltrRow]}
            onPress={handleShareCloudWeb}
            activeOpacity={0.8}
          >
            <Share2 size={16} color={COLORS.gold} />
            <Text style={styles.cloudBtnSecondaryText}>
              {isAr ? 'مشاركة الرابط' : 'Share Link'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Cloud AI Gemini Engine Card */}
      <View style={styles.card}>
        <View style={[styles.cardHeader, isAr ? styles.rtlRow : styles.ltrRow]}>
          <Sparkles size={18} color={COLORS.gold} />
          <Text style={styles.cardTitle}>
            {isAr ? 'الذكاء الاصطناعي السحابي (Google Gemini)' : 'Cloud AI (Google Gemini)'}
          </Text>
        </View>
        <Text style={[styles.descText, isAr ? styles.textRight : styles.textLeft]}>
          {isAr
            ? 'يدعم التطبيق نموذج Google Gemini 2.5 Flash Audio السحابي للتحليل الصوتي فائق الدقة، أو المحرك الصوتي الداخلي دون إنترنت.'
            : 'Supports Google Gemini 2.5 Flash Audio Cloud API for high-precision acoustic analysis, or the offline on-device engine.'}
        </Text>

        <View style={[styles.apiKeyRow, isAr ? styles.rtlRow : styles.ltrRow]}>
          <Key size={16} color={COLORS.gold} />
          <TextInput
            style={[styles.apiKeyInput, isAr ? styles.textRight : styles.textLeft]}
            placeholder={isAr ? 'أدخل مفتاح Gemini API المجاني...' : 'Enter Gemini API Key...'}
            placeholderTextColor={COLORS.textMuted}
            value={geminiKey}
            onChangeText={setGeminiKey}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.getKeyBtn, isAr ? styles.rtlRow : styles.ltrRow]}
          onPress={handleOpenAiStudio}
          activeOpacity={0.8}
        >
          <Key size={14} color={COLORS.gold} />
          <Text style={styles.getKeyBtnText}>
            {isAr
              ? 'احصل على مفتاح مجاني من Google AI Studio (اضغط هنا)'
              : 'Get Free Key from Google AI Studio (Tap here)'}
          </Text>
          <ExternalLink size={14} color={COLORS.gold} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveKeyBtn, isKeySaved && styles.saveKeyBtnDone]}
          onPress={handleSaveGeminiKey}
          activeOpacity={0.8}
        >
          <Text style={styles.saveKeyBtnText}>
            {isKeySaved
              ? isAr
                ? '✓ المفتاح مفعّل ومتصل بالسحابة (اضغط للتحديث)'
                : '✓ Key Activated & Cloud Connected (Tap to update)'
              : isAr
              ? 'حفظ وتفعيل الاتصال السحابي'
              : 'Save & Connect to Cloud'}
          </Text>
        </TouchableOpacity>

        {isKeySaved && (
          <TouchableOpacity
            style={[styles.removeKeyBtn, isAr ? styles.rtlRow : styles.ltrRow]}
            onPress={handleRemoveGeminiKey}
            activeOpacity={0.8}
          >
            <Trash2 size={14} color={COLORS.error} />
            <Text style={styles.removeKeyBtnText}>
              {isAr ? 'مسح المفتاح والعودة للمحرك الداخلي' : 'Remove Key (Revert to Offline Engine)'}
            </Text>
          </TouchableOpacity>
        )}
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
  appBanner: {
    backgroundColor: COLORS.cardElevated,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorderActive,
    alignItems: 'center',
    gap: SPACING.md,
  },
  bannerLogoWrapper: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    backgroundColor: COLORS.background,
  },
  bannerLogo: {
    width: '100%',
    height: '100%',
  },
  bannerTextCol: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textGold,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  versionPill: {
    marginTop: 6,
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
  },
  versionText: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '700',
  },
  cloudUrlText: {
    color: COLORS.emeraldLight,
    fontSize: 12,
    marginVertical: SPACING.xs,
    padding: 6,
    backgroundColor: COLORS.cardElevated,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  cloudButtonsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  cloudBtn: {
    flex: 1,
    backgroundColor: COLORS.gold,
    paddingVertical: 10,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  cloudBtnText: {
    color: COLORS.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
  cloudBtnSecondary: {
    flex: 1,
    backgroundColor: COLORS.cardElevated,
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingVertical: 10,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  cloudBtnSecondaryText: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: 'bold',
  },
  apiKeyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardElevated,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    height: 44,
    gap: 8,
  },
  apiKeyInput: {
    flex: 1,
    color: COLORS.textGold,
    fontSize: 12,
    height: '100%',
  },
  saveKeyBtn: {
    backgroundColor: COLORS.gold,
    borderRadius: RADIUS.sm,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  saveKeyBtnDone: {
    backgroundColor: COLORS.emeraldLight,
  },
  saveKeyBtnText: {
    color: COLORS.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
  getKeyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    borderRadius: RADIUS.sm,
    paddingVertical: 8,
    paddingHorizontal: SPACING.sm,
    marginTop: SPACING.sm,
    gap: 8,
  },
  getKeyBtnText: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '600',
  },
  removeKeyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.sm,
    paddingVertical: 6,
    gap: 6,
  },
  removeKeyBtnText: {
    color: COLORS.error,
    fontSize: 11,
    fontWeight: 'bold',
  },
});
