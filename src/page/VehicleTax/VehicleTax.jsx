import React, { useState } from "react";
import { Plus, Download } from "lucide-react";
import VehicleTaxHeader from "./layout/VehicleTaxHeader";
import VehicleTaxFilters from "./layout/VehicleTaxFilters";
import VehicleTaxTable from "./layout/VehicleTaxTable";
import AddRecordModal from "./Modal/AddRecordModal";
import ExportModal from "./Modal/ExportModal";
import EditRecordModal from "./Modal/EditRecordModal";

export default function VehicleTax({ isAuthenticated }) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // 🌟 1. State ใหม่สำหรับบอกตารางให้อัปเดตทันทีโดยไม่ต้องโหลด API ใหม่
  const [instantUpdate, setInstantUpdate] = useState(null);

  // 🌟 ลบ setRefreshTrigger ออกให้เกลี้ยง!
  const handleAddSuccess = (newRecord) => {
    setIsAddOpen(false);
    setInstantUpdate({ action: "ADD", payload: newRecord });
  };

  const handleEditSuccess = (updatedRecord, isDeleted = false) => {
    setIsEditOpen(false);
    setEditingRecord(null);
    if (isDeleted) {
      setInstantUpdate({ action: "DELETE", payload: updatedRecord.id }); // updatedRecord จะกลายเป็น ID ของตัวที่โดนลบ
    } else {
      setInstantUpdate({ action: "EDIT", payload: updatedRecord });
    }
  };

  const handleEditClick = (record) => {
    setEditingRecord(record);
    setIsEditOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <VehicleTaxHeader />

        {isAuthenticated && (
          <div className="flex flex-row gap-3 items-center">
            <button onClick={() => setIsExportOpen(true)} className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-100 rounded-[1.5rem] hover:bg-gray-50 transition-all group">
              <Download size={18} className="text-gray-400 group-hover:text-blue-500" />
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-gray-700">ส่งออกข้อมูล</span>
                <span className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">Export Data</span>
              </div>
            </button>

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

      <VehicleTaxFilters onSearchChange={(val) => setSearchQuery(val)} />

      {/* 🌟 4. ส่ง instantUpdate ไปให้ตารางจัดการต่อ */}
      <VehicleTaxTable
        isAuthenticated={isAuthenticated}
        searchQuery={searchQuery}
        instantUpdate={instantUpdate}
        onEditClick={handleEditClick}
      />

      <EditRecordModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={handleEditSuccess}
        recordData={editingRecord}
      />

      <AddRecordModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSuccess={handleAddSuccess} />
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
}