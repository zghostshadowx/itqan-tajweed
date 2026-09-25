import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Language } from '../constants/translations';
import {
  X,
  BookOpen,
  Volume2,
  Mic,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  UserCheck,
} from 'lucide-react-native';

interface HowToUseModalProps {
  visible: boolean;
  onClose: () => void;
  currentLanguage: Language;
  onQuickGoogleSignIn?: () => void;
  googleUserEmail?: string | null;
}

export const HowToUseModal: React.FC<HowToUseModalProps> = ({
  visible,
  onClose,
  currentLanguage,
  onQuickGoogleSignIn,
  googleUserEmail,
}) => {
  const isAr = currentLanguage === 'ar';

  const steps = [
    {
      number: isAr ? '١' : '1',
      icon: <BookOpen size={22} color={COLORS.gold} />,
      title: isAr ? 'اختر السورة والآية الكريمة' : '1. Choose a Surah & Verse',
      desc: isAr
        ? 'من الشاشة الرئيسية، اضغط على أي سورة من سور القرآن الكريم (114 سورة كاملة بالرسم العثماني) للبدء.'
        : 'From the Home screen, tap any of the 114 Surahs of the Holy Quran in authentic Uthmani script.',
    },
    {
      number: isAr ? '٢' : '2',
      icon: <Volume2 size={22} color={COLORS.emeraldLight} />,
      title: isAr ? 'استمع لتلاوة الشيخ المتقن' : '2. Listen to the Master Reciter',
      desc: isAr
        ? 'اضغط على زر الاستماع لسماع النطق الصحيح للآية بصوت الشيخ الحصري أو العفاسي أو عبد الباسط قبل أن تقرأ.'
        : 'Tap the Play button to hear the exact pronunciation from Sheikh Al-Husary, Alafasy, or Abdul Basit.',
    },
    {
      number: isAr ? '٣' : '3',
      icon: <Mic size={22} color="#FF9F43" />,
      title: isAr ? 'اضغط زر الميكروفون واقرأ' : '3. Tap the Microphone & Recite',
      desc: isAr
        ? 'اضغط على زر الميكروفون الذهبي، واقرأ الآية الكريمة بصوت واضح وهادئ، ثم اضغط إيقاف عند الانتهاء.'
        : 'Tap the gold Microphone button, recite the verse clearly at a calm pace, then tap Stop when finished.',
    },
    {
      number: isAr ? '٤' : '4',
      icon: <Sparkles size={22} color="#3498DB" />,
      title: isAr
        ? 'تصحيح فوري بالذكاء الاصطناعي (يعمل تلقائياً!)'
        : '4. Instant AI Correction (Works Automatically!)',
      desc: isAr
        ? 'يعمل الذكاء الاصطناعي في التطبيق تلقائياً ومجاناً فور فتحه دون الحاجة لإدخال أي مفتاح أو إعدادات معقدة! سيظهر لك تقييم دقيق لمخارج الحروف وأحكام التجويد.'
        : 'Cloud AI is pre-connected and works automatically out-of-the-box—no API key setup needed! You immediately receive a detailed Makharij and Tajweed report.',
    },
  ];

  const tajweedColors = [
    {
      color: COLORS.tajweedMadd,
      label: isAr ? 'الأحمر: المدود (٢ أو ٤ أو ٦ حركات)' : 'Crimson Red: Madd (Prolongation 2/4/6 counts)',
    },
    {
      color: COLORS.tajweedGhunnah,
      label: isAr ? 'الأخضر: الغنّة (حركتان من الخيشوم)' : 'Emerald Green: Ghunnah (2-count nasalization)',
    },
    {
      color: COLORS.tajweedQalqalah,
      label: isAr ? 'الأزرق: القلقلة (حروف: قطب جد)' : 'Sky Blue: Qalqalah (Echoing letters ق ط ب ج د)',
    },
    {
      color: COLORS.tajweedIkhfa,
      label: isAr ? 'التركواز: الإخفاء والإدغام' : 'Turquoise: Ikhfa & Idgham rules',
    },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={[styles.headerRow, isAr ? styles.rtlRow : styles.ltrRow]}>
            <View style={[styles.titleRow, isAr ? styles.rtlRow : styles.ltrRow]}>
              <View style={styles.iconCircle}>
                <HelpCircle size={22} color={COLORS.gold} />
              </View>
              <View>
                <Text style={[styles.modalTitle, isAr ? styles.textRight : styles.textLeft]}>
                  {isAr ? 'طريقة استخدام تطبيق إتقان' : 'How to Use Itqan'}
                </Text>
                <Text style={[styles.modalSubtitle, isAr ? styles.textRight : styles.textLeft]}>
                  {isAr
                    ? 'دليل مبسّط خطوة بخطوة لجميع الأعمار'
                    : 'Simple step-by-step guide for everyone'}
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
              <X size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollBody}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Ready Out of the Box Banner */}
            <View style={[styles.readyBanner, isAr ? styles.rtlRow : styles.ltrRow]}>
              <CheckCircle2 size={22} color={COLORS.emeraldLight} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.readyBannerTitle, isAr ? styles.textRight : styles.textLeft]}>
                  {isAr
                    ? '✅ الذكاء الاصطناعي مفعّل وجاهز تلقائياً'
                    : '✅ Cloud AI Pre-Activated & Ready'}
                </Text>
                <Text style={[styles.readyBannerSub, isAr ? styles.textRight : styles.textLeft]}>
                  {isAr
                    ? 'لا تحتاج لإنشاء أو نسخ أي مفتاح API — ابدأ التلاوة مباشرة!'
                    : 'No API key copying or technical setup needed — just tap the mic and recite!'}
                </Text>
              </View>
            </View>

            {/* 1-Tap Google Sign-In / Sync Button for Elderly Ease */}
            {onQuickGoogleSignIn && (
              <TouchableOpacity
                style={[
                  styles.googleSignInCard,
                  googleUserEmail ? styles.googleSignedInCard : null,
                  isAr ? styles.rtlRow : styles.ltrRow,
                ]}
                onPress={onQuickGoogleSignIn}
                activeOpacity={0.85}
              >
                <UserCheck
                  size={20}
                  color={googleUserEmail ? COLORS.emeraldLight : COLORS.gold}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.googleBtnTitle,
                      isAr ? styles.textRight : styles.textLeft,
                    ]}
                  >
                    {googleUserEmail
                      ? isAr
                        ? `✓ متصل بحساب Google (${googleUserEmail})`
                        : `✓ Signed in with Google (${googleUserEmail})`
                      : isAr
                      ? 'تسجيل الدخول بلمسة واحدة بحساب Google (لحفظ الختمة)'
                      : '1-Tap Sign in with Google (Sync Progress & AI)'}
                  </Text>
                  <Text
                    style={[
                      styles.googleBtnSub,
                      isAr ? styles.textRight : styles.textLeft,
                    ]}
                  >
                    {googleUserEmail
                      ? isAr
                        ? 'يتم حفظ تقدمك وربط الذكاء الاصطناعي تلقائياً'
                        : 'Your progress and automatic Cloud AI are linked'
                      : isAr
                      ? 'اضغط هنا لربط حسابك تلقائياً بضغطة زر واحدة'
                      : 'Tap here to link your account with a single tap'}
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            {/* 4 Easy Steps */}
            {steps.map((step, idx) => (
              <View
                key={idx}
                style={[styles.stepCard, isAr ? styles.rtlRow : styles.ltrRow]}
              >
                <View style={styles.stepIconBox}>{step.icon}</View>
                <View style={styles.stepTextBox}>
                  <Text style={[styles.stepTitle, isAr ? styles.textRight : styles.textLeft]}>
                    {step.title}
                  </Text>
                  <Text style={[styles.stepDesc, isAr ? styles.textRight : styles.textLeft]}>
                    {step.desc}
                  </Text>
                </View>
              </View>
            ))}

            {/* Color Legend */}
            <View style={styles.legendCard}>
              <Text style={[styles.legendTitle, isAr ? styles.textRight : styles.textLeft]}>
                {isAr ? '🎨 دليل ألوان أحكام التجويد في الآيات:' : '🎨 Tajweed Color Guide in Verses:'}
              </Text>
              {tajweedColors.map((item, i) => (
                <View
                  key={i}
                  style={[styles.legendRow, isAr ? styles.rtlRow : styles.ltrRow]}
                >
                  <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                  <Text style={[styles.legendText, isAr ? styles.textRight : styles.textLeft]}>
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Footer CTA */}
          <TouchableOpacity style={styles.gotItBtn} onPress={onClose} activeOpacity={0.85}>
            <Text style={styles.gotItBtnText}>
              {isAr ? 'واضح، ابدأ التلاوة الآن 🎙️' : 'Got It, Start Reciting Now 🎙️'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 12, 9, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '90%',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    padding: SPACING.md,
  },
  headerRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
  },
  titleRow: {
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textGold,
  },
  modalSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.cardElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollBody: {
    marginTop: SPACING.sm,
  },
  scrollContent: {
    paddingBottom: SPACING.md,
    gap: SPACING.sm,
  },
  readyBanner: {
    backgroundColor: 'rgba(46, 204, 113, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(46, 204, 113, 0.45)',
    borderRadius: RADIUS.md,
    padding: SPACING.sm + 4,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  readyBannerTitle: {
    color: '#2ECC71',
    fontSize: 14,
    fontWeight: 'bold',
  },
  readyBannerSub: {
    color: COLORS.textPrimary,
    fontSize: 12,
    marginTop: 2,
    lineHeight: 18,
  },
  googleSignInCard: {
    backgroundColor: COLORS.cardElevated,
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: RADIUS.md,
    padding: SPACING.sm + 4,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  googleSignedInCard: {
    borderColor: COLORS.emeraldLight,
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
  },
  googleBtnTitle: {
    color: COLORS.textGold,
    fontSize: 13,
    fontWeight: 'bold',
  },
  googleBtnSub: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  stepCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  stepIconBox: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.cardElevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
  },
  stepTextBox: {
    flex: 1,
  },
  stepTitle: {
    color: COLORS.textGold,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  stepDesc: {
    color: COLORS.textPrimary,
    fontSize: 13,
    lineHeight: 20,
  },
  legendCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    gap: 8,
  },
  legendTitle: {
    color: COLORS.textGold,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  legendRow: {
    alignItems: 'center',
    gap: 8,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    flex: 1,
  },
  gotItBtn: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.gold,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  gotItBtnText: {
    color: COLORS.background,
    fontSize: 15,
    fontWeight: 'bold',
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
