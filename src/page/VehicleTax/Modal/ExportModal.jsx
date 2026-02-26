import React from "react";
import { X, FileJson, FileSpreadsheet, FileText } from "lucide-react";

export default function ExportModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const exportTypes = [
    { name: "Excel Spreadsheet", ext: ".xlsx", icon: FileSpreadsheet, color: "text-green-500", bg: "bg-green-50" },
    { name: "CSV Document", ext: ".csv", icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
    { name: "JSON Data", ext: ".json", icon: FileJson, color: "text-orange-500", bg: "bg-orange-50" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-white/60 backdrop-blur-md animate-in fade-in duration-500" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] border border-gray-100 shadow-2xl p-10 animate-in zoom-in-95 duration-300">
        <h3 className="text-lg font-black text-gray-900 mb-2">ส่งออกข้อมูล</h3>
        <p className="text-xs text-gray-400 mb-8 font-medium uppercase tracking-widest">Select your format</p>
        
        <div className="flex flex-col gap-3">
          {exportTypes.map((type) => (
            <button key={type.ext} className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 hover:border-blue-100 hover:bg-blue-50/30 transition-all group">
              <div className="flex items-center gap-4">
                <div className={`p-2 ${type.bg} ${type.color} rounded-xl`}><type.icon size={20} /></div>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-700">{type.name}</p>
                  <p className="text-[10px] text-gray-400 font-medium uppercase">{type.ext}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}