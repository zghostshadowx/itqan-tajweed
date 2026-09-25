import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ayah } from '../constants/quranData';
import { CloudPoolService } from './cloudPoolConfig';

export interface MakhrajEvaluationItem {
  letter: string;
  makhrajZoneAr: string;
  makhrajZoneEn: string;
  status: 'passed' | 'warning' | 'needs_practice';
  commentAr: string;
  commentEn: string;
  anatomicalTipAr: string;
  anatomicalTipEn: string;
}

export interface TajweedRuleEvaluationItem {
  ruleNameAr: string;
  ruleNameEn: string;
  status: 'passed' | 'warning' | 'needs_practice';
  scorePercent: number;
  feedbackAr: string;
  feedbackEn: string;
}

export interface LahnAudit {
  status: 'clean' | 'lahn_khafi' | 'lahn_jali';
  titleAr: string;
  titleEn: string;
  detailAr: string;
  detailEn: string;
}

export interface AIEvaluationReport {
  overallScore: number; // 0 - 100
  accuracyGrade: 'excellent' | 'very_good' | 'needs_practice' | 'failed';
  ayahEvaluated: Ayah;
  timestamp: string;
  transcribedText?: string;
  makharijResults: MakhrajEvaluationItem[];
  tajweedResults: TajweedRuleEvaluationItem[];
  lahnAudit: LahnAudit;
  generalAdviceAr: string;
  generalAdviceEn: string;
}

export class AITajweedService {
  private static geminiApiKey: string = '';
  private static builtInPoolEnabled: boolean = true;
  private static readonly GEMINI_STORAGE_KEY = '@itqan_gemini_api_key';

  public static async init(): Promise<string> {
    try {
      await CloudPoolService.loadGoogleSession();
      const key = await AsyncStorage.getItem(this.GEMINI_STORAGE_KEY);
      if (key) {
        this.geminiApiKey = key.trim();
        return this.geminiApiKey;
      }
    } catch (e) {
      console.warn('Error reading stored Gemini key:', e);
    }
    return '';
  }

  public static isZeroConfigReady(): boolean {
    return this.builtInPoolEnabled || Boolean(this.geminiApiKey);
  }

  public static setBuiltInPoolEnabled(enabled: boolean): void {
    this.builtInPoolEnabled = enabled;
  }

  public static getGeminiApiKey(): string {
    return this.geminiApiKey;
  }

  public static async setGeminiApiKey(key: string): Promise<void> {
    this.geminiApiKey = key.trim();
    try {
      if (this.geminiApiKey) {
        await AsyncStorage.setItem(this.GEMINI_STORAGE_KEY, this.geminiApiKey);
      } else {
        await AsyncStorage.removeItem(this.GEMINI_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Error storing Gemini key:', e);
    }
  }

  /**
   * Maps common Islamic and Quranic transliterated Latin terms into Arabic script
   * (e.g. "bismillah" -> "بسم الله", "alhamdulillah" -> "الحمد لله", "ar-rahman" -> "الرحمن").
   */
  public static transliterateIslamicTermsToArabic(text: string): string {
    if (!text) return '';
    let res = text.toLowerCase();

    res = res
      .replace(/\bbismillah(?:ir|er)?[\s-]*(?:rahman|rehman)[\s-]*(?:ir|er)?[\s-]*(?:rahim|raheem)\b/gi, 'بسم الله الرحمن الرحيم')
      .replace(/\bbism(?:[\s-]*allah|illah|illahi)?\b/gi, 'بسم الله')
      .replace(/\bal[\s-]*hamdulillah\b/gi, 'الحمد لله')
      .replace(/\brabb(?:il|ul)?[\s-]*(?:'alameen|alameen|alamin|'alamin)\b/gi, 'رب العالمين')
      .replace(/\bar[\s-]*(?:rahman|rehman)\b/gi, 'الرحمن')
      .replace(/\bar[\s-]*(?:rahim|raheem)\b/gi, 'الرحيم')
      .replace(/\bmaliki?[\s-]*yawm(?:id|ed)?[\s-]*deen\b/gi, 'مالك يوم الدين')
      .replace(/\biyyaka[\s-]*na'budu\b/gi, 'إياك نعبد')
      .replace(/\bwa[\s-]*iyyaka[\s-]*nasta'in\b/gi, 'وإياك نستعين')
      .replace(/\bihdina[\s-]*as[\s-]*sirat[\s-]*al[\s-]*mustaqim\b/gi, 'اهدنا الصراط المستقيم')
      .replace(/\balladhina[\s-]*an'amta[\s-]*alayhim\b/gi, 'الذين أنعمت عليهم')
      .replace(/\bghayril[\s-]*maghdubi[\s-]*alayhim\b/gi, 'غير المغضوب عليهم')
      .replace(/\bwa[\s-]*lad[\s-]*dallin\b/gi, 'ولا الضالين')
      .replace(/\ballah\b/gi, 'الله')
      .replace(/\brabb\b/gi, 'رب')
      .replace(/\bqul\b/gi, 'قل')
      .replace(/\ba'udhu\b/gi, 'أعوذ')
      .replace(/\bmin[\s-]*sharri\b/gi, 'من شر')
      .replace(/\bma[\s-]*khalaq\b/gi, 'ما خلق')
      .replace(/\bal[\s-]*falaq\b/gi, 'الفلق')
      .replace(/\ban[\s-]*nas\b/gi, 'الناس');

    return res;
  }

  /**
   * Normalizes Arabic text by mapping transliterations, removing diacritics, Quranic marks, and standardizing letters.
   */
  public static normalizeArabicText(text: string): string {
    if (!text) return '';
    const transliterated = this.transliterateIslamicTermsToArabic(text);
    return transliterated
      // Remove diacritics / tashkeel
      .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
      // Remove Quranic annotation signs
      .replace(/[\u0610-\u061A\u06D6-\u06ED]/g, '')
      // Standardize Alef variations (أ, إ, آ, ٱ -> ا)
      .replace(/[أإآٱ]/g, 'ا')
      // Standardize Taa Marbuta (ة -> ه)
      .replace(/ة/g, 'ه')
      // Standardize Yaa / Alif Maqsura (ى -> ي)
      .replace(/ى/g, 'ي')
      // Standardize Hamza on Waw / Nabrah
      .replace(/ؤ/g, 'و')
      .replace(/ئ/g, 'ي')
      // Remove punctuation, brackets, symbols, english chars, digits
      .replace(/[.,/#!$%^&*;:{}=\-_`~()؟،«»"'\d]/g, ' ')
      // Collapse multiple whitespaces
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Validates whether the spoken text matches the chosen target verse.
   * Accurately recognizes Quranic words, transliterated Islamic terms (e.g. "bismillah"),
   * while rejecting unrelated English/foreign words (e.g. "banana").
   */
  public static verifyRecitationMatches(spokenText: string, targetVerse: string): boolean {
    if (!spokenText || !targetVerse) return false;

    const normSpoken = this.normalizeArabicText(spokenText);
    const normTarget = this.normalizeArabicText(targetVerse);

    // If after transliteration expansion it contains no Arabic words at all, it's pure non-Quranic speech (e.g. "banana")
    if (!/[\u0600-\u06FF]/.test(normSpoken)) {
      return false;
    }

    if (!normSpoken) return false;

    const spokenWords = normSpoken.split(' ').filter((w) => w.length > 0 && /[\u0600-\u06FF]/.test(w));
    const targetWords = normTarget.split(' ').filter((w) => w.length > 0 && /[\u0600-\u06FF]/.test(w));

    if (targetWords.length === 0) return true;
    if (spokenWords.length === 0) return false;

    // Count how many target words match spoken words
    let matchedCount = 0;
    for (const tWord of targetWords) {
      const found = spokenWords.some(
        (sWord) => sWord === tWord || sWord.includes(tWord) || tWord.includes(sWord)
      );
      if (found) {
        matchedCount++;
      }
    }

    // At least 1 target word must match to be considered an authentic attempt of this verse
    return matchedCount >= 1;
  }

  private static async uriToBase64(
    uri: string
  ): Promise<{ base64: string; mimeType: string } | null> {
    try {
      const res = await fetch(uri);
      const blob = await res.blob();
      if (!blob || blob.size < 1200) {
        console.warn('Audio blob is empty or below threshold:', blob?.size);
        return null;
      }
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          if (result && typeof result === 'string') {
            const split = result.split(',');
            if (split.length === 2) {
              const match = split[0].match(/:(.*?);/);
              let mimeType = match ? match[1] : 'audio/mp4';
              if (mimeType.includes(';')) mimeType = mimeType.split(';')[0].trim();
              resolve({ base64: split[1], mimeType });
              return;
            }
          }
          resolve(null);
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.warn('Audio base64 conversion fallback:', err);
      return null;
    }
  }

  /**
   * Calls Google Gemini Flash Audio API with strict, uncompromised scholarly evaluation criteria.
   * Tries gemini-2.0-flash, then falls back to gemini-1.5-flash.
   */
  public static async evaluateWithGemini(
    ayah: Ayah,
    audioBase64: string,
    mimeType: string = 'audio/mp4'
  ): Promise<AIEvaluationReport | null> {
    if (!this.geminiApiKey) return null;

    let cleanMime = mimeType ? mimeType.split(';')[0].trim() : 'audio/mp4';
    if (!cleanMime.startsWith('audio/')) cleanMime = 'audio/mp4';

    const modelsToTry = [
      'gemini-2.5-flash',
      'gemini-2.5-flash-lite',
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-3.8-flash',
      'gemini-3.5-flash-lite',
      'gemini-3.1-flash-lite',
    ];

    for (const model of modelsToTry) {
      try {
        // Key travels in the header, never the URL, so it cannot leak into proxy/server logs
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
        const prompt = `You are a certified Master Sheikh of Quranic Recitation (شيخ مقرئ مجاز بالسند المتصل برواية حفص عن عاصم).
A student recorded their voice reciting after the reciter for this target Quranic Ayah:
"${ayah.uthmaniText}"

MANDATORY TASK 1 - AUDIO TRANSCRIPTION:
Listen to the student's audio recording carefully and transcribe exactly what words the student spoke into the "transcribedText" field.
- If the student spoke in English or non-Arabic words (for example: "banana", "hello", "car"), transcribe those exact English words into "transcribedText".
- If the student spoke Arabic words, transcribe those exact Arabic words with tashkeel into "transcribedText".
- If the audio is silent or contains only breathing or background noise, set "transcribedText" to "".

MANDATORY TASK 2 - COMPARISON & ACCURACY EVALUATION:
Compare what was spoken ("transcribedText") against the target Ayah ("${ayah.uthmaniText}").

CASE A - UNRELATED WORDS, ENGLISH, OR SILENCE (e.g. "banana", "hello", or non-Quranic speech):
You MUST return:
- "overallScore": 0
- "accuracyGrade": "failed"
- "lahnAudit": {
    "status": "lahn_jali",
    "titleAr": "خطأ جلي: الكلمات المنطوقة لا تطابق الآية المختارة 🛑",
    "titleEn": "Major Error: Spoken Words Do Not Match Chosen Verse",
    "detailAr": "لقد نطقت: \\"" + (transcribedText || 'كلام غير مفهوم') + "\\" بينما الآية المطلوبة هي: \\"" + "${ayah.uthmaniText}" + "\\". القراءة مرفوضة تماماً.",
    "detailEn": "You said: \\"" + (transcribedText || 'unrelated speech') + "\\". The target verse is: \\"" + "${ayah.uthmaniText}" + "\\". Spoken words do not match the chosen verse."
  }
- "makharijResults": []
- "tajweedResults": []
- "generalAdviceAr": "يرجى قراءة الآية القرآنية المطلوبة فقط والاستماع للشيخ المقرئ قبل التسجيل."
- "generalAdviceEn": "Please recite only the chosen Quranic verse and listen to the reciter before recording."

CASE B - PARTIAL VERSE RECITATION (The student recited part of this verse, e.g. 1 or 2 words from this Ayah, or skipped words):
Return:
- "overallScore": between 45 and 65 (reward words recited correctly, but deduct for missing words)
- "accuracyGrade": "needs_practice"
- "lahnAudit": {
    "status": "lahn_khafi",
    "titleAr": "تلاوة غير مكتملة للآية الكريمة ⚠️",
    "titleEn": "Incomplete Recitation of Target Verse",
    "detailAr": "لقد قرأت جزءاً من الآية الكريمة ('" + (transcribedText || '') + "') ونقصت بقية الكلمات. يرجى تلاوة الآية كاملة: '" + "${ayah.uthmaniText}" + "'.",
    "detailEn": "You recited part of the verse ('" + (transcribedText || '') + "') but missed some words. Please recite the complete verse: '" + "${ayah.uthmaniText}" + "'."
  }
- "generalAdviceAr": "أحسنت في قراءة الكلمات المنطوقة، لكن احرص على تلاوة الآية كاملة من أولها إلى آخرها."
- "generalAdviceEn": "Good effort reciting part of the verse. Please make sure to recite the entire verse from start to end."
- Evaluate Makharij and Tajweed for the words and letters actually spoken!

CASE C - COMPLETE VERSE RECITATION:
Evaluate rigorously according to Hafs rules:
1. اللحن الجلي (Major Mistake): Changing any letter, changing/dropping a harakah, missing Shaddah -> score 50-69, status "lahn_jali".
2. اللحن الخفي (Subtle Mistake): Short Madd duration, incomplete Ghunnah (< 2 counts), improper Qalqalah -> score 70-87, status "lahn_khafi".
3. Accurate Recitation: score 88-100, status "clean", accuracyGrade "excellent".

Respond ONLY with a JSON object matching this exact schema:
{
  "transcribedText": "string",
  "overallScore": number (0-100),
  "accuracyGrade": "excellent" | "very_good" | "needs_practice" | "failed",
  "lahnAudit": {
    "status": "clean" | "lahn_khafi" | "lahn_jali",
    "titleAr": "string",
    "titleEn": "string",
    "detailAr": "string",
    "detailEn": "string"
  },
  "generalAdviceAr": "string",
  "generalAdviceEn": "string",
  "makharijResults": [
    {
      "letter": "string",
      "makhrajZoneAr": "string",
      "makhrajZoneEn": "string",
      "status": "passed" | "warning" | "needs_practice",
      "commentAr": "string",
      "commentEn": "string",
      "anatomicalTipAr": "string",
      "anatomicalTipEn": "string"
    }
  ],
  "tajweedResults": [
    {
      "ruleNameAr": "string",
      "ruleNameEn": "string",
      "status": "passed" | "warning" | "needs_practice",
      "scorePercent": number,
      "feedbackAr": "string",
      "feedbackEn": "string"
    }
  ]
}`;

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': this.geminiApiKey,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: prompt },
                  {
                    inlineData: {
                      mimeType: cleanMime,
                      data: audioBase64,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.1,
            },
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          console.warn(`Gemini API ${model} failed (${response.status}):`, errText);
          continue;
        }

        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) continue;

        let cleanJson = rawText.trim();
        if (cleanJson.startsWith('```')) {
          cleanJson = cleanJson.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
        }

        const parsed = JSON.parse(cleanJson);
        const transcribed = (parsed.transcribedText || '').trim();

        // Secondary deterministic client-side validation on Gemini response
        const isMatched = this.verifyRecitationMatches(transcribed, ayah.uthmaniText);

        if (transcribed && !isMatched) {
          parsed.overallScore = 0;
          parsed.accuracyGrade = 'failed';
          parsed.lahnAudit = {
            status: 'lahn_jali',
            titleAr: 'خطأ جلي: الكلمات المنطوقة لا تطابق الآية المختارة 🛑',
            titleEn: 'Major Error: Spoken Words Do Not Match Chosen Verse',
            detailAr: `لقد نطقت: "${transcribed}". بينما الآية المطلوبة هي: "${ayah.uthmaniText}". القراءة مرفوضة تماماً لمخالفتها الآية.`,
            detailEn: `You said: "${transcribed}". The target chosen verse is: "${ayah.uthmaniText}". Spoken words do not match the chosen verse. Recitation rejected.`,
          };
          parsed.makharijResults = [];
          parsed.tajweedResults = [];
          parsed.generalAdviceAr = 'يرجى قراءة الآية القرآنية المطلوبة فقط والاستماع للشيخ المقرئ قبل التسجيل.';
          parsed.generalAdviceEn = 'Please recite only the chosen Quranic verse and listen to the reciter before recording.';
        }

        return {
          ...parsed,
          transcribedText: transcribed,
          ayahEvaluated: ayah,
          timestamp: new Date().toISOString(),
        };
      } catch (err) {
        console.warn(`Gemini model ${model} execution error:`, err);
      }
    }

    return null;
  }

  /**
   * Built-in Zero-Config Cloud AI Pool Evaluator.
   * Ensures elderly and non-technical users get immediate, authentic AI recitation evaluation
   * out-of-the-box without manually configuring an API key in Settings.
   */
  public static async evaluateWithBuiltInCloudPool(
    ayah: Ayah,
    audioBase64: string,
    mimeType: string = 'audio/mp4',
    clientTranscript?: string
  ): Promise<AIEvaluationReport | null> {
    if (!this.builtInPoolEnabled) return null;

    const creds = CloudPoolService.getBuiltInCloudCredentials();
    const audioFormat = mimeType.includes('wav')
      ? 'wav'
      : mimeType.includes('mp3') || mimeType.includes('mpeg')
      ? 'mp3'
      : 'mp4';

    const prompt = `You are a certified Master Sheikh of Quranic Recitation (شيخ مقرئ مجاز بالسند المتصل برواية حفص عن عاصم).
Target Quranic Ayah: "${ayah.uthmaniText}"
${clientTranscript ? `Client speech recognizer detected: "${clientTranscript}"` : ''}
Transcribe the student's spoken words into "transcribedText" and evaluate strictly against "${ayah.uthmaniText}".
If unrelated words/English/silence -> overallScore 0, accuracyGrade "failed", lahnAudit status "lahn_jali".
If partial verse -> overallScore 45-65, accuracyGrade "needs_practice", lahnAudit status "lahn_khafi".
If complete verse -> overallScore 88-100 (or 50-87 if Tajweed/Makharij errors), evaluate Makharij and Tajweed rules accurately.
Respond ONLY with valid JSON matching schema: {transcribedText, overallScore, accuracyGrade, lahnAudit:{status,titleAr,titleEn,detailAr,detailEn}, generalAdviceAr, generalAdviceEn, makharijResults:[{letter,makhrajZoneAr,makhrajZoneEn,status,commentAr,commentEn,anatomicalTipAr,anatomicalTipEn}], tajweedResults:[{ruleNameAr,ruleNameEn,status,scorePercent,feedbackAr,feedbackEn}]}.`;

    const poolModels = [
      {
        url: 'https://openrouter.ai/api/v1/chat/completions',
        key: creds.openRouterKey,
        model: 'google/gemini-2.0-flash-001',
      },
      {
        url: 'https://openrouter.ai/api/v1/chat/completions',
        key: creds.openRouterKey,
        model: 'google/gemini-2.5-flash',
      },
      {
        url: 'https://api.openai.com/v1/chat/completions',
        key: creds.openAiKey,
        model: 'gpt-4o-audio-preview',
      },
    ];

    for (const provider of poolModels) {
      if (!provider.key) continue;
      try {
        const response = await fetch(provider.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${provider.key}`,
          },
          body: JSON.stringify({
            model: provider.model,
            temperature: 0.1,
            messages: [
              {
                role: 'user',
                content: [
                  { type: 'text', text: prompt },
                  {
                    type: 'input_audio',
                    input_audio: {
                      data: audioBase64,
                      format: audioFormat,
                    },
                  },
                ],
              },
            ],
          }),
        });

        if (!response.ok) continue;
        const data = await response.json();
        const rawText = data?.choices?.[0]?.message?.content;
        if (!rawText) continue;

        let cleanJson = rawText.trim();
        if (cleanJson.startsWith('```')) {
          cleanJson = cleanJson.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
        }
        const parsed = JSON.parse(cleanJson);
        const transcribed = (parsed.transcribedText || clientTranscript || '').trim();
        const isMatched = this.verifyRecitationMatches(transcribed, ayah.uthmaniText);

        if (transcribed && !isMatched) {
          parsed.overallScore = 0;
          parsed.accuracyGrade = 'failed';
          parsed.lahnAudit = {
            status: 'lahn_jali',
            titleAr: 'خطأ جلي: الكلمات المنطوقة لا تطابق الآية المختارة 🛑',
            titleEn: 'Major Error: Spoken Words Do Not Match Chosen Verse',
            detailAr: `لقد نطقت: "${transcribed}". بينما الآية المطلوبة هي: "${ayah.uthmaniText}". القراءة مرفوضة تماماً لمخالفتها الآية.`,
            detailEn: `You said: "${transcribed}". The target chosen verse is: "${ayah.uthmaniText}". Spoken words do not match the chosen verse. Recitation rejected.`,
          };
          parsed.makharijResults = [];
          parsed.tajweedResults = [];
        }

        return {
          ...parsed,
          transcribedText: transcribed,
          ayahEvaluated: ayah,
          timestamp: new Date().toISOString(),
        };
      } catch (e) {
        console.warn(`Built-in pool model ${provider.model} failed:`, e);
      }
    }

    return null;
  }

  /**
   * Honest, uncompromised evaluation.
   * Analyzes the student's recitation rigorously without sugarcoating.
   */
  public static async evaluateRecitation(
    ayah: Ayah,
    audioUri: string | null,
    clientTranscript?: string
  ): Promise<AIEvaluationReport> {
    // Ensure Gemini key is initialized from storage if not already loaded in memory
    if (!this.geminiApiKey) {
      await this.init();
    }

    const rawTranscript = (clientTranscript || '').trim();

    // Check 1: Zero Audio / No Permission / Cancelled
    if (!audioUri) {
      return {
        overallScore: 0,
        accuracyGrade: 'failed',
        ayahEvaluated: ayah,
        timestamp: new Date().toISOString(),
        transcribedText: rawTranscript || undefined,
        makharijResults: [],
        tajweedResults: [],
        lahnAudit: {
          status: 'lahn_jali',
          titleAr: 'لم يتم رصد تلاوة صوتية (صوت صامت) ⚠️',
          titleEn: 'No Recitation Detected (Silence)',
          detailAr: 'لم يتم تسجيل أي صوت للآية الكريمة، أو أن التسجيل أُوقف فوراً دون نطق. يرجى التحدث بوضوح بعد الضغط على زر الميكروفون.',
          detailEn: 'No audio was recorded or the recording was stopped prematurely. Please recite the verse clearly after tapping the microphone.',
        },
        generalAdviceAr: 'اضغط على زر الميكروفون واقرأ الآية بصوت مسموع وواضح بعد استماعك للشيخ.',
        generalAdviceEn: 'Tap the mic button and recite the verse clearly after listening to the reciter.',
      };
    }

    // Check 2: Convert Audio to Base64 & Inspect Audio Content
    const audioData = await this.uriToBase64(audioUri);
    if (!audioData || audioData.base64.length < 2500) {
      return {
        overallScore: 0,
        accuracyGrade: 'failed',
        ayahEvaluated: ayah,
        timestamp: new Date().toISOString(),
        transcribedText: rawTranscript || undefined,
        makharijResults: [],
        tajweedResults: [],
        lahnAudit: {
          status: 'lahn_jali',
          titleAr: 'التسجيل الصوتي فارغ أو قصير جداً ⚠️',
          titleEn: 'Recording Too Short or Empty',
          detailAr: 'التسجيل الصوتي أقل من ثانية أو فارغ تماماً ولم يتم رصد أي كلمات قرآنية منطوقة.',
          detailEn: 'Recording was under 1 second or empty. No Quranic words were detected in the audio.',
        },
        generalAdviceAr: 'تأكد من إذن الميكروفون، واقرأ الآية كاملة بتمهل وتأنٍ من بدايتها إلى نهايتها.',
        generalAdviceEn: 'Check microphone permissions and recite the full verse at a steady pace.',
      };
    }

    // Tier 1: If user configured a personal Gemini key, attempt direct Gemini Cloud AI evaluation
    if (this.geminiApiKey) {
      try {
        const geminiReport = await this.evaluateWithGemini(
          ayah,
          audioData.base64,
          audioData.mimeType
        );
        if (geminiReport) {
          if (!geminiReport.transcribedText && rawTranscript) {
            geminiReport.transcribedText = rawTranscript;
          }
          return geminiReport;
        }
      } catch (err) {
        console.warn('Personal Gemini key evaluation fallback to built-in cloud pool:', err);
      }
    }

    // Tier 2: Built-in Zero-Config Cloud AI Pool (works automatically for all users out-of-the-box!)
    if (this.builtInPoolEnabled) {
      try {
        const poolReport = await this.evaluateWithBuiltInCloudPool(
          ayah,
          audioData.base64,
          audioData.mimeType,
          rawTranscript
        );
        if (poolReport) {
          return poolReport;
        }
      } catch (err) {
        console.warn('Built-in cloud pool evaluation error:', err);
      }
    }

    // Failsafe Guard: If both personal key and built-in pool are disabled
    if (!this.geminiApiKey && !this.builtInPoolEnabled) {
      return {
        overallScore: 0,
        accuracyGrade: 'failed',
        ayahEvaluated: ayah,
        timestamp: new Date().toISOString(),
        transcribedText: rawTranscript || undefined,
        makharijResults: [],
        tajweedResults: [],
        lahnAudit: {
          status: 'lahn_jali',
          titleAr: 'مطلوب تفعيل مفتاح Gemini السحابي 🔑',
          titleEn: 'Cloud AI Key Required for Verse Verification',
          detailAr: 'لتدقيق كلمات التلاوة ومقارنتها بالآية المختارة بالذكاء الاصطناعي، يرجى تفعيل مفتاح Google Gemini المجاني في شاشة الإعدادات.',
          detailEn: 'To transcribe and strictly verify your spoken words against the chosen verse, please enter your free Google Gemini API key in Settings.',
        },
        generalAdviceAr: 'انتقل إلى شاشة الإعدادات وفعّل مفتاح Google Gemini API المجاني لتمكين تدقيق التلاوة الصوتي المباشر.',
        generalAdviceEn: 'Go to Settings and add your free Google Gemini API key to enable speech-to-verse verification.',
      };
    }

    // If Gemini was unreachable, verify whether we have a confirmed matching client transcript or valid audio
    const isClientVerified = rawTranscript ? this.verifyRecitationMatches(rawTranscript, ayah.uthmaniText) : true;

    if (!isClientVerified) {
      return {
        overallScore: 0,
        accuracyGrade: 'failed',
        ayahEvaluated: ayah,
        timestamp: new Date().toISOString(),
        transcribedText: rawTranscript || undefined,
        makharijResults: [],
        tajweedResults: [],
        lahnAudit: {
          status: 'lahn_jali',
          titleAr: 'خطأ جلي: الكلمات المنطوقة لا تطابق الآية المختارة 🛑',
          titleEn: 'Major Error: Spoken Words Do Not Match Chosen Verse',
          detailAr: `لقد تم رصد نطق: "${rawTranscript}". بينما الآية المطلوبة هي: "${ayah.uthmaniText}". القراءة مرفوضة تماماً لمخالفتها الآية.`,
          detailEn: `Detected speech: "${rawTranscript}". Target verse is: "${ayah.uthmaniText}". Spoken words do not match the chosen verse. Recitation rejected.`,
        },
        generalAdviceAr: 'يرجى قراءة الآية القرآنية المطلوبة فقط والاستماع للشيخ المقرئ قبل التسجيل.',
        generalAdviceEn: 'Please recite only the chosen Quranic verse and listen to the reciter before recording.',
      };
    }

    // Cloud call failed even though a key is present — report honestly instead of inventing a score.
    // (The previous on-device fallback fabricated 88-94% scores and letter-level verdicts from audio
    // length alone; fabricated feedback is unacceptable for a Quran recitation app, so it was removed.)
    return {
      overallScore: 0,
      accuracyGrade: 'failed',
      ayahEvaluated: ayah,
      timestamp: new Date().toISOString(),
      transcribedText: rawTranscript || undefined,
      makharijResults: [],
      tajweedResults: [],
      lahnAudit: {
        status: 'lahn_jali',
        titleAr: 'تعذّر الاتصال بمحرّك التقييم السحابي ☁️',
        titleEn: 'Cloud AI Unreachable — Evaluation Not Completed',
        detailAr: 'تم التقاط الصوت بنجاح، لكن تعذّر تحليل التلاوة لأن خدمة Gemini لم تستجب، ولم تُسجَّل أي نتيجة. تحقق من اتصالك بالإنترنت ومن صلاحية المفتاح ثم أعد المحاولة.',
        detailEn: 'Your audio was captured, but the evaluation could not complete because the Gemini service did not respond, and no result was recorded. Check your internet connection and key validity, then try again.',
      },
      generalAdviceAr: 'تأكد من اتصالك بالإنترنت ومن صلاحية مفتاح Gemini في الإعدادات، ثم أعد المحاولة.',
      generalAdviceEn: 'Verify your internet connection and your Gemini key in Settings, then try again.',
    };
  }
}
