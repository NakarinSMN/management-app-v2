import React, { useState } from "react";
import {
  History,
  Trash2,
  Zap,
  ArrowUpRight,
  CheckCircle2,
  Info,
  AlertCircle,
  X,
} from "lucide-react";

const getTimelineItemStyle = (type) => {
  switch (type) {
    case "applied":
      return {
        icon: <Info size={14} className="text-gray-500" />,
        bgColor: "bg-gray-100",
      };
    case "advanced":
      return {
        icon: <Zap size={14} className="text-blue-500" />,
        bgColor: "bg-blue-50",
      };
    case "completed":
      return {
        icon: <CheckCircle2 size={14} className="text-green-500" />,
        bgColor: "bg-green-50",
      };
    default:
      return {
        icon: <ArrowUpRight size={14} className="text-gray-400" />,
        bgColor: "bg-gray-50",
      };
  }
};

export default function Historyfeed({ historyList, setHistoryList }) {
  // 1. เพิ่ม State สำหรับควบคุมการเปิด/ปิด Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirmClear = () => {
    setHistoryList([]);
    setIsModalOpen(false);
  };

  return (
    <div className="w-full relative">
      {/* ส่วนหัว */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 border-dashed">
        <div className="flex items-center gap-2">
          <History size={18} className="text-gray-600" />
          <h2 className="text-base font-bold text-gray-800">
            ประวัติการใช้งาน
          </h2>
        </div>
        {historyList.length > 0 && (
          <button
            onClick={() => setIsModalOpen(true)} // เปิด Modal แทน confirm แบบเดิม
            className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
          >
            <Trash2 size={14} /> ล้างทั้งหมด
          </button>
        )}
      </div>

      {/* เนื้อหาประวัติ */}
      {historyList.length === 0 ? (
        <div className="flex max-h-112 h-112 flex-col items-center justify-center py-10 text-gray-300 text-center">
          <History size={30} strokeWidth={1} className="mb-2" />
          <p className="text-xs italic">ไม่มีประวัติการคำนวณในเครื่องนี้</p>
        </div>
      ) : (
        <div className="max-h-112 h-112 overflow-y-auto pr-2 custom-scrollbar">
          <div className="flow-root">
            <ul role="list" className="-mb-8">
              {historyList.map((item, itemIdx) => {
                const { bgColor, icon } = getTimelineItemStyle(item.type);
                return (
                  <li key={item.id} className="relative pb-8 group">
                    {itemIdx !== historyList.length - 1 && (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-100"
                        aria-hidden="true"
                      ></span>
                    )}
                    <div className="relative flex items-start space-x-3">
                      <div
                        className={`h-8 w-8 rounded-lg flex items-center justify-center ring-4 ring-white ${bgColor} transition-transform group-hover:scale-110`}
                      >
                        {icon}
                      </div>
                      <div className="min-w-0 flex-1 flex justify-between gap-2">
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-tighter font-medium">
                            {item.title}
                          </p>
                          <p className="text-xs font-bold text-gray-700 leading-tight">
                            {item.subject}
                          </p>
                        </div>
                        <time className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                          {item.date}
                        </time>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* 2. Tailwind Modal Dialog */}
      {/* 2. Super Minimalist Tailwind Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          {/* Overlay: เน้นความโปร่งใสและเบลอเบาๆ */}
          <div
            className="absolute inset-0 bg-white/5 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* กล่อง Modal: ตัดเงาที่หนักออก ใช้เพียงเส้นขอบบางๆ และความโค้งมน */}
          <div className="relative bg-white w-full max-w-[320px] rounded-2xl shadow-xl border border-gray-100 p-10 text-center animate-in fade-in zoom-in-95 duration-300">
            {/* ไอคอนแจ้งเตือน: ใช้เส้นที่บางมาก (strokeWidth={1}) */}
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gray-50 rounded-full">
                <AlertCircle
                  className="text-gray-400"
                  size={32}
                  strokeWidth={1}
                />
              </div>
            </div>

            <h3 className="text-base font-bold text-gray-900 mb-2 tracking-tight">
              ยืนยันการล้างข้อมูล
            </h3>
            <p className="text-xs text-gray-400 mb-10 leading-relaxed px-2">
              ประวัติการคำนวณทั้งหมดจะถูกลบออก <br /> และไม่สามารถกู้คืนได้
            </p>

            {/* ปุ่มกดสไตล์มินิมอล: ใช้ Ghost Button และตัวหนังสือสีแดงจางๆ */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleConfirmClear}
                className="w-full py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-all"
              >
                ล้างประวัติทั้งหมด
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full py-3 text-sm font-medium text-gray-400 hover:text-gray-600 transition-all"
              >
                ยกเลิก
              </button>
            </div>

            {/* ปุ่มปิดมุมบน: เล็กและจางที่สุด */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-gray-300 hover:text-gray-500 transition-colors"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
