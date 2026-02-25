import { LayoutDashboard, Calendar as CalendarIcon } from "lucide-react";

// นำเข้า Components ของคุณ
import CalenderDate from "./BesicCalenderDate";

export default function MainContent() {
  return (
    // ใช้พื้นหลังเทาอ่อนมากๆ (bg-gray-50/50) เพื่อความสะอาดตา
    <div className="min-h-screen bg-gray-50/50 font-sans p-6 md:p-10">
      
      <div className="max-w-7xl mx-auto">
        
        {/* --- ส่วนหัวข้อ (Header) สไตล์ Super Minimalist --- */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-500 mb-1">
              <LayoutDashboard size={14} />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Overview</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              ระบบจัดการ พ.ร.บ.
            </h1>
            <p className="text-sm text-gray-400 mt-1 font-medium">
              ตรวจสอบเบี้ยประกันและจัดการตารางความคุ้มครอง
            </p>
          </div>

          {/* แทนที่ปุ่มเมนูด้วย "สถานะปัจจุบัน" เล็กๆ เพื่อความมินิมอล */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-100 rounded-full shadow-sm">
            <CalendarIcon size={14} className="text-gray-400" />
            <span className="text-xs font-semibold text-gray-600">มุมมองปฏิทิน</span>
          </div>
        </header>

        {/* เส้นประคั่นส่วนหัว (เหมือนกับในส่วนอื่นๆ ของแอป) */}
        <div className="w-full border-b border-gray-200 border-dashed mb-10"></div>

        {/* --- ส่วนเนื้อหาหลัก --- */}
        {/* ไม่ต้องมี Logic สลับเมนูแล้ว เพราะเหลือเพียงปฏิทินอย่างเดียว */}
        <main className="w-full animate-in fade-in duration-700">
          <CalenderDate />
          
    
        </main>

      </div>
    </div>
  );
}