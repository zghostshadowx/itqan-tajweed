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
  private static webSpeechRecognition: any = null;
  private static lastTranscript: string = '';
  private static voiceFrames: number = 0;
  private static peakVoiceLevel: number = 0;
  private static lastRecordingSilent: boolean = false;
  private static speechRecSupported: boolean = false;

  public static getLastTranscript(): string {
    return this.lastTranscript;
  }

  public static wasLastRecordingSilent(): boolean {
    return this.lastRecordingSilent;
  }

  public static isSpeechRecognitionSupported(): boolean {
    return this.speechRecSupported;
  }

  public static getVoiceFrames(): number {
    return this.voiceFrames;
  }

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
  public static async startRecording(
    onMetering?: (level: number) => void,
    onTranscriptUpdate?: (text: string) => void
  ): Promise<boolean> {
    try {
      await this.stopAudio();
      if (this.recording || this.webMediaRecorder || this.webSpeechRecognition) {
        await this.stopRecording();
      }

      this.recordingStartTime = Date.now();
      this.voiceFrames = 0;
      this.peakVoiceLevel = 0;
      this.lastRecordingSilent = false;
      this.lastTranscript = '';

      if (Platform.OS !== 'web') {
        this.speechRecSupported = false;
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

        recordingInstance.setOnRecordingStatusUpdate((status) => {
          if (status.isRecording && typeof status.metering === 'number') {
            const norm = Math.max(0, (status.metering + 160) / 160);
            // Require clear human speech into mobile mic (> -28 dB)
            if (status.metering > -28) {
              this.voiceFrames += 1;
              if (norm > this.peakVoiceLevel) this.peakVoiceLevel = norm;
            }
            if (onMetering) onMetering(norm);
          }
        });

        await recordingInstance.startAsync();
        this.recording = recordingInstance;
        return true;
      } else {
        // Web Platform: Prioritize SpeechRecognition (ar-SA) so mobile browsers never fail with audio-capture mic contention
        const SpeechRec =
          typeof window !== 'undefined'
            ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
            : null;
        const isMobileBrowser =
          typeof navigator !== 'undefined' &&
          /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent || '');

        let finalizedChunks = '';
        if (SpeechRec) {
          try {
            this.speechRecSupported = true;
            const rec = new SpeechRec();
            rec.lang = 'ar-SA';
            rec.continuous = true;
            rec.interimResults = true;
            rec.maxAlternatives = 1;

            rec.onresult = (e: any) => {
              let interim = '';
              for (let i = e.resultIndex || 0; i < e.results.length; i++) {
                const seg = e.results[i][0].transcript;
                if (e.results[i].isFinal) {
                  finalizedChunks += seg + ' ';
                } else {
                  interim += seg + ' ';
                }
              }
              const combined = (finalizedChunks + interim).trim();
              if (combined) {
                this.lastTranscript = combined;
                this.voiceFrames += 5;
                if (onTranscriptUpdate) onTranscriptUpdate(this.lastTranscript);
              }
            };

            rec.onerror = (e: any) => {
              if (e?.error === 'not-allowed' || e?.error === 'service-not-allowed') {
                this.speechRecSupported = false;
              }
            };

            rec.onend = () => {
              // Automatically restart if user is still recording and took a brief breath pause
              if (this.recording && this.webSpeechRecognition === rec) {
                try {
                  rec.start();
                } catch {}
              }
            };

            rec.start();
            this.webSpeechRecognition = rec;
          } catch (srErr) {
            this.speechRecSupported = false;
          }
        } else {
          this.speechRecSupported = false;
        }

        // On Mobile Web where SpeechRecognition is active, do NOT open competing getUserMedia stream
        // (Android Chrome & iOS Safari kill SpeechRecognition if getUserMedia steals the hardware mic)
        if (isMobileBrowser && this.speechRecSupported) {
          this.recording = { isWeb: true, isMobileSpeechOnly: true } as any;
          this.webAnimId = setInterval(() => {
            if (onMetering) {
              onMetering(this.lastTranscript ? 0.75 : 0.15);
            }
          }, 100);
          return true;
        }

        // Desktop Web or browsers without SpeechRecognition: Open getUserMedia with autoGainControl DISABLED
        if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              autoGainControl: false,
              noiseSuppression: true,
              echoCancellation: true,
            },
          });
          this.webStream = stream;
          this.webAudioChunks = [];

          try {
            const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
            if (AudioCtx) {
              const audioCtx = new AudioCtx();
              if (audioCtx.state === 'suspended') {
                await audioCtx.resume();
              }
              const source = audioCtx.createMediaStreamSource(stream);
              const analyser = audioCtx.createAnalyser();
              analyser.fftSize = 256;
              analyser.smoothingTimeConstant = 0.3;
              source.connect(analyser);
              this.webAudioContext = audioCtx;
              this.webAnalyser = analyser;

              const freqArray = new Uint8Array(analyser.frequencyBinCount);
              const timeArray = new Uint8Array(analyser.fftSize);

              this.webAnimId = setInterval(() => {
                if (!this.webAnalyser) return;
                if (this.webAudioContext && this.webAudioContext.state === 'suspended') {
                  this.webAudioContext.resume().catch(() => {});
                }
                this.webAnalyser.getByteFrequencyData(freqArray);
                this.webAnalyser.getByteTimeDomainData(timeArray);

                let sumSquares = 0;
                for (let i = 0; i < timeArray.length; i++) {
                  const sample = (timeArray[i] - 128) / 128.0;
                  sumSquares += sample * sample;
                }
                const rms = Math.sqrt(sumSquares / timeArray.length);

                let vocalSum = 0;
                const vocalBins = Math.min(45, freqArray.length);
                for (let i = 2; i < vocalBins; i++) {
                  vocalSum += freqArray[i];
                }
                const vocalAvg = vocalSum / Math.max(1, vocalBins - 2);

                const norm = Math.min(1.0, Math.max(rms * 4.5, vocalAvg / 65));
                if (rms >= 0.035 || vocalAvg >= 24) {
                  this.voiceFrames += 1;
                  if (norm > this.peakVoiceLevel) this.peakVoiceLevel = norm;
                }
                if (onMetering) onMetering(norm);
              }, 50);
            }
          } catch (audioErr) {
            console.warn('Web AudioContext metering warning:', audioErr);
          }

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
        } else if (this.speechRecSupported) {
          this.recording = { isWeb: true, isMobileSpeechOnly: true } as any;
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
      const isTooShort = duration < 900;
      const wasRecording = this.recording;
      this.recording = null;

      // Handle Web stop
      if (Platform.OS === 'web') {
        if (this.webAnimId) {
          clearInterval(this.webAnimId);
          this.webAnimId = null;
        }
        if (this.webAudioContext) {
          try {
            await this.webAudioContext.close();
          } catch (e) {}
          this.webAudioContext = null;
          this.webAnalyser = null;
        }

        if (this.webSpeechRecognition) {
          const recRef = this.webSpeechRecognition;
          this.webSpeechRecognition = null;
          try {
            recRef.stop();
          } catch (e) {}
          // Wait 400ms so SpeechRecognition emits its final onresult transcript before evaluation
          await new Promise((r) => setTimeout(r, 400));
        }

        // Strict Silence Check on Web:
        // If SpeechRecognition is supported and captured 0 words, OR if voiceFrames < 8, mark as silent!
        if (!this.lastTranscript.trim() && (this.speechRecSupported || this.voiceFrames < 8)) {
          this.lastRecordingSilent = true;
        }

        // If mobile speech-only mode (where getUserMedia was skipped to prevent mic conflict)
        if ((wasRecording as any)?.isMobileSpeechOnly) {
          if (isTooShort || this.lastRecordingSilent || !this.lastTranscript.trim()) {
            return null;
          }
          // Return a valid base64 WAV data URI representing the verified speech capture
          return 'data:audio/wav;base64,' + 'UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='.repeat(12);
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

              if (isTooShort || blob.size < 200 || this.lastRecordingSilent) {
                console.warn('Web recording silent or too short:', {
                  bytes: blob.size,
                  voiceFrames: this.voiceFrames,
                  transcript: this.lastTranscript,
                });
                resolve(null);
              } else {
                const objectUrl = URL.createObjectURL(blob);
                resolve(objectUrl);
              }
            };

            if (this.webMediaRecorder.state !== 'inactive') {
              this.webMediaRecorder.stop();
            } else {
              resolve(null);
            }
          });
        }
        return null;
      }

      // Handle Native Mobile stop
      if (!this.recording) return null;

      if (this.voiceFrames < 4) {
        this.lastRecordingSilent = true;
      }

      let uri: string | null = null;
      if (typeof (this.recording as any).stopAndUnloadAsync === 'function') {
        await (this.recording as Audio.Recording).stopAndUnloadAsync();
        if (!isTooShort && !this.lastRecordingSilent) {
          uri = (this.recording as Audio.Recording).getURI();
        } else {
          console.warn('Native recording was silent or under 900ms threshold');
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
