import React from "react";
import { ArrowLeft, ArrowRight, ExternalLink, Phone, CalendarCheck, ClipboardCheck } from "lucide-react";
import { vehicleTaxData } from "../mockData"; // Import ข้อมูลมาใช้งาน

export default function VehicleTaxTable() {
  const headers = ["ลำดับ", "ทะเบียนรถ", "ประเภท / ยี่ห้อ", "ชื่อลูกค้า / เบอร์โทร", "ชำระล่าสุด", "วันตรวจ ตรอ.", "สถานะ", ""];

  return (
    <div className="w-full bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50/30">
              {headers.map((head, i) => (
                <th key={i} className={`px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest ${i === 0 ? 'text-center' : ''} ${i === 7 ? 'text-right' : ''}`}>
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm">
            {vehicleTaxData.map((item, index) => (
              <tr key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors group">
                <td className="px-4 py-2 text-center text-[10px] font-bold text-gray-300">
                  {String(index + 1).padStart(2, '0')}
                </td>
                <td className="px-4 py-2">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900 leading-tight">{item.plate}</span>
                    <span className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">{item.province}</span>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-blue-500 uppercase leading-tight">{item.type}</span>
                    <span className="text-[10px] text-gray-500 font-medium">{item.brand}</span>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="flex flex-col">
                    <span className="text-gray-700 font-bold leading-tight">{item.owner}</span>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1 font-medium">
                      <Phone size={10} className="text-gray-300" /> {item.phone}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <CalendarCheck size={12} className="text-gray-300" />
                    <span className="text-[11px] font-medium">{item.lastPayment}</span>
                  </div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <ClipboardCheck size={12} className="text-gray-300" />
                    <span className="text-[11px] font-medium">{item.checkUpDate}</span>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${item.status === "รอชำระ" ? "bg-orange-400 animate-pulse" : "bg-green-400"}`} />
                    <span className={`text-[10px] font-black uppercase tracking-tighter ${item.status === "รอชำระ" ? "text-orange-500/80" : "text-green-500/80"}`}>
                      {item.status}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-2 text-right">
                  <button className="p-1.5 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                    <ExternalLink size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* ส่วน Pagination... คงไว้เหมือนเดิม */}
    </div>
  );
}