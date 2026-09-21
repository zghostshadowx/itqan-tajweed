import { TajweedSegment } from '../constants/quranData';

// Letters of Qalqalah: قطب جد
const QALQALAH_LETTERS = new Set(['ق', 'ط', 'ب', 'ج', 'د']);

// Characters marking an elongation (madd): maddah ٓ, alef-madda آ, dagger alif ٰ
const MADD_MARKS = /[ٓ~آٰ]/;

// Letters of Ikhfa: ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك
const IKHFA_LETTERS = new Set(['ت', 'ث', 'ج', 'د', 'ذ', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ف', 'ق', 'ك']);

// Letters of Idgham: يرملون
const IDGHAM_LETTERS = new Set(['ي', 'ر', 'م', 'ل', 'و', 'ن']);

/**
 * Universal Tajweed rule parser that dynamically breaks any Uthmani Quranic text
 * into color-coded Tajweed segments with authentic scholarly explanations.
 */
export function parseUniversalTajweed(text: string): TajweedSegment[] {
  if (!text || text.trim().length === 0) return [];

  const segments: TajweedSegment[] = [];
  const words = text.split(' ');

  for (let wIndex = 0; wIndex < words.length; wIndex++) {
    const word = words[wIndex];
    const isLastWord = wIndex === words.length - 1;

    // Check for specific Tajweed rules within the word
    let wordSegments: TajweedSegment[] = [];

    // Rule 1: Ghunnah in doubled Noon or doubled Meem (نّ or مّ)
    if (word.includes('نّ') || word.includes('مّ') || word.includes('نَّ') || word.includes('مَّ')) {
      const parts = word.split(/(نّ|مّ|نَّ|مَّ)/g);
      for (const part of parts) {
        if (part === 'نّ' || part === 'مّ' || part === 'نَّ' || part === 'مَّ') {
          const letterName = part.startsWith('ن') ? 'النون' : 'الميم';
          wordSegments.push({
            text: part,
            rule: 'ghunnah',
            explanationAr: `غنة ${letterName} المشددة أكمل ما تكون (حركتان)`,
            explanationEn: `Complete 2-count Ghunnah in doubled ${letterName}`,
          });
        } else if (part.length > 0) {
          wordSegments.push({ text: part, rule: 'normal' });
        }
      }
    }
    // Rule 2: Madd marks (maddah, alef-madda, dagger alif, tilde)
    else if (MADD_MARKS.test(word)) {
      const parts = word.split(/([^\s]*[ٓ~آٰ][^\s]*)/g);
      for (const part of parts) {
        if (MADD_MARKS.test(part)) {
          wordSegments.push({
            text: part,
            rule: 'madd',
            explanationAr: 'مدّ: أطِل الحرف حسب نوع المد في موضعك (حركتان أو أكثر حتى 6)',
            explanationEn: 'Madd: elongate this letter per its rule (2 counts or more, up to 6)',
          });
        } else if (part.length > 0) {
          wordSegments.push({ text: part, rule: 'normal' });
        }
      }
    }
    // Rule 3: End-of-ayah Qalqalah or internal Qalqalah
    else {
      let foundRule = false;

      // Check if last letter of word at pause has a Qalqalah letter
      if (isLastWord) {
        const cleanLast = word.replace(/[ًٌٍَُِّْٰۡـ]/g, '');
        const lastChar = cleanLast.slice(-1);
        if (QALQALAH_LETTERS.has(lastChar)) {
          const splitIdx = word.lastIndexOf(lastChar);
          if (splitIdx > 0) {
            wordSegments.push({ text: word.slice(0, splitIdx), rule: 'normal' });
            wordSegments.push({
              text: word.slice(splitIdx),
              rule: 'qalqalah',
              explanationAr: `قلقلة كبرى عند الوقف على حرف (${lastChar})`,
              explanationEn: `Major Qalqalah bounce upon pause on (${lastChar})`,
            });
            foundRule = true;
          }
        }
      }

      if (!foundRule) {
        // Check for internal Qalqalah with Sukun: قْ طْ بْ جْ دْ
        const qalqalahMatch = word.match(/([قطبجد][ْۡ])/);
        if (qalqalahMatch && qalqalahMatch.index !== undefined) {
          const idx = qalqalahMatch.index;
          const matchStr = qalqalahMatch[0];
          const letter = matchStr[0];
          if (idx > 0) wordSegments.push({ text: word.slice(0, idx), rule: 'normal' });
          wordSegments.push({
            text: matchStr,
            rule: 'qalqalah',
            explanationAr: `قلقلة صغرى في حرف (${letter}) الساكن وسط الكلمة`,
            explanationEn: `Minor Qalqalah bounce on sakin (${letter})`,
          });
          if (idx + matchStr.length < word.length) {
            wordSegments.push({ text: word.slice(idx + matchStr.length), rule: 'normal' });
          }
          foundRule = true;
        }
      }

      if (!foundRule) {
        wordSegments.push({ text: word, rule: 'normal' });
      }
    }

    // Add space after word if not the last word
    if (!isLastWord) {
      const lastSeg = wordSegments[wordSegments.length - 1];
      if (lastSeg) {
        lastSeg.text += ' ';
      } else {
        wordSegments.push({ text: ' ', rule: 'normal' });
      }
    }

    segments.push(...wordSegments);
  }

  return segments;
}
