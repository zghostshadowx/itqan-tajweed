import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';
import { Language } from '../constants/translations';
import { MakharijVisualizer } from '../components/MakharijVisualizer';

interface MakharijScreenProps {
  currentLanguage: Language;
}

export const MakharijScreen: React.FC<MakharijScreenProps> = ({ currentLanguage }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <MakharijVisualizer currentLanguage={currentLanguage} />
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
});
