import { useState } from "react";
import MenuButton from "./MenuButton";

export default function SubmenuGroup({ item, activeTab, setActiveTab }) {
  const [isOpen, setIsOpen] = useState(false);

  // เช็คว่าลูกตัวใดตัวหนึ่ง active อยู่หรือไม่
  const isChildActive = item.children?.some((child) => child.id === activeTab);

  return (
    <div className="flex flex-col">
      {/* ปุ่มแม่ */}
     <MenuButton
        icon={item.icon}
        title={item.title}
        subtitle={item.subtitle}
        // แก้ไขตรงนี้: ให้ Active เมื่อลูกถูกเลือก หรือตัวมันเองถูกเลือก
        isActive={isChildActive || activeTab === item.id} 
        // เพิ่ม Prop ใหม่ (ถ้าคุณแก้ไขใน MenuButton แล้ว) เพื่อคุมไอคอน + / -
        isMenuOpen={isOpen} 
        onClick={() => setIsOpen(!isOpen)}
      />

      {/* รายการลูก: ปรับเส้นนำสายตาให้จางลง (slate-50) เพื่อความคลีน */}
      <div
        className={`overflow-hidden transition-all duration-500  ml-6 border-l border-slate-100/80 ${
          isOpen ? "max-h-80 mt-1 pb-3 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="pt-1 space-y-1">
          {item.children.map((child) => {
            const isActive = activeTab === child.id;
            return (
              <button
                key={child.id}
                onClick={() => setActiveTab(child.id)}
                className={`w-full flex flex-col items-start px-5 py-2.5 rounded-r-2xl transition-all duration-300 relative group
                  ${
                    isActive
                      ? "text-blue-600 bg-blue-50/80 to-transparent"
                      : "text-slate-400 hover:bg-slate-50/50 hover:text-slate-600"
                  }`}
              >
                {/* Active Indicator: เปลี่ยนจากเส้นแข็งๆ เป็นแคปซูลมนๆ ที่ดูนุ่มกว่า */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.4)]" />
                )}

                <div className="flex items-center gap-2.5">
                  {/* Dot Indicator: ปรับความสว่างให้นุ่มลง */}
                  <div
                    className={`w-1 h-1 rounded-full transition-all duration-300 ${
                      isActive
                        ? "bg-blue-400 scale-125 shadow-[0_0_6px_rgba(96,165,250,0.6)]"
                        : "bg-slate-200 group-hover:bg-slate-300"
                    }`}
                  />

                  <span
                    className={`text-sm transition-colors duration-300 ${isActive ? "font-semibold" : "font-medium"}`}
                  >
                    {child.title}
                  </span>
                </div>

                <span
                  className={`text-[9px] uppercase tracking-widest ml-3.5 transition-colors duration-300 ${
                    isActive ? "text-blue-400/80" : "text-slate-300"
                  }`}
                >
                  {child.subtitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
