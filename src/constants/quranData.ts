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
          { text: 'ا', rule: 'madd', explanationAr: 'مد عارض للسكون', explanationEn: 'Madd Arid li-Sukun' },
          { text: 'سِ', rule: 'normal' }
        ],
        audioHusary: 'https://everyayah.com/data/Husary_64kbps/114001.mp3',
        audioAlafasy: 'https://everyayah.com/data/Alafasy_64kbps/114001.mp3',
        audioAbdulbasit: 'https://everyayah.com/data/Abdul_Basit_Murattal_64kbps/114001.mp3',
        tajweedNotesAr: 'غنة أكمل ما تكون بمقدار حركتين في نون (الناس)',
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
        tajweedNotesAr: 'كسر كاف (ملكِ) من غير إشباع، وغنة النون المشددة',
        tajweedNotesEn: 'Clear Kasrah on Kaaf; full Ghunnah on doubled Noon.',
      }
    ]
  }
];
