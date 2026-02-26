import { useState } from "react";
import { Code2, Eye, EyeOff } from "lucide-react";

export default function DevModal({ onClose, onSuccess }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const handleConfirm = () => {
    if (password === "240444") {
      onSuccess(); // ถ้ารหัสถูก ให้เรียกฟังก์ชันที่ส่งมาจาก Menu
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-xs animate-in fade-in duration-500" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[340px] rounded-[3rem] border border-gray-100 p-10 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 border border-dashed border-gray-200 rounded-full flex items-center justify-center mb-6">
            <Code2 size={32} strokeWidth={1} className="text-gray-400" />
          </div>
          <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Developer Access</h3>
          <p className="text-sm font-medium text-gray-800 mb-10">กรุณายืนยันรหัสผ่านผู้พัฒนา</p>

          <div className="w-full mb-10 relative">
            <input
              autoFocus
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(false);
              }}
              placeholder="••••"
              className={`w-full bg-transparent text-center text-2xl tracking-[0.5em] py-2 border-b-2 transition-all duration-500 outline-none ${
                error ? "border-red-200 text-red-500" : "border-gray-100 text-gray-900 focus:border-gray-900"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-900"
            >
              {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
            </button>
            {error && <span className="absolute -bottom-6 left-0 w-full text-[10px] text-red-500 font-bold uppercase tracking-tighter animate-in fade-in">รหัสผ่านไม่ถูกต้อง</span>}
          </div>

          <div className="flex flex-col w-full gap-2">
            <button onClick={handleConfirm} disabled={!password} className="w-full py-4 bg-gray-900 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-20 shadow-lg">
              Confirm Access
            </button>
            <button onClick={onClose} className="w-full py-3 text-[10px] font-bold text-gray-300 hover:text-gray-500 uppercase tracking-widest transition-all">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}