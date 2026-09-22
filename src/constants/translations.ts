export type Language = 'ar' | 'en';

export interface Translations {
  appName: string;
  appSubtitle: string;
  tagline: string;
  home: string;
  recite: string;
  makharij: string;
  academy: string;
  settings: string;
  
  // Home
  dailyGoal: string;
  streakDays: string;
  startPractice: string;
  surahListTitle: string;
  recentSurahs: string;
  makharijMastery: string;
  overallScore: string;
  readyToRecite: string;
  todayTajweedRule: string;

  // Recitation
  listenTeacher: string;
  reciterSelect: string;
  reciterHusary: string;
  reciterAlafasy: string;
  reciterAbdulbasit: string;
  playbackSpeed: string;
  repeatAyah: string;
  recordYourVoice: string;
  tapToRecord: string;
  recordingInProgress: string;
  stopAndAnalyze: string;
  aiAnalyzing: string;
  ayahNumber: string;
  nextAyah: string;
  prevAyah: string;

  // AI Feedback
  aiCorrectionTitle: string;
  accuracyScore: string;
  perfectRecitation: string;
  goodAttempt: string;
  needsImprovement: string;
  makharijCheck: string;
  tajweedRuleCheck: string;
  phoneticTips: string;
  tryAgain: string;
  listenToMistakeComparison: string;

  // Makharij
  makharijTitle: string;
  makharijDesc: string;
  halq: string;
  lisan: string;
  shafatan: string;
  khayshoom: string;
  jawf: string;
  lettersFromThisExit: string;
  anatomyGuide: string;

  // Rules / Academy
  tajweedRulesTitle: string;
  noonSakinahRules: string;
  maddRules: string;
  qalqalahRules: string;
  ghunnahExplanation: string;
  tafkheemTarqeeq: string;
  audioExample: string;

  // Settings
  languageSelect: string;
  arabicLanguage: string;
  englishLanguage: string;
  darkMode: string;
  microphoneAccess: string;
  playStoreVersion: string;
  aboutItqan: string;
  privacyPolicy: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  ar: {
    appName: 'إتقان',
    appSubtitle: 'معلم التجويد ومخارج الحروف بالذكاء الاصطناعي',
    tagline: 'رتل القرآن ترتيلاً بإتقان وإحسان',
    home: 'الرئيسية',
    recite: 'التلاوة والتصحيح',
    makharij: 'مخارج الحروف',
    academy: 'أحكام التجويد',
    settings: 'الإعدادات',

    dailyGoal: 'الورد اليومي للتجويد',
    streakDays: 'أيام التتابع',
    startPractice: 'ابدأ التدريب الآن',
    surahListTitle: 'السور والآيات المختارة',
    recentSurahs: 'المتابعة الأخيرة',
    makharijMastery: 'نسبة إتقان المخارج',
    overallScore: 'معدل الدقة الإجمالي',
    readyToRecite: 'اختر سورة وتدرّب على النطق السليم مع الذكاء الاصطناعي',
    todayTajweedRule: 'حكم اليوم: القلقلة وأحرف (قطب جد)',

    listenTeacher: 'استمع للشيخ المتقن',
    reciterSelect: 'اختيار القارئ المعلم',
    reciterHusary: 'الشيخ محمود خليل الحصري (المعلم)',
    reciterAlafasy: 'الشيخ مشاري راشد العفاسي',
    reciterAbdulbasit: 'الشيخ عبد الباسط عبد الصمد (مرتل)',
    playbackSpeed: 'سرعة التلاوة',
    repeatAyah: 'تكرار الآية للحفظ والتدريب',
    recordYourVoice: 'سجّل تلاوتك الآن',
    tapToRecord: 'اضغط على الميكروفون لبدء التلاوة',
    recordingInProgress: 'جاري الاستماع لتلاوتك الكريمة...',
    stopAndAnalyze: 'إيقاف وتحليل التجويد بالذكاء الاصطناعي',
    aiAnalyzing: 'جاري فحص مخارج الحروف وقواعد التجويد...',
    ayahNumber: 'الآية',
    nextAyah: 'الآية التالية',
    prevAyah: 'الآية السابقة',

    aiCorrectionTitle: 'تقرير التصحيح اللحظي (AI)',
    accuracyScore: 'درجة الإتقان',
    perfectRecitation: 'ما شاء الله! تلاوة متقنة ومخارج سليمة 🌟',
    goodAttempt: 'تلاوة طيبة مع وجود ملاحظات يسيرة على بعض المخارج 🎯',
    needsImprovement: 'تحتاج لمراجعة بعض قواعد التجويد وضبط مخارج الحروف 💡',
    makharijCheck: 'تدقيق مخارج الحروف',
    tajweedRuleCheck: 'تدقيق أحكام التجويد والمدود',
    phoneticTips: 'توجيهات المخرج والنطق',
    tryAgain: 'أعد المحاولة والتسجيل',
    listenToMistakeComparison: 'مقارنة نطقك مع القارئ الشيخ',

    makharijTitle: 'الدليل التشريحي لمخارج الحروف',
    makharijDesc: 'تعرف على المواضع التشريحية الدقيقة لخروج الأحرف العربية الـ 28',
    halq: 'الحلق (6 أحرف)',
    lisan: 'اللسان (18 حرفاً)',
    shafatan: 'الشفتان (4 أحرف)',
    khayshoom: 'الخيشوم (الغنة)',
    jawf: 'الجوف (حروف المد الثلاثة)',
    lettersFromThisExit: 'الأحرف الخارجة من هذا المخرج:',
    anatomyGuide: 'المخطط التشريحي الصوتي',

    tajweedRulesTitle: 'موسوعة أحكام التجويد',
    noonSakinahRules: 'أحكام النون الساكنة والتنوين (الإظهار، الإدغام، الإقلاب، الإخفاء)',
    maddRules: 'أحكام المدود (المد الطبيعي، المتصل، المنفصل، اللازم، العارض)',
    qalqalahRules: 'أحكام القلقلة (صغرى، كبرى، أكبر)',
    ghunnahExplanation: 'أحكام الغنة ومقدارها حركتان',
    tafkheemTarqeeq: 'التفخيم والترقيق في الراء ولام لفظ الجلالة',
    audioExample: 'استمع للمثال الصوتي النموذجي',

    languageSelect: 'لغة التطبيق',
    arabicLanguage: 'العربية (اللغة الافتراضية)',
    englishLanguage: 'English (الإنجليزية)',
    darkMode: 'الوضع الليلي الإسلامي',
    microphoneAccess: 'إذن الميكروفون لتحليل التلاوة',
    playStoreVersion: 'نسخة متجر Google Play: v1.0.1 (بناء معتمد)',
    aboutItqan: 'عن تطبيق إتقان',
    privacyPolicy: 'سياسة الخصوصية وأمان الصوت',
  },
  en: {
    appName: 'Itqan',
    appSubtitle: 'AI Quran Tajweed & Makharij Tutor',
    tagline: 'Master Quranic Recitation with Precision',
    home: 'Home',
    recite: 'Recite & Correct',
    makharij: 'Articulation Points',
    academy: 'Tajweed Rules',
    settings: 'Settings',

    dailyGoal: 'Daily Tajweed Target',
    streakDays: 'Day Streak',
    startPractice: 'Start Practice Now',
    surahListTitle: 'Featured Surahs & Verses',
    recentSurahs: 'Recent Surahs',
    makharijMastery: 'Makharij Mastery',
    overallScore: 'Overall Precision',
    readyToRecite: 'Select a Surah and train on proper pronunciation with instant AI feedback',
    todayTajweedRule: "Today's Rule: Qalqalah & Consonants (ق، ط، ب، ج، د)",

    listenTeacher: 'Listen to the Master Reciter',
    reciterSelect: 'Select Master Teacher Reciter',
    reciterHusary: 'Sheikh Mahmoud Khalil Al-Husary (Teacher)',
    reciterAlafasy: 'Sheikh Mishary Rashid Alafasy',
    reciterAbdulbasit: 'Sheikh Abdul Basit Abdus Samad (Murattal)',
    playbackSpeed: 'Recitation Speed',
    repeatAyah: 'Repeat Ayah for Practice',
    recordYourVoice: 'Record Your Recitation',
    tapToRecord: 'Tap the microphone to start reciting',
    recordingInProgress: 'Listening to your noble recitation...',
    stopAndAnalyze: 'Stop & Analyze Tajweed with AI',
    aiAnalyzing: 'Evaluating articulation points and Tajweed rules...',
    ayahNumber: 'Ayah',
    nextAyah: 'Next Ayah',
    prevAyah: 'Previous Ayah',

    aiCorrectionTitle: 'Instant AI Evaluation Report',
    accuracyScore: 'Mastery Score',
    perfectRecitation: 'MashaAllah! Flawless recitation and precise articulation 🌟',
    goodAttempt: 'Noble recitation with minor adjustments needed on certain points 🎯',
    needsImprovement: 'Needs review on Tajweed rules and articulation points 💡',
    makharijCheck: 'Makharij (Articulation) Inspection',
    tajweedRuleCheck: 'Tajweed & Madd Rule Adherence',
    phoneticTips: 'Articulation Guidance & Tips',
    tryAgain: 'Try Again & Re-record',
    listenToMistakeComparison: 'Compare your voice with the Sheikh',

    makharijTitle: 'Vocal Tract Articulation Guide',
    makharijDesc: 'Discover the exact anatomical origins of all 28 Arabic letters',
    halq: 'The Throat (6 letters)',
    lisan: 'The Tongue (18 letters)',
    shafatan: 'The Lips (4 letters)',
    khayshoom: 'Nasal Cavity (Ghunnah)',
    jawf: 'Oral Cavity (3 Long Vowels)',
    lettersFromThisExit: 'Letters emerging from this point:',
    anatomyGuide: 'Phonetic Vocal Diagram',

    tajweedRulesTitle: 'Tajweed Rules Encyclopedia',
    noonSakinahRules: 'Noon Sakinah & Tanween (Izhar, Idgham, Iqlab, Ikhfa)',
    maddRules: 'Madd Prolongation (Natural, Connected, Separated, Compulsory)',
    qalqalahRules: 'Qalqalah Echo Consonants (Minor, Major, Greatest)',
    ghunnahExplanation: 'Ghunnah Nasalization (2 Harakat counts)',
    tafkheemTarqeeq: 'Tafkheem & Tarqeeq (Heavy vs Light letters)',
    audioExample: 'Listen to reference audio example',

    languageSelect: 'Application Language',
    arabicLanguage: 'العربية (Arabic - Default)',
    englishLanguage: 'English',
    darkMode: 'Islamic Midnight Dark Mode',
    microphoneAccess: 'Microphone Permission for Speech Analysis',
    playStoreVersion: 'Google Play Store Release: v1.0.1 (Certified)',
    aboutItqan: 'About Itqan App',
    privacyPolicy: 'Privacy Policy & Voice Data Protection',
  },
};
