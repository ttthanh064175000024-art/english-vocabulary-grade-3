import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp, Shield, Award } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4">
      <div className="bg-white/80 backdrop-blur-xs rounded-2xl border-2 border-amber-200/90 shadow-xs p-4 text-xs text-slate-600 transition-all">
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Info className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-slate-700">
              Lưu ý sư phạm & Quyền riêng tư cho phụ huynh / thầy cô giáo
            </span>
          </div>
          <button className="text-slate-400 hover:text-slate-600">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-2 text-slate-600 leading-relaxed animate-in fade-in duration-150">
            <div className="flex items-start gap-2">
              <Award className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p>
                <strong>Mục tiêu đồng hành ôn luyện Cambridge Pre A1 Starters:</strong> Ứng dụng sử dụng công nghệ nhận diện giọng nói Web Speech API để đối chiếu âm học tương đối với từ và câu mẫu. Ứng dụng không khẳng định thẩm định tuyệt đối từng âm vị chuyên sâu mà tập trung khuyến khích học sinh lớp 3 rèn luyện thói quen tự tin nói to, rõ ràng, phát âm tròn vành rõ chữ.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p>
                <strong>Bảo mật thông tin học sinh:</strong> Ứng dụng hoàn toàn không yêu cầu học sinh cung cấp họ tên, số điện thoại hay thông tin cá nhân. Quyền truy cập micro chỉ được yêu cầu trực tiếp qua trình duyệt khi thu âm luyện nói và không lưu trữ file âm thanh trên máy chủ bên ngoài.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
