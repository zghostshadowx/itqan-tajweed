import { Audio } from 'expo-av';
import { Platform } from 'react-native';

export class AudioService {
  private static sound: Audio.Sound | null = null;
  private static recording: Audio.Recording | null = null;
  private static isPlaying: boolean = false;
  private static onStatusCallback: ((status: any) => void) | null = null;
  private static webMediaRecorder: any = null;
  private static webAudioChunks: any[] = [];
  private static webStream: any = null;
  private static webAudioContext: any = null;
  private static webAnalyser: any = null;
  private static webAnimId: any = null;
  private static recordingStartTime: number = 0;

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
      if (this.recording || this.webMediaRecorder) {
        await this.stopRecording();
      }

      this.recordingStartTime = Date.now();

      if (Platform.OS !== 'web') {
        await Audio.requestPermissionsAsync();
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
        return true;
      } else {
        // Genuine Web Microphone Recording via Web Audio API & MediaRecorder
        if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          this.webStream = stream;
          this.webAudioChunks = [];

          // Live audio level metering via Web Audio API
          try {
            const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
            if (AudioCtx) {
              const audioCtx = new AudioCtx();
              const source = audioCtx.createMediaStreamSource(stream);
              const analyser = audioCtx.createAnalyser();
              analyser.fftSize = 256;
              source.connect(analyser);
              this.webAudioContext = audioCtx;
              this.webAnalyser = analyser;

              const dataArray = new Uint8Array(analyser.frequencyBinCount);
              const trackVolume = () => {
                if (!this.webAnalyser) return;
                this.webAnalyser.getByteFrequencyData(dataArray);
                let sum = 0;
                for (let i = 0; i < dataArray.length; i++) {
                  sum += dataArray[i];
                }
                const avg = sum / dataArray.length;
                const norm = Math.min(1.0, avg / 70);
                if (onMetering) onMetering(norm);
                this.webAnimId = requestAnimationFrame(trackVolume);
              };
              trackVolume();
            }
          } catch (audioErr) {
            console.warn('Web AudioContext metering warning:', audioErr);
          }

          // Pick best supported MIME type on browser
          let mimeType = '';
          if (typeof MediaRecorder !== 'undefined') {
            if (MediaRecorder.isTypeSupported('audio/webm')) mimeType = 'audio/webm';
            else if (MediaRecorder.isTypeSupported('audio/mp4')) mimeType = 'audio/mp4';
          }

          const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
          recorder.ondataavailable = (e: any) => {
            if (e.data && e.data.size > 0) {
              this.webAudioChunks.push(e.data);
            }
          };

          recorder.start(100);
          this.webMediaRecorder = recorder;
          this.recording = { isWeb: true } as any;
          return true;
        } else {
          console.warn('getUserMedia not supported in this browser');
          return false;
        }
      }
    } catch (err) {
      console.error('Failed to start recitation recording', err);
      return false;
    }
  }

  public static async stopRecording(): Promise<string | null> {
    try {
      const duration = Date.now() - this.recordingStartTime;
      const isTooShort = duration < 700;

      // Handle Web stop
      if (Platform.OS === 'web') {
        if (this.webAnimId && typeof cancelAnimationFrame !== 'undefined') {
          cancelAnimationFrame(this.webAnimId);
          this.webAnimId = null;
        }
        if (this.webAudioContext) {
          try {
            await this.webAudioContext.close();
          } catch (e) {}
          this.webAudioContext = null;
          this.webAnalyser = null;
        }

        if (this.webMediaRecorder) {
          return new Promise<string | null>((resolve) => {
            this.webMediaRecorder.onstop = () => {
              if (this.webStream) {
                this.webStream.getTracks().forEach((track: any) => track.stop());
                this.webStream = null;
              }

              const mime = this.webMediaRecorder?.mimeType || 'audio/webm';
              const blob = new Blob(this.webAudioChunks, { type: mime });
              this.webMediaRecorder = null;
              this.recording = null;

              if (isTooShort || blob.size < 1500) {
                console.warn('Web recording too short or empty:', blob.size, 'bytes');
                resolve(null);
              } else {
                const objectUrl = URL.createObjectURL(blob);
                resolve(objectUrl);
              }
            };

            if (this.webMediaRecorder.state !== 'inactive') {
              this.webMediaRecorder.stop();
            } else {
              this.recording = null;
              resolve(null);
            }
          });
        }
        this.recording = null;
        return null;
      }

      // Handle Native Mobile stop
      if (!this.recording) return null;

      let uri: string | null = null;
      if (typeof (this.recording as any).stopAndUnloadAsync === 'function') {
        await (this.recording as Audio.Recording).stopAndUnloadAsync();
        if (!isTooShort) {
          uri = (this.recording as Audio.Recording).getURI();
        } else {
          console.warn('Native recording was under 700ms threshold');
          uri = null;
        }
      }

      this.recording = null;
      return uri;
    } catch (e) {
      console.error('Failed to stop recording', e);
      this.recording = null;
      this.webMediaRecorder = null;
      return null;
    }
  }
}
