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
  HelpCircle,
  UserCheck,
} from 'lucide-react-native';
import { AITajweedService } from '../services/aiService';
import { CloudPoolService, GoogleUserSession } from '../services/cloudPoolConfig';

interface SettingsScreenProps {
  currentLanguage: Language;
  onSetLanguage: (lang: Language) => void;
  onOpenGuide?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  currentLanguage,
  onSetLanguage,
  onOpenGuide,
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const isAr = currentLanguage === 'ar';

  const [geminiKey, setGeminiKey] = useState<string>('');
  const [isKeySaved, setIsKeySaved] = useState<boolean>(false);
  const [googleUser, setGoogleUser] = useState<GoogleUserSession | null>(null);

  useEffect(() => {
    AITajweedService.init().then((savedKey) => {
      if (savedKey) {
        setGeminiKey(savedKey);
        setIsKeySaved(true);
      }
    });
    CloudPoolService.loadGoogleSession().then((session) => {
      if (session) setGoogleUser(session);
    });
  }, []);

  const handleGoogleSignIn = async () => {
    const session = await CloudPoolService.signInWithGoogleQuick();
    setGoogleUser(session);
    Alert.alert(
      isAr ? 'تم ربط حساب Google بنجاح ✅' : 'Google Account Connected ✅',
      isAr
        ? 'تم تفعيل الذكاء الاصطناعي السحابي التلقائي ومزامنة الختمة بنجاح دون الحاجة لأي مفتاح!'
        : 'Automatic Cloud AI and Quran progress sync are now active—no API key required!'
    );
  };

  const handleGoogleSignOut = async () => {
    await CloudPoolService.signOutGoogle();
    setGoogleUser(null);
  };

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
        ? 'تم مسح المفتاح الشخصي والعودة إلى محرك السحابة المدمج التلقائي.'
        : 'Personal key removed. Reverted to built-in automatic Cloud AI pool.'
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
            <Text style={styles.versionText}>v1.1.0 • AI Tajweed Edition</Text>
          </View>
        </View>
      </View>

      {/* Quick Launch How to Use Guide Card + 1-Tap Google Sign-In */}
      <View style={styles.card}>
        <View style={[styles.cardHeader, isAr ? styles.rtlRow : styles.ltrRow]}>
          <HelpCircle size={18} color={COLORS.gold} />
          <Text style={styles.cardTitle}>
            {isAr ? 'دليل الاستخدام السريع والربط التلقائي' : 'Quick Guide & 1-Tap Google Connect'}
          </Text>
        </View>
        <Text style={[styles.descText, isAr ? styles.textRight : styles.textLeft]}>
          {isAr
            ? 'يعمل الذكاء الاصطناعي في إتقان تلقائياً فور التثبيت دون الحاجة لإدخال مفتاح API يدوياً. يمكنك أيضاً فتح دليل الاستخدام المبسط أو ربط حساب Google بلمسة واحدة.'
            : 'Itqan Cloud AI works automatically out-of-the-box with zero API key setup required. Open the visual guide or sign in with Google in one tap below.'}
        </Text>

        {onOpenGuide && (
          <TouchableOpacity
            style={[styles.saveKeyBtn, { marginTop: SPACING.sm }]}
            onPress={onOpenGuide}
            activeOpacity={0.85}
          >
            <Text style={styles.saveKeyBtnText}>
              {isAr ? '📖 فتح دليل طريقة استخدام التطبيق (خطوة بخطوة)' : '📖 Open How to Use Guide (Step-by-Step)'}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.getKeyBtn,
            { marginTop: SPACING.sm },
            googleUser ? { borderColor: '#2ECC71', backgroundColor: 'rgba(46, 204, 113, 0.12)' } : null,
            isAr ? styles.rtlRow : styles.ltrRow,
          ]}
          onPress={googleUser ? handleGoogleSignOut : handleGoogleSignIn}
          activeOpacity={0.85}
        >
          <UserCheck size={16} color={googleUser ? '#2ECC71' : COLORS.gold} />
          <Text style={[styles.getKeyBtnText, googleUser ? { color: '#2ECC71' } : null]}>
            {googleUser
              ? isAr
                ? `✓ متصل بحساب Google (${googleUser.email}) — الذكاء التلقائي مفعل`
                : `✓ Signed in with Google (${googleUser.email}) — Auto AI Active`
              : isAr
              ? 'تسجيل الدخول بلمسة واحدة بحساب Google (تفعيل تلقائي بالكامل)'
              : '1-Tap Sign in with Google (Full Automatic Cloud AI)'}
          </Text>
        </TouchableOpacity>
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
            ? 'يستخدم التطبيق الميكروفون لتحليل تلاوتك وحساب درجة الإتقان فقط. عند تفعيل الذكاء السحابي، يُرسَل التسجيل إلى Google Gemini للتحليل دون تخزينه، ويمكنك إيقاف الذكاء السحابي ليبقى كل شيء على جهازك.'
            : 'Itqan uses your microphone only to score your recitation. With Cloud AI enabled in Settings, your recording is sent to Google Gemini for analysis and is not stored by Itqan. Turn Cloud AI off to keep all processing on your device.'}
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
          <Text style={styles.infoValue}>1.1.0 (Release Build 3)</Text>
        </View>

        <View style={[styles.infoRow, isAr ? styles.rtlRow : styles.ltrRow]}>
          <Text style={styles.infoLabel}>{isAr ? 'المحرك الذكي:' : 'AI Engine:'}</Text>
          <Text style={styles.infoValue}>
            {isAr
              ? 'محرّك Gemini من Google (سحابي مدمج يعمل تلقائياً)'
              : 'Google Gemini (Built-in Auto Cloud)'}
          </Text>
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
