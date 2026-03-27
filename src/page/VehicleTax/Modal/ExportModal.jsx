import React from "react";
import { X, FileJson, FileSpreadsheet, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ExportModal({ isOpen, onClose }) {
  const exportTypes = [
    { name: "Excel Spreadsheet", ext: ".xlsx", icon: FileSpreadsheet, color: "text-green-600", bg: "bg-green-100" },
    { name: "CSV Document", ext: ".csv", icon: FileText, color: "text-blue-600", bg: "bg-blue-100" },
    { name: "JSON Data", ext: ".json", icon: FileJson, color: "text-orange-600", bg: "bg-orange-100" },
  ];

  return (
    // 🌟 1. ครอบด้วย AnimatePresence เพื่อให้มีแอนิเมชั่นตอนปิด
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          
          {/* 🌟 2. แอนิเมชั่นพื้นหลัง (Fade in / Fade out) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm"
            onClick={onClose}
          ></motion.div>

          {/* 🌟 3. แอนิเมชั่นตัวกล่อง Modal (เด้งขึ้นมา + ขยายขนาด) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative bg-white w-full max-w-sm rounded-[2rem] border border-gray-100 shadow-2xl p-8"
          >
            {/* 🌟 เพิ่มปุ่มกากบาท (X) มุมขวาบน */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all active:scale-90"
            >
              <X size={20} strokeWidth={2.5} />
            </button>

            <h3 className="text-xl font-black text-gray-900 tracking-tight mb-1">ส่งออกข้อมูล</h3>
            <p className="text-[10px] text-gray-400 mb-6 font-bold uppercase tracking-widest">
              Select your format
            </p>

            <div className="flex flex-col gap-3">
              {exportTypes.map((type) => (
                <button
                  key={type.ext}
                  // 🌟 เพิ่ม active:scale-[0.98] ให้ปุ่มยุบลงเวลากด
                  className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 hover:border-blue-100 hover:bg-blue-50/50 hover:shadow-sm transition-all group active:scale-[0.98]"
                >
                  <div className="flex items-center gap-4">
                    {/* 🌟 เพิ่ม group-hover:scale-110 ให้ไอคอนขยายขึ้นเวลาชี้เมาส์ */}
                    <div className={`p-2.5 ${type.bg} ${type.color} rounded-xl group-hover:scale-110 transition-transform`}>
                      <type.icon size={22} strokeWidth={2.5} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
                        {type.name}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        {type.ext}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}