import { useEffect, useState } from "react";
import DashboardLoader from "../../components/Loading/DashboardLoader";
import { BellDot, CheckCheck, Settings, Search, ShieldAlert, Clock, Copy, Trash2, Check } from "lucide-react";



const notidata = [
  {
    id: "N01",
    no: "#01",
    licensePlate: "1กต3522กท",
    customerName: "มรกต อาหมัด",
    dueDate: "06/01/2026",
    phone: "0948198880",
    statusText: "เกิน 55 วัน",
    statusType: "overdue", // 'overdue' (แดง), 'warning' (ส้ม), 'normal' (เทา)
    isSent: true
  },
  {
    id: "N02",
    no: "#02",
    licensePlate: "3ขข9999กท",
    customerName: "สมชาย ใจดี",
    dueDate: "28/02/2026",
    phone: "0812345678",
    statusText: "เกิน 2 วัน",
    statusType: "warning",
    isSent: false
  },
  {
    id: "N03",
    no: "#03",
    licensePlate: "กต1234ชม",
    customerName: "วิไลวรรณ รักดี",
    dueDate: "15/03/2026",
    phone: "0899998888",
    statusText: "เหลือ 13 วัน",
    statusType: "normal",
    isSent: false
  }
  ,
  {
    id: "N03",
    no: "#03",
    licensePlate: "กต1234ชม",
    customerName: "วิไลวรรณ รักดี",
    dueDate: "15/03/2026",
    phone: "0899998888",
    statusText: "เหลือ 13 วัน",
    statusType: "normal",
    isSent: false
  }
  ,
  {
    id: "N03",
    no: "#03",
    licensePlate: "กต1234ชม",
    customerName: "วิไลวรรณ รักดี",
    dueDate: "15/03/2026",
    phone: "0899998888",
    statusText: "เหลือ 13 วัน",
    statusType: "normal",
    isSent: false
  }
  ,
  {
    id: "N03",
    no: "#03",
    licensePlate: "กต1234ชม",
    customerName: "วิไลวรรณ รักดี",
    dueDate: "15/03/2026",
    phone: "0899998888",
    statusText: "เหลือ 13 วัน",
    statusType: "normal",
    isSent: false
  }
  ,
  {
    id: "N03",
    no: "#03",
    licensePlate: "กต1234ชม",
    customerName: "วิไลวรรณ รักดี",
    dueDate: "15/03/2026",
    phone: "0899998888",
    statusText: "เหลือ 13 วัน",
    statusType: "normal",
    isSent: false
  }
];



export default function NotificationBoard() {
  const [isLoading, setIsLoading] = useState(true);

  // 🌟 แก้ตรงนี้! เปลี่ยนไปดึงจาก sessionStorage และใช้ชื่อ "current_user" ให้ตรงกับ App.jsx
  const userStr = sessionStorage.getItem("current_user");
  const currentUser = userStr ? JSON.parse(userStr) : null;

  const isAuthenticated = !!currentUser;
  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <DashboardLoader text="กำลังโหลดหน้าการแจ้งเตือน..." Icon={BellDot} />;
  }

  if (!isAuthenticated) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-gray-400">
        <BellDot size={48} className="mb-4 opacity-20" />
        <p>กรุณาเข้าสู่ระบบเพื่อดูการแจ้งเตือน</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-red-400">
        <div className="bg-red-50 p-4 rounded-full mb-4">
          <ShieldAlert size={48} className="text-red-500 opacity-80" />
        </div>
        <p className="text-xl font-bold text-gray-800 mb-1">ไม่มีสิทธิ์เข้าถึงหน้านี้</p>
        <p className="text-sm text-gray-500">
          ขออภัย เนื้อหาส่วนนี้จำกัดสิทธิ์เฉพาะผู้ดูแลระบบ (Admin) เท่านั้น
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full h-full p-6 md:p-8 animate-in fade-in duration-500 bg-gray-50/30">

      {/* 🌟 2. Header Section (ส่วนหัว) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 flex-none">

        {/* ข้อความและไอคอนด้านซ้าย */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
            <BellDot size={24} strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">กระดานแจ้งเตือน</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Notification Center
              </span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            </div>
          </div>
        </div>

        {/* ปุ่ม Action ด้านขวา */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm group">
            <CheckCheck size={16} className="text-gray-400 group-hover:text-blue-500" />
            <span className="hidden sm:inline">อ่านทั้งหมดแล้ว</span>
          </button>
          <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all shadow-sm">
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* 🌟 3. Content Section (กล่องรายการแจ้งเตือน) */}
      <div className="flex flex-col flex-1 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">

        {/* Toolbar: แถบตัวกรองและค้นหา */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:px-6 border-b border-gray-50 bg-gray-50/50 gap-4 flex-none">
          <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl w-full sm:w-auto overflow-x-auto hide-scrollbar">
            <button className="px-4 py-2 bg-white text-gray-900 text-xs font-black rounded-lg shadow-sm whitespace-nowrap">
              ทั้งหมด
            </button>
            <button className="px-4 py-2 bg-transparent text-gray-500 hover:text-gray-900 hover:bg-white/50 text-xs font-bold rounded-lg transition-colors whitespace-nowrap">
              ยังไม่อ่าน <span className="ml-1 px-1.5 py-0.5 bg-red-100 text-red-600 rounded-md text-[9px]">3</span>
            </button>
            <button className="px-4 py-2 bg-transparent text-gray-500 hover:text-gray-900 hover:bg-white/50 text-xs font-bold rounded-lg transition-colors whitespace-nowrap">
              ใกล้หมดอายุ
            </button>
          </div>

          <div className="relative w-full sm:w-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาทะเบียน, ชื่อลูกค้า..."
              className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
            />
          </div>
        </div>


        <div className="flex-1 max-h-[70vh] h-full overflow-auto custom-scrollbar p-3 sm:p-4 flex flex-col gap-3 bg-gray-50/30">
          {notidata.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-100 rounded-2xl p-3 sm:p-4 hover:shadow-md transition-all duration-300"
            >
              {/* แถวที่ 1: ทะเบียน + ชื่อลูกค้า (จัดให้อยู่ในแถวเดียวกัน) */}
              <div className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] font-bold text-gray-300 flex-none">{item.no}</span>
                  <h3 className="text-base font-black text-gray-900 tracking-tight truncate">{item.licensePlate}</h3>
                  <span className="text-gray-300 text-xs flex-none">|</span>
                  <p className="text-gray-500 text-xs font-medium truncate">{item.customerName}</p>
                </div>

                {/* ป้ายสถานะ (เล็กลง) */}
                <div className={`px-2 py-0.5 rounded-md text-[10px] font-black whitespace-nowrap flex-none ${item.statusType === 'overdue' ? 'bg-red-50 text-red-500 border border-red-100' :
                  item.statusType === 'warning' ? 'bg-orange-50 text-orange-500 border border-orange-100' :
                    'bg-gray-100 text-gray-500 border border-gray-200'
                  }`}>
                  {item.statusText}
                </div>
              </div>

              {/* แถวที่ 2: ข้อมูลติดต่อและวันครบกำหนด */}
              <div className="flex flex-wrap justify-between items-center mt-2 pt-2 border-t border-gray-50 text-[11px] font-bold">
                <div className="flex items-center gap-3 text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} />
                    <span>{item.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5 hover:text-blue-500 cursor-pointer transition-colors group">
                    <span>{item.phone}</span>
                    <Copy size={11} className="group-hover:scale-110" />
                  </div>
                </div>

                {/* ปุ่ม Actions แบบกะทัดรัด */}
                <div className="flex items-center gap-1.5 mt-2 sm:mt-0">
                  <button className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-all">
                    <Copy size={12} />
                    <span>คัดลอก</span>
                  </button>

                  <button className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border transition-all ${item.isSent
                    ? 'bg-white border-transparent text-green-500 cursor-default'
                    : 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700 shadow-sm'
                    }`}>
                    {item.isSent ? <Check size={12} strokeWidth={3} /> : null}
                    <span>{item.isSent ? 'ส่งแล้ว' : 'ส่งแจ้งเตือน'}</span>
                  </button>

                  <button className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  )
}