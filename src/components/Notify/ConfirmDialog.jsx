import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = "ยืนยัน", isDestructive = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-gray-100"
      >
        <div className="flex flex-col items-center text-center">
          <div className={`p-4 rounded-full mb-4 ${isDestructive ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'}`}>
            <AlertTriangle size={32} />
          </div>
          
          <h3 className="text-xl font-black text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-500 text-sm font-medium mb-8 leading-relaxed">
            {message}
          </p>
          
          <div className="flex gap-3 w-full">
            <button 
              onClick={onClose} 
              className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors"
            >
              ยกเลิก
            </button>
            <button 
              onClick={onConfirm} 
              className={`flex-1 py-3.5 rounded-2xl text-sm font-bold text-white transition-all active:scale-95 shadow-lg ${
                isDestructive 
                ? 'bg-red-500 hover:bg-red-600 shadow-red-200' 
                : 'bg-gray-900 hover:bg-gray-800 shadow-gray-200'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}