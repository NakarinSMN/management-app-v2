import React, { useState } from "react";
import { Plus, Download } from "lucide-react";
import VehicleTaxHeader from "./layout/VehicleTaxHeader";
import VehicleTaxFilters from "./layout/VehicleTaxFilters";
import VehicleTaxTable from "./layout/VehicleTaxTable";
import AddRecordModal from "./Modal/AddRecordModal";
import ExportModal from "./Modal/ExportModal";

// รับ isAuthenticated มาจากหน้า Contents
export default function VehicleTax({ isAuthenticated }) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <VehicleTaxHeader />
        
        {/* เช็กเงื่อนไข: จะแสดงกลุ่มปุ่มนี้ก็ต่อเมื่อเป็น Admin (isAuthenticated = true) */}
        {isAuthenticated && (
          <div className="flex flex-row gap-3 items-center">
            {/* ปุ่มส่งออก */}
            <button onClick={() => setIsExportOpen(true)} className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-100 rounded-[1.5rem] hover:bg-gray-50 transition-all group">
              <Download size={18} className="text-gray-400 group-hover:text-blue-500" />
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-gray-700">ส่งออกข้อมูล</span>
                <span className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">Export Data</span>
              </div>
            </button>

            {/* ปุ่มเพิ่มรายการ */}
            <button onClick={() => setIsAddOpen(true)} className="flex items-center gap-3 px-6 py-3 bg-gray-900 text-white rounded-[1.5rem] hover:bg-blue-600 transition-all shadow-lg shadow-gray-200 group">
              <Plus size={18} />
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold">เพิ่มรายการ</span>
                <span className="text-[9px] text-white/50 font-black uppercase tracking-tighter">Add Record</span>
              </div>
            </button>
          </div>
        )}
      </div>

      <VehicleTaxFilters />
      
      {/* ส่ง isAuthenticated ต่อไปให้ Table เพื่อซ่อนปุ่มแก้ไข */}
      <VehicleTaxTable isAuthenticated={isAuthenticated} />

      {/* เรียกใช้งาน Modal */}
      <AddRecordModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
}