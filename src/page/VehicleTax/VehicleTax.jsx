import React, { useEffect, useState } from "react";
import { Plus, Download, Table } from "lucide-react";
import VehicleTaxHeader from "./layout/VehicleTaxHeader";
import VehicleTaxFilters from "./layout/VehicleTaxFilters";
import VehicleTaxTable from "./layout/VehicleTaxTable";
import ExportModal from "./Modal/ExportModal";
import VehicleFormModal from "./Modal/VehicleFormModal";
import DashboardLoader from "../../components/Loading/DashboardLoader";

export default function VehicleTax({ isAuthenticated }) {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [instantUpdate, setInstantUpdate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null); // ถ้าเป็น null = Add, ถ้ามีข้อมูล = Edit

  const handleAddClick = () => {
    setEditingRecord(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (record) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleSuccess = (record, isDeleted = false) => {
    setIsModalOpen(false);

    if (isDeleted) {

      setInstantUpdate({ action: "DELETE", payload: record._id || record.id });
    } else if (editingRecord) {
      setInstantUpdate({ action: "EDIT", payload: record });
    } else {
      setInstantUpdate({ action: "ADD", payload: record });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);


  if (isLoading) {
    return <DashboardLoader text="กำลังโหลดหน้าต่อภาษีประจำปี..." Icon={Table} />;
  }

  return (
    <div className="flex flex-col gap-6 w-full h-screen p-6 overflow-hidden animate-in fade-in duration-500 bg-white">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 flex-none">
        <VehicleTaxHeader /> 

        {isAuthenticated && (
          <div className="flex flex-row gap-3 items-center">

            
            <button
              onClick={() => setIsExportOpen(true)}
              className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-100 rounded-[1.5rem] hover:bg-gray-50 transition-all group"
            >
              <Download
                size={18}
                className="text-gray-400 group-hover:text-blue-500"
              />
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-gray-700">
                  ส่งออกข้อมูล
                </span>
                <span className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">
                  Export Data
                </span>
              </div>
            </button>


            <button
              onClick={handleAddClick}
              className="flex items-center gap-3 px-6 py-3 bg-gray-900 text-white rounded-[1.5rem] hover:bg-blue-600 transition-all shadow-lg shadow-gray-200 group"
            >
              <Plus size={18} />
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold">เพิ่มรายการ</span>
                <span className="text-[9px] text-white/50 font-black uppercase tracking-tighter">
                  Add Record
                </span>
              </div>
            </button>



          </div>
        )}
      </div>

 
      <div className="flex-none">
        <VehicleTaxFilters onSearchChange={(val) => setSearchQuery(val)} />
      </div>


      <div className="flex-1 min-h-0 overflow-hidden">
        <VehicleTaxTable
          isAuthenticated={isAuthenticated}
          searchQuery={searchQuery}
          instantUpdate={instantUpdate}
          onEditClick={handleEditClick}
        />
      </div>

      {/* 🌟 5. ใช้ VehicleFormModal แค่ตัวเดียวจบ ครอบคลุมทั้ง Add และ Edit */}
      <VehicleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        initialData={editingRecord}
      />
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}
