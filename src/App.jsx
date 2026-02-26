import { useState, lazy, useEffect, Suspense } from "react";
import { ArrowRight, Lock, Command, X, ShieldCheck } from "lucide-react";

const Contents = lazy(() => import('./page/Contents/Contents'));
const Menu = lazy(() => import('./components/Menu/Menu'));
const Toast = lazy(() => import('./components/Notify/Toast'));

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  
  // 1. สถานะ "เข้าสู่หน้าเว็บ" (ให้คนนอกเข้ามาดูได้)
  const [isEntered, setIsEntered] = useState(() => {
    return sessionStorage.getItem("is_entered") === "true";
  });

  // 2. สถานะ "ล็อกอินแล้ว" (สำหรับ Admin)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("is_auth") === "true";
  });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const correctPassword = "095841";

  const verifyPassword = (inputPassword) => {
    if (inputPassword === correctPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem("is_auth", "true");
      setShowLoginModal(false);
      setError(false);
      setShowToast(true);
    } else {
      setError(true);
      setTimeout(() => setPassword(""), 400); 
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    setPassword(value);
    
    if (value.length === 6) {
      verifyPassword(value);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    verifyPassword(password);
  };

  // ฟังก์ชันกดปุ่มเข้าสู่เว็บไซต์แบบ Guest
  const handleEnterWebsite = () => {
    setIsEntered(true);
    sessionStorage.setItem("is_entered", "true");
  };

  // --- 1. หน้า Dashboard (เมื่อกดเข้าเว็บมาแล้ว ไม่ว่าจะ Login หรือไม่) ---
  if (isEntered) {
    return (
      <div className="flex flex-col h-screen bg-white font-sans animate-in fade-in duration-1000">
        <Suspense fallback={
          <div className="flex items-center justify-center h-screen w-full">
            <div className="animate-pulse text-gray-400 text-sm tracking-widest uppercase">Loading Workspace...</div>
          </div>
        }>
          <div className="flex flex-1 overflow-hidden">
            
            {/* ส่งสถานะ Login และฟังก์ชันเปิด Modal ไปให้ Menu */}
            <Menu 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              isAuthenticated={isAuthenticated}
              onOpenLogin={() => setShowLoginModal(true)} 
            />

            <main className="flex-1 overflow-y-auto bg-gray-50/30 relative">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gray-50 to-transparent pointer-events-none"></div>
              <div className="relative z-10 h-full">
                
                {/* ส่งสถานะ Login ไปให้ Contents เพื่อเปิด/ปิดสิทธิ์การแก้ไขข้อมูล */}
                <Contents 
                  activeTab={activeTab} 
                  isAuthenticated={isAuthenticated} 
                />
              </div>
            </main>
          </div>

          <Toast
            isOpen={showToast}
            onClose={() => setShowToast(false)}
            type="success"
            message="Admin Access Granted"
            subMessage="เข้าสู่ระบบผู้ดูแล สำเร็จเรียบร้อยแล้ว"
          />

          {/* --- Login Modal (ย้ายมาเด้งทับหน้า Dashboard แทน) --- */}
          {showLoginModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <div
                className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm animate-in fade-in duration-500"
                onClick={() => { setShowLoginModal(false); setError(false); setPassword(""); }}
              ></div>

              <div className="relative bg-white w-full max-w-[360px] rounded-[3.5rem] border border-gray-100 p-12 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] animate-in zoom-in-95 slide-in-from-bottom-8 duration-300 text-center">
                <div className="mb-10 flex justify-center">
                  <div className={`p-5 rounded-full transition-all duration-500 ${error ? 'bg-red-50 text-red-400' : 'bg-blue-50 text-blue-500'}`}>
                    {error ? <ShieldCheck size={28} strokeWidth={1.5} /> : <Lock size={28} strokeWidth={1.5} />}
                  </div>
                </div>

                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Admin Login</h3>
                <p className="text-sm font-medium text-gray-800 mb-10">ระบุรหัสส่วนตัวของคุณ (6 หลัก)</p>

                <form onSubmit={handlePasswordSubmit}>
                  <div className={`relative mb-8 ${error ? 'animate-[shake_0.2s_ease-in-out_0s_2]' : ''}`}>
                    <input
                      autoFocus
                      type="password"
                      value={password}
                      onChange={handlePasswordChange}
                      maxLength={6}
                      placeholder="••••••"
                      className={`w-full text-center text-4xl tracking-[0.4em] py-3 border-b-2 bg-transparent focus:outline-none transition-all duration-500 ${error ? 'text-red-500 border-red-200' : 'text-gray-900 border-gray-100 focus:border-gray-900'}`}
                    />
                    <div className="absolute bottom-0 left-0 h-[2px] bg-blue-500 transition-all duration-300" style={{ width: `${(password.length / 6) * 100}%` }}></div>
                    {error && <p className="absolute -bottom-6 left-0 w-full text-[10px] text-red-500 font-bold uppercase tracking-tighter animate-in fade-in slide-in-from-top-2">รหัสผ่านไม่ถูกต้อง</p>}
                  </div>
                  <button type="submit" className="hidden">ยืนยัน</button>
                </form>

                <button
                  onClick={() => { setShowLoginModal(false); setError(false); setPassword(""); }}
                  className="absolute top-8 right-8 text-gray-300 hover:text-gray-500 transition-colors"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          )}

        </Suspense>
      </div>
    );
  }

  // --- 2. หน้า Landing Page (เข้าเว็บโดยไม่ต้องใส่รหัส) ---
  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-white font-sans overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-50/30 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-50/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="mb-10 relative z-10 group">
        <div className="p-8 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-center transition-transform duration-700 group-hover:scale-110">
          <Command className="text-gray-900" size={38} strokeWidth={1} />
        </div>
        <div className="absolute inset-0 border border-dashed border-gray-200 rounded-[2.5rem] scale-125 opacity-50"></div>
      </div>

      <div className="text-center mb-14 relative z-10">
        <h1 className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-black mb-5 leading-none">
          Minimalist Dashboard
        </h1>
        <p className="text-2xl font-light text-gray-900 tracking-tight">
          เริ่มต้นจัดการระบบของคุณ
        </p>
      </div>

      <button
        onClick={handleEnterWebsite}
        className="group relative flex items-center gap-4 px-14 py-4 bg-gray-900 text-white rounded-full hover:bg-blue-600 transition-all duration-500 active:scale-95 shadow-2xl shadow-gray-200 overflow-hidden"
      >
        <span className="text-xs font-bold uppercase tracking-widest relative z-10">เข้าสู่หน้าเว็บไซต์</span>
        <ArrowRight size={16} className="relative z-10 group-hover:translate-x-2 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </button>

      <footer className="absolute bottom-10 flex items-center gap-4 text-[9px] text-gray-300 tracking-[0.5em] uppercase">
        <span className="w-8 h-[1px] bg-gray-100"></span>
        Public Access Allowed
        <span className="w-8 h-[1px] bg-gray-100"></span>
      </footer>
    </div>
  );
}