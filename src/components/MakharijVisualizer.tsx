import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { MAKHARIJ_DATA, MakhrajItem } from '../constants/tajweedData';
import { Language, TRANSLATIONS } from '../constants/translations';
import { Activity, HelpCircle, Check, ChevronRight } from 'lucide-react-native';

interface MakharijVisualizerProps {
  currentLanguage: Language;
}

export const MakharijVisualizer: React.FC<MakharijVisualizerProps> = ({
  currentLanguage,
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const isAr = currentLanguage === 'ar';

  const [activeZoneId, setActiveZoneId] = useState<string>('halq');
  const activeZone = MAKHARIJ_DATA.find((z) => z.id === activeZoneId) || MAKHARIJ_DATA[0];

  return (
    <View style={styles.container}>
      {/* Title & Description */}
      <View style={styles.header}>
        <Text style={[styles.title, isAr ? styles.textRight : styles.textLeft]}>
          {t.makharijTitle}
        </Text>
        <Text style={[styles.desc, isAr ? styles.textRight : styles.textLeft]}>
          {t.makharijDesc}
        </Text>
      </View>

      {/* 5 General Zones Horizontal Selector Bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.zonesScroll}
      >
        {MAKHARIJ_DATA.map((zone) => {
          const isActive = zone.id === activeZoneId;
          return (
            <TouchableOpacity
              key={zone.id}
              style={[styles.zoneChip, isActive && styles.zoneChipActive]}
              onPress={() => setActiveZoneId(zone.id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.zoneChipText, isActive && styles.zoneChipTextActive]}>
                {isAr ? zone.nameAr : zone.nameEn}
              </Text>
              {isActive && <View style={styles.activeDot} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Anatomical Visual Schematic Representation */}
      <View style={styles.diagramCard}>
        <View style={styles.diagramHeader}>
          <Activity size={16} color={COLORS.gold} />
          <Text style={styles.diagramTitle}>
            {isAr ? `مخطط مخرج: ${activeZone.nameAr}` : `Vocal Zone: ${activeZone.nameEn}`}
          </Text>
        </View>

        {/* Anatomical Schematic Mockup */}
        <View style={styles.visualCavity}>
          {/* Visual layers representing vocal tract */}
          <View
            style={[
              styles.tractLayer,
              activeZone.category === 'khayshoom' && styles.tractLayerActive,
            ]}
          >
            <Text style={styles.tractLayerText}>
              {isAr ? '👃 الخيشوم (التجويف الأنفي - الغنة)' : 'Nasal Cavity (Khayshoom)'}
            </Text>
          </View>

          <View
            style={[
              styles.tractLayer,
              activeZone.category === 'jawf' && styles.tractLayerActive,
            ]}
          >
            <Text style={styles.tractLayerText}>
              {isAr ? '🗣️ الجوف (خلاء الحلق والفم - حروف المد)' : 'Oral Cavity (Jawf)'}
            </Text>
          </View>

          <View
            style={[
              styles.tractLayer,
              activeZone.category === 'lisan' && styles.tractLayerActive,
            ]}
          >
            <Text style={styles.tractLayerText}>
              {isAr ? '👅 اللسان (أقصى، وسط، حافتان، طرف)' : 'Tongue (Lisan)'}
            </Text>
          </View>

          <View
            style={[
              styles.tractLayer,
              activeZone.category === 'shafatan' && styles.tractLayerActive,
            ]}
          >
            <Text style={styles.tractLayerText}>
              {isAr ? '👄 الشفتان (ف، ب، م، و)' : 'Lips (Shafatan)'}
            </Text>
          </View>

          <View
            style={[
              styles.tractLayer,
              activeZone.category === 'halq' && styles.tractLayerActive,
            ]}
          >
            <Text style={styles.tractLayerText}>
              {isAr ? '🫁 الحلق (أقصى، وسط، أدنى)' : 'Throat (Halq)'}
            </Text>
          </View>
        </View>

        {/* Letters Badges */}
        <View style={styles.lettersBox}>
          <Text style={styles.lettersLabel}>{t.lettersFromThisExit}</Text>
          <View style={styles.letterGrid}>
            {activeZone.letters.map((char, index) => (
              <View key={index} style={styles.letterBadge}>
                <Text style={styles.letterBadgeText}>{char}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Sub-Points & Corrections */}
      <View style={styles.subPointsList}>
        {activeZone.subPoints.map((sub, i) => (
          <View key={i} style={styles.subCard}>
            <Text style={[styles.subTitle, isAr ? styles.textRight : styles.textLeft]}>
              {isAr ? sub.titleAr : sub.titleEn}
            </Text>

            <View style={styles.subLettersRow}>
              <Text style={styles.subLettersText}>{sub.letters}</Text>
            </View>

            <Text style={[styles.subDesc, isAr ? styles.textRight : styles.textLeft]}>
              {isAr ? sub.descriptionAr : sub.descriptionEn}
            </Text>

            {/* Common Mistake Alert */}
            <View style={styles.mistakeBox}>
              <Text style={[styles.mistakeText, isAr ? styles.textRight : styles.textLeft]}>
                ⚠️ {isAr ? `الخطأ الشائع: ${sub.commonMistakeAr}` : `Common Error: ${sub.commonMistakeEn}`}
              </Text>
            </View>

            {/* Correction Tip */}
            <View style={styles.tipBox}>
              <Text style={[styles.tipText, isAr ? styles.textRight : styles.textLeft]}>
                💡 {isAr ? `طريقة الضبط: ${sub.correctionTipAr}` : `Correction Tip: ${sub.correctionTipEn}`}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.sm,
  },
  header: {
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textGold,
    marginBottom: 4,
  },
  desc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  zonesScroll: {
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  zoneChip: {
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  zoneChipActive: {
    backgroundColor: COLORS.cardElevated,
    borderColor: COLORS.gold,
  },
  zoneChipText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  zoneChipTextActive: {
    color: COLORS.gold,
    fontWeight: 'bold',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.gold,
  },
  diagramCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    marginTop: SPACING.xs,
  },
  diagramHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: SPACING.sm,
  },
  diagramTitle: {
    color: COLORS.textGold,
    fontSize: 14,
    fontWeight: 'bold',
  },
  visualCavity: {
    backgroundColor: COLORS.cardElevated,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    gap: 6,
    marginVertical: SPACING.xs,
  },
  tractLayer: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingVertical: 7,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.sm,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  tractLayerActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.18)',
    borderLeftWidth: 3,
    borderLeftColor: COLORS.gold,
  },
  tractLayerText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  lettersBox: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.cardElevated,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
  },
  lettersLabel: {
    color: COLORS.textGold,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  letterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  letterBadge: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterBadgeText: {
    color: COLORS.gold,
    fontSize: 16,
    fontWeight: 'bold',
  },
  subPointsList: {
    marginTop: SPACING.sm,
    gap: SPACING.sm,
  },
  subCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  subTitle: {
    color: COLORS.textGold,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subLettersRow: {
    backgroundColor: COLORS.cardElevated,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
    alignSelf: 'flex-start',
    marginBottom: SPACING.xs,
  },
  subLettersText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  subDesc: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: SPACING.sm,
  },
  mistakeBox: {
    backgroundColor: 'rgba(243, 156, 18, 0.12)',
    borderRadius: RADIUS.sm,
    padding: 8,
    marginBottom: 6,
  },
  mistakeText: {
    color: COLORS.warning,
    fontSize: 11,
    lineHeight: 16,
  },
  tipBox: {
    backgroundColor: 'rgba(46, 204, 113, 0.12)',
    borderRadius: RADIUS.sm,
    padding: 8,
  },
  tipText: {
    color: COLORS.emeraldLight,
    fontSize: 11,
    lineHeight: 16,
  },
  textRight: {
    textAlign: 'right',
  },
  textLeft: {
    textAlign: 'left',
  },
});
