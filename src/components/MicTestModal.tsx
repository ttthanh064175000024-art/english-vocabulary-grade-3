import React, { useState, useEffect } from 'react';
import { X, Mic, Volume2, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRequestPermission: () => Promise<boolean>;
  isSpeechSupported: boolean;
}

export const MicTestModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onRequestPermission,
  isSpeechSupported,
}) => {
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [volumeLevel, setVolumeLevel] = useState<number>(0);
  const [testHeardWord, setTestHeardWord] = useState<string>('');

  useEffect(() => {
    if (!isOpen) {
      setTestStatus('idle');
      setErrorMessage(null);
      setVolumeLevel(0);
      setTestHeardWord('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartTest = async () => {
    soundEffects.playClick();
    setTestStatus('testing');
    setErrorMessage(null);
    setTestHeardWord('');

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Trình duyệt không hỗ trợ Web Audio / getUserMedia');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Audio level analyser
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      const buffer = new Uint8Array(analyser.frequencyBinCount);
      let animId: number;

      const checkVolume = () => {
        analyser.getByteFrequencyData(buffer);
        let sum = 0;
        for (let i = 0; i < buffer.length; i++) {
          sum += buffer[i];
        }
        const avg = sum / buffer.length;
        const norm = Math.min(100, Math.round((avg / 128) * 100));
        setVolumeLevel(norm);
        animId = requestAnimationFrame(checkVolume);
      };

      checkVolume();

      // Test recognition if supported
      const win = window as any;
      const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = true;

        recognition.onresult = (e: any) => {
          const text = e.results[0][0].transcript;
          setTestHeardWord(text);
          if (text) {
            setTestStatus('success');
            soundEffects.playSuccess();
          }
        };

        recognition.onerror = () => {
          // Even if speech recognition had no speech, mic stream worked
          setTestStatus('success');
        };

        recognition.start();

        setTimeout(() => {
          try {
            recognition.stop();
          } catch (e) {}
        }, 5000);
      } else {
        // Just mic stream success
        setTestStatus('success');
        soundEffects.playSuccess();
      }

      // Stop stream after 6 seconds
      setTimeout(() => {
        cancelAnimationFrame(animId);
        ctx.close().catch(() => {});
        stream.getTracks().forEach(t => t.stop());
      }, 6000);
    } catch (err: any) {
      console.warn('Mic test error:', err);
      setTestStatus('failed');
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage('Quyền truy cập Micro bị từ chối. Vui lòng cho phép truy cập Micro trên trình duyệt để sử dụng.');
      } else {
        setErrorMessage(err.message || 'Không tìm thấy thiết bị Microphone hoạt động.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full border-4 border-amber-300 shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center text-2xl">
            🎙️
          </div>
          <div>
            <h3 className="font-black text-xl text-slate-800">Kiểm tra Micro & Thiết bị</h3>
            <p className="text-xs text-slate-500 font-semibold">
              Kiểm tra để sẵn sàng luyện nói tiếng Anh Cambridge Starters
            </p>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-900 font-medium">
            <strong className="font-bold">Bảo vệ quyền riêng tư:</strong> Ứng dụng chỉ sử dụng Micro để nhận diện phát âm trực tiếp trên trình duyệt, không lưu trữ âm thanh hay yêu cầu bất kỳ thông tin cá nhân nào của học sinh.
          </p>
        </div>

        {/* Browser check */}
        <div className="mb-5 bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5 text-xs sm:text-sm">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700">Công nghệ nhận diện giọng nói:</span>
            {isSpeechSupported ? (
              <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                <CheckCircle2 className="w-3.5 h-3.5" /> Sẵn sàng
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                <AlertTriangle className="w-3.5 h-3.5" /> Chưa hỗ trợ
              </span>
            )}
          </div>

          <div className="text-xs text-slate-500">
            Khuyên dùng: <strong>Google Chrome</strong> hoặc <strong>Microsoft Edge</strong> trên máy tính, điện thoại Android, hoặc <strong>Safari</strong> trên iPad/iPhone.
          </div>
        </div>

        {/* Test live area */}
        <div className="text-center py-4 bg-amber-50/50 rounded-2xl border-2 border-dashed border-amber-200 mb-5">
          {testStatus === 'idle' && (
            <div>
              <p className="text-slate-700 font-bold text-sm mb-3">
                Bấm nút dưới đây để kiểm tra kết nối micro của bạn
              </p>
              <button
                onClick={handleStartTest}
                className="px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-sm shadow-md shadow-sky-200 transition-all active:scale-95 inline-flex items-center gap-2"
              >
                <Mic className="w-4 h-4" />
                <span>Bắt đầu kiểm tra Micro</span>
              </button>
            </div>
          )}

          {testStatus === 'testing' && (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-rose-500 text-white flex items-center justify-center animate-pulse mb-3">
                <Mic className="w-8 h-8" />
              </div>
              <p className="font-black text-rose-600 text-base mb-2">Đang lắng nghe... Hãy nói một từ (ví dụ: "Hello" hoặc "Book")</p>
              
              {/* Visual meter */}
              <div className="w-48 h-3 bg-slate-200 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-emerald-500 transition-all duration-75"
                  style={{ width: `${Math.min(100, volumeLevel * 2)}%` }}
                />
              </div>
              <span className="text-xs text-slate-500 font-medium">Âm lượng phát hiện: {volumeLevel}%</span>
            </div>
          )}

          {testStatus === 'success' && (
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mb-2">
                🎉
              </div>
              <h4 className="font-black text-emerald-800 text-base mb-1">Micro hoạt động rất tốt!</h4>
              {testHeardWord && (
                <p className="text-xs font-bold text-slate-600 bg-white px-3 py-1 rounded-lg border border-slate-200 mb-2">
                  Hệ thống nghe được: "{testHeardWord}"
                </p>
              )}
              <p className="text-xs text-slate-500 max-w-xs">
                Bạn đã sẵn sàng để luyện phát âm cùng các từ vựng Starters rồi!
              </p>
            </div>
          )}

          {testStatus === 'failed' && (
            <div className="flex flex-col items-center text-rose-600 px-3">
              <AlertTriangle className="w-10 h-10 mb-2" />
              <h4 className="font-black text-sm mb-1">Chưa thể kết nối Microphone</h4>
              <p className="text-xs text-slate-600 mb-3">{errorMessage}</p>
              <button
                onClick={handleStartTest}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Thử lại lần nữa
              </button>
            </div>
          )}
        </div>

        {/* Instructions to enable mic */}
        <div className="bg-slate-50 p-3 rounded-xl text-[11px] text-slate-500 space-y-1">
          <p className="font-bold text-slate-700">Hướng dẫn nếu micro chưa hoạt động:</p>
          <ul className="list-disc pl-4 space-y-0.5">
            <li>Bấm vào biểu tượng ổ khóa hoặc camera trên thanh địa chỉ URL.</li>
            <li>Chọn "Cho phép" (Allow) ở mục Microphone.</li>
            <li>Sau đó tải lại trang hoặc bấm "Thử lại".</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm transition-all shadow-md shadow-amber-200"
          >
            Đã hiểu, vào luyện tập ngay!
          </button>
        </div>
      </div>
    </div>
  );
};
