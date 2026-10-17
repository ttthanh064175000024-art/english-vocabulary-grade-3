import { useState, useEffect, useRef, useCallback } from 'react';

// Web Speech API interface declarations for TypeScript
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export interface UseSpeechRecognitionReturn {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  error: string | null;
  audioLevel: number; // 0 - 100 for live animation
  hasMicPermission: boolean | null;
  startListening: () => Promise<void>;
  stopListening: () => void;
  resetTranscript: () => void;
  requestPermission: () => Promise<boolean>;
  simulateSpeech: (text: string) => void;
}

export function useSpeechRecognition(onResultCallback?: (result: string) => void): UseSpeechRecognitionReturn {
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);

  const recognitionRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timeoutRef = useRef<any>(null);

  // Check browser support on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const win = window as unknown as IWindow;
      const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
      setIsSupported(Boolean(SpeechRecognition));
    }
  }, []);

  // Visual audio level analyser
  const startAudioAnalyser = async (stream: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        // Normalize roughly between 0 and 100
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setAudioLevel(normalized);
        animFrameRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();
    } catch (e) {
      console.warn('Audio analyser setup error:', e);
    }
  };

  const stopAudioAnalyser = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setAudioLevel(0);
  };

  // Explicit permission request
  const requestPermission = useCallback(async (): Promise<boolean> => {
    setError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Trình duyệt không hỗ trợ truy cập Micro');
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasMicPermission(true);
      // Stop tracks immediately after testing permission
      stream.getTracks().forEach(t => t.stop());
      return true;
    } catch (err: any) {
      console.warn('Mic permission error:', err);
      setHasMicPermission(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Micro chưa được cấp quyền. Con hoặc bố mẹ hãy bấm nút cho phép truy cập micro trên trình duyệt nhé!');
      } else {
        setError('Không thể kết nối với Micro: ' + (err.message || 'Lỗi thiết bị'));
      }
      return false;
    }
  }, []);

  const stopListening = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    stopAudioAnalyser();
    setIsListening(false);
  }, []);

  const startListening = useCallback(async () => {
    setError(null);
    setTranscript('');

    const win = window as unknown as IWindow;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      setError('Trình duyệt của bạn hiện chưa hỗ trợ tính năng nhận diện giọng nói. Hãy dùng Google Chrome hoặc Microsoft Edge nhé!');
      return;
    }

    try {
      // 1. Attempt to request microphone stream for live sound wave animation
      if (navigator.mediaDevices?.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaStreamRef.current = stream;
          setHasMicPermission(true);
          startAudioAnalyser(stream);
        } catch (permErr: any) {
          if (permErr.name === 'NotAllowedError' || permErr.name === 'PermissionDeniedError') {
            setHasMicPermission(false);
            setError('Vui lòng bấm "Cho phép" (Allow) sử dụng Micro trên trình duyệt để luyện nói tiếng Anh nhé!');
            return;
          }
          // Non-fatal on some devices: SpeechRecognition can still record audio directly
          console.warn('Audio analyser unavailable, continuing with SpeechRecognition:', permErr);
        }
      }

      // 2. Initialize SpeechRecognition
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 3;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);

        // Safety timeout: auto stop after 7 seconds if kid forgets
        timeoutRef.current = setTimeout(() => {
          stopListening();
        }, 7000);
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const currentText = finalTranscript || interimTranscript;
        setTranscript(currentText);

        if (finalTranscript) {
          if (onResultCallback) {
            onResultCallback(finalTranscript.trim());
          }
          stopListening();
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error event:', event.error);
        if (event.error === 'no-speech') {
          setError('Hệ thống chưa nghe thấy tiếng nói. Con hãy thử bấm lại micro và đọc to hơn nhé!');
        } else if (event.error === 'not-allowed') {
          setHasMicPermission(false);
          setError('Quyền truy cập micro đã bị chặn. Hãy bấm biểu tượng ổ khóa hoặc camera trên thanh địa chỉ để cấp quyền!');
        } else if (event.error === 'network') {
          setError('Lỗi kết nối mạng nhận diện giọng nói. Vui lòng kiểm tra lại mạng Internet!');
        } else {
          setError(`Lỗi nhận diện (${event.error}). Con hãy thử lại nhé!`);
        }
        stopListening();
      };

      recognition.onend = () => {
        setIsListening(false);
        stopAudioAnalyser();
      };

      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      setError('Không thể khởi động micro: ' + (err.message || 'Lỗi không xác định'));
      setIsListening(false);
      stopAudioAnalyser();
    }
  }, [onResultCallback, stopListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  // Simulator helper: useful for testing or when micro is not supported in environment
  const simulateSpeech = useCallback((text: string) => {
    setTranscript(text);
    if (onResultCallback) {
      onResultCallback(text);
    }
  }, [onResultCallback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    isSupported,
    isListening,
    transcript,
    error,
    audioLevel,
    hasMicPermission,
    startListening,
    stopListening,
    resetTranscript,
    requestPermission,
    simulateSpeech,
  };
}
