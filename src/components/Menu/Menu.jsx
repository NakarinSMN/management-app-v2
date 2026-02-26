import { 
  Home, 
  CircleUserRound, 
  ShoppingBasket, 
  Tags, 
  BriefcaseBusiness, 
  ToolCase, 
  ReceiptText, 
  Code2 
} from "lucide-react";
import MenuButton from "../GlobalButton/MenuButton";
import SubmenuGroup from "../GlobalButton/SubmenuGroup";
import Toast from "../Notify/Toast";
import { useState, lazy, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // เอาบรรทัดที่ซ้ำกันออกแล้ว

// 1. Lazy Load ตัว Modal
const DevModal = lazy(() => import("../Modal/DevModal"));

// 2. ข้อมูลเมนู (อยู่นอก Component ประหยัด RAM)
const menuList = [
  { id: "home", title: "หน้าหลัก", subtitle: "Home", icon: Home },
  {
    id: "data-tax",
    title: "งานภาษีขอมูลลูกค้า",
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

// 3. เริ่ม Component หลัก
export default function Menu() {
  const [isDevModalOpen, setIsDevModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // แปลง URL ให้กลายเป็น activeTab เพื่อใช้กับปุ่ม
  const activeTab = location.pathname === "/" ? "home" : location.pathname.substring(1);

  // ฟังก์ชันเปลี่ยนหน้า
  const handleNavigate = (id) => {
    navigate(id === "home" ? "/" : `/${id}`);
  };

  return (
    <>
      <Toast
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        type="success"
        message="Developer Mode Activated"
      />

      {/* Lazy Load Modal (โหลดเฉพาะตอนจะใช้) */}
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
      <div className="flex flex-col h-screen w-70 bg-slate-50 text-slate-800 shadow-xl border-r border-slate-200">
        
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
              <span className="text-[10px] text-slate-400 uppercase font-medium">user</span>
            </div>
          </div>
        </div>

        {/* รายการเมนู */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar">
          
          {/* Loop เมนูหลัก */}
          {menuList.map((item) =>
            item.children ? (
              <SubmenuGroup 
                key={item.id} 
                item={item} 
                activeTab={activeTab} 
                setActiveTab={handleNavigate} 
              />
            ) : (
              <MenuButton 
                key={item.id} 
                icon={item.icon} 
                title={item.title} 
                subtitle={item.subtitle} 
                isActive={activeTab === item.id} 
                onClick={() => handleNavigate(item.id)} 
              />
            )
          )}

          {/* ตัวคั่น */}
          <div className="pt-6 pb-2 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center">
            - Others -
          </div>

          {/* Loop เมนูอื่นๆ (อย่างเช่นหน้า Developer) */}
          {menuOthers.map((item) => (
            <MenuButton
              key={item.id}
              icon={item.icon}
              title={item.title}
              subtitle={item.subtitle}
              isActive={activeTab === item.id}
              onClick={() => item.id === "developer-page" ? setIsDevModalOpen(true) : handleNavigate(item.id)}
            />
          ))}
          
        </div>
      </div>
    </>
  );
}