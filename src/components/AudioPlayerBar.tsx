import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Ayah } from '../constants/quranData';
import { Language, TRANSLATIONS } from '../constants/translations';
import { AudioService } from '../services/audioService';
import { Play, Pause, RotateCcw, Volume2, UserCheck, FastForward } from 'lucide-react-native';

export type ReciterKey = 'husary' | 'alafasy' | 'abdulbasit';

interface AudioPlayerBarProps {
  ayah: Ayah;
  currentLanguage: Language;
  selectedReciter: ReciterKey;
  onSelectReciter: (reciter: ReciterKey) => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  ayah,
  currentLanguage,
  selectedReciter,
  onSelectReciter,
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const isAr = currentLanguage === 'ar';

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isLooping, setIsLooping] = useState<boolean>(false);

  // Stop playback when ayah changes
  useEffect(() => {
    setIsPlaying(false);
    AudioService.stopAudio();
  }, [ayah.globalNumber]);

  const getAudioUrl = (): string => {
    switch (selectedReciter) {
      case 'alafasy':
        return ayah.audioAlafasy;
      case 'abdulbasit':
        return ayah.audioAbdulbasit;
      case 'husary':
      default:
        return ayah.audioHusary;
    }
  };

  const handleTogglePlay = async () => {
    if (isPlaying) {
      await AudioService.pauseAudio();
      setIsPlaying(false);
    } else {
      const url = getAudioUrl();
      setIsPlaying(true);
      await AudioService.playReciterAudio(url, playbackSpeed, (status) => {
        if (status.isLoaded && status.didJustFinish) {
          if (isLooping) {
            handleTogglePlay(); // replay
          } else {
            setIsPlaying(false);
          }
        }
      });
    }
  };

  const toggleSpeed = async () => {
    let nextSpeed = 1.0;
    if (playbackSpeed === 1.0) nextSpeed = 0.75;
    else if (playbackSpeed === 0.75) nextSpeed = 1.25;
    else nextSpeed = 1.0;

    setPlaybackSpeed(nextSpeed);
    await AudioService.setPlaybackSpeed(nextSpeed);
  };

  return (
    <View style={styles.container}>
      {/* Reciter Selector Header */}
      <View style={[styles.reciterRow, isAr ? styles.rtlRow : styles.ltrRow]}>
        <View style={styles.reciterTitleBox}>
          <UserCheck size={14} color={COLORS.gold} />
          <Text style={styles.reciterTitle}>{t.reciterSelect}:</Text>
        </View>

        <View style={[styles.reciterPills, isAr ? styles.rtlRow : styles.ltrRow]}>
          <TouchableOpacity
            style={[
              styles.reciterPill,
              selectedReciter === 'husary' && styles.reciterPillActive,
            ]}
            onPress={() => onSelectReciter('husary')}
          >
            <Text
              style={[
                styles.reciterPillText,
                selectedReciter === 'husary' && styles.reciterPillTextActive,
              ]}
            >
              {isAr ? 'الحصري (المعلم)' : 'Al-Husary'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.reciterPill,
              selectedReciter === 'alafasy' && styles.reciterPillActive,
            ]}
            onPress={() => onSelectReciter('alafasy')}
          >
            <Text
              style={[
                styles.reciterPillText,
                selectedReciter === 'alafasy' && styles.reciterPillTextActive,
              ]}
            >
              {isAr ? 'العفاسي' : 'Alafasy'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.reciterPill,
              selectedReciter === 'abdulbasit' && styles.reciterPillActive,
            ]}
            onPress={() => onSelectReciter('abdulbasit')}
          >
            <Text
              style={[
                styles.reciterPillText,
                selectedReciter === 'abdulbasit' && styles.reciterPillTextActive,
              ]}
            >
              {isAr ? 'عبد الباسط' : 'Abdulbasit'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Playback Controller Bar */}
      <View style={[styles.controlsRow, isAr ? styles.rtlRow : styles.ltrRow]}>
        {/* Speed Toggle */}
        <TouchableOpacity
          style={styles.auxBtn}
          onPress={toggleSpeed}
          activeOpacity={0.7}
        >
          <FastForward size={16} color={COLORS.gold} />
          <Text style={styles.auxBtnText}>{playbackSpeed}x</Text>
        </TouchableOpacity>

        {/* Big Center Play/Pause Button */}
        <TouchableOpacity
          style={[styles.playBtn, isPlaying && styles.playBtnActive]}
          onPress={handleTogglePlay}
          activeOpacity={0.85}
        >
          {isPlaying ? (
            <Pause size={24} color={COLORS.background} />
          ) : (
            <Play size={24} color={COLORS.background} style={{ marginLeft: 2 }} />
          )}
        </TouchableOpacity>

        {/* Repeat Toggle */}
        <TouchableOpacity
          style={[styles.auxBtn, isLooping && styles.auxBtnActive]}
          onPress={() => setIsLooping(!isLooping)}
          activeOpacity={0.7}
        >
          <RotateCcw size={16} color={isLooping ? COLORS.gold : COLORS.textSecondary} />
          <Text
            style={[
              styles.auxBtnText,
              isLooping && { color: COLORS.gold, fontWeight: 'bold' },
            ]}
          >
            {isAr ? 'تكرار' : 'Repeat'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Listening status notice */}
      <View style={styles.statusFooter}>
        <Volume2 size={13} color={isPlaying ? COLORS.emeraldLight : COLORS.textMuted} />
        <Text
          style={[
            styles.statusFooterText,
            isPlaying && { color: COLORS.emeraldLight },
          ]}
        >
          {isPlaying
            ? isAr
              ? 'جاري الاستماع للآية الكريمة بصوت القارئ...'
              : 'Streaming master recitation audio...'
            : isAr
            ? 'انقر للاستماع للنطق السليم'
            : 'Tap play to listen to reference recitation'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardElevated,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    marginVertical: SPACING.xs,
  },
  reciterRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  ltrRow: {
    flexDirection: 'row',
  },
  reciterTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reciterTitle: {
    color: COLORS.textGold,
    fontSize: 12,
    fontWeight: '600',
  },
  reciterPills: {
    gap: 4,
  },
  reciterPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  reciterPillActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderColor: COLORS.gold,
  },
  reciterPillText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  reciterPillTextActive: {
    color: COLORS.gold,
    fontWeight: 'bold',
  },
  controlsRow: {
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  playBtn: {
    width: 54,
    height: 54,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  playBtnActive: {
    backgroundColor: COLORS.emeraldLight,
    shadowColor: COLORS.emeraldLight,
  },
  auxBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    gap: 5,
  },
  auxBtnActive: {
    borderColor: COLORS.gold,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
  },
  auxBtnText: {
    color: COLORS.textPrimary,
    fontSize: 11,
    fontWeight: '500',
  },
  statusFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xs + 2,
    gap: 6,
  },
  statusFooterText: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
});
