import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Text, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { COLORS, RADIUS, SPACING } from './src/constants/theme';
import { Language, TRANSLATIONS } from './src/constants/translations';
import { FEATURED_SURAHS, Surah } from './src/constants/quranData';
import { ProgressService, UserProgress, INITIAL_PROGRESS } from './src/services/progressService';
import { AITajweedService } from './src/services/aiService';
import { CloudPoolService, GoogleUserSession } from './src/services/cloudPoolConfig';
import { Header } from './src/components/Header';
import { HowToUseModal } from './src/components/HowToUseModal';
import { HomeScreen } from './src/screens/HomeScreen';
import { RecitationScreen } from './src/screens/RecitationScreen';
import { MakharijScreen } from './src/screens/MakharijScreen';
import { AcademyScreen } from './src/screens/AcademyScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { Home, Mic, Activity, BookOpen, Settings } from 'lucide-react-native';

export type TabType = 'home' | 'recite' | 'makharij' | 'academy' | 'settings';

const LANGUAGE_STORAGE_KEY = '@itqan_language_pref';

export default function App() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ar');
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedSurah, setSelectedSurah] = useState<Surah>(FEATURED_SURAHS[0]);
  const [progress, setProgress] = useState<UserProgress>(INITIAL_PROGRESS);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [googleUser, setGoogleUser] = useState<GoogleUserSession | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
      .then((saved) => {
        if (saved === 'ar' || saved === 'en') {
          setCurrentLanguage(saved);
        }
      })
      .catch(() => {});

    AITajweedService.init();
    CloudPoolService.loadGoogleSession()
      .then((session) => {
        if (session) setGoogleUser(session);
      })
      .catch(() => {});

    return ProgressService.subscribe(setProgress);
  }, []);

  const t = TRANSLATIONS[currentLanguage];
  const isAr = currentLanguage === 'ar';

  const handleSetLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang).catch(() => {});
  };

  const handleToggleLanguage = () => {
    const nextLang: Language = currentLanguage === 'ar' ? 'en' : 'ar';
    handleSetLanguage(nextLang);
  };

  const handleQuickGoogleSignIn = async () => {
    const session = await CloudPoolService.signInWithGoogleQuick();
    setGoogleUser(session);
  };

  const handleSelectSurah = (surah: Surah) => {
    setSelectedSurah(surah);
    setActiveTab('recite');
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            currentLanguage={currentLanguage}
            onSelectSurah={handleSelectSurah}
            onNavigateToMakharij={() => setActiveTab('makharij')}
            onNavigateToAcademy={() => setActiveTab('academy')}
          />
        );
      case 'recite':
        return (
          <RecitationScreen
            key={selectedSurah.number}
            currentLanguage={currentLanguage}
            initialSurah={selectedSurah}
          />
        );
      case 'makharij':
        return <MakharijScreen currentLanguage={currentLanguage} />;
      case 'academy':
        return <AcademyScreen currentLanguage={currentLanguage} />;
      case 'settings':
        return (
          <SettingsScreen
            currentLanguage={currentLanguage}
            onSetLanguage={handleSetLanguage}
            onOpenGuide={() => setShowGuideModal(true)}
          />
        );
      default:
        return (
          <HomeScreen
            currentLanguage={currentLanguage}
            onSelectSurah={handleSelectSurah}
            onNavigateToMakharij={() => setActiveTab('makharij')}
            onNavigateToAcademy={() => setActiveTab('academy')}
          />
        );
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

        {/* Global Header */}
        <Header
          currentLanguage={currentLanguage}
          onToggleLanguage={handleToggleLanguage}
          onOpenGuide={() => setShowGuideModal(true)}
          streakCount={progress.streakDays}
        />

        {/* Interactive How to Use Modal */}
        <HowToUseModal
          visible={showGuideModal}
          onClose={() => setShowGuideModal(false)}
          currentLanguage={currentLanguage}
          onQuickGoogleSignIn={handleQuickGoogleSignIn}
          googleUserEmail={googleUser?.email || null}
        />

        {/* Active Tab Screen */}
        <View style={styles.mainContent}>{renderActiveScreen()}</View>

        {/* Bottom Navigation Bar */}
        <View style={[styles.bottomBar, isAr ? styles.rtlRow : styles.ltrRow]}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'home' && styles.tabButtonActive]}
            onPress={() => setActiveTab('home')}
            activeOpacity={0.7}
          >
            <Home
              size={20}
              color={activeTab === 'home' ? COLORS.gold : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'home' && styles.tabLabelActive,
              ]}
            >
              {t.home}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'recite' && styles.tabButtonActive]}
            onPress={() => setActiveTab('recite')}
            activeOpacity={0.7}
          >
            <Mic
              size={20}
              color={activeTab === 'recite' ? COLORS.gold : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'recite' && styles.tabLabelActive,
              ]}
            >
              {t.recite}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'makharij' && styles.tabButtonActive]}
            onPress={() => setActiveTab('makharij')}
            activeOpacity={0.7}
          >
            <Activity
              size={20}
              color={activeTab === 'makharij' ? COLORS.gold : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'makharij' && styles.tabLabelActive,
              ]}
            >
              {t.makharij}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'academy' && styles.tabButtonActive]}
            onPress={() => setActiveTab('academy')}
            activeOpacity={0.7}
          >
            <BookOpen
              size={20}
              color={activeTab === 'academy' ? COLORS.gold : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'academy' && styles.tabLabelActive,
              ]}
            >
              {t.academy}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'settings' && styles.tabButtonActive]}
            onPress={() => setActiveTab('settings')}
            activeOpacity={0.7}
          >
            <Settings
              size={20}
              color={activeTab === 'settings' ? COLORS.gold : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'settings' && styles.tabLabelActive,
              ]}
            >
              {t.settings}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mainContent: {
    flex: 1,
  },
  bottomBar: {
    backgroundColor: COLORS.cardElevated,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212, 175, 55, 0.25)',
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  ltrRow: {
    flexDirection: 'row',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 2,
    borderRadius: RADIUS.sm,
    gap: 2,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
  },
  tabLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: COLORS.gold,
    fontWeight: '700',
  },
});
