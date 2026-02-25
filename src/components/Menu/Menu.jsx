import {
  Home,
  CircleUserRound,
  ShoppingBasket,
  LogInIcon,
  Tags,
  BriefcaseBusiness,
  ToolCase,
  ReceiptText,
  Eye,
  EyeOff,
  Lock,
  Code2,
} from "lucide-react";
import MenuButton from "../GobalButton/MenuButton";
import SubmenuGroup from "../GobalButton/SubmenuGroup";
import { useState } from "react";
import Toast from "../Notify/Toast";

export default function Menu({ activeTab, setActiveTab }) {
  const [isDevModalOpen, setIsDevModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleConfirm = () => {
    if (password === "240444") {
      setActiveTab("developer-page");
      setIsDevModalOpen(false);
      setPassword("");
      setError(false);

      // สั่งเปิด Toast เมื่อรหัสถูก
      setShowToast(true);
    } else {
      setError(true);
    }
  };

  const menuList = [
    { id: "home", title: "หน้าหลัก", subtitle: "Home", icon: Home },
    {
      id: "data-tax",
      title: "งานภาษีขอมูลลูกค้า",
      subtitle: "Invoice & Tax",
      icon: Tags,
      children: [
        { id: "vehicle-tax", title: "ต่อภาษีประจำปี", subtitle: "Vehicle Tax" },
        {
          id: "notification-board",
          title: "กระดานแจ้งเตือนต่อภาษี",
          subtitle: "Notification Board",
        },
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
        {
          id: "tax-cover-sheet",
          title: "ใบปะหน้าภาษี",
          subtitle: "Tax cover sheet",
        },
        {
          id: "insurance",
          title: "ปรับรอบพรบ.",
          subtitle: "Insurance Synchronization",
        },
      ],
    },
    {
      id: "billing",
      title: "ออกบิลและใบเสร็จ",
      subtitle: "billing",
      icon: ReceiptText,
      children: [
        { id: "car-bill", title: "บิลรถยนต์", subtitle: "car bill" },
        {
          id: "motorcycle-bill",
          title: "บิลรถจักรยานยนต์",
          subtitle: "motorcycle bill",
        },
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
    {
      id: "developer-page",
      title: "ผู้พัฒนา",
      subtitle: "Developer Page",
      icon: Code2,
    },
  ];

  const hdlLogin = () => {
    alert("ฟีเจอร์นี้ยังไม่พร้อมใช้งานครับ");
  };

  return (
    <>
      <Toast
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        type="success"
        message="Successfully saved!"
        subMessage="Anyone with a link can now view this file."
      />

      {isDevModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
          {/* 1. Backdrop: ใช้สีขาวโปร่งแสง + Blur ขั้นสุด */}
          <div
            className="absolute inset-0 bg-white/10 backdrop-blur-xs animate-in fade-in duration-500"
            onClick={() => {
              setIsDevModalOpen(false);
              setError(false);
              setPassword("");
            }}
          />

          {/* 2. Modal Card: ขอบโค้งมนพิเศษ และเส้นขอบจางๆ */}
          <div className="relative bg-white w-full max-w-[340px] rounded-[3rem] border border-gray-100 p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center">
              {/* ส่วนไอคอน: เปลี่ยนเป็นวงกลมเส้นประจางๆ */}
              <div className="w-20 h-20 border border-dashed border-gray-200 rounded-full flex items-center justify-center mb-6">
                <Code2 size={32} strokeWidth={1} className="text-gray-400" />
              </div>

              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">
                Developer Access
              </h3>
              <p className="text-sm font-medium text-gray-800 mb-10">
                กรุณายืนยันรหัสผ่านผู้พัฒนา
              </p>

              {/* 3. Password Input: สไตล์มินิมอล (Centered Ghost Input) */}
              <div className="w-full mb-10 relative">
                <div className="relative">
                  <input
                    autoFocus
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(false);
                    }}
                    placeholder="••••"
                    className={`
                w-full bg-transparent text-center text-2xl tracking-[0.5em] py-2 border-b-2 transition-all duration-500 outline-none
                ${
                  error
                    ? "border-red-200 text-red-500 placeholder:text-red-200"
                    : "border-gray-100 text-gray-900 placeholder:text-gray-200 focus:border-gray-900"
                }
              `}
                  />

                  {/* Toggle Show Password: วางไว้มุมขวาแบบจางๆ */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-900 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff size={16} strokeWidth={1.5} />
                    ) : (
                      <Eye size={16} strokeWidth={1.5} />
                    )}
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <span className="absolute -bottom-6 left-0 w-full text-[10px] text-red-500 font-bold uppercase tracking-tighter animate-in fade-in slide-in-from-top-2">
                    รหัสผ่านไม่ถูกต้อง
                  </span>
                )}
              </div>

              {/* 4. Action Buttons: ใช้ปุ่มแบบ Ghost และปุ่มหลักที่ดูเบาขึ้น */}
              <div className="flex flex-col w-full gap-2">
                <button
                  onClick={handleConfirm}
                  disabled={!password}
                  className="w-full py-4 bg-gray-900 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-blue-600 transition-all duration-300 active:scale-95 disabled:opacity-20 shadow-lg shadow-gray-200"
                >
                  Confirm Access
                </button>

                <button
                  onClick={() => {
                    setIsDevModalOpen(false);
                    setError(false);
                    setPassword("");
                  }}
                  className="w-full py-3 text-[10px] font-bold text-gray-300 hover:text-gray-500 uppercase tracking-widest transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Sidebar Structure */}
      <div className="flex flex-col h-screen w-70 bg-slate-50 text-slate-800 shadow-xl border-r border-slate-200">
        {/* Header Section */}
        <div className="relative h-24 shrink-0 border-b border-blue-100 bg-white flex items-center px-6">
          <div className="relative z-10 flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <CircleUserRound
                size={28}
                onClick={() => window.location.reload()}
                className="text-blue-500 cursor-pointer hover:rotate-12 transition-all active:scale-90"
              />
              <div className="flex flex-col">
                <span className="text-md font-bold text-slate-700 tracking-tight">
                  ตรอ.บังรีท่าอิฐ
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-medium">
                  user
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar">
          {/* Main Menus */}
          {menuList.map((item) =>
            item.children ? (
              <SubmenuGroup
                key={item.id}
                item={item}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            ) : (
              <MenuButton
                key={item.id}
                icon={item.icon}
                title={item.title}
                subtitle={item.subtitle}
                isActive={activeTab === item.id}
                onClick={() => setActiveTab(item.id)}
              />
            ),
          )}

          {/* Section Divider */}
          <div className="pt-6 pb-2 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center">
            - Others -
          </div>

          {/* Others Menus */}
          {menuOthers.map((item) => (
            <MenuButton
              key={item.id}
              icon={item.icon}
              title={item.title}
              subtitle={item.subtitle}
              isActive={activeTab === item.id}
              onClick={() => {
                if (item.id === "developer-page") {
                  setIsDevModalOpen(true);
                } else {
                  setActiveTab(item.id);
                }
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
