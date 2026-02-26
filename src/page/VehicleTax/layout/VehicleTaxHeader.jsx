import React from "react";
import { CarFront, Clock, CheckCircle2 } from "lucide-react";

export default function VehicleTaxHeader() {
  const stats = [
    { label: "ทั้งหมด", value: "1,248", icon: CarFront, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "รอต่อภาษี", value: "42", icon: Clock, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "เสร็จสิ้น", value: "1,206", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50" },
  ];

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">ต่อภาษีประจำปี</h1>
        <p className="text-sm text-gray-400 mt-1 font-medium">จัดการข้อมูลและติดตามสถานะการต่อภาษีของลูกค้า</p>
      </div>

      <div className="flex gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 custom-scrollbar">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm min-w-[160px]">
            <div className={`p-2 ${stat.bg} ${stat.color} rounded-xl`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{stat.label}</p>
              <p className="text-lg font-black text-gray-800 leading-none mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}