import { parseUniversalTajweed } from '../services/tajweedParser';

// Load via require to avoid TypeScript literal AST bloat on 6,236 Ayahs
const quranFullJson = require('../data/quranFull.json');

export interface SurahMeta {
  number: number;
  nameAr: string;
  nameEn: string;
  nameTranslation: string;
  revelationType: 'Meccan' | 'Medinan';
  revelationTypeAr: 'مكية' | 'مدنية';
  totalAyahs: number;
}

export interface TajweedSegment {
  text: string;
  rule?: 'madd' | 'ghunnah' | 'qalqalah' | 'ikhfa' | 'idgham' | 'iqlab' | 'silent' | 'normal';
  explanationAr?: string;
  explanationEn?: string;
}

export interface Ayah {
  numberInSurah: number;
  globalNumber: number;
  uthmaniText: string;
  segments: TajweedSegment[];
  audioHusary: string;
  audioAlafasy: string;
  audioAbdulbasit: string;
  tajweedNotesAr: string;
  tajweedNotesEn: string;
}

export interface Surah {
  number: number;
  nameAr: string;
  nameEn: string;
  revelationType: 'Meccan' | 'Medinan';
  revelationTypeAr: 'مكية' | 'مدنية';
  totalAyahs: number;
  ayahs: Ayah[];
}

export const FEATURED_SURAHS: Surah[] = [
  {
    number: 1,
    nameAr: 'سورة الفاتحة',
    nameEn: 'Al-Fatihah (The Opening)',
    revelationType: 'Meccan',
    revelationTypeAr: 'مكية',
    totalAyahs: 7,
    ayahs: [
      {
        numberInSurah: 1,
        globalNumber: 1,
        uthmaniText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        segments: [
          { text: 'بِسْمِ ', rule: 'normal' },
          { text: 'اللَّهِ ', rule: 'normal', explanationAr: 'ترقيق لام لفظ الجلالة لأن ما قبلها مكسور', explanationEn: 'Tarqeeq (thin) of Allah due to preceding kasrah' },
          { text: 'الرَّحْمَٰنِ ', rule: 'normal' },
          { text: 'الرَّحِ', rule: 'normal' },
          { text: 'ي', rule: 'madd', explanationAr: 'مد عارض للسكون (2 أو 4 أو 6 حركات)', explanationEn: 'Madd Arid li-Sukun (2, 4, or 6 counts)' },
          { text: 'مِ', rule: 'normal' }
        ],
        audioHusary: 'https://everyayah.com/data/Husary_64kbps/001001.mp3',
        audioAlafasy: 'https://everyayah.com/data/Alafasy_64kbps/001001.mp3',
        audioAbdulbasit: 'https://everyayah.com/data/Abdul_Basit_Murattal_64kbps/001001.mp3',
        tajweedNotesAr: 'ترقيق لام لفظ الجلالة، ومد عارض للسكون عند الوقف على (الرحيم)',
        tajweedNotesEn: 'Light (tarqeeq) pronunciation of the Lam in Allah, and Madd Arid at the end.',
      },
      {
        numberInSurah: 2,
        globalNumber: 2,
        uthmaniText: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        segments: [
          { text: 'الْحَمْدُ ', rule: 'normal' },
          { text: 'لِلَّهِ ', rule: 'normal' },
          { text: 'رَبِّ ', rule: 'normal' },
          { text: 'الْعَالَمِ', rule: 'normal' },
          { text: 'ي', rule: 'madd', explanationAr: 'مد عارض للسكون عند الوقف (2 أو 4 أو 6 حركات)', explanationEn: 'Madd Arid li-Sukun upon stopping' },
          { text: 'نَ', rule: 'normal' }
        ],
        audioHusary: 'https://everyayah.com/data/Husary_64kbps/001002.mp3',
        audioAlafasy: 'https://everyayah.com/data/Alafasy_64kbps/001002.mp3',
        audioAbdulbasit: 'https://everyayah.com/data/Abdul_Basit_Murattal_64kbps/001002.mp3',
        tajweedNotesAr: 'إظهار اللام القمرية في (الحمد) و (العالمين)، ضبط مخرج الحاء من وسط الحلق',
        tajweedNotesEn: 'Clear Lam Qamariyyah in Al-Hamd; articulate Haa from the middle of the throat.',
      },
      {
        numberInSurah: 3,
        globalNumber: 3,
        uthmaniText: 'الرَّحْمَٰنِ الرَّحِيمِ',
        segments: [
          { text: 'الرَّحْمَٰنِ ', rule: 'normal' },
          { text: 'الرَّحِ', rule: 'normal' },
          { text: 'ي', rule: 'madd', explanationAr: 'مد عارض للسكون', explanationEn: 'Madd Arid li-Sukun' },
          { text: 'مِ', rule: 'normal' }
        ],
        audioHusary: 'https://everyayah.com/data/Husary_64kbps/001003.mp3',
        audioAlafasy: 'https://everyayah.com/data/Alafasy_64kbps/001003.mp3',
        audioAbdulbasit: 'https://everyayah.com/data/Abdul_Basit_Murattal_64kbps/001003.mp3',
        tajweedNotesAr: 'إدغام اللام الشمسية في الراء، تفخيم الراء المفتوحة والمشددة',
        tajweedNotesEn: 'Idgham of Lam Shamsiyyah into Raa; heavy pronunciation (Tafkheem) of the Raa.',
      },
      {
        numberInSurah: 4,
        globalNumber: 4,
        uthmaniText: 'مَالِكِ يَوْمِ الدِّينِ',
        segments: [
          { text: 'مَالِكِ ', rule: 'normal' },
          { text: 'يَوْمِ ', rule: 'normal' },
          { text: 'الدِّ', rule: 'normal' },
          { text: 'ي', rule: 'madd', explanationAr: 'مد عارض للسكون', explanationEn: 'Madd Arid li-Sukun' },
          { text: 'نِ', rule: 'normal' }
        ],
        audioHusary: 'https://everyayah.com/data/Husary_64kbps/001004.mp3',
        audioAlafasy: 'https://everyayah.com/data/Alafasy_64kbps/001004.mp3',
        audioAbdulbasit: 'https://everyayah.com/data/Abdul_Basit_Murattal_64kbps/001004.mp3',
        tajweedNotesAr: 'كسر كاف (مالكِ) كسراً تاماً دون إشباع لتفادي تولد ياء',
        tajweedNotesEn: 'Crisp articulation of the Kasrah on Kaaf without elongation.',
      },
      {
        numberInSurah: 5,
        globalNumber: 5,
        uthmaniText: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        segments: [
          { text: 'إِيَّاكَ ', rule: 'normal' },
          { text: 'نَعْبُدُ ', rule: 'normal', explanationAr: 'بيان مخرج العين من وسط الحلق دون قلقلة', explanationEn: 'Articulate Ayn from middle throat without echo' },
          { text: 'وَإِيَّاكَ ', rule: 'normal' },
          { text: 'نَسْتَعِ', rule: 'normal' },
          { text: 'ي', rule: 'madd', explanationAr: 'مد عارض للسكون', explanationEn: 'Madd Arid li-Sukun' },
          { text: 'نُ', rule: 'normal' }
        ],
        audioHusary: 'https://everyayah.com/data/Husary_64kbps/001005.mp3',
        audioAlafasy: 'https://everyayah.com/data/Alafasy_64kbps/001005.mp3',
        audioAbdulbasit: 'https://everyayah.com/data/Abdul_Basit_Murattal_64kbps/001005.mp3',
        tajweedNotesAr: 'تشديد الياء في (إيَّاك) مع النبر اللطيف، وضبط مخرج العين في (نعبد) و (نستعين)',
        tajweedNotesEn: 'Accented shaddah on the Yaa; clear throat articulation of the letter Ayn.',
      },
      {
        numberInSurah: 6,
        globalNumber: 6,
        uthmaniText: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        segments: [
          { text: 'اهْدِنَا ', rule: 'normal' },
          { text: 'الصِّرَاطَ ', rule: 'normal', explanationAr: 'تفخيم الصاد والطاء، وترقيق الراء المفتوحة', explanationEn: 'Tafkheem on Saad and Taa' },
          { text: 'الْمُسْتَقِ', rule: 'normal' },
          { text: 'ي', rule: 'madd', explanationAr: 'مد عارض للسكون', explanationEn: 'Madd Arid li-Sukun' },
          { text: 'مَ', rule: 'normal' }
        ],
        audioHusary: 'https://everyayah.com/data/Husary_64kbps/001006.mp3',
        audioAlafasy: 'https://everyayah.com/data/Alafasy_64kbps/001006.mp3',
        audioAbdulbasit: 'https://everyayah.com/data/Abdul_Basit_Murattal_64kbps/001006.mp3',
        tajweedNotesAr: 'بيان صفة الهمس والرخاوة في الهاء، وتفخيم الصاد والطاء وترقيق السين والتاء في (المستقيم)',
        tajweedNotesEn: 'Hams on Haa; distinction between heavy Saad/Taa and light Seen/Taa.',
      },
      {
        numberInSurah: 7,
        globalNumber: 7,
        uthmaniText: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        segments: [
          { text: 'صِرَاطَ الَّذِينَ ', rule: 'normal' },
          { text: 'أَنْعَمْتَ ', rule: 'normal', explanationAr: 'إظهار حلقي للنون الساكنة قبل العين', explanationEn: 'Izhar Halqi: clear Noon before Ayn' },
          { text: 'عَلَيْهِمْ ', rule: 'normal', explanationAr: 'إظهار شفوي للميم الساكنة قبل الغين', explanationEn: 'Izhar Shafawi: clear Meem before Ghayn' },
          { text: 'غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا ', rule: 'normal' },
          { text: 'الضَّ', rule: 'normal', explanationAr: 'ضبط مخرج الضاد من إحدى حافتي اللسان مع الأضراس العليا مع الاستطالة', explanationEn: 'Daad: lateral tongue against upper molars with elongation (Istitalah)' },
          { text: 'ا', rule: 'madd', explanationAr: 'مد لازم كلمي مثقل (6 حركات وجوباً)', explanationEn: 'Madd Lazim Kalimi Muthaqqal (Strictly 6 counts)' },
          { text: 'لِّينَ', rule: 'normal' }
        ],
        audioHusary: 'https://everyayah.com/data/Husary_64kbps/001007.mp3',
        audioAlafasy: 'https://everyayah.com/data/Alafasy_64kbps/001007.mp3',
        audioAbdulbasit: 'https://everyayah.com/data/Abdul_Basit_Murattal_64kbps/001007.mp3',
        tajweedNotesAr: 'مد لازم كلمي مثقل (6 حركات) في (الضالين)، وضبط مخرج واستطالة الضاد دون تحويلها لظاء',
        tajweedNotesEn: 'Compulsory 6-harakah Madd in Al-Dallin; precise articulation of Daad with Istitalah.',
      },
    ]
  },
  {
    number: 112,
    nameAr: 'سورة الإخلاص',
    nameEn: 'Al-Ikhlas (Purity of Faith)',
    revelationType: 'Meccan',
    revelationTypeAr: 'مكية',
    totalAyahs: 4,
    ayahs: [
      {
        numberInSurah: 1,
        globalNumber: 6222,
        uthmaniText: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        segments: [
          { text: 'قُلْ هُوَ اللَّهُ أَحَ', rule: 'normal' },
          { text: 'دٌ', rule: 'qalqalah', explanationAr: 'قلقلة كبرى عند الوقف على الدال الساكنة', explanationEn: 'Major Qalqalah when stopping on the Dal' }
        ],
        audioHusary: 'https://everyayah.com/data/Husary_64kbps/112001.mp3',
        audioAlafasy: 'https://everyayah.com/data/Alafasy_64kbps/112001.mp3',
        audioAbdulbasit: 'https://everyayah.com/data/Abdul_Basit_Murattal_64kbps/112001.mp3',
        tajweedNotesAr: 'قلقلة الدال في (أحد) عند الوقف، وتفخيم القاف في (قل)',
        tajweedNotesEn: 'Qalqalah on the Dal at the end upon pause.',
      },
      {
        numberInSurah: 2,
        globalNumber: 6223,
        uthmaniText: 'اللَّهُ الصَّمَدُ',
        segments: [
          { text: 'اللَّهُ الصَّمَ', rule: 'normal' },
          { text: 'دُ', rule: 'qalqalah', explanationAr: 'قلقلة كبرى عند الوقف على الدال', explanationEn: 'Major Qalqalah upon pause' }
        ],
        audioHusary: 'https://everyayah.com/data/Husary_64kbps/112002.mp3',
        audioAlafasy: 'https://everyayah.com/data/Alafasy_64kbps/112002.mp3',
        audioAbdulbasit: 'https://everyayah.com/data/Abdul_Basit_Murattal_64kbps/112002.mp3',
        tajweedNotesAr: 'تفخيم الصاد وترقيق الميم، وقلقلة الدال عند الوقف',
        tajweedNotesEn: 'Tafkheem on Saad, Tarqeeq on Meem, Qalqalah on Dal.',
      },
      {
        numberInSurah: 3,
        globalNumber: 6224,
        uthmaniText: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
        segments: [
          { text: 'لَمْ يَلِ', rule: 'normal' },
          { text: 'دْ', rule: 'qalqalah', explanationAr: 'قلقلة صغرى في وسط الكلام', explanationEn: 'Minor Qalqalah mid-verse' },
          { text: ' وَلَمْ يُولَ', rule: 'normal' },
          { text: 'دْ', rule: 'qalqalah', explanationAr: 'قلقلة كبرى عند الوقف', explanationEn: 'Major Qalqalah at pause' }
        ],
        audioHusary: 'https://everyayah.com/data/Husary_64kbps/112003.mp3',
        audioAlafasy: 'https://everyayah.com/data/Alafasy_64kbps/112003.mp3',
        audioAbdulbasit: 'https://everyayah.com/data/Abdul_Basit_Murattal_64kbps/112003.mp3',
        tajweedNotesAr: 'إظهار الميم الساكنة قبل الياء والواو، وقلقلة الدال في الموضعين',
        tajweedNotesEn: 'Izhar Shafawi for both Meems; Qalqalah on both occurrences of Dal.',
      },
      {
        numberInSurah: 4,
        globalNumber: 6225,
        uthmaniText: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        segments: [
          { text: 'وَلَمْ يَكُ', rule: 'normal' },
          { text: 'ن لَّ', rule: 'idgham', explanationAr: 'إدغام بغير غنة: نون ساكنة أدغمت في اللام كاملاً', explanationEn: 'Idgham without Ghunnah: complete merging of Noon into Lam' },
          { text: 'هُ كُفُوًا أَحَ', rule: 'normal' },
          { text: 'دٌ', rule: 'qalqalah', explanationAr: 'قلقلة كبرى عند الوقف', explanationEn: 'Major Qalqalah upon pause' }
        ],
        audioHusary: 'https://everyayah.com/data/Husary_64kbps/112004.mp3',
        audioAlafasy: 'https://everyayah.com/data/Alafasy_64kbps/112004.mp3',
        audioAbdulbasit: 'https://everyayah.com/data/Abdul_Basit_Murattal_64kbps/112004.mp3',
        tajweedNotesAr: 'إدغام بغير غنة في (يكن له)، إظهار حلقي في (كفواً أحد)، قلقلة الدال في (أحد)',
        tajweedNotesEn: 'Idgham without Ghunnah in yakun-lahu; clear Izhar Halqi in kufuwan ahad.',
      },
    ]
  },
  {
    number: 113,
    nameAr: 'سورة الفلق',
    nameEn: 'Al-Falaq (The Daybreak)',
    revelationType: 'Meccan',
    revelationTypeAr: 'مكية',
    totalAyahs: 5,
    ayahs: [
      {
        numberInSurah: 1,
        globalNumber: 6226,
        uthmaniText: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
        segments: [
          { text: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَ', rule: 'normal' },
          { text: 'قِ', rule: 'qalqalah', explanationAr: 'قلقلة كبرى عند الوقف على القاف', explanationEn: 'Major Qalqalah on Qaaf upon stopping' }
        ],
        audioHusary: 'https://everyayah.com/data/Husary_64kbps/113001.mp3',
        audioAlafasy: 'https://everyayah.com/data/Alafasy_64kbps/113001.mp3',
        audioAbdulbasit: 'https://everyayah.com/data/Abdul_Basit_Murattal_64kbps/113001.mp3',
        tajweedNotesAr: 'تفخيم القاف في (قل) و (الفلق)، وإخراج الذال المعجمة من طرف اللسان مع أطراف الثنايا العليا، وقلقلة القاف عند الوقف.',
        tajweedNotesEn: 'Tafkheem on Qaaf, correct Dhal articulation from tongue tip and upper incisors, major Qalqalah on Qaaf at the pause.',
      },
      {
        numberInSurah: 2,
        globalNumber: 6227,
        uthmaniText: 'مِن شَرِّ مَا خَلَقَ',
        segments: [
          { text: 'مِ', rule: 'normal' },
          { text: 'ن شَ', rule: 'ikhfa', explanationAr: 'إخفاء حقيقي للنون الساكنة عند الشين بغنة مرققة حركتين', explanationEn: 'True Ikhfa of Noon before Sheen with light 2-count Ghunnah' },
          { text: 'رِّ مَا خَلَ', rule: 'normal' },
          { text: 'قَ', rule: 'qalqalah', explanationAr: 'قلقلة كبرى عند الوقف على القاف', explanationEn: 'Major Qalqalah upon pause' }
        ],
        audioHusary: 'https://everyayah.com/data/Husary_64kbps/113002.mp3',
        audioAlafasy: 'https://everyayah.com/data/Alafasy_64kbps/113002.mp3',
        audioAbdulbasit: 'https://everyayah.com/data/Abdul_Basit_Murattal_64kbps/113002.mp3',
        tajweedNotesAr: 'إخفاء النون الساكنة عند الشين بغنة حركتين، وترقيق راء (شرِّ) لكسرها، وتفخيم الخاء والقاف وقلقلتها عند الوقف.',
        tajweedNotesEn: 'Ikhfa with light Ghunnah on min-sharri; thin Raa due to kasrah; Qalqalah on Qaaf at end.',
      },
      {
        numberInSurah: 3,
        globalNumber: 6228,
        uthmaniText: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
        segments: [
          { text: 'وَمِ', rule: 'normal' },
          { text: 'ن شَ', rule: 'ikhfa', explanationAr: 'إخفاء حقيقي بغنة مرققة حركتين', explanationEn: 'True Ikhfa with 2-count Ghunnah' },
          { text: 'رِّ غَاسِ', rule: 'normal' },
          { text: 'قٍ إِ', rule: 'normal', explanationAr: 'إظهار حلقي لتنوين الكسر قبل همزة (إذا)', explanationEn: 'Izhar Halqi of tanween before Hamzah' },
          { text: 'ذَا وَقَ', rule: 'normal' },
          { text: 'بَ', rule: 'qalqalah', explanationAr: 'قلقلة كبرى عند الوقف على الباء', explanationEn: 'Major Qalqalah on Baa upon stopping' }
        ],
        audioHusary: 'https://everyayah.com/data/Husary_64kbps/113003.mp3',
        audioAlafasy: 'https://everyayah.com/data/Alafasy_64kbps/113003.mp3',
        audioAbdulbasit: 'https://everyayah.com/data/Abdul_Basit_Murattal_64kbps/113003.mp3',
        tajweedNotesAr: 'إخفاء في (ومن شر)، إظهار حلقي في (غاسقٍ إذا)، وقلقلة كبرى في باء (وقب).',
        tajweedNotesEn: 'Ikhfa in wa-min sharri, Izhar Halqi in ghasiqin idha, major Qalqalah on Baa.',
      },
      {
        numberInSurah: 4,
        globalNumber: 6229,
        uthmaniText: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
        segments: [
          { text: 'وَمِ', rule: 'normal' },
          { text: 'ن شَ', rule: 'ikhfa', explanationAr: 'إخفاء حقيقي بغنة حركتين', explanationEn: 'Ikhfa with Ghunnah' },
          { text: 'رِّ ', rule: 'normal' },
          { text: 'النَّ', rule: 'ghunnah', explanationAr: 'غنة النون المشددة أكمل ما تكون (حركتان)', explanationEn: 'Complete 2-count Ghunnah on doubled Noon' },
          { text: 'فَّاثَاتِ فِي الْعُقَ', rule: 'normal' },
          { text: 'دِ', rule: 'qalqalah', explanationAr: 'قلقلة كبرى عند الوقف على الدال', explanationEn: 'Major Qalqalah on Dal at pause' }
        ],
        audioHusary: 'https://everyayah.com/data/Husary_64kbps/113004.mp3',
        audioAlafasy: 'https://everyayah.com/data/Alafasy_64kbps/113004.mp3',
        audioAbdulbasit: 'https://everyayah.com/data/Abdul_Basit_Murattal_64kbps/113004.mp3',
        tajweedNotesAr: 'غنة مشددة أكمل ما تكون حركتين في نون (النفَّاثات)، وبيان همس ورخاوة الثاء الممدودة، وقلقلة الدال في (العُقد).',
        tajweedNotesEn: 'Full Ghunnah on doubled Noon; distinct whisper (Hams) on Thaa; Qalqalah on Dal.',
      },
      {
        numberInSurah: 5,
        globalNumber: 6230,
        uthmaniText: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
        segments: [
          { text: 'وَمِ', rule: 'normal' },
          { text: 'ن شَ', rule: 'ikhfa', explanationAr: 'إخفاء حقيقي بغنة حركتين', explanationEn: 'Ikhfa with Ghunnah' },
          { text: 'رِّ حَاسِ', rule: 'normal' },
          { text: 'دٍ إِ', rule: 'normal', explanationAr: 'إظهار حلقي للتنوين قبل الهمزة', explanationEn: 'Izhar Halqi before Hamzah' },
          { text: 'ذَا حَسَ', rule: 'normal' },
          { text: 'دَ', rule: 'qalqalah', explanationAr: 'قلقلة كبرى عند الوقف على الدال', explanationEn: 'Major Qalqalah on Dal' }
        ],
        audioHusary: 'https://everyayah.com/data/Husary_64kbps/113005.mp3',
        audioAlafasy: 'https://everyayah.com/data/Alafasy_64kbps/113005.mp3',
        audioAbdulbasit: 'https://everyayah.com/data/Abdul_Basit_Murattal_64kbps/113005.mp3',
        tajweedNotesAr: 'إخفاء في (ومن شر)، إظهار حلقي في (حاسدٍ إذا)، قلقلة الدال في (حسد).',
        tajweedNotesEn: 'Ikhfa in wa-min sharri, Izhar Halqi in hasidin idha, and major Qalqalah on Dal.',
      }
    ]
  },
  {
    number: 114,
    nameAr: 'سورة النَّاس',
    nameEn: 'An-Nas (Mankind)',
    revelationType: 'Meccan',
    revelationTypeAr: 'مكية',
    totalAyahs: 6,
    ayahs: [
      {
        numberInSurah: 1,
        globalNumber: 6231,
        uthmaniText: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
        segments: [
          { text: 'قُلْ أَعُوذُ بِرَبِّ ', rule: 'normal' },
          { text: 'النَّ', rule: 'ghunnah', explanationAr: 'غنة النون المشددة (حركتان)', explanationEn: 'Ghunnah of Mushaddadah Noon (2 counts)' },
          { text: 'ا', rule: 'madd', explanationAr: 'مد عارض للسكون (2 أو 4 أو 6 حركات)', explanationEn: 'Madd Arid li-Sukun' },
          { text: 'سِ', rule: 'normal' }
        ],
        audioHusary: 'https://everyayah.com/data/Husary_64kbps/114001.mp3',
        audioAlafasy: 'https://everyayah.com/data/Alafasy_64kbps/114001.mp3',
        audioAbdulbasit: 'https://everyayah.com/data/Abdul_Basit_Murattal_64kbps/114001.mp3',
        tajweedNotesAr: 'غنة أكمل ما تكون بمقدار حركتين في نون (الناس)، ومد عارض للسكون.',
        tajweedNotesEn: 'Complete 2-count Ghunnah in the doubled Noon of An-Nas.',
      },
      {
        numberInSurah: 2,
        globalNumber: 6232,
        uthmaniText: 'مَلِكِ النَّاسِ',
        segments: [
          { text: 'مَلِكِ ', rule: 'normal' },
          { text: 'النَّ', rule: 'ghunnah', explanationAr: 'غنة مشددة بمقدار حركتين', explanationEn: '2-count Ghunnah' },
          { text: 'ا', rule: 'madd', explanationAr: 'مد عارض للسكون', explanationEn: 'Madd Arid' },
          { text: 'سِ', rule: 'normal' }
        ],
        audioHusary: 'https://everyayah.com/data/Husary_64kbps/114002.mp3',
        audioAlafasy: 'https://everyayah.com/data/Alafasy_64kbps/114002.mp3',
        audioAbdulbasit: 'https://everyayah.com/data/Abdul_Basit_Murattal_64kbps/114002.mp3',
        tajweedNotesAr: 'كسر كاف (ملكِ) من غير إشباع، وغنة النون المشددة حركتين.',
        tajweedNotesEn: 'Clear Kasrah on Kaaf; full Ghunnah on doubled Noon.',
      },
      {
        numberInSurah: 3,
        globalNumber: 6233,
        uthmaniText: 'إِلَٰهِ النَّاسِ',
        segments: [
          { text: 'إِلَٰهِ ', rule: 'normal' },
          { text: 'النَّ', rule: 'ghunnah', explanationAr: 'غنة مشددة حركتين', explanationEn: '2-count Ghunnah' },
          { text: 'ا', rule: 'madd', explanationAr: 'مد عارض للسكون', explanationEn: 'Madd Arid' },
          { text: 'سِ', rule: 'normal' }
        ],
        audioHusary: 'https://everyayah.com/data/Husary_64kbps/114003.mp3',
        audioAlafasy: 'https://everyayah.com/data/Alafasy_64kbps/114003.mp3',
        audioAbdulbasit: 'https://everyayah.com/data/Abdul_Basit_Murattal_64kbps/114003.mp3',
        tajweedNotesAr: 'تحقيق كسر الهمزة في (إلٰه)، وإثبات الألف الخنجرية حركتين، وغنة النون المشددة.',
        tajweedNotesEn: 'Precise Kasrah on Hamzah; natural 2-count Madd on small Alif; full Ghunnah.',
      },
      {
        numberInSurah: 4,
        globalNumber: 6234,
        uthmaniText: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
        segments: [
          { text: 'مِ', rule: 'normal' },
          { text: 'ن شَ', rule: 'ikhfa', explanationAr: 'إخفاء حقيقي للنون الساكنة عند الشين بغنة حركتين', explanationEn: 'True Ikhfa of Noon before Sheen' },
          { text: 'رِّ الْوَسْوَاسِ الْ', rule: 'normal' },
          { text: 'خَ', rule: 'normal', explanationAr: 'تفخيم الخاء من أدنى الحلق', explanationEn: 'Tafkheem on Khaa' },
          { text: 'نَّ', rule: 'ghunnah', explanationAr: 'غنة النون المشددة حركتين', explanationEn: '2-count Ghunnah on doubled Noon' },
          { text: 'ا', rule: 'madd', explanationAr: 'مد عارض للسكون', explanationEn: 'Madd Arid' },
          { text: 'سِ', rule: 'normal' }
        ],
        audioHusary: 'https://everyayah.com/data/Husary_64kbps/114004.mp3',
        audioAlafasy: 'https://everyayah.com/data/Alafasy_64kbps/114004.mp3',
        audioAbdulbasit: 'https://everyayah.com/data/Abdul_Basit_Murattal_64kbps/114004.mp3',
        tajweedNotesAr: 'إخفاء حقيقي في (من شر)، بيان الصفير والهمس في السينين في (الوسواس)، تفخيم الخاء، وغنة النون المشددة في (الخنَّاس).',
        tajweedNotesEn: 'Ikhfa in min-sharri; sharp sibilance (Safeer) on Seen; Tafkheem on Khaa; full Ghunnah on doubled Noon.',
      },
      {
        numberInSurah: 5,
        globalNumber: 6235,
        uthmaniText: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ',
        segments: [
          { text: 'الَّذِي يُوَسْوِسُ فِي ', rule: 'normal' },
          { text: 'صُ', rule: 'normal', explanationAr: 'تفخيم الصاد المضمومة من حروف الاستعلاء والإطباق', explanationEn: 'Tafkheem and Itbaq on Saad' },
          { text: 'دُورِ ', rule: 'normal', explanationAr: 'ترقيق الدال لتفادي تفخيمها لمجاورة الصاد', explanationEn: 'Careful Tarqeeq on Dal adjacent to heavy Saad' },
          { text: 'النَّ', rule: 'ghunnah', explanationAr: 'غنة النون المشددة حركتين', explanationEn: '2-count Ghunnah' },
          { text: 'ا', rule: 'madd', explanationAr: 'مد عارض للسكون', explanationEn: 'Madd Arid' },
          { text: 'سِ', rule: 'normal' }
        ],
        audioHusary: 'https://everyayah.com/data/Husary_64kbps/114005.mp3',
        audioAlafasy: 'https://everyayah.com/data/Alafasy_64kbps/114005.mp3',
        audioAbdulbasit: 'https://everyayah.com/data/Abdul_Basit_Murattal_64kbps/114005.mp3',
        tajweedNotesAr: 'إخراج الذال من مخرجها دون تحويلها لزاي، وتفخيم الصاد وترقيق الدال المجاورة لها في (صدور)، وغنة النون المشددة.',
        tajweedNotesEn: 'Accurate Dhal articulation; maintain heavy Saad while keeping the following Dal thin; full Ghunnah.',
      },
      {
        numberInSurah: 6,
        globalNumber: 6236,
        uthmaniText: 'مِنَ الْجِنَّةِ وَالنَّاسِ',
        segments: [
          { text: 'مِنَ الْجِ', rule: 'normal' },
          { text: 'نَّ', rule: 'ghunnah', explanationAr: 'غنة النون المشددة أكمل ما تكون (حركتان)', explanationEn: 'Complete 2-count Ghunnah on doubled Noon' },
          { text: 'ةِ وَ', rule: 'normal' },
          { text: 'النَّ', rule: 'ghunnah', explanationAr: 'غنة النون المشددة (حركتان)', explanationEn: '2-count Ghunnah' },
          { text: 'ا', rule: 'madd', explanationAr: 'مد عارض للسكون', explanationEn: 'Madd Arid' },
          { text: 'سِ', rule: 'normal' }
        ],
        audioHusary: 'https://everyayah.com/data/Husary_64kbps/114006.mp3',
        audioAlafasy: 'https://everyayah.com/data/Alafasy_64kbps/114006.mp3',
        audioAbdulbasit: 'https://everyayah.com/data/Abdul_Basit_Murattal_64kbps/114006.mp3',
        tajweedNotesAr: 'غنة أكمل ما تكون في نون (الجِنَّة) ونون (الناس) بمقدار حركتين لكل منهما، مع مد عارض للسكون عند الوقف.',
        tajweedNotesEn: 'Two distinct complete 2-count Ghunnahs in Al-Jinnah and An-Nas; Madd Arid at final pause.',
      },
    ]
  }
];

// Complete 114-Surah catalog
export const ALL_SURAHS: SurahMeta[] = (quranFullJson as any[]).map((s) => ({
  number: s.number,
  nameAr: s.nameAr,
  nameEn: s.nameEn,
  nameTranslation: s.nameTranslation,
  revelationType: s.revelationType,
  revelationTypeAr: s.revelationTypeAr,
  totalAyahs: s.totalAyahs,
}));

export function getAyahAudioUrl(
  surahNumber: number,
  ayahNumber: number,
  reciter: 'husary' | 'alafasy' | 'abdulbasit' = 'husary'
): string {
  const s = String(surahNumber).padStart(3, '0');
  const a = String(ayahNumber).padStart(3, '0');
  const reciterFolder =
    reciter === 'alafasy'
      ? 'Alafasy_64kbps'
      : reciter === 'abdulbasit'
      ? 'Abdul_Basit_Murattal_64kbps'
      : 'Husary_64kbps';
  return `https://everyayah.com/data/${reciterFolder}/${s}${a}.mp3`;
}

// Map for fast featured surah lookup
const FEATURED_MAP = new Map<number, Surah>();
FEATURED_SURAHS.forEach((s) => FEATURED_MAP.set(s.number, s));

// In-memory cache for dynamic full surahs
const FULL_SURAHS_CACHE = new Map<number, Surah>();

export function getFullSurah(surahNumber: number): Surah {
  // If featured, return enriched version
  if (FEATURED_MAP.has(surahNumber)) {
    return FEATURED_MAP.get(surahNumber)!;
  }

  // If already built in cache, return
  if (FULL_SURAHS_CACHE.has(surahNumber)) {
    return FULL_SURAHS_CACHE.get(surahNumber)!;
  }

  // Find in full JSON dataset
  const rawSurah = (quranFullJson as any[]).find((s) => s.number === surahNumber);
  if (!rawSurah) {
    return FEATURED_SURAHS[0];
  }

  const ayahs: Ayah[] = rawSurah.ayahs.map((a: any) => ({
    numberInSurah: a.numberInSurah,
    globalNumber: a.globalNumber,
    uthmaniText: a.text,
    segments: parseUniversalTajweed(a.text),
    audioHusary: getAyahAudioUrl(surahNumber, a.numberInSurah, 'husary'),
    audioAlafasy: getAyahAudioUrl(surahNumber, a.numberInSurah, 'alafasy'),
    audioAbdulbasit: getAyahAudioUrl(surahNumber, a.numberInSurah, 'abdulbasit'),
    tajweedNotesAr: `أحكام التجويد ومخارج الحروف للآية ${a.numberInSurah} من ${rawSurah.nameAr}.`,
    tajweedNotesEn: `Tajweed rules and articulation guide for Ayah ${a.numberInSurah} of ${rawSurah.nameEn}.`,
  }));

  const built: Surah = {
    number: rawSurah.number,
    nameAr: rawSurah.nameAr,
    nameEn: rawSurah.nameEn,
    revelationType: rawSurah.revelationType,
    revelationTypeAr: rawSurah.revelationTypeAr,
    totalAyahs: rawSurah.totalAyahs,
    ayahs,
  };

  FULL_SURAHS_CACHE.set(surahNumber, built);
  return built;
}
