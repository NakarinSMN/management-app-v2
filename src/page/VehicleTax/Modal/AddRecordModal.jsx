import React from "react";
import { X, Save } from "lucide-react";

export default function AddRecordModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-md animate-in fade-in duration-500" onClick={onClose}></div>
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] border border-gray-100 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] p-8 md:p-10 animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-300 hover:text-gray-900 transition-colors">
          <X size={20} />
        </button>

        <div className="mb-8">
          <h3 className="text-xl font-black text-gray-900 tracking-tight">เพิ่มรายการใหม่</h3>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-1">Vehicle Tax Registration</p>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">ทะเบียนรถ</label>
            <input type="text" placeholder="กค 1234" className="px-4 py-3 bg-gray-50 border-transparent rounded-2xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">จังหวัด</label>
            <input type="text" placeholder="นนทบุรี" className="px-4 py-3 bg-gray-50 border-transparent rounded-2xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all" />
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">ชื่อลูกค้า</label>
            <input type="text" placeholder="ระบุชื่อ-นามสกุล" className="px-4 py-3 bg-gray-50 border-transparent rounded-2xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">เบอร์โทรศัพท์</label>
            <input type="tel" placeholder="08x-xxx-xxxx" className="px-4 py-3 bg-gray-50 border-transparent rounded-2xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">ยี่ห้อรถ</label>
            <input type="text" placeholder="Toyota, Honda..." className="px-4 py-3 bg-gray-50 border-transparent rounded-2xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all" />
          </div>

          <div className="md:col-span-2 mt-6 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-4 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">ยกเลิก</button>
            <button type="submit" className="flex-[2] py-4 bg-gray-900 text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-gray-200">
              <Save size={18} /> บันทึกข้อมูล
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}