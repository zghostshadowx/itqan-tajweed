# 📖 Itqan (إتقان) — AI Quran Tajweed & Makharij Mobile App
> **معلّم التجويد ومخارج الحروف الذكي بالذكاء الاصطناعي**  
> *AI-Powered Quran Tajweed & Articulation Tutor for Android, iOS & Web*

---

## 🌟 Overview
**Itqan (إتقان)** is an Islamic educational mobile application engineered for Google Play Store publication, supporting native **Arabic (RTL default)** and **English**. It enables users to listen to certified master reciters (**Sheikh Al-Husary**, **Sheikh Mishary Alafasy**, **Sheikh Abdul Basit**), clearly displays Uthmani scripture with standard Tajweed color coding, and delivers **real-time AI-powered articulation (مخارج الحروف) and Tajweed rule correction**.

---

## 📱 Core Features
1. **Accredited Sheikh Recitation Studio:**
   - Listen verse-by-verse with Sheikh Mahmoud Khalil Al-Husary (Teacher), Sheikh Mishary Alafasy, and Sheikh Abdul Basit.
   - Variable playback speed (0.75x slow learning mode, 1.0x normal, 1.25x).
   - Verse repeat and loop mode for memorization and drills.
2. **Uthmani Scripture & Color-Coded Tajweed:**
   - Certified Tajweed color map:
     - 🔴 **Crimson Red (`#E74C3C`)**: Madd rules (2/4/6 counts).
     - 🟢 **Emerald Green (`#2ECC71`)**: Ghunnah & Ikhfa (2 counts).
     - 🔵 **Sky Blue (`#3498DB`)**: Qalqalah echo consonants (قطب جد).
     - 🟣 **Amethyst Purple (`#9B59B6`)**: Idgham merging.
     - 🟠 **Amber Orange (`#E67E22`)**: Iqlab (conversion to Meem).
   - Interactive tap on any word reveals the underlying Tajweed rule explanation in Arabic and English.
3. **Real-Time AI Speech Correction Engine:**
   - Records user voice with live animated waveform visualizer.
   - Computes overall accuracy score (e.g. 96%).
   - Generates phoneme-level Makharij alerts (e.g. distinguishing ض from ظ, or ح from هـ).
   - Validates Tajweed rules (Ghunnah timing, Qalqalah impact, Madd count).
4. **Interactive Anatomical Makharij Visualizer:**
   - Explores the 5 major articulation zones: *Al-Jawf (الجوف), Al-Halq (الحلق), Al-Lisan (اللسان), Ash-Shafatan (الشفتان), Al-Khayshoom (الخيشوم)*.
   - Explains common mistakes and provides physiological tips on how to position the tongue and mouth.
5. **Tajweed Rules Academy:**
   - Comprehensive encyclopedia covering Noon Sakinah, Meem Sakinah, Mudood, Qalqalah, and Tafkheem/Tarqeeq with Quranic examples.

---

## 🚀 Quick Start & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run on Web / Browser
```bash
npx expo start --web
```

### 3. Run on Android Device / Emulator
```bash
npx expo start --android
```

### 4. Run on iOS (macOS only)
```bash
npx expo start --ios
```

---

## 📦 Google Play Store Release Build

The application is pre-configured with Android package ID `com.itqan.tajweed`, microphone permissions, and responsive RTL layout.

To generate a production Android App Bundle (`.aab`) for Google Play Store:
```bash
# Using Expo Application Services (EAS):
npx eas-cli build --platform android
```
Or build locally via Gradle:
```bash
npx expo run:android --variant release
```

---

## 🏛️ Project Architecture
See the standalone blueprint document at:  
`C:\Users\venom\Desktop\Itqan-Tajweed-Architecture.md`
