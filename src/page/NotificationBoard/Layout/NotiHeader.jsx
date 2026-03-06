import { BellDot } from "lucide-react";

export default function NotiHeader() {
    return (
        <div>
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
                <BellDot className="text-blue-600" size={28} />
                <h1 className="text-2xl font-bold text-gray-800">รายการแจ้งเตือนลูกค้า</h1>
            </div>
        </div>
    )
}
