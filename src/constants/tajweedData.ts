export interface MakhrajItem {
  id: string;
  nameAr: string;
  nameEn: string;
  category: 'jawf' | 'halq' | 'lisan' | 'shafatan' | 'khayshoom';
  categoryAr: string;
  categoryEn: string;
  letters: string[];
  subPoints: {
    titleAr: string;
    titleEn: string;
    letters: string;
    descriptionAr: string;
    descriptionEn: string;
    commonMistakeAr: string;
    commonMistakeEn: string;
    correctionTipAr: string;
    correctionTipEn: string;
  }[];
}

export const MAKHARIJ_DATA: MakhrajItem[] = [
  {
    id: 'halq',
    nameAr: 'الحلق',
    nameEn: 'The Throat (Al-Halq)',
    category: 'halq',
    categoryAr: 'مخرج رئيسي عام',
    categoryEn: 'General Articulation Zone',
    letters: ['ء', 'هـ', 'ع', 'ح', 'غ', 'خ'],
    subPoints: [
      {
        titleAr: 'أقصى الحلق (المنطقة الأعمق مما يلي الصدر)',
        titleEn: 'Deepest Throat (Near the chest)',
        letters: 'الهمزة (ء) والهاء (هـ)',
        descriptionAr: 'يخرجان من منطقة الحنجرة عند الأوتار الصوتية بالانطباق في الهمزة والانفتاح في الهاء.',
        descriptionEn: 'Originates at the vocal cords: closure for Hamzah, slight opening for Haa.',
        commonMistakeAr: 'تسهيل الهمزة بدون موجب أو إضعاف الهاء حتى تكاد تختفي خاصة عند الوقف.',
        commonMistakeEn: 'Weakening the Haa until inaudible, especially at the end of verses.',
        correctionTipAr: 'اضغط باعتدال على الأوتار لخروج الهمزة ناصعة، وادفع هواء الزفير مع جريان الصوت في الهاء.',
        correctionTipEn: 'Ensure clear breath flow (Hams) for Haa and firm cord contact for Hamzah.',
      },
      {
        titleAr: 'وسط الحلق (منطقة لسان المزمار)',
        titleEn: 'Middle Throat (Epiglottis region)',
        letters: 'العين (ع) والحاء (ح)',
        descriptionAr: 'رجوع لسان المزمار نحو الجدار الخلفي للبلعوم. حرفا العين والحاء من أصفى أصوات الحلق.',
        descriptionEn: 'Produced by retraction of the epiglottis towards the pharyngeal wall.',
        commonMistakeAr: 'تحويل العين إلى همزة أو نطق الحاء هاءً خفيفة عند المبتدئين والأعاجم.',
        commonMistakeEn: 'Subbing Ayn with a glottal stop (Hamzah) or pronouncing Haa like English h.',
        correctionTipAr: 'اعصر وسط الحلق بانقباض متزن لعضلة لسان المزمار، وجرّب نطق: (أَعْ - أَحْ).',
        correctionTipEn: 'Gently squeeze the middle throat muscles; practice saying "A\'" and "Ah".',
      },
      {
        titleAr: 'أدنى الحلق (الأقرب إلى الفم مما يلي اللهاة)',
        titleEn: 'Upper Throat (Closest to mouth near uvula)',
        letters: 'الغين (غ) والخاء (خ)',
        descriptionAr: 'تلاقي جذر اللسان مع الحنك اللحمي الرخو. وهما حرفان مفخمان دائماً.',
        descriptionEn: 'Where the root of the tongue nears the soft palate. Both are heavy letters.',
        commonMistakeAr: 'ترقيق الغين والخاء أو المبالغة في الشخير في الخاء مما يولد صوتاً منفراً.',
        commonMistakeEn: 'Making Ghayn and Khaa light, or over-rasping the Khaa.',
        correctionTipAr: 'ارفع أقصى لسانك لملامسة سقف الحنك الرخو مع ملء الفم بصدى الحرف (التفخيم).',
        correctionTipEn: 'Elevate the back of the tongue towards the soft palate to ensure Tafkheem.',
      }
    ]
  },
  {
    id: 'lisan',
    nameAr: 'اللسان',
    nameEn: 'The Tongue (Al-Lisan)',
    category: 'lisan',
    categoryAr: 'أوسع المخارج (18 حرفاً)',
    categoryEn: 'Largest Zone (18 letters)',
    letters: ['ق', 'ك', 'ج', 'ش', 'ي', 'ض', 'ل', 'ن', 'ر', 'ط', 'د', 'ت', 'ص', 'ز', 'س', 'ظ', 'ذ', 'ث'],
    subPoints: [
      {
        titleAr: 'أقصى اللسان (المنطقة الخلفية)',
        titleEn: 'Back / Root of the Tongue',
        letters: 'القاف (ق) ثم الكاف (ك)',
        descriptionAr: 'القاف: أقصى اللسان مع الحنك الرخو اللحمي. الكاف: أسفل القاف قليلاً مع الحنك العظمي واللحمي.',
        descriptionEn: 'Qaaf: back of tongue with soft palate. Kaaf: slightly lower with hard/soft palate.',
        commonMistakeAr: 'خلط صوت القاف بالجيم القاهرية (G) أو إهمال همس الكاف الساكنة.',
        commonMistakeEn: 'Turning Qaaf into a "G" sound or neglecting the audible burst (Hams) on Kaaf.',
        correctionTipAr: 'اضرب أقصى اللسان في أعلى نقطة رخوة مع القلقلة في القاف، وبث نفثة هواء لطيفة مع الكاف.',
        correctionTipEn: 'Strike the highest soft palate point with echo for Qaaf; follow with soft air for Kaaf.',
      },
      {
        titleAr: 'حافتا اللسان (مخرج الضاد واللام)',
        titleEn: 'Edges of the Tongue (Daad & Lam)',
        letters: 'الضاد (ض) واللام (ل)',
        descriptionAr: 'الضاد: إحدى حافتي اللسان أو كلاهما مع ما يحاذيها من الأضراس العليا مع صفة الاستطالة.',
        descriptionEn: 'Daad: lateral side of the tongue touching the upper molars with elongation (Istitalah).',
        commonMistakeAr: 'نطق الضاد كأنها ظاء أو دال مفخمة، وهو الخطأ الأشهر لدى معظم القراء.',
        commonMistakeEn: 'Pronouncing Daad like Zhaa (ظ) or a heavy Dal (د). Most common global error.',
        correctionTipAr: 'ثبّت حافتي اللسان على الأضراس العليا مع إرخاء طرف اللسان دون ملامسة الأسنان الأمامية.',
        correctionTipEn: 'Press sides of the tongue against upper molars, leaving the tip free from teeth.',
      },
      {
        titleAr: 'طرف اللسان (مخرج الحروف النطعية واللثوية والصفير)',
        titleEn: 'Tip of the Tongue',
        letters: 'ط، د، ت | ص، ز، س | ظ، ذ، ث | ن، ر',
        descriptionAr: 'أكثر مناطق اللسان تشعباً لخروج 11 حرفاً تنقسم لصفير ولثوية ونطعية.',
        descriptionEn: 'Produces 11 letters: dental-alveolar, sibilants, and interdentals.',
        commonMistakeAr: 'خلط الثاء والذال بالسين والزاي، أو ترقيق الطاء والصاد.',
        commonMistakeEn: 'Mixing "Thaa" (ث) with "Seen" (س), or losing fullness on Taa (ط).',
        correctionTipAr: 'أخرج طرف لسانك قليلاً بين الثنايا للظاء والذال والثاء، واحبس الهواء خلف الأسنان للصفير.',
        correctionTipEn: 'Place tongue tip slightly between teeth for Thaa, Zhal, and Zhaa.',
      }
    ]
  },
  {
    id: 'shafatan',
    nameAr: 'الشفتان',
    nameEn: 'The Lips (Ash-Shafatan)',
    category: 'shafatan',
    categoryAr: 'مخرج رئيسي (4 أحرف)',
    categoryEn: 'Major Zone (4 letters)',
    letters: ['ف', 'ب', 'م', 'و'],
    subPoints: [
      {
        titleAr: 'بطن الشفة السفلى',
        titleEn: 'Inner Lower Lip',
        letters: 'الفاء (ف)',
        descriptionAr: 'ملامسة أطراف الثنايا العليا لبطن الشفة السفلى.',
        descriptionEn: 'Edges of upper front teeth resting upon the wet inner lower lip.',
        commonMistakeAr: 'الضغط الزائد على الشفة مما يكتم جريان النفس.',
        commonMistakeEn: 'Over-pressing, choking the breath flow of the Faa.',
        correctionTipAr: 'اترك منفذاً ليجري هواء النفس بوضوح (صفة الهمس).',
        correctionTipEn: 'Allow light continuous breath to flow through the incisors.',
      },
      {
        titleAr: 'بين الشفتين',
        titleEn: 'Between Both Lips',
        letters: 'الباء (ب) والميم (م) والواو (و)',
        descriptionAr: 'انطباق الشفتين في الباء والميم، وانضمامهما مع بقاء فرجة دائرية في الواو غير المدية.',
        descriptionEn: 'Full closure for Baa & Meem; rounded pursing for non-vowel Wow.',
        commonMistakeAr: 'تسرّب غنة غير مرغوبة في الواو، أو قلقلة الميم الساكنة.',
        commonMistakeEn: 'Nasal leak into Wow, or accidental echo bounce on Meem.',
        correctionTipAr: 'أحكم غلق الشفتين برفق للباء مع القلقلة عند السكون، واضمم الشفتين للأمام في الواو.',
        correctionTipEn: 'Seal lips gently for Baa with sharp bounce; round lips forward for Wow.',
      }
    ]
  },
  {
    id: 'khayshoom',
    nameAr: 'الخيشوم',
    nameEn: 'The Nasal Cavity (Al-Khayshoom)',
    category: 'khayshoom',
    categoryAr: 'مخرج الغنة',
    categoryEn: 'The Origin of Ghunnah',
    letters: ['الغنة (النون والميم)'],
    subPoints: [
      {
        titleAr: 'التجويف الأنفي (مخرج الغنة)',
        titleEn: 'Nasal Pharyngeal Resonator',
        letters: 'صوت الغنة الملازم للنون والميم',
        descriptionAr: 'صوت رخيم يخرج من الخيشوم لا عمل للسان فيه، ومقداره حركتان في المشدد والمدغم والمخفى.',
        descriptionEn: 'A sweet nasalized resonance accompanying Noon & Meem, calibrated at 2 counts.',
        commonMistakeAr: 'تقصير زمن الغنة لأقل من حركتين أو خروج الغنة في حروف المد (الألف والواو والياء).',
        commonMistakeEn: 'Rushing the Ghunnah under 2 beats, or leaking nasality into long vowels.',
        correctionTipAr: 'تحسس اهتزاز الأنف بيدك أثناء نطق (إنَّ - عمَّ)، واحذر من رنين الأنف عند مد (قالوا).',
        correctionTipEn: 'Feel nose vibration on "Inna" and "Amma"; ensure zero vibration on "Qaaloo".',
      }
    ]
  },
  {
    id: 'jawf',
    nameAr: 'الجوف',
    nameEn: 'The Oral Cavity (Al-Jawf)',
    category: 'jawf',
    categoryAr: 'مخرج حروف المد (مخرج مقدر)',
    categoryEn: 'Estimated Zone (3 Long Vowels)',
    letters: ['ا', 'و', 'ي'],
    subPoints: [
      {
        titleAr: 'الخلاء الداخل في الحلق والفم',
        titleEn: 'Open Space in Throat and Mouth',
        letters: 'الألف الساكنة، الواو المدية، الياء المدية',
        descriptionAr: 'مخرج مقدر ينتهي بانتهاء الهواء، ولا يعتمد على جزء معين من أجزاء الفم أو الحلق.',
        descriptionEn: 'Open acoustic chamber with no localized physical contact.',
        commonMistakeAr: 'إمالة الألف نحو الياء، أو قفل الحلق في نهاية المد بحبس همزي غير مقصود.',
        commonMistakeEn: 'Slanting Alif towards Yaa (Imalah), or abruptly clipping with an unwanted glottal stop.',
        correctionTipAr: 'افتح الفك عمودياً للألف، واضم الشفتين للواو، واخفض الفك السفلي للياء بانسيابية.',
        correctionTipEn: 'Open jaw vertically for Alif, purse lips for Wow, lower mandible gently for Yaa.',
      }
    ]
  }
];

export interface TajweedRuleEncyclopedia {
  id: string;
  titleAr: string;
  titleEn: string;
  category: 'noon_meem' | 'madd' | 'qalqalah' | 'tafkheem';
  color: string;
  summaryAr: string;
  summaryEn: string;
  rules: {
    nameAr: string;
    nameEn: string;
    letters: string;
    explanationAr: string;
    explanationEn: string;
    exampleAyahAr: string;
    exampleWordAr: string;
  }[];
}

export const TAJWEED_RULES_ENCYCLOPEDIA: TajweedRuleEncyclopedia[] = [
  {
    id: 'noon_sakinah',
    titleAr: 'أحكام النون الساكنة والتنوين',
    titleEn: 'Rules of Noon Sakinah & Tanween',
    category: 'noon_meem',
    color: '#2ECC71',
    summaryAr: 'أربعة أحكام أساسية تترتب عند التقاء النون الساكنة أو التنوين بالحروف الهجائية.',
    summaryEn: 'Four primary phonetic rules applied when Noon Sakinah or Tanween meets the alphabet.',
    rules: [
      {
        nameAr: 'الإظهار الحلقي',
        nameEn: 'Izhar Halqi (Clear Pronunciation)',
        letters: 'ء ، هـ ، ع ، ح ، غ ، خ (أخي هاك علماً حازه غير خاسر)',
        explanationAr: 'إخراج النون من مخرجها ناصعة واضحة دون غنة زائدة ولا سكت.',
        explanationEn: 'Pronounce Noon crisply from its exit without added elongation or nasal pause.',
        exampleAyahAr: 'مِنْ خَوْفٍ - أَنْعَمْتَ عَلَيْهِمْ',
        exampleWordAr: 'مَنْ آمَنَ',
      },
      {
        nameAr: 'الإدغام (بغنة وبغير غنة)',
        nameEn: 'Idgham (Merging)',
        letters: 'ي ، ر ، م ، ل ، و ، ن (مجموعة في كلمة: يَرْمَلُون)',
        explanationAr: 'إدخال النون في الحرف التالي، بغنة في (يَنْمُو) بمقدار حركتين، وبغير غنة في (اللام والراء).',
        explanationEn: 'Merging Noon into next letter; with 2-count Ghunnah in (YANMU), and complete without Ghunnah in (L & R).',
        exampleAyahAr: 'مَن يَّقُولُ (بغنة) - مِن رَّبِّهِمْ (بغير غنة)',
        exampleWordAr: 'مَن يَّعْمَلْ',
      },
      {
        nameAr: 'الإقلاب',
        nameEn: 'Iqlab (Conversion to Meem)',
        letters: 'حرف الباء (ب) فقط',
        explanationAr: 'قلب النون الساكنة أو التنوين ميماً مخفاة مع بقاء الغنة بمقدار حركتين.',
        explanationEn: 'Converting Noon or Tanween to a concealed Meem with 2 counts of Ghunnah.',
        exampleAyahAr: 'مِنۢ بَعْدِ - أَنۢبِئْهُم بِأَسْمَائِهِمْ',
        exampleWordAr: 'أَنۢبُورِكْتَ',
      },
      {
        nameAr: 'الإخفاء الحقيقي',
        nameEn: 'Ikhfa Haqiqi (Concealment)',
        letters: '15 حرفاً: ص، ذ، ث، ك، ج، ش، ق، س، د، ط، ز، ف، ت، ض، ظ',
        explanationAr: 'النطق بحالة متوسطة بين الإظهار والإدغام مع بقاء الغنة واستعداد الفم لمخرج الحرف التالي.',
        explanationEn: 'State between Izhar and Idgham with 2 counts of Ghunnah while positioning tongue near the upcoming letter.',
        exampleAyahAr: 'مِن قَبْلِ - كُنتُمْ - أَنفُسَكُمْ',
        exampleWordAr: 'مِن طِينٍ',
      }
    ]
  },
  {
    id: 'qalqalah',
    titleAr: 'أحكام القلقلة',
    titleEn: 'Rules of Qalqalah (Vocal Echo)',
    category: 'qalqalah',
    color: '#3498DB',
    summaryAr: 'اضطراب المخرج عند النطق بالحرف ساكناً حتى يُسمع له نبرة قوية تميزه عن الحركات.',
    summaryEn: 'Echo and dynamic release vibration produced upon arresting a consonant sound.',
    rules: [
      {
        nameAr: 'مراتب القلقلة',
        nameEn: 'Degrees of Qalqalah',
        letters: 'ق ، ط ، ب ، ج ، د (قُطْبُ جَدّ)',
        explanationAr: '1. كبرى: عند الوقف على حرف مشدد (الْحَقّ، تَبّ). 2. وسطى: عند الوقف على مخفف (أَحَد، فَلَق). 3. صغرى: في وسط الكلمة أو الوصل (يَجْعَلُون، يَدْخُلُون).',
        explanationEn: '1. Greatest: stopped on doubled letter. 2. Medium: stopped on single letter. 3. Minor: inside a word mid-recitation.',
        exampleAyahAr: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ',
        exampleWordAr: 'يَقْطَعُونَ',
      }
    ]
  },
  {
    id: 'madd',
    titleAr: 'أحكام المدود وأزمنتها',
    titleEn: 'Rules of Madd (Prolongation)',
    category: 'madd',
    color: '#E74C3C',
    summaryAr: 'إطالة الصوت بحرف من حروف المد الثلاثة (الألف، الواو، الياء) لسبب همز أو سكون أو أصالة.',
    summaryEn: 'Extending the sound through the three vowel letters due to hamzah, sukoon, or inherent nature.',
    rules: [
      {
        nameAr: 'المد الطبيعي (الأصلي)',
        nameEn: 'Natural Madd (Madd Asli)',
        letters: 'حروف المد الثلاثة الخالية من همز أو سكون',
        explanationAr: 'يمد حركتين وجوباً ولا تقوم ذات الحرف إلا به (نوحيها).',
        explanationEn: 'Strictly 2 counts duration; intrinsic to the vowel structure.',
        exampleAyahAr: 'قَالَ - يَقُولُ - قِيلَ',
        exampleWordAr: 'نُوحِيهَا',
      },
      {
        nameAr: 'المد المتصل والمنفصل',
        nameEn: 'Connected & Separated Madd',
        letters: 'حرف مد يليه همز في نفس الكلمة (متصل) أو كلمة تالية (منفصل)',
        explanationAr: 'المتصل واجب (4 أو 5 حركات)، والمنفصل جائز (2 أو 4 أو 5 حركات في الشاطبية).',
        explanationEn: 'Connected is mandatory 4-5 counts; Separated is permissible 2-5 counts.',
        exampleAyahAr: 'جَآءَ (متصل) - بِمَآ أُنزِلَ (منفصل)',
        exampleWordAr: 'السَّمَآءِ',
      },
      {
        nameAr: 'المد اللازم الكلمي والحرفي',
        nameEn: 'Compulsory Madd (Madd Lazim)',
        letters: 'حرف مد يليه حرف ساكن سكوناً أصلياً مشدداً أو مخففاً',
        explanationAr: 'يمد 6 حركات وجوباً وإجماعاً بلا خلاف.',
        explanationEn: 'Mandatory 6 full counts without exception.',
        exampleAyahAr: 'وَلَا الضَّآلِّينَ - الْحَآقَّةُ - الٓمٓ',
        exampleWordAr: 'الصَّآخَّةُ',
      }
    ]
  }
];
