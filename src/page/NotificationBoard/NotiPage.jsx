import { useEffect, useState } from "react";
import DashboardLoader from "../../components/Loading/DashboardLoader";
import NotificationBoard from "./Layout/NotificationBoard";
import { BellDot, ShieldAlert } from "lucide-react";
import NotiHeader from "./Layout/NotiHeader";


export default function NotiPage() {

    const [isLoading, setIsLoading] = useState(true);
    const userStr = sessionStorage.getItem("current_user");
    const currentUser = userStr ? JSON.parse(userStr) : null;
    const isAuthenticated = !!currentUser;
    const isAdmin = currentUser?.role === "admin";

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
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
        <div>
            <div>
                <NotiHeader />
            </div>

            <div>
                <NotificationBoard />
            </div>
        </div>

    )

}