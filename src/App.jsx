import { useState, lazy } from "react";
import { ArrowRight, Lock, Command, X, ShieldCheck } from "lucide-react";



const Contents = lazy(() => import('./page/Contents/Contents'))
const Menu = lazy(() => import('./components/Menu/Menu'))
const Toast = lazy(() => import('./components/Notify/Toast'))


export default function App() {
  // --- States ---
  const [activeTab, setActiveTab] = useState("home");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  // 1. เพิ่ม State สำหรับเปิด/ปิด Toast
  const [showToast, setShowToast] = useState(false);

  const correctPassword = "095841";

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setShowPasswordModal(false);
      setError(false);

      // 2. สั่งให้ Toast แสดงผลหลังจาก Login สำเร็จ
      setShowToast(true);
    } else {
      setError(true);
      setPassword("");
    }
  };

  // --- 1. หน้าหลักของระบบ (เมื่อผ่านการตรวจสอบแล้ว) ---
  if (isAuthenticated) {
    return (
      <div className="flex flex-col h-screen bg-white font-sans animate-in fade-in duration-1000">
        <div className="flex flex-1 overflow-hidden">
          {/* Side Menu */}
          <Menu activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-gray-50/30 relative">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gray-50 to-transparent pointer-events-none"></div>
            <div className="relative z-10 h-full">
              <Contents activeTab={activeTab} />
            </div>
          </main>
        </div>


        <Toast
          isOpen={showToast}
          onClose={() => setShowToast(false)}
          type="success"
          message="Successfully saved!"
          subMessage="Anyone with a link can now view this file."
        />
      </div>
    );
  }

  // --- 2. หน้า Enter Screen & Minimal Password Modal ---
  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-white font-sans overflow-hidden">

      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-50/30 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-50/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Hero Icon Section */}
      <div className="mb-10 relative z-10 group">
        <div className="p-8 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-center transition-transform duration-700 group-hover:scale-110">
          <Command className="text-gray-900" size={38} strokeWidth={1} />
        </div>
        <div className="absolute inset-0 border border-dashed border-gray-200 rounded-[2.5rem] scale-125 opacity-50"></div>
      </div>

      {/* Branding */}
      <div className="text-center mb-14 relative z-10">
        <h1 className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-black mb-5 leading-none">
          Minimalist Dashboard
        </h1>
        <p className="text-2xl font-light text-gray-900 tracking-tight">
          เริ่มต้นจัดการระบบของคุณ
        </p>
      </div>

      {/* Main Enter Button */}
      <button
        onClick={() => setShowPasswordModal(true)}
        className="group relative flex items-center gap-4 px-14 py-4 bg-gray-900 text-white rounded-full hover:bg-blue-600 transition-all duration-500 active:scale-95 shadow-2xl shadow-gray-200 overflow-hidden"
      >
        <span className="text-xs font-bold uppercase tracking-widest relative z-10">เริ่มต้นใช้งาน</span>
        <ArrowRight size={16} className="relative z-10 group-hover:translate-x-2 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </button>

      {/* --- Password Modal --- */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-white/60 backdrop-blur-3xl animate-in fade-in duration-700"
            onClick={() => { setShowPasswordModal(false); setError(false); }}
          ></div>

          <div className="relative bg-white w-full max-w-[360px] rounded-[3.5rem] border border-gray-100 p-12 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 text-center">

            <div className="mb-10 flex justify-center">
              <div className={`p-5 rounded-full transition-all duration-500 ${error ? 'bg-red-50 text-red-400' : 'bg-gray-50 text-gray-300'}`}>
                {error ? <ShieldCheck size={28} strokeWidth={1.5} /> : <Lock size={28} strokeWidth={1} />}
              </div>
            </div>

            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Authentication</h3>
            <p className="text-sm font-medium text-gray-800 mb-10">ระบุรหัสส่วนตัวของคุณ</p>

            <form onSubmit={handlePasswordSubmit}>
              <div className="relative mb-8">
                <input
                  autoFocus
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••"
                  className={`w-full text-center text-4xl tracking-[0.4em] py-3 border-b-2 bg-transparent focus:outline-none transition-all duration-500 ${error ? 'text-red-500 border-red-200' : 'text-gray-900 border-gray-100 focus:border-gray-900'
                    }`}
                />
                {error && (
                  <p className="absolute -bottom-6 left-0 w-full text-[10px] text-red-500 font-bold uppercase tracking-tighter animate-in fade-in slide-in-from-top-2">
                    รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-4 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 transition-colors duration-300"
              >
                ยืนยันเพื่อเข้าสู่ระบบ
              </button>
            </form>

            <button
              onClick={() => { setShowPasswordModal(false); setError(false); }}
              className="absolute top-10 right-10 text-gray-300 hover:text-gray-500 transition-colors"
            >
              <X size={20} strokeWidth={1} />
            </button>
          </div>
        </div>
      )}

      {/* Mini Footer */}
      <footer className="absolute bottom-10 flex items-center gap-4 text-[9px] text-gray-300 tracking-[0.5em] uppercase">
        <span className="w-8 h-[1px] bg-gray-100"></span>
        Secured Access Only
        <span className="w-8 h-[1px] bg-gray-100"></span>
      </footer>
    </div>
  );
}