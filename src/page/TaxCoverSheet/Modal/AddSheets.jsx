import React, { useState } from "react";
import { X, Plus, Link, Type, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { useCoverSheetStore } from '../../../store/useCoverSheetStore';
import Toast from '../../../components/Notify/Toast'; // 🌟 อย่าลืมเปลี่ยน Path ให้ชี้ไปที่ไฟล์ Toast ของคุณนะครับ

export default function AddSheets({ isOpen, onClose }) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🌟 1. สร้าง State สำหรับควบคุม Toast
  const [toast, setToast] = useState({
    isOpen: false,
    type: "success",
    message: "",
    subMessage: ""
  });

  const { addCoverSheet } = useCoverSheetStore();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    // 🌟 2. เปลี่ยน Alert แจ้งเตือนกรอกข้อมูลไม่ครบ เป็น Warning Toast
    if (!name.trim() || !url.trim()) {
      setToast({
        isOpen: true,
        type: "warning",
        message: "ข้อมูลไม่ครบถ้วน",
        subMessage: "กรุณากรอกชื่อเดือนและลิงก์ Google Sheet ให้ครบครับ"
      });
      return;
    }

    setIsSubmitting(true);
    const res = await addCoverSheet(name, url);
    setIsSubmitting(false);

    if (res.success) {
      // เซฟผ่าน: ล้างค่าช่องกรอก แล้วปิด Modal ทันที
      setName('');
      setUrl('');
      onClose();
      
      // 💡 หมายเหตุ: ถ้าอยากโชว์ Success Toast ตอนเซฟผ่านด้วย 
      // แนะนำให้เอา State Toast ไปไว้ที่หน้าจอหลัก (ไฟล์แม่) จะดีกว่าครับ 
      // เพราะถ้าสั่งโชว์ตรงนี้ พอ Component Modal ปิดลง Toast อาจจะหายไปด้วยครับ
    } else {
      // 🌟 3. เปลี่ยน Alert แจ้งเตือน Error เป็น Error Toast
      setToast({
        isOpen: true,
        type: "error",
        message: "เกิดข้อผิดพลาดในการบันทึก",
        subMessage: res.error || "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้"
      });
    }
  };

  return (
    <>
      {/* 🌟 4. วาง Component Toast ไว้บนสุด (นอก AnimatePresence) */}
      <Toast 
        isOpen={toast.isOpen} 
        onClose={() => setToast({ ...toast, isOpen: false })}
        type={toast.type}
        message={toast.message}
        subMessage={toast.subMessage}
      />

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm"
              onClick={onClose}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative bg-white w-full max-w-sm rounded-[2rem] border border-gray-100 shadow-2xl p-8"
            >
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all active:scale-90"
              >
                <X size={20} strokeWidth={2.5} />
              </button>

              <div className="mb-6">
                <h3 className="text-xl font-black text-gray-900 tracking-tight">เพิ่มใบปะหน้า</h3>
                <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">
                  Add Cover Sheets
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500">
                    <Type size={18} className="text-gray-400 group-focus-within:text-blue-500" />
                  </div>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ชื่อเดือน (เช่น 03-2569)"
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Link size={18} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="url"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="วางลิงก์ Google Sheet ที่นี่"
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 w-full mt-2 py-3.5 bg-gray-900 text-white rounded-2xl text-sm font-bold shadow-md shadow-gray-900/10 hover:bg-gray-800 hover:shadow-lg transition-all active:scale-[0.98] disabled:bg-gray-400"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} strokeWidth={3} />}
                  {isSubmitting ? "กำลังบันทึก..." : "เพิ่มข้อมูล"}
                </button>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}