import { useEffect, useState } from "react";
import DashboardLoader from "../../../components/Loading/DashboardLoader";
import { BellDot, Trash2, ShieldAlert, Check } from "lucide-react";
import { useNotificationStore } from "../../../store/useNotificationStore";

export default function NotificationBoard() {
  const [isLoading, setIsLoading] = useState(true);

  // 1. ดึง State และ Action จาก Zustand
  const { notifications, fetchNotifications } = useNotificationStore();

  // 2. ตรวจสอบสิทธิ์ผู้ใช้
  const userStr = sessionStorage.getItem("current_user");
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const isAuthenticated = !!currentUser;
  const isAdmin = currentUser?.role === "admin";

  // 3. จัดการโหลดข้อมูลและหน่วงเวลา
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        // เงื่อนไข: ถ้าเป็น Admin ถึงจะเรียกฟังก์ชันดึงข้อมูล ถ้าไม่ใช่ก็ให้ข้ามไป
        const fetchPromise = (isAuthenticated && isAdmin)
          ? fetchNotifications()
          : Promise.resolve(); // จำลองว่าเสร็จแล้วถ้าไม่ต้องดึงข้อมูล

        // ให้ทำ 2 อย่างพร้อมกัน: รอข้อมูล(ถ้ามีสิทธิ์) และ รอหลอดโหลด 2.5 วินาที
        await Promise.all([
          fetchPromise,
          new Promise((resolve) => setTimeout(resolve, 2500))
        ]);

      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการโหลดข้อมูล:", error);
      } finally {
        // ไม่ว่าจะดึงข้อมูลสำเร็จหรือพัง ก็ต้องปิดหลอดโหลดเสมอ
        setIsLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated, isAdmin, fetchNotifications]);

  // 4. แสดงผลหน้า Loading
  if (isLoading) {
    return <DashboardLoader text="กำลังรับข้อมูลลูกค้า..." Icon={BellDot} />;
  }

  // 5. แสดงผลหน้า Login (ถ้ายังไม่ได้เข้าระบบ)
  if (!isAuthenticated) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-gray-400">
        <BellDot size={48} className="mb-4 opacity-20" />
        <p>กรุณาเข้าสู่ระบบเพื่อดูการแจ้งเตือน</p>
      </div>
    );
  }

  // 6. แสดงผลหน้าห้ามเข้า (ถ้าไม่ใช่ Admin)
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

  // ฟังก์ชันช่วยกำหนดสีตามสถานะ (ปรับเป็นคลาส Tailwind)
  const getStatusStyle = (type) => {
    switch (type) {
      case 'overdue': return 'bg-red-500';
      case 'warning': return 'bg-orange-500';
      default: return 'bg-blue-500';
    }
  };


  return (
    <div className="p-6 max-w-4xl mx-auto">

      <div className="flex flex-col">
        {notifications.length > 0 ? (
          notifications.map((item) => (
            <div
              key={item.id}
              className="group flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
            >
              {/* ฝั่งซ้าย: สถานะ + ข้อมูลหลัก */}
              <div className="flex items-center gap-4 min-w-0">
                {/* จุดสถานะเล็กๆ */}
                <div className={`w-1.5 h-1.5 rounded-full flex-none ${getStatusStyle(item.statusType)}`} />

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 min-w-0">
                  <h3 className="text-[15px] font-black text-gray-900 tracking-tight uppercase">
                    {item.licensePlate}
                  </h3>
                  <span className="hidden sm:block text-gray-200 text-xs">|</span>
                  <p className="text-sm text-gray-500 font-medium truncate">
                    {item.customerName}
                  </p>
                </div>
              </div>

              {/* ฝั่งขวา: วันที่ + ปุ่มกด (จะโชว์เด่นตอน Hover) */}
              <div className="flex items-center gap-6">
                {/* ข้อมูลวันที่และสถานะตัวหนังสือ */}
                <div className="flex flex-col items-end">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${item.statusType === 'overdue' ? 'text-red-500' : 'text-gray-400'
                    }`}>
                    {item.statusText}
                  </span>
                  <span className="text-[11px] font-medium text-gray-300">
                    ครบกำหนด: {item.dueDate}
                  </span>
                </div>

                {/* ปุ่ม Action แบบสะอาดตา */}
                <div className="flex items-center gap-1">
                  {/* ปุ่มส่งแล้ว / ยังไม่ส่ง */}
                  <button
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black transition-all ${item.isSent
                        ? 'text-green-500 bg-green-50/50'
                        : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                  >
                    {item.isSent ? <Check size={14} strokeWidth={3} /> : null}
                    {item.isSent ? 'SENT' : 'SEND'}
                  </button>

                  {/* ปุ่มลบ (จะจางมากจนกว่าจะชี้) */}
                  <button className="p-2 text-gray-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center">
            <p className="text-[11px] font-bold text-gray-300 uppercase tracking-[0.3em]">
              No Notifications
            </p>
          </div>
        )}
      </div>


    </div>


  );
}