import { 
  Home, 
  CircleUserRound, 
  ShoppingBasket, 
  Tags, 
  BriefcaseBusiness, 
  ToolCase, 
  ReceiptText, 
  Code2,
  LogOut,
  Settings,
  ShieldCheck,
  MessageSquare,
  ChevronUp,
  CircleUser,
  Lock // เพิ่ม Icon Lock สำหรับปุ่ม Login
} from "lucide-react";
import MenuButton from "../GlobalButton/MenuButton";
import SubmenuGroup from "../GlobalButton/SubmenuGroup";
import Toast from "../Notify/Toast";
import { useState, lazy, Suspense, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// 1. Lazy Load ตัว Modal
const DevModal = lazy(() => import("../Modal/DevModal"));

// 2. ข้อมูลเมนู
const menuList = [
  { id: "home", title: "หน้าหลัก", subtitle: "Home", icon: Home },
  {
    id: "data-tax",
    title: "งานภาษีข้อมูลลูกค้า",
    subtitle: "Invoice & Tax",
    icon: Tags,
    children: [
      { id: "vehicle-tax", title: "ต่อภาษีประจำปี", subtitle: "Vehicle Tax" },
      { id: "notification-board", title: "กระดานแจ้งเตือนต่อภาษี", subtitle: "Notification Board" },
    ],
  },
  {
    id: "insurance-work",
    title: "งานประกัน",
    subtitle: "Insurance work",
    icon: BriefcaseBusiness,
  },
  {
    id: "tools",
    title: "เครื่องมือ",
    subtitle: "Tools",
    icon: ToolCase,
    children: [
      { id: "tax-cover-sheet", title: "ใบปะหน้าภาษี", subtitle: "Tax cover sheet" },
      { id: "insurance", title: "ปรับรอบพรบ.", subtitle: "Insurance Synchronization" },
    ],
  },
  {
    id: "billing",
    title: "ออกบิลและใบเสร็จ",
    subtitle: "billing",
    icon: ReceiptText,
    children: [
      { id: "car-bill", title: "บิลรถยนต์", subtitle: "car bill" },
      { id: "motorcycle-bill", title: "บิลรถจักรยานยนต์", subtitle: "motorcycle bill" },
      { id: "orther-bill", title: "บิลอื่นๆ", subtitle: "other bill" },
    ],
  },
  {
    id: "items",
    title: "ราคางานบริการ",
    subtitle: "item shop",
    icon: ShoppingBasket,
  },
];

const menuOthers = [
  { id: "developer-page", title: "ผู้พัฒนา", subtitle: "Developer Page", icon: Code2 },
];

export default function Menu({ isAuthenticated, onOpenLogin }) {
  const [isDevModalOpen, setIsDevModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); 
  
  const profileRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // ใช้ Location จาก Router โดยตรง
  const currentTab = location.pathname === "/" ? "home" : location.pathname.substring(1);

  const handleNavigate = (id) => {
    navigate(id === "home" ? "/" : `/${id}`);
    setIsProfileOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <Toast isOpen={showToast} onClose={() => setShowToast(false)} type="success" message="Developer Mode Activated" />

      {isDevModalOpen && (
        <Suspense fallback={null}>
          <DevModal 
            onClose={() => setIsDevModalOpen(false)} 
            onSuccess={() => {
              setIsDevModalOpen(false);
              setShowToast(true);
              handleNavigate("developer-page");
            }} 
          />
        </Suspense>
      )}

      {/* Sidebar UI */}
      <div className="flex flex-col h-screen w-70 bg-slate-50 text-slate-800 shadow-xl border-r border-slate-200 relative">
        
        {/* Header โลโก้ & User */}
        <div className="relative h-24 shrink-0 border-b border-blue-100 bg-white flex items-center px-6">
          <div className="flex items-center gap-2">
            <CircleUserRound 
              onClick={() => handleNavigate("home")} 
              className="text-blue-500 cursor-pointer hover:rotate-12 transition-all active:scale-90" 
              size={28} 
            />
            <div className="flex flex-col">
              <span className="text-md font-bold text-slate-700 tracking-tight">ตรอ.บังรีท่าอิฐ</span>
              <span className="text-[10px] text-slate-400 uppercase font-medium">
                {isAuthenticated ? "Admin Access" : "Guest Mode"}
              </span>
            </div>
          </div>
        </div>

        {/* รายการเมนู */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar">
          {menuList.map((item) =>
            item.children ? (
              <SubmenuGroup key={item.id} item={item} activeTab={currentTab} setActiveTab={handleNavigate} />
            ) : (
              <MenuButton key={item.id} icon={item.icon} title={item.title} subtitle={item.subtitle} isActive={currentTab === item.id} onClick={() => handleNavigate(item.id)} />
            )
          )}

          <div className="pt-6 pb-2 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center">
            - Others -
          </div>

          {menuOthers.map((item) => (
            <MenuButton
              key={item.id}
              icon={item.icon}
              title={item.title}
              subtitle={item.subtitle}
              isActive={currentTab === item.id}
              onClick={() => item.id === "developer-page" ? setIsDevModalOpen(true) : handleNavigate(item.id)}
            />
          ))}
        </div>

        {/* --- ส่วนล่างสุด: แสดงผลตามสถานะ Login --- */}
        <div className="p-4 border-t border-slate-200 bg-white/50 relative" ref={profileRef}>
          {isAuthenticated ? (
            <>
              {/* Admin Mode: แสดง Profile และเมนู Sign Out */}
              {isProfileOpen && (
                <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-2xl border border-slate-100 shadow-2xl py-2 animate-in fade-in slide-in-from-bottom-2 duration-300 z-50">
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                    <CircleUserRound size={16} className="text-slate-400" /> My profile
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                    <Settings size={16} className="text-slate-400" /> Settings
                  </button>
                  <div className="h-px bg-slate-100 my-1 mx-2" />
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                    <ShieldCheck size={16} className="text-slate-400" /> Privacy policy
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                    <MessageSquare size={16} className="text-slate-400" /> Share feedback
                  </button>
                  <div className="h-px bg-slate-100 my-1 mx-2" />
                  <button 
                    onClick={() => { sessionStorage.clear(); window.location.reload(); }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors font-bold"
                  >
                    <LogOut size={16} /> Sign out
                  </button>
                </div>
              )}

              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-300 ${isProfileOpen ? 'bg-slate-100' : 'hover:bg-slate-100'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 shadow-inner flex items-center justify-center text-white">
                    <CircleUser size={24} />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-bold text-slate-700 leading-none">Admin</span>
                    <span className="text-[10px] text-slate-400 font-medium truncate w-32">bangree@example.com</span>
                  </div>
                </div>
                <ChevronUp size={16} className={`text-slate-300 transition-transform duration-500 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>
            </>
          ) : (
            /* Guest Mode: แสดงปุ่ม Login */
            <button 
              onClick={onOpenLogin}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-gray-900 text-white rounded-2xl hover:bg-blue-600 transition-all duration-300 active:scale-95 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
            >
              <Lock size={16} className="text-white/80" />
              <span className="text-sm font-bold tracking-wide">เข้าสู่ระบบ (Login)</span>
            </button>
          )}
        </div>

      </div>
    </>
  );
}