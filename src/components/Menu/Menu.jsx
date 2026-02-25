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
    if (password === "1234") {
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
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => {
              setIsDevModalOpen(false);
              setError(false);
              setPassword("");
            }}
          />
          <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-5">
                <Code2 size={40} className="text-blue-500" />
              </div>

              <h3 className="text-xl font-bold text-slate-800">ยืนยันตัวตน</h3>
              <p className="text-sm text-slate-400 mb-6">
                กรุณากรอกรหัสผ่านเพื่อดูข้อมูล
              </p>

              {/* Password Input Group */}
              <div className="w-full mb-6 relative group">
                <div
                  className={`
            flex items-center bg-slate-50 border-2 transition-all duration-300 rounded-2xl px-4 py-1
            ${error ? "border-red-300 bg-red-50" : "border-transparent focus-within:border-blue-400 focus-within:bg-white"}
          `}
                >
                  <Lock
                    size={18}
                    className={`${error ? "text-red-400" : "text-slate-400"} mr-2`}
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(false);
                    }}
                    placeholder="กรอกรหัสผ่าน..."
                    className="bg-transparent w-full py-3 text-sm outline-none text-slate-700 placeholder:text-slate-300"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-300 hover:text-slate-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <span className="absolute -bottom-5 left-4 text-[10px] text-red-500 font-medium animate-in slide-in-from-top-1">
                    รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 w-full mt-2">
                <button
                  onClick={() => {
                    setIsDevModalOpen(false);
                    setError(false);
                    setPassword("");
                  }}
                  className="flex-1 py-3 text-slate-400 font-bold rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-[2] py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-200 active:scale-95 disabled:opacity-50"
                  disabled={!password}
                >
                  เข้าสู่ระบบ
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
                  GOOD DEV
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-medium">
                  user
                </span>
              </div>
            </div>

            <button
              onClick={hdlLogin}
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-blue-50 transition-colors group"
            >
              <LogInIcon
                className="text-blue-500 group-hover:scale-110 transition-transform"
                size={20}
              />
              <span className="text-[10px] text-slate-400 uppercase font-bold leading-tight">
                Login
              </span>
            </button>
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
