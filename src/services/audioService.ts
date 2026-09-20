import { Audio } from 'expo-av';
import { Platform } from 'react-native';

export class AudioService {
  private static sound: Audio.Sound | null = null;
  private static recording: Audio.Recording | null = null;
  private static isPlaying: boolean = false;
  private static onStatusCallback: ((status: any) => void) | null = null;

  public static async initAudio(): Promise<boolean> {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Audio permissions not granted');
          return false;
        }
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      }
      return true;
    } catch (e) {
      console.error('Failed to init audio mode', e);
      return false;
    }
  }

  public static async playReciterAudio(
    url: string,
    speed: number = 1.0,
    onStatusUpdate?: (status: any) => void
  ): Promise<void> {
    try {
      await this.stopAudio();
      this.onStatusCallback = onStatusUpdate || null;

      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true, rate: speed, shouldCorrectPitch: true },
        (status) => {
          if (this.onStatusCallback) {
            this.onStatusCallback(status);
          }
          if (status.isLoaded && status.didJustFinish) {
            this.isPlaying = false;
          }
        }
      );

      this.sound = sound;
      this.isPlaying = true;
    } catch (e) {
      console.error('Error playing audio from URL:', url, e);
    }
  }

  public static async pauseAudio(): Promise<void> {
    if (this.sound) {
      await this.sound.pauseAsync();
      this.isPlaying = false;
    }
  }

  public static async resumeAudio(): Promise<void> {
    if (this.sound) {
      await this.sound.playAsync();
      this.isPlaying = true;
    }
  }

  public static async stopAudio(): Promise<void> {
    if (this.sound) {
      try {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
      } catch (e) {
        // already unloaded
      }
      this.sound = null;
      this.isPlaying = false;
    }
  }

  public static async setPlaybackSpeed(speed: number): Promise<void> {
    if (this.sound) {
      await this.sound.setRateAsync(speed, true);
    }
  }

  // --- Microphone Recording for Recitation & AI Analysis ---
  public static async startRecording(onMetering?: (level: number) => void): Promise<boolean> {
    try {
      await this.stopAudio();
      if (this.recording) {
        await this.stopRecording();
      }

      await Audio.requestPermissionsAsync();

      if (Platform.OS !== 'web') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const recordingInstance = new Audio.Recording();
        await recordingInstance.prepareToRecordAsync({
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
          isMeteringEnabled: true,
        });

        if (onMetering) {
          recordingInstance.setOnRecordingStatusUpdate((status) => {
            if (status.isRecording && typeof status.metering === 'number') {
              // Convert dB (-160 to 0) to normalized 0.0 - 1.0 range
              const norm = Math.max(0, (status.metering + 160) / 160);
              onMetering(norm);
            }
          });
        }

        await recordingInstance.startAsync();
        this.recording = recordingInstance;
      } else {
        // Web fallback simulation
        this.recording = {} as any;
      }

      return true;
    } catch (err) {
      console.error('Failed to start recitation recording', err);
      return false;
    }
  }

  public static async stopRecording(): Promise<string | null> {
    try {
      if (!this.recording) return null;

      let uri: string | null = null;
      if (Platform.OS !== 'web' && typeof (this.recording as any).stopAndUnloadAsync === 'function') {
        await (this.recording as Audio.Recording).stopAndUnloadAsync();
        uri = (this.recording as Audio.Recording).getURI();
      } else {
        uri = 'mock://recorded-audio-session.wav';
      }

      this.recording = null;
      return uri;
    } catch (e) {
      console.error('Failed to stop recording', e);
      this.recording = null;
      return null;
    }
  }
}
