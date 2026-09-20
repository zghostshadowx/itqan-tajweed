import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Language, TRANSLATIONS } from '../constants/translations';
import { AudioService } from '../services/audioService';
import { Mic, Square, Sparkles } from 'lucide-react-native';

interface RecitationRecorderProps {
  currentLanguage: Language;
  isAnalyzing: boolean;
  onStartRecording: () => void;
  onFinishRecording: (audioUri: string | null) => void;
}

export const RecitationRecorder: React.FC<RecitationRecorderProps> = ({
  currentLanguage,
  isAnalyzing,
  onStartRecording,
  onFinishRecording,
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const isAr = currentLanguage === 'ar';

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [meterLevel, setMeterLevel] = useState<number>(0.3);

  // Pulse animation for recording state
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveHeights = useRef([
    new Animated.Value(8),
    new Animated.Value(18),
    new Animated.Value(28),
    new Animated.Value(14),
    new Animated.Value(32),
    new Animated.Value(22),
    new Animated.Value(12),
  ]).current;

  useEffect(() => {
    let loop: Animated.CompositeAnimation | null = null;
    if (isRecording) {
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.25,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1.0,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();

      // Random dynamic waveform bounce
      const interval = setInterval(() => {
        waveHeights.forEach((anim) => {
          Animated.timing(anim, {
            toValue: Math.floor(Math.random() * 32) + 8,
            duration: 150,
            useNativeDriver: false,
          }).start();
        });
      }, 160);

      return () => {
        if (loop) loop.stop();
        clearInterval(interval);
      };
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  const toggleRecording = async () => {
    if (isAnalyzing) return;

    if (isRecording) {
      setIsRecording(false);
      const uri = await AudioService.stopRecording();
      onFinishRecording(uri);
    } else {
      setIsRecording(true);
      onStartRecording();
      await AudioService.startRecording((level) => {
        setMeterLevel(level);
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>{t.recordYourVoice}</Text>

      {/* Center Microphone Button with Glowing Aura */}
      <View style={styles.micWrapper}>
        {isRecording && (
          <Animated.View
            style={[
              styles.pulseRing,
              {
                transform: [{ scale: pulseAnim }],
                opacity: pulseAnim.interpolate({
                  inputRange: [1, 1.25],
                  outputRange: [0.6, 0.1],
                }),
              },
            ]}
          />
        )}

        <TouchableOpacity
          style={[
            styles.micButton,
            isRecording && styles.micButtonRecording,
            isAnalyzing && styles.micButtonAnalyzing,
          ]}
          onPress={toggleRecording}
          disabled={isAnalyzing}
          activeOpacity={0.85}
        >
          {isAnalyzing ? (
            <Sparkles size={32} color={COLORS.background} />
          ) : isRecording ? (
            <Square size={28} color="#FFFFFF" fill="#FFFFFF" />
          ) : (
            <Mic size={32} color={COLORS.background} />
          )}
        </TouchableOpacity>
      </View>

      {/* Dynamic Sound Waveform Visualizer */}
      {isRecording && (
        <View style={styles.waveformContainer}>
          {waveHeights.map((h, i) => (
            <Animated.View
              key={i}
              style={[
                styles.waveformBar,
                {
                  height: h,
                  backgroundColor: i % 2 === 0 ? COLORS.gold : COLORS.emeraldLight,
                },
              ]}
            />
          ))}
        </View>
      )}

      {/* Status Notice */}
      <Text
        style={[
          styles.statusText,
          isRecording && styles.statusTextRecording,
          isAnalyzing && styles.statusTextAnalyzing,
        ]}
      >
        {isAnalyzing
          ? t.aiAnalyzing
          : isRecording
          ? t.recordingInProgress
          : t.tapToRecord}
      </Text>

      {isRecording && (
        <TouchableOpacity
          style={styles.stopActionPill}
          onPress={toggleRecording}
          activeOpacity={0.8}
        >
          <Text style={styles.stopActionText}>{t.stopAndAnalyze}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    marginVertical: SPACING.sm,
  },
  sectionHeader: {
    color: COLORS.textGold,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
  },
  micWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    height: 90,
  },
  pulseRing: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.tajweedMadd,
  },
  micButton: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },
  micButtonRecording: {
    backgroundColor: COLORS.error,
    shadowColor: COLORS.error,
  },
  micButtonAnalyzing: {
    backgroundColor: COLORS.emeraldLight,
    shadowColor: COLORS.emeraldLight,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    height: 40,
    marginVertical: SPACING.sm,
  },
  waveformBar: {
    width: 4,
    borderRadius: 2,
  },
  statusText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  statusTextRecording: {
    color: COLORS.tajweedMadd,
    fontWeight: '700',
  },
  statusTextAnalyzing: {
    color: COLORS.emeraldLight,
    fontWeight: '700',
  },
  stopActionPill: {
    marginTop: SPACING.sm + 2,
    backgroundColor: COLORS.cardElevated,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  stopActionText: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '600',
  },
});
